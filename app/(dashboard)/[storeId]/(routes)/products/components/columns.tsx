"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Check, X } from "lucide-react";
import ColumnActions from "./ColumnActions";
import { formateCurrency } from "@/lib/utils";

export type ProductColumn = {
  id: string;
  name: string;
  isFeatured: boolean;
  isArchived: boolean;
  price: string;
  category: string;
  size: string;
  color: string;
  createdAt: string;
};

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "isFeatured",
    header: "Featured",
    cell: (cell) => {
      return cell.getValue() ? <Check className="h-4 w-4 text-green-600" /> : <X className="h-4 w-4 text-red-600"/>
    }
  },
  {
    accessorKey: "isArchived",
    header: "Archived",
    cell: (cell) => {
      return cell.getValue() ? <Check className="h-4 w-4 text-green-600" /> : <X className="h-4 w-4 text-red-600"/>
    }
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "size",
    header: "Size",
  },
  {
    accessorKey: "color",
    header: "Color",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-5">
          <span>{row.original.color}</span>
          <div className="w-8 h-8 rounded-full border-2" style={{ backgroundColor: row.original.color}}></div>
        </div>
      )
    }
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <>
          <ColumnActions data={row.original} />
        </>
      );
    },
  },
];
