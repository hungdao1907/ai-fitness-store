import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany();
  let updatedCount = 0;
  for (const p of products) {
    if (p.image && p.image.startsWith('blob:')) {
      await prisma.product.update({
        where: { id: p.id },
        data: { image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=300' }
      });
      updatedCount++;
    }
  }
  console.log(`Fixed ${updatedCount} products with blob images.`);
}
main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
