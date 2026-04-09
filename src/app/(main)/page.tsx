import React from "react";
import { Hero } from "@/components/home/hero";
import { ProductShowcase } from "@/components/home/product-showcase";
import { BentoFeatures } from "@/components/home/bento-features";
import { FAQSection } from "@/components/home/faq-section";
import { db } from "@/lib/db";
import { products, productVariants } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export default async function HomePage() {
  // Fetch featured/top products for the showcase
  const topProducts = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      description: products.description,
      images: products.images,
      label: products.label,
    })
    .from(products)
    .where(eq(products.isArchived, false))
    .limit(4);

  // Fetch prices for these products
  const productsWithPrices = await Promise.all(
    topProducts.map(async (p) => {
      const variants = await db
        .select({ price: productVariants.price })
        .from(productVariants)
        .where(eq(productVariants.productId, p.id))
        .orderBy(productVariants.price);

      return { ...p, variants };
    }),
  );

  return (
    <main className="flex-1 bg-white">
      <Hero />
      <ProductShowcase products={productsWithPrices} />
      <BentoFeatures />
      <FAQSection />
    </main>
  );
}
