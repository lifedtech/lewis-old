import { createPrismaClient } from "./db";

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  HYPERDRIVE: { connectionString: string };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/")) {
      return handleApi(url, env);
    }
    return env.ASSETS.fetch(request);
  },
};

async function handleApi(url: URL, env: Env): Promise<Response> {
  // Self-check: proves the Hyperdrive binding + Prisma adapter wiring actually works.
  if (url.pathname === "/api/health") {
    const prisma = createPrismaClient(env.HYPERDRIVE.connectionString);
    try {
      await prisma.$queryRaw`SELECT 1`;
      return Response.json({ status: "ok" });
    } catch (err) {
      return Response.json({ status: "error", message: String(err) }, { status: 500 });
    }
  }
  return new Response("Not found", { status: 404 });
}
