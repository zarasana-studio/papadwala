import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { products, orders } from "@/lib/db/schema";
import { count } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Package, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function AdminDashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Role check is now handled by layout.tsx
  if (!session?.user) return null;

  // Fetch stats
  const [productsCount] = await db.select({ value: count() }).from(products);
  const [ordersCount] = await db.select({ value: count() }).from(orders);

  const recentOrders = await db
    .select()
    .from(orders)
    .orderBy(orders.createdAt)
    .limit(5);

  const stats = [
    {
      title: "Total Orders",
      value: ordersCount.value.toString(),
      icon: ShoppingBag,
      description: "Lifetime orders placed",
    },
    {
      title: "Products",
      value: productsCount.value.toString(),
      icon: Package,
      description: "Active items in catalog",
    },
    {
      title: "Recent Sales",
      value: recentOrders.length.toString(),
      icon: DollarSign,
      description: "Last 5 orders",
    },
  ];

  return (
    <div className="p-8 space-y-8 max-h-full max-w-full animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-medium tracking-tight font-serif text-slate-900">
            Admin Dashboard
          </h1>
          <p className="text-sm text-slate-600 font-medium">
            Welcome back, {session.user.name}
          </p>
        </div>
        <div className="flex gap-4">
          <Button
            asChild
            variant="outline"
            className="h-8 rounded-xl border-none bg-white shadow-sm shadow-slate-100 hover:bg-slate-50 transition-all text-xs font-semibold text-slate-600"
          >
            <Link href="/admin/products">Manage Inventory</Link>
          </Button>
          <Button
            asChild
            className="h-8 rounded-xl transition-all text-xs font-semibold shadow-sm shadow-slate-100"
          >
            <Link href="/admin/orders">View Orders</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat, idx) => (
          <Card
            key={stat.title}
            className={`rounded-2xl border-none shadow-sm shadow-slate-100 overflow-hidden transition-all hover:opacity-90 ${
              idx === 0
                ? "bg-sky-50/50"
                : idx === 1
                  ? "bg-emerald-50/50"
                  : "bg-amber-50/50"
            }`}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 text-slate-900/80">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider opacity-60">
                {stat.title}
              </CardTitle>
              <stat.icon className="w-4 h-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold tracking-tight text-slate-900">
                {stat.value}
              </div>
              <p className="text-[11px] font-medium text-slate-500 mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 rounded-3xl border-none shadow-sm shadow-slate-100 bg-white overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-900/80 uppercase tracking-widest text-[10px]">
              Recent Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/40 transition-colors hover:bg-slate-50/80 group"
                >
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm text-slate-900">
                      Order #{order.id.slice(0, 8)}
                    </span>
                    <span className="text-[11px] font-medium text-slate-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold text-slate-700">
                      ₹{order.total}
                    </span>
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-md font-semibold uppercase tracking-wider border-none shadow-sm ${
                        order.paymentStatus === "completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>
              ))}
              {recentOrders.length === 0 && (
                <p className="text-sm text-center py-8 text-slate-500 font-medium">
                  No orders yet.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 rounded-3xl border-none shadow-sm shadow-slate-100 bg-white overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-900/80 uppercase tracking-widest text-[10px]">
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Button
              asChild
              variant="outline"
              className="justify-start h-9 rounded-xl border-none bg-slate-50/50 shadow-sm shadow-slate-100 transition-all hover:bg-slate-50 hover:translate-x-1 text-xs font-semibold text-slate-600"
            >
              <Link href="/admin/products/new">Add New Product</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="justify-start h-9 rounded-xl border-none bg-slate-50/50 shadow-sm shadow-slate-100 transition-all hover:bg-slate-50 hover:translate-x-1 text-xs font-semibold text-slate-600"
            >
              <Link href="/admin/inventory">Update Stock levels</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="justify-start h-9 rounded-xl border-none bg-rose-50/30 shadow-sm shadow-slate-100 transition-all hover:bg-rose-50 hover:translate-x-1 text-xs font-semibold text-rose-600"
            >
              <Link href="/">Back to Shop</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
