import { PrismaClient } from "@/lib/generated/prisma";

// Exportar uma instância do PrismaClient para uso global
export const prisma = new PrismaClient();

// Re-exportar tipos do Prisma
export * from "@/lib/generated/prisma";
