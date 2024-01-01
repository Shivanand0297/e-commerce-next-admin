"use client";

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { SizeColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import ApiList from "@/components/ui/api-list";

type Props = {
  sizes: SizeColumn[];
}

const SizeClient = ({ sizes }: Props) => {

  const router = useRouter()
  const { storeId } = useParams()

  return (
    <>
      <div className="flex justify-between items-center">
        <Heading title={`Size(${sizes.length})`} description="Manage sizes for your store" />
        <Button onClick={() => router.push(`/${storeId}/sizes/new`)} >
          <Plus className="h-4 w-4 mr-2" />
          Add New
        </Button>
      </div>
      <Separator className="mt-3"/>
      <DataTable columns={columns} data={sizes} searchKey="name" />
      <ApiList
        entityName="sizes"
        entityIdName="sizeId"
      />
    </>
  );
};

export default SizeClient;
