import { db } from "@/lib/db";
import { products, productVariants } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, AlertTriangle } from "lucide-react";
import {
  InventoryTable,
} from "@/components/admin/inventory/inventory-table";
import { InventoryItem } from "@/components/admin/inventory/inventory-columns";

export default async function AdminInventoryPage() {
  const allVariants = await db
    .select({
      id: productVariants.id,
      name: productVariants.name,
      stock: productVariants.stock,
      soldCount: productVariants.soldCount,
      price: productVariants.price,
      productId: productVariants.productId,
      productName: products.name,
    })
    .from(productVariants)
    .leftJoin(products, eq(productVariants.productId, products.id))
    .orderBy(productVariants.stock);

  const lowStockThreshold = 10;
  const lowStockItems = allVariants.filter((v) => v.stock < lowStockThreshold);
  const outOfStockItems = allVariants.filter((v) => (v.stock ?? 0) === 0);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto pb-12 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-medium tracking-tight font-serif text-slate-900">
          Inventory Management
        </h1>
        <p className="text-sm text-slate-600 font-medium">
          Monitor and update stock levels for all papad variants.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-3xl border-none shadow-sm shadow-slate-100 bg-emerald-50/30 overflow-hidden transition-all hover:bg-emerald-50/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-emerald-900/80">
              In Stock Variants
            </CardTitle>
            <Package className="w-4 h-4 text-emerald-500/80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-medium tracking-tight text-emerald-950">
              {allVariants.length - outOfStockItems.length}
            </div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-emerald-700/60">
              Active inventory items
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-3xl border-none shadow-sm shadow-slate-100 bg-amber-50/40 overflow-hidden transition-all hover:bg-amber-50/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-amber-900/80">
              Low Stock
            </CardTitle>
            <AlertTriangle className="w-4 h-4 text-amber-500/80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-medium tracking-tight text-amber-950">
              {lowStockItems.length}
            </div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-amber-700/60">
              Below threshold ({lowStockThreshold})
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-3xl border-none shadow-sm shadow-slate-100 bg-rose-50/40 overflow-hidden transition-all hover:bg-rose-50/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-rose-900/80">
              Out of Stock
            </CardTitle>
            <Package className="w-4 h-4 text-rose-500/80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-medium tracking-tight text-rose-950">
              {outOfStockItems.length}
            </div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-rose-700/60">
              Needs replenishment
            </p>
          </CardContent>
        </Card>
      </div>

      <InventoryTable data={allVariants as InventoryItem[]} />
    </div>
  );
}
