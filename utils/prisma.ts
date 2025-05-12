// utils/prisma.ts
import { PrismaClient } from '@prisma/client';

// Déclaration pour éviter les instances multiples en développement
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Création d'une seule instance de PrismaClient pour toute l'application
const prismaClientSingleton = () => {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? [
            { emit: 'stdout', level: 'query' },
            { emit: 'stdout', level: 'error' },
            { emit: 'stdout', level: 'warn' },
          ]
        : [{ emit: 'stdout', level: 'error' }],
  });
};

// Assigner l'instance à la variable globale en développement
export const prisma = global.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}
