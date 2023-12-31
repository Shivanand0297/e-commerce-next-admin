"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import ApiList from "@/components/ui/api-list";
import { CategoryColumn, columns } from "./columns";
import { Plus } from "lucide-react";

type Props = {
  categories: CategoryColumn[];
};

const CategoryClient = ({ categories }: Props) => {
  const router = useRouter();
  const { storeId } = useParams();

  return (
    <>
      <div className="flex justify-between items-center">
        <Heading title={`Categories(${categories.length})`} description="Manage categories for your store" />
        <Button onClick={() => router.push(`/${storeId}/categories/new`)}>
          <Plus className="h-4 w-4 mr-2" />
          Add New
        </Button>
      </div>
      <Separator className="mt-3" />
      <DataTable columns={columns} data={categories} searchKey="name" />
      <ApiList entityName="categories" entityIdName="categoryId" />
    </>
  );
};

export default CategoryClient;
