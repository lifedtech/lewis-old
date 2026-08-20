import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// One PrismaClient per Worker isolate, built from Hyperdrive's pooled connection string.
// ponytail: no cross-request caching beyond the isolate — Workers reuse isolates across
// requests naturally; add a global singleton guard only if cold-start cost measurably hurts.
export function createPrismaClient(connectionString: string): PrismaClient {
  return new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
}
