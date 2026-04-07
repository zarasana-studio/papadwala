ALTER TABLE "orders" ADD COLUMN "shipping_address" text NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "phone" text NOT NULL;--> statement-breakpoint
ALTER TABLE "product_variants" ADD COLUMN "name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "images" text[];