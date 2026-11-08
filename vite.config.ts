import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

// In `npm run dev`, serve /api/admin/* with the same handlers Vercel deploys,
// reading ADMIN_PASSWORD / GITHUB_TOKEN etc. from .env.local.
function adminApi(): Plugin {
  return {
    name: "admin-api",
    configureServer(server) {
      Object.assign(process.env, loadEnv("development", process.cwd(), ""));
      server.middlewares.use("/api/admin", async (req, res) => {
        const name = (req.url ?? "").split("?")[0].replace(/^\/+/, "");
        try {
          const handlers = await server.ssrLoadModule(`/api/admin/${name}.js`);
          const handler = handlers[req.method ?? "GET"];
          if (!handler) {
            res.statusCode = 405;
            res.end();
            return;
          }
          const chunks: Buffer[] = [];
          for await (const chunk of req) chunks.push(chunk as Buffer);
          const request = new Request(`http://localhost${req.originalUrl}`, {
            method: req.method,
            headers: req.headers as Record<string, string>,
            body: chunks.length ? Buffer.concat(chunks) : undefined,
          });
          const response: Response = await handler(request);
          res.statusCode = response.status;
          response.headers.forEach((value, key) => res.setHeader(key, value));
          res.end(Buffer.from(await response.arrayBuffer()));
        } catch {
          res.statusCode = 404;
          res.end();
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), adminApi()],
});
