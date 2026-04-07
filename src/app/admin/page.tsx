import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { products, productVariants, orders } from "@/lib/db/schema";
import { count, eq } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Package, DollarSign, Users } from "lucide-react";
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
    <div className="p-8 space-y-8 max-h-full max-w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {session.user.name}
          </p>
        </div>
        <div className="flex gap-4">
          <Button asChild variant="outline">
            <Link href="/admin/products">Manage Inventory</Link>
          </Button>
          <Button asChild>
            <Link href="/admin/orders">View Orders</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="rounded-2xl border-none shadow-sm bg-white"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 rounded-3xl border-none shadow-sm bg-white overflow-hidden">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 rounded-2xl bg-slate-50"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">
                      Order #{order.id.slice(0, 8)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold">₹{order.total}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        order.paymentStatus === "completed"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>
              ))}
              {recentOrders.length === 0 && (
                <p className="text-sm text-center py-8 text-muted-foreground">
                  No orders yet.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 rounded-3xl border-none shadow-sm bg-white overflow-hidden">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Button
              asChild
              variant="ghost"
              className="justify-start rounded-xl"
            >
              <Link href="/admin/products/new">Add New Product</Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="justify-start rounded-xl"
            >
              <Link href="/admin/inventory">Update Stock levels</Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="justify-start rounded-xl text-destructive hover:text-destructive"
            >
              <Link href="/">Back to Shop</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
