import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const prod = await prisma.product.findFirst();
  console.log("Before:", prod);
  
  if (prod) {
    const updated = await prisma.product.update({
      where: { id: prod.id },
      data: { description: prod.description + " (Edited)" }
    });
    console.log("After:", updated);
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
