import type { ReactNode } from "react";

export function RichText({ text, strong = [] }: { text: string; strong?: string[] }) {
  if (!strong.length) return text;
  let parts: Array<string | ReactNode> = [text];
  strong.forEach((phrase, phraseIndex) => {
    parts = parts.flatMap((part, partIndex) => {
      if (typeof part !== "string" || !part.includes(phrase)) return [part];
      const pieces = part.split(phrase);
      const next: Array<string | ReactNode> = [];
      pieces.forEach((piece, index) => {
        if (piece) next.push(piece);
        if (index < pieces.length - 1) {
          next.push(<strong key={`${phraseIndex}-${partIndex}-${index}`}>{phrase}</strong>);
        }
      });
      return next;
    });
  });
  return parts;
}
