import { db } from "../src/lib/db";
import { products } from "../src/lib/db/schema";
import { sql } from "drizzle-orm";

async function updateDescriptions() {
  const infoLink = "\n\nLearn more about how papads are made: https://foodcrumbles.com/how-papadums-papads-work-and-are-made/";
  
  console.log("📝 Updating product descriptions with info link...");

  try {
    // Append the link to the description for all products
    const result = await db
      .update(products)
      .set({
        description: sql`${products.description} || ${infoLink}`,
      });

    console.log("✅ Successfully updated all products with the info link!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to update descriptions:", error);
    process.exit(1);
  }
}

updateDescriptions();
