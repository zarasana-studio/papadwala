import { db } from "@/lib/db";
import { orders, users } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Package,
  Truck,
  CheckCircle2,
  ShoppingBag,
  Eye,
  Search,
} from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";

export default async function AdminOrdersPage() {
  const allOrders = await db
    .select({
      id: orders.id,
      total: orders.total,
      status: orders.status,
      paymentStatus: orders.paymentStatus,
      createdAt: orders.createdAt,
      phone: orders.phone,
      userName: users.name,
      userEmail: users.email,
    })
    .from(orders)
    .leftJoin(users, eq(orders.userId, users.id))
    .orderBy(desc(orders.createdAt));

  const stats = [
    {
      label: "Pending",
      count: allOrders.filter((o) => o.status === "progress").length,
      color: "text-amber-500",
      icon: Package,
    },
    {
      label: "Shipped",
      count: allOrders.filter((o) => o.status === "shipped").length,
      color: "text-blue-500",
      icon: Truck,
    },
    {
      label: "Delivered",
      count: allOrders.filter((o) => o.status === "delivered").length,
      color: "text-emerald-500",
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Order Management
          </h1>
          <p className="text-muted-foreground">
            Track and update the status of customer orders.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className="rounded-3xl border-none shadow-sm bg-white overflow-hidden"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.label}
              </CardTitle>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.count}</div>
              <p className="text-xs text-muted-foreground">Active orders</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="rounded-3xl border-none shadow-sm bg-white overflow-hidden">
        <div className="p-6 border-b flex items-center gap-4 bg-slate-50/50">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by Order ID, Email or Phone..."
              className="pl-10 rounded-xl bg-white border-none shadow-sm h-11"
            />
          </div>
          <Button variant="outline" className="rounded-xl h-11 font-bold">
            Filter
          </Button>
        </div>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b">
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Order ID & Date
                  </th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Customer Info
                  </th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Total Price
                  </th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Payment
                  </th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Shipping Status
                  </th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-slate-50/50 transition-all duration-200"
                  >
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 font-serif">
                          #{order.id.slice(0, 8)}
                        </span>
                        <span className="text-xs text-muted-foreground font-medium">
                          {new Date(order.createdAt).toLocaleDateString(
                            undefined,
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-sm">
                          {order.userName || "Guest"}
                        </span>
                        <span className="text-xs text-muted-foreground font-medium">
                          {order.phone}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-extrabold text-slate-900">
                        ₹{order.total}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-tighter ${
                          order.paymentStatus === "completed"
                            ? "bg-emerald-100 text-emerald-700"
                            : order.paymentStatus === "failed"
                              ? "bg-rose-100 text-rose-700"
                              : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-tighter ${
                            order.status === "delivered"
                              ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                              : order.status === "shipped"
                                ? "bg-indigo-100 text-indigo-700 border border-indigo-200"
                                : "bg-slate-100 text-slate-600 border border-slate-200"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full hover:bg-slate-200 transition-colors"
                        asChild
                      >
                        <Link href={`/admin/orders/${order.id}`}>
                          <Eye className="w-4 h-4" />
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {allOrders.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 bg-slate-50/30">
                <ShoppingBag className="w-12 h-12 text-slate-200 mb-4" />
                <p className="text-slate-400 font-bold">No orders found.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
