// utils/prisma.ts
import { PrismaClient } from "@prisma/client";

// Déclaration pour éviter les instances multiples en développement
declare global {
    // eslint-disable-next-line no-var
    var prisma: PrismaClient | undefined;
}

// Création d'une seule instance de PrismaClient pour toute l'application
export const prisma = global.prisma || new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "info", "warn"] : ["error"],
});

// Assigner l'instance à la variable globale en développement
if (process.env.NODE_ENV !== "production") {
    global.prisma = prisma;
}