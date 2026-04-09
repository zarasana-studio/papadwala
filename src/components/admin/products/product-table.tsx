"use client";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Search, SlidersHorizontal, Plus } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { columns, type ProductWithVariants } from "./product-columns";
import Link from "next/link";
import { useState } from "react";

interface ProductTableProps {
  data: ProductWithVariants[];
}

export function ProductTable({ data }: ProductTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full space-y-4">
      {/* Search and Filter */}
      <div className="flex items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="pl-9 h-8 rounded-xl border-none bg-white outline-none shadow-sm shadow-slate-100 focus:ring-2 focus:ring-indigo-500 transition-all"
          />
        </div>
        {/* Filter & CTA */}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-8 rounded-xl border-none bg-white shadow-sm shadow-slate-100 hover:bg-slate-50 transition-all"
              >
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="rounded-xl min-w-[150px]"
            >
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button asChild className="h-8 rounded-xl transition-all">
            <Link href="/admin/products/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Link>
          </Button>
        </div>
      </div>

      {/* Table */}

      <Table>
        <TableHeader className="bg-sky-50 shadow shadow-slate-200 backdrop-blur sticky top-0 z-20 transition-all rounded-t-2xl overflow-hidden">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="hover:bg-transparent border-slate-100 "
            >
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className="text-[11px] font-bold uppercase tracking-wider text-slate-500 h-12"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="border-slate-100 hover:bg-slate-50/50 transition-colors group border"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-32 text-center text-muted-foreground font-medium"
              >
                No products found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-4">
          <div className="text-xs text-muted-foreground font-medium bg-slate-100/50 px-3 py-1 rounded-full border border-slate-100">
            Showing{" "}
            <span className="text-slate-900 font-bold">
              {table.getRowModel().rows.length > 0
                ? table.getState().pagination.pageIndex *
                    table.getState().pagination.pageSize +
                  1
                : 0}
            </span>
            -
            <span className="text-slate-900 font-bold">
              {Math.min(
                (table.getState().pagination.pageIndex + 1) *
                  table.getState().pagination.pageSize,
                table.getFilteredRowModel().rows.length,
              )}
            </span>{" "}
            of{" "}
            <span className="text-slate-900 font-bold">
              {table.getFilteredRowModel().rows.length}
            </span>{" "}
            products
          </div>
          <div className="text-xs text-muted-foreground font-medium">
            Page{" "}
            <span className="text-slate-900 font-bold">
              {table.getState().pagination.pageIndex + 1}
            </span>{" "}
            of{" "}
            <span className="text-slate-900 font-bold">
              {table.getPageCount()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-xs font-medium text-slate-500">Rows per page</p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 w-12 rounded-lg border-none bg-white shadow-sm shadow-slate-100 text-xs font-bold"
                >
                  {table.getState().pagination.pageSize}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="min-w-[70px] rounded-xl"
              >
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <DropdownMenuCheckboxItem
                    key={pageSize}
                    checked={table.getState().pagination.pageSize === pageSize}
                    onCheckedChange={() => table.setPageSize(pageSize)}
                    className="text-xs font-medium"
                  >
                    {pageSize}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={"outline"}
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="rounded-lg h-8 text-xs font-bold border-none shadow-slate-100"
          >
            Previous
          </Button>
          <Button
            variant={"outline"}
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="rounded-lg h-8 text-xs font-bold border-none shadow-slate-100"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
