import { PrismaClient } from "@/lib/generated/prisma";

export const db = new PrismaClient();

export * from "@/lib/generated/prisma";
