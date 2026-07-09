import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const newProducts = [
    {
      id: "W-LEG-01",
      name: "Elite Compression Leggings",
      description: "Quần Leggings bó cơ định hình cao cấp dành cho những buổi tập chân khắc nghiệt nhất.",
      price: 65,
      stock: 100,
      image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800",
      category: "LEGGINGS",
      status: "Active",
    },
    {
      id: "W-BRA-01",
      name: "Tactical Sports Bra",
      description: "Áo bra thể thao hỗ trợ cường độ cao, thiết thiết kế nguyên khối chống sốc tối đa.",
      price: 45,
      stock: 50,
      image: "https://images.unsplash.com/photo-1620188526357-ff08e03ea266?auto=format&fit=crop&q=80&w=800",
      category: "SPORTS BRAS",
      status: "Low Stock",
    },
    {
      id: "W-SET-01",
      name: "Stealth Workout Set",
      description: "Đồ bộ tập luyện đồng bộ gồm áo crop top và quần ôm, phối màu tối tinh tế.",
      price: 100,
      stock: 30,
      image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=800",
      category: "SETS",
      status: "Active",
    },
    {
      id: "W-JAC-01",
      name: "Aero Zip-up Jacket",
      description: "Áo khoác thể thao cản gió siêu nhẹ, hoàn hảo cho việc khởi động và chạy bộ.",
      price: 85,
      stock: 15,
      image: "https://images.unsplash.com/photo-1556817411-31ae72fa3ea0?auto=format&fit=crop&q=80&w=800",
      category: "JACKETS",
      status: "Active",
    },
    {
      id: "W-SHO-01",
      name: "Sprint Pro Shorts",
      description: "Quần đùi thoáng khí với chất liệu co giãn 4 chiều, túi zip ẩn tiện lợi.",
      price: 35,
      stock: 20,
      image: "https://images.unsplash.com/photo-1536640712-4d4c36ef0e47?auto=format&fit=crop&q=80&w=800",
      category: "SHORTS",
      status: "Low Stock",
    },
    {
      id: "W-TAN-01",
      name: "Breathe Tank Top",
      description: "Áo ba lỗ siêu mỏng nhẹ, tối đa hóa luồng không khí và thấm hút mồ hôi.",
      price: 30,
      stock: 200,
      image: "https://images.unsplash.com/photo-1532454526553-62391ce4be9a?auto=format&fit=crop&q=80&w=800",
      category: "TANKS",
      status: "Active",
    }
  ];

  for (const prod of newProducts) {
    await prisma.product.upsert({
      where: { id: prod.id },
      update: prod,
      create: prod,
    });
  }
  console.log("Seeded 6 women's products successfully.");
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
