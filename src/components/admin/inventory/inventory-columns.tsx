"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp } from "lucide-react";
import Link from "next/link";

export type InventoryItem = {
  id: string;
  name: string;
  stock: number;
  soldCount: number;
  price: string;
  productId: string;
  productName: string | null;
};

const lowStockThreshold = 10;

export const columns: ColumnDef<InventoryItem>[] = [
  {
    accessorKey: "productName",
    header: "Product & Variant",
    cell: ({ row }) => {
      const productName = row.getValue("productName") as string;
      const variantName = row.original.name;
      return (
        <div className="flex flex-col">
          <span className="font-medium text-slate-900 leading-tight">
            {productName}
          </span>
          <span className="text-[11px] font-medium text-slate-500/80">
            {variantName}
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const productName = (row.getValue("productName") as string)?.toLowerCase() ?? "";
      const variantName = row.original.name.toLowerCase();
      const searchTerm = value.toLowerCase();
      return productName.includes(searchTerm) || variantName.includes(searchTerm);
    },
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const price = row.getValue("price") as string;
      return <span className="font-medium text-slate-700">₹{price}</span>;
    },
  },
  {
    accessorKey: "stock",
    header: "Stock Status",
    cell: ({ row }) => {
      const stock = row.getValue("stock") as number;
      return (
        <Badge
          className={`rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider border-none shadow-sm ${
            stock === 0
              ? "bg-rose-100/80 text-rose-700"
              : stock < lowStockThreshold
                ? "bg-amber-100/80 text-amber-700"
                : "bg-green-100/80 text-green-700"
          }`}
        >
          {stock} {stock === 1 ? "unit" : "units"} in stock
        </Badge>
      );
    },
  },
  {
    accessorKey: "soldCount",
    header: "Total Sold",
    cell: ({ row }) => {
      const soldCount = row.getValue("soldCount") as number;
      return (
        <div className="flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-500/70" />
          <span className="font-medium text-slate-600">{soldCount}</span>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <div className="text-right">
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-3 rounded-lg border-none bg-white shadow-sm shadow-slate-100 text-[10px] font-semibold uppercase tracking-wider transition-all hover:bg-slate-50 text-slate-600"
            asChild
          >
            <Link href={`/admin/products/${item.productId}/inventory`}>
              Edit Stock
            </Link>
          </Button>
        </div>
      );
    },
  },
];
