"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import { Image } from "@imagekit/next";
import Link from "next/link";
import { deleteProduct } from "@/lib/actions/products";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export type ProductWithVariants = {
  id: string;
  name: string;
  slug: string;
  images: string[] | null;
  description: string | null;
  isHandmade: boolean;
  isAvailable: boolean;
  label: "coming_soon" | "featured" | "bestseller" | null;
  createdAt: Date;
  variants: {
    id: string;
    name: string;
    price: string;
    stock: number;
  }[];
};

export const columns: ColumnDef<ProductWithVariants>[] = [
  {
    accessorKey: "images",
    header: "Image",
    cell: ({ row }) => {
      const images = row.getValue("images") as string[] | null;
      // Robust check: ensure it's an array, grab the first item, and trim it.
      const src = images && images.length > 0 ? images[0].trim() : "";
      console.log("------src----->", src);

      // Get the first letter of the product name for the fallback
      const productName = row.getValue("name") as string;
      const initial = productName ? productName.charAt(0).toUpperCase() : "P";

      return (
        <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-slate-100 bg-slate-50 flex items-center justify-center">
          {src ? (
            <Image
              urlEndpoint="https://ik.imagekit.io/babacreatesassets"
              src={src}
              alt={productName || "Product"}
              fill
              transformation={[{ width: 96, height: 96 }]}
              className="object-contain h-12"
            />
          ) : (
            // Premium Fallback: Displays the first letter
            <span className="text-slate-400 font-bold text-lg font-serif">
              {initial}
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Product",
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      const slug = row.original.slug;
      return (
        <div className="flex flex-col">
          <span className="font-medium text-sm">{name}</span>
          <span className="text-xs text-muted-foreground">/{slug}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "isAvailable",
    header: "Status",
    cell: ({ row }) => {
      const isAvailable = row.getValue("isAvailable") as boolean;
      return (
        <Badge className="rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border-none bg-green-100 text-green-700 shadow-sm">
          {isAvailable ? "Active" : "Draft"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "label",
    header: "Label",
    cell: ({ row }) => {
      const label = row.getValue("label") as string;
      if (!label)
        return <span className="text-muted-foreground text-xs">-</span>;
      return (
        <Badge
          variant="outline"
          className="rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border-indigo-200"
        >
          {label.replace("_", " ")}
        </Badge>
      );
    },
  },
  {
    id: "price",
    header: "Price Range",
    cell: ({ row }) => {
      const variants = row.original.variants;
      if (!variants.length) return "-";
      const prices = variants.map((v) => parseFloat(v.price));
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      return (
        <span className="text-sm font-medium">
          ₹{min === max ? min : `${min} - ${max}`}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell product={row.original} />,
  },
];

function ActionsCell({ product }: { product: ProductWithVariants }) {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-xl min-w-[160px]">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link href={`/admin/products/${product.id}/edit`}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit Product
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onSelect={async (e) => {
            e.preventDefault();
            if (confirm("Are you sure you want to delete this product?")) {
              const result = await deleteProduct(product.id);
              if (result.success) {
                toast.success("Product deleted successfully");
                router.refresh();
              } else {
                const errorMessage =
                  "error" in result
                    ? (result.error as string)
                    : "Something went wrong";
                toast.error(errorMessage);
              }
            }
          }}
        >
          <Trash className="mr-2 h-4 w-4" />
          Delete Product
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
