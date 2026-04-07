import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./src/lib/db/schema";
import * as dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema });

async function seed() {
  console.log("🌱 Seeding database...");

  // 1. Seed Users
  const adminId = "user_admin_1";
  const customerId = "user_customer_1";
  
  await db.insert(schema.users).values([
    {
      id: adminId,
      name: "Admin User",
      email: process.env.ADMIN_EMAIL || "admin@papadwala.com",
      role: "admin",
    },
    {
      id: customerId,
      name: "Rahul Sharma",
      email: "rahul@example.com",
      role: "user",
    },
  ]).onConflictDoNothing();

  // 2. Clear Existing Orders/Transactions to avoid foreign key issues
  await db.delete(schema.phonepeTransactions);
  await db.delete(schema.orderItems);
  await db.delete(schema.orders);
  await db.delete(schema.comments);
  await db.delete(schema.productVariants);
  await db.delete(schema.products);

  // 3. Seed Products
  const [aalooPapad] = await db.insert(schema.products).values({
    name: "Classic Aaloo Papad",
    slug: "classic-aaloo-papad",
    description: "Sun-dried potato papads made with hand-picked potatoes and a blend of secret spices. No preservatives, just pure tradition.",
    images: ["/products/aaloo.jpg"],
    label: "bestseller",
    isHandmade: true,
  }).returning();

  const [besanPapad] = await db.insert(schema.products).values({
    name: "Besan Lehsun Papad",
    slug: "besan-lehsun-papad",
    description: "Zesty gram flour papads infused with fresh garlic and black pepper. Perfect for a spicy punch with your meals.",
    images: ["/products/besan.jpg"],
    label: "featured",
    isHandmade: true,
  }).returning();

  // 3. Seed Variants
  const variants = await db.insert(schema.productVariants).values([
    {
      productId: aalooPapad.id,
      name: "Small Pack (250g)",
      flavor: "Mild Spicy",
      weight: "250g",
      packSize: "Pack of 1",
      price: "120.00",
      stock: 50,
    },
    {
      productId: aalooPapad.id,
      name: "Family Pack (500g)",
      flavor: "Mild Spicy",
      weight: "500g",
      packSize: "Pack of 1",
      price: "220.00",
      stock: 30,
    },
    {
      productId: besanPapad.id,
      name: "Standard Pack (400g)",
      flavor: "Garlic Spicy",
      weight: "400g",
      packSize: "Pack of 1",
      price: "180.00",
      stock: 5, // Low stock for testing
    },
    {
      productId: besanPapad.id,
      name: "Bulk Pack (1kg)",
      flavor: "Garlic Spicy",
      weight: "1kg",
      packSize: "Pack of 2",
      price: "420.00",
      stock: 0, // Out of stock for testing
    },
  ]).returning();

  // 4. Seed Orders
  const [order] = await db.insert(schema.orders).values({
    userId: customerId,
    total: "340.00",
    status: "progress",
    paymentStatus: "completed",
    shippingAddress: "Flat 402, Sunshine Apartments, Mumbai - 400001",
    phone: "+91 9876543210",
  }).returning();

  // 5. Seed Order Items
  await db.insert(schema.orderItems).values([
    {
      orderId: order.id,
      variantId: variants[0].id,
      quantity: 1,
      priceAtOrder: "120.00",
    },
    {
      orderId: order.id,
      variantId: variants[1].id, // 220.00
      quantity: 1,
      priceAtOrder: "220.00",
    },
  ]);

  // 6. Seed Comments
  await db.insert(schema.comments).values([
    {
      userId: customerId,
      productId: aalooPapad.id,
      rating: 5,
      title: "Authentic Taste!",
      description: "Tastes exactly like how my grandmother used to make. Very crispy and fresh.",
    },
    {
      userId: customerId,
      productId: besanPapad.id,
      rating: 4,
      title: "Spicy and Good",
      description: "Great flavor, maybe a bit too spicy for kids but perfect for adults.",
    },
  ]);

  // 7. Seed Transactions
  await db.insert(schema.phonepeTransactions).values({
    orderId: order.id,
    merchantTransactionId: `T_SEED_${order.id.slice(0,8)}`,
    amount: "340.00",
    status: "SUCCESS",
    pgResponse: JSON.stringify({ code: "PAYMENT_SUCCESS", message: "Seed data transaction" }),
  });

  console.log("✅ Seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
