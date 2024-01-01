"use client";

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ColorColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import ApiList from "@/components/ui/api-list";

type Props = {
  colors: ColorColumn[];
}

const ColorClient = ({ colors }: Props) => {

  const router = useRouter()
  const { storeId } = useParams()

  return (
    <>
      <div className="flex justify-between items-center">
        <Heading title={`Colors(${colors.length})`} description="Manage colors for your store" />
        <Button onClick={() => router.push(`/${storeId}/colors/new`)} >
          <Plus className="h-4 w-4 mr-2" />
          Add New
        </Button>
      </div>
      <Separator className="mt-3"/>
      <DataTable columns={columns} data={colors} searchKey="name" />
      <ApiList
        entityName="colors"
        entityIdName="colorId"
      />
    </>
  );
};

export default ColorClient;
