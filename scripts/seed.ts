import { db } from "../src/lib/db";
import {
  products,
  productVariants,
  orders,
  orderItems,
  phonepeTransactions,
} from "../src/lib/db/schema";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

// Simple slugify for the script
const slugify = (text: string) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");

const bases = [
  "Moong Daal",
  "Urad Daal",
  "Aaloo (Potato)",
  "Besan (Gram)",
  "Sabudana",
  "Chana Daal",
  "Rice Flour",
  "Nachni (Ragi)",
];
const flavors = [
  "Special Spicy",
  "Classic Jeera",
  "Garlic Tadka",
  "Black Pepper",
  "Minty Pudina",
  "Green Chili",
  "Teekha Masala",
  "Salted Plain",
];
const labels = ["coming_soon", "featured", "bestseller", null];

async function seed() {
  console.log("🚀 Starting large-scale seeding (40 products)...");

  try {
    // 1. Clear existing data
    console.log("🧹 Cleaning up old data (including orders)...");
    await db.delete(phonepeTransactions);
    await db.delete(orderItems);
    await db.delete(orders);
    await db.delete(productVariants);
    await db.delete(products);

    // 2. Generate 40 products
    for (let i = 1; i <= 40; i++) {
      const base = bases[i % bases.length];
      const flavor = flavors[i % flavors.length];
      const name = `${base} ${flavor} Papad`;

      // Add index to name if needed to ensure uniqueness before slugify
      const uniqueName = i > 8 ? `${name} Vol. ${i}` : name;
      const slug = slugify(uniqueName);

      const [product] = await db
        .insert(products)
        .values({
          name: uniqueName,
          slug,
          description: `Premium ${uniqueName}. Authentic taste, handmade with love. Perfect crisp for your tea-time or meals. No artificial colors or preservatives.`,
          images: [
            `https://ik.imagekit.io/babacreatesassets/papadwala/products/product-1775726728368-m3_3PDYLkH-P.png?updatedAt=1775726743695`,
          ],
          isHandmade: true,
          isAvailable: true,
          label: labels[i % labels.length] as any,
        })
        .returning();

      // 3. Generate variants for each product
      await db.insert(productVariants).values([
        {
          productId: product.id,
          name: `${uniqueName} - 250g`,
          flavor,
          weight: "250g",
          packSize: "Pack of 1",
          price: (80 + (i % 10) * 15).toFixed(2),
          stock: 50 + (i % 5) * 20,
        },
        {
          productId: product.id,
          name: `${uniqueName} - 500g`,
          flavor,
          weight: "500g",
          packSize: "Pack of 1",
          price: (150 + (i % 10) * 25).toFixed(2),
          stock: 20 + (i % 5) * 10,
        },
      ]);

      if (i % 10 === 0) {
        console.log(`✅ Seeded ${i} products...`);
      }
    }

    console.log("✨ Seeding completed! 40 products and 80 variants added.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
}

seed();
