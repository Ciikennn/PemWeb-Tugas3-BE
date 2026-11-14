import { prisma } from "../src/lib/prisma";

const products = [
  { name: "Pulpen", price: 5000 },
  { name: "Buku Tulis", price: 12000 },
  { name: "Spidol", price: 8000 },
  { name: "Penggaris", price: 6000 },
  { name: "Penghapus", price: 3000 },
];

async function main() {
  await prisma.product.deleteMany();
  // Reset auto-increment supaya ID kembali mulai dari 1
  await prisma.$executeRawUnsafe(`ALTER SEQUENCE "products_id_seq" RESTART WITH 1`);

  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  console.log(`Seed selesai: ${products.length} produk ditambahkan`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
