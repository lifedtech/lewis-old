interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  HYPERDRIVE?: { connectionString: string };
  BACKEND_URL?: string;
}

const DEFAULT_BACKEND_URL = "https://lewis-production-953f.up.railway.app";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === "/api/health") {
      return handleHealthCheck(url, env);
    }
    if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/support/")) {
      return proxyToBackend(request, url, env);
    }
    return env.ASSETS.fetch(request);
  },
};

async function proxyToBackend(request: Request, url: URL, env: Env): Promise<Response> {
  const backendBase = env.BACKEND_URL || DEFAULT_BACKEND_URL;
  const targetUrl = `${backendBase.replace(/\/$/, "")}${url.pathname}${url.search}`;
  
  const proxyHeaders = new Headers(request.headers);
  proxyHeaders.set("Host", new URL(backendBase).host);

  const proxyReq = new Request(targetUrl, {
    method: request.method,
    headers: proxyHeaders,
    body: request.method !== "GET" && request.method !== "HEAD" ? request.body : undefined,
    redirect: "follow",
  });
  
  return fetch(proxyReq);
}

async function handleHealthCheck(url: URL, env: Env): Promise<Response> {
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
