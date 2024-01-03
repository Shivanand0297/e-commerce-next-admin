"use client";

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ProductColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import ApiList from "@/components/ui/api-list";

type Props = {
  products: ProductColumn[];
}

const ProductClient = ({ products }: Props) => {

  const router = useRouter()
  const { storeId } = useParams()

  return (
    <>
      <div className="flex justify-between items-center">
        <Heading title={`Products(${products.length})`} description="Manage products for your store" />
        <Button onClick={() => router.push(`/${storeId}/products/new`)} >
          <Plus className="h-4 w-4 mr-2" />
          Add New
        </Button>
      </div>
      <Separator className="mt-3"/>
      <DataTable columns={columns} data={products} searchKey="name" />
      <ApiList
        entityName="products"
        entityIdName="productId"
      />
    </>
  );
};

export default ProductClient;
