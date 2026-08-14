import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Prisma 7 exige un driver adapter à l'instanciation. La base est Neon, en
// région européenne — voir docs/mon-histoire-decisions-structure.md §6.

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL est absente. Renseignez la connexion Neon (région UE) dans .env.local.",
  );
}

const adapter = new PrismaPg({ connectionString });

// En développement, Next recharge les modules à chaque modification : sans ce
// cache, chaque rechargement ouvrirait un nouveau pool de connexions.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
