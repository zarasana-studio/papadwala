import { db } from "../src/lib/db";
import { products, productVariants } from "../src/lib/db/schema";

async function seed() {
  console.log("Seeding started...");

  // Clear existing data to avoid conflicts
  await db.delete(productVariants);
  await db.delete(products);

  // 1. Aaloo Papad (Standard)
  const [aaloo] = await db.insert(products).values({
    name: "Aaloo Papad",
    slug: "aaloo-papad",
    description: "Classic handmade potato papad with subtle spices.",
    images: ["/products/aaloo.jpg"],
    isHandmade: true,
    label: "featured",
  }).returning();

  await db.insert(productVariants).values([
    {
      productId: aaloo.id,
      name: "Classic Red Chili 250g",
      flavor: "Classic Red Chili",
      weight: "250g",
      packSize: "Pack of 1",
      price: "120.00",
      stock: 100,
    },
    {
      productId: aaloo.id,
      name: "Classic Red Chili 500g",
      flavor: "Classic Red Chili",
      weight: "500g",
      packSize: "Pack of 1",
      price: "220.00",
      stock: 50,
    }
  ]);

  // 2. Besan Lehsun Papad
  const [besanLehsun] = await db.insert(products).values({
    name: "Besan Lehsun Papad",
    slug: "besan-lehsun-papad",
    description: "Gram flour papad infused with fresh garlic and black pepper.",
    images: ["/products/besan.jpg"],
    isHandmade: true,
    label: "bestseller",
  }).returning();

  await db.insert(productVariants).values([
    {
      productId: besanLehsun.id,
      name: "Garlic Pepper 250g",
      flavor: "Garlic Pepper",
      weight: "250g",
      packSize: "Pack of 1",
      price: "150.00",
      stock: 80,
    },
    {
      productId: besanLehsun.id,
      name: "Garlic Pepper 500g",
      flavor: "Garlic Pepper",
      weight: "500g",
      packSize: "Pack of 1",
      price: "280.00",
      stock: 40,
    }
  ]);

  console.log("Seeding completed!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
