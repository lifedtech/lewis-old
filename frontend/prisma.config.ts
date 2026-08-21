import { defineConfig } from "prisma/config";

// Load environment variables without requiring external dotenv dependency
try {
  process.loadEnvFile(".env.local");
} catch {
  // Ignore if .env.local is missing
}

try {
  process.loadEnvFile(".env");
} catch {
  // Ignore if .env is missing
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/postgres",
  },
});
