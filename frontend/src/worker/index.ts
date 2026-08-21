interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  HYPERDRIVE?: { connectionString: string };
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
  if (url.pathname === "/api/health") {
    if (!env.HYPERDRIVE?.connectionString) {
      return Response.json({ status: "ok", mode: "edge_asset_worker" });
    }
    try {
      const { createPrismaClient } = await import("./db");
      const prisma = createPrismaClient(env.HYPERDRIVE.connectionString);
      await prisma.$queryRaw`SELECT 1`;
      return Response.json({ status: "ok", database: "connected" });
    } catch (err) {
      return Response.json({ status: "error", message: String(err) }, { status: 500 });
    }
  }
  return new Response("Not found", { status: 404 });
}
