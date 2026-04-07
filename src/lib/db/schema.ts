// import { pgTable, text, timestamp, boolean, integer, pgEnum, decimal, primaryKey } from "drizzle-pro-pg-table"; // Wait, that's not right. Standard pgTable.
import { pgTable as pt, text, timestamp, boolean, integer, pgEnum, decimal, primaryKey, uuid } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["user", "admin"]);
export const labelEnum = pgEnum("label", ["coming_soon", "featured", "bestseller"]);
export const orderStatusEnum = pgEnum("order_status", ["progress", "packaging", "shipped", "delivered"]);
export const paymentStatusEnum = pgEnum("payment_status", ["pending", "completed", "failed"]);

export const users = pt("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").default(false).notNull(),
  image: text("image"),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const sessions = pt("sessions", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId").notNull().references(() => users.id),
});

export const accounts = pt("accounts", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId").notNull().references(() => users.id),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
});

export const verifications = pt("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt"),
  updatedAt: timestamp("updatedAt"),
});

export const products = pt("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  images: text("images").array(),
  description: text("description"),
  isHandmade: boolean("is_handmade").default(true).notNull(),
  isAvailable: boolean("is_available").default(true).notNull(),
  label: labelEnum("label"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const productVariants = pt("product_variants", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  name: text("name").notNull(), // Combined name like "Spicy 500g"
  flavor: text("flavor").notNull(),
  weight: text("weight").notNull(), // e.g. "500g", "1kg"
  packSize: text("pack_size").notNull(), // e.g. "Pack of 1", "Pack of 2"
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  stock: integer("stock").default(0).notNull(),
  soldCount: integer("sold_count").default(0).notNull(),
});

export const orders = pt("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  status: orderStatusEnum("status").default("progress").notNull(),
  paymentStatus: paymentStatusEnum("payment_status").default("pending").notNull(),
  shippingAddress: text("shipping_address").notNull(),
  phone: text("phone").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orderItems = pt("order_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  variantId: uuid("variant_id").notNull().references(() => productVariants.id),
  quantity: integer("quantity").notNull(),
  priceAtOrder: decimal("price_at_order", { precision: 10, scale: 2 }).notNull(),
});

export const comments = pt("comments", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  rating: integer("rating").notNull(),
  title: text("title"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const phonepeTransactions = pt("phonepe_transactions", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id").notNull().references(() => orders.id),
  merchantTransactionId: text("merchant_transaction_id").notNull().unique(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull(), // e.g. "COMPLETED", "FAILED"
  pgResponse: text("pg_response"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

import { relations } from "drizzle-orm";

export const productsRelations = relations(products, ({ many }) => ({
  variants: many(productVariants),
  comments: many(comments),
}));

export const productVariantsRelations = relations(productVariants, ({ one }) => ({
  product: one(products, {
    fields: [productVariants.productId],
    references: [products.id],
  }),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  product: one(products, {
    fields: [comments.productId],
    references: [products.id],
  }),
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  comments: many(comments),
}));
