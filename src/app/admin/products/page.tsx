import { db } from "@/lib/db";
import { products, productVariants } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, MoreHorizontal, LayoutGrid, List } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export default async function AdminProductsPage() {
  const allProducts = await db.query.products.findMany({
    with: {
      variants: true,
    },
    orderBy: [desc(products.createdAt)],
  });

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Catalogue Management
          </h1>
          <p className="text-muted-foreground">
            Add and manage your papad products and their variants.
          </p>
        </div>
        <Button asChild className="rounded-2xl">
          <Link href="/admin/products/new">
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allProducts.map((product) => (
          <Card
            key={product.id}
            className="group rounded-3xl border-none shadow-sm hover:shadow-xl transition-all duration-300 bg-white overflow-hidden"
          >
            <div className="relative aspect-video overflow-hidden">
              <Image
                src={product.images?.[0] || "/placeholder.jpg"}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute top-4 right-4 flex gap-2">
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8 rounded-full shadow-lg bg-white/80 backdrop-blur-sm"
                  asChild
                >
                  <Link href={`/admin/products/${product.id}/edit`}>
                    <Pencil className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold font-serif leading-tight">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        product.isAvailable
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      {product.isAvailable ? "Available" : "Unavailable"}
                    </span>
                    {product.label && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-bold uppercase">
                        {product.label}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Variants ({product.variants.length})
                </p>
                <div className="grid gap-2">
                  {product.variants.slice(0, 3).map((variant) => (
                    <div
                      key={variant.id}
                      className="flex justify-between items-center text-sm p-2 rounded-xl bg-slate-50"
                    >
                      <span className="font-medium text-slate-600">
                        {variant.name}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="font-bold">₹{variant.price}</span>
                        <span
                          className={`text-xs ${variant.stock < 10 ? "text-amber-600" : "text-slate-400"}`}
                        >
                          Stock: {variant.stock}
                        </span>
                      </div>
                    </div>
                  ))}
                  {product.variants.length > 3 && (
                    <p className="text-center text-xs text-muted-foreground pt-1">
                      +{product.variants.length - 3} more variants
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-xl text-xs font-bold uppercase transition-colors"
                  asChild
                >
                  <Link href={`/admin/products/${product.id}`}>View Stats</Link>
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="rounded-xl font-bold transition-all px-4"
                  asChild
                >
                  <Link href={`/admin/products/${product.id}/inventory`}>
                    Inventory
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
