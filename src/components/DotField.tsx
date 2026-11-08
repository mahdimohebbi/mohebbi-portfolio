import { useEffect, useRef } from "react";

// Matches the static body::before pattern: 1px dots on a 22px grid, centred in each tile.
const GAP = 22;
const RADIUS = 1;
// How far the cursor reaches, and how strongly fast movement pushes and lights dots.
const REACH = 150;
const PUSH = 0.045;
const GLOW = 0.012;
const MAX_OFFSET = 7;
// Spring back to rest; lower damping = more wobble.
const SPRING = 0.08;
const DAMPING = 0.82;
const GLOW_DECAY = 0.94;

/**
 * Interactive version of the dotted background. Moving or shaking the cursor
 * nudges nearby dots away and makes them light up; they settle back after.
 * Draws only while something is moving. Off for touch screens and reduced motion,
 * where the static CSS dots stay.
 */
export function DotField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!finePointer.matches || reducedMotion.matches) return;

    const canvas = canvasRef.current!;
    const context = canvas.getContext("2d")!;
    const root = document.documentElement;
    root.classList.add("dots-live");

    let columns = 0;
    let rows = 0;
    let offsetX = new Float32Array(0);
    let offsetY = new Float32Array(0);
    let velocityX = new Float32Array(0);
    let velocityY = new Float32Array(0);
    let glow = new Float32Array(0);
    let dotColor = "";
    let glowRgb = "255, 92, 0";
    let frame = 0;
    let last: { x: number; y: number; t: number } | null = null;

    const readColors = () => {
      const styles = getComputedStyle(root);
      dotColor = styles.getPropertyValue("--color-dot").trim() || "rgba(255,255,255,0.16)";
      // Dots light up in the site's accent color.
      const hex = /^#([0-9a-f]{6})$/i.exec(styles.getPropertyValue("--color-accent").trim())?.[1];
      if (hex) glowRgb = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(", ");
    };

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * ratio);
      canvas.height = Math.round(window.innerHeight * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      columns = Math.ceil(window.innerWidth / GAP) + 1;
      rows = Math.ceil(window.innerHeight / GAP) + 1;
      const count = columns * rows;
      offsetX = new Float32Array(count);
      offsetY = new Float32Array(count);
      velocityX = new Float32Array(count);
      velocityY = new Float32Array(count);
      glow = new Float32Array(count);
      draw();
    };

    const draw = () => {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      // Resting dots share one path; glowing dots are drawn on top with their own alpha.
      context.fillStyle = dotColor;
      context.beginPath();
      for (let row = 0; row < rows; row += 1) {
        for (let column = 0; column < columns; column += 1) {
          const i = row * columns + column;
          if (glow[i] > 0.02) continue;
          const x = column * GAP + GAP / 2 + offsetX[i];
          const y = row * GAP + GAP / 2 + offsetY[i];
          context.moveTo(x + RADIUS, y);
          context.arc(x, y, RADIUS, 0, Math.PI * 2);
        }
      }
      context.fill();
      for (let i = 0; i < glow.length; i += 1) {
        if (glow[i] <= 0.02) continue;
        const x = (i % columns) * GAP + GAP / 2 + offsetX[i];
        const y = Math.floor(i / columns) * GAP + GAP / 2 + offsetY[i];
        context.fillStyle = `rgba(${glowRgb}, ${Math.min(1, 0.25 + glow[i])})`;
        context.beginPath();
        context.arc(x, y, RADIUS + glow[i] * 0.9, 0, Math.PI * 2);
        context.fill();
      }
    };

    const step = () => {
      let moving = false;
      for (let i = 0; i < offsetX.length; i += 1) {
        velocityX[i] = (velocityX[i] - offsetX[i] * SPRING) * DAMPING;
        velocityY[i] = (velocityY[i] - offsetY[i] * SPRING) * DAMPING;
        offsetX[i] = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, offsetX[i] + velocityX[i]));
        offsetY[i] = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, offsetY[i] + velocityY[i]));
        glow[i] *= GLOW_DECAY;
        if (glow[i] < 0.005) glow[i] = 0;
        if (glow[i] || Math.abs(offsetX[i]) > 0.02 || Math.abs(offsetY[i]) > 0.02 || Math.abs(velocityX[i]) > 0.02) moving = true;
        else offsetX[i] = offsetY[i] = velocityX[i] = velocityY[i] = 0;
      }
      draw();
      frame = moving ? requestAnimationFrame(step) : 0;
    };

    const onMove = (event: PointerEvent) => {
      const now = performance.now();
      const previous = last;
      last = { x: event.clientX, y: event.clientY, t: now };
      if (!previous || now - previous.t > 100) return;
      // Speed in px per ms; slow moves barely register, shaking builds up quickly.
      const speed = Math.hypot(event.clientX - previous.x, event.clientY - previous.y) / Math.max(1, now - previous.t);
      if (speed < 0.3) return;

      const minColumn = Math.max(0, Math.floor((event.clientX - REACH) / GAP));
      const maxColumn = Math.min(columns - 1, Math.ceil((event.clientX + REACH) / GAP));
      const minRow = Math.max(0, Math.floor((event.clientY - REACH) / GAP));
      const maxRow = Math.min(rows - 1, Math.ceil((event.clientY + REACH) / GAP));
      for (let row = minRow; row <= maxRow; row += 1) {
        for (let column = minColumn; column <= maxColumn; column += 1) {
          const i = row * columns + column;
          const dx = column * GAP + GAP / 2 - event.clientX;
          const dy = row * GAP + GAP / 2 - event.clientY;
          const distance = Math.hypot(dx, dy);
          if (distance > REACH) continue;
          const falloff = (1 - distance / REACH) ** 2;
          const push = Math.min(speed, 4) * falloff * PUSH * GAP;
          velocityX[i] += (dx / (distance || 1)) * push;
          velocityY[i] += (dy / (distance || 1)) * push;
          glow[i] = Math.min(1, glow[i] + speed * falloff * GLOW * GAP);
        }
      }
      if (!frame) frame = requestAnimationFrame(step);
    };

    // Re-read colors when the theme toggles.
    const themeObserver = new MutationObserver(() => {
      readColors();
      draw();
    });
    themeObserver.observe(root, { attributes: true, attributeFilter: ["data-theme"] });

    readColors();
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      themeObserver.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      root.classList.remove("dots-live");
    };
  }, []);

  return <canvas ref={canvasRef} className="dot-field" aria-hidden="true" />;
}
