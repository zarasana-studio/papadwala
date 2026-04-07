import { db } from "@/lib/db";
import { products, productVariants } from "@/lib/db/schema";
import { count, eq, sql } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ShoppingBag,
  Package,
  DollarSign,
  Users,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
  const outOfStockItems = allVariants.filter((v) => v.stock === 0);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Inventory Management
          </h1>
          <p className="text-muted-foreground">
            Monitor and update stock levels for all papad variants.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-2xl" asChild>
            <Link href="/admin/products/new">New Product</Link>
          </Button>
          <Button className="rounded-2xl" asChild>
            <Link href="/admin/products">Manage Catalogue</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-3xl border-none shadow-sm bg-white overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              In Stock Variants
            </CardTitle>
            <Package className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {allVariants.length - outOfStockItems.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Active inventory items
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-3xl border-none shadow-sm bg-amber-50 overflow-hidden border-amber-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-amber-900">
              Low Stock
            </CardTitle>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-900">
              {lowStockItems.length}
            </div>
            <p className="text-xs text-amber-700">
              Below threshold ({lowStockThreshold})
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-3xl border-none shadow-sm bg-rose-50 overflow-hidden border-rose-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-rose-900">
              Out of Stock
            </CardTitle>
            <Package className="w-4 h-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-900">
              {outOfStockItems.length}
            </div>
            <p className="text-xs text-rose-700">Needs replenishment</p>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-3xl border-none shadow-sm bg-white overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b">
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Product & Variant
                  </th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Price
                  </th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Stock Status
                  </th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Total Sold
                  </th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {allVariants.map((v) => (
                  <tr
                    key={v.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">
                          {v.productName}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {v.name}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-bold">₹{v.price}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            v.stock === 0
                              ? "bg-rose-500"
                              : v.stock < lowStockThreshold
                                ? "bg-amber-500"
                                : "bg-emerald-500"
                          }`}
                        />
                        <span
                          className={`font-bold ${
                            v.stock === 0
                              ? "text-rose-600"
                              : v.stock < lowStockThreshold
                                ? "text-amber-600"
                                : "text-slate-700"
                          }`}
                        >
                          {v.stock} in stock
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-emerald-500" />
                        <span className="font-medium">{v.soldCount}</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl font-bold"
                        asChild
                      >
                        <Link href={`/admin/products/${v.productId}/inventory`}>
                          Edit Stock
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
