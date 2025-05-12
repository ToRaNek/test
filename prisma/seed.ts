import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Création utilisateur de test
  await prisma.user.create({
    data: {
      name: "Test User",
      email: "test@example.com",
      pseudo: "testeur",
    }
  });

  // Ajout d'une room de démo
  await prisma.room.create({
    data: {
      code: "ABCDEF",
      hostId: "1", // Adapter après premier user créé
      status: "open"
    }
  });
}

main()
  .then(() => {
    console.log("Seed done.");
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });