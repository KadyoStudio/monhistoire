import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// `dotenv/config` ne lit que `.env`. Les secrets du projet vivent dans
// `.env.local` : sans cette ligne, la CLI Prisma migrerait une autre base que
// celle que l'application utilise — silencieusement.
config({ path: ".env.local" });
config();

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
