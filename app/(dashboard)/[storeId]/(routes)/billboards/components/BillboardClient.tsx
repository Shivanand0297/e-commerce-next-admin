"use client";

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { BillboardColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import ApiList from "@/components/ui/api-list";

type Props = {
  billboards: BillboardColumn[];
}

const BillboardClient = ({ billboards }: Props) => {

  const router = useRouter()
  const { storeId } = useParams()

  return (
    <>
      <div className="flex justify-between items-center">
        <Heading title={`Billboards(${billboards.length})`} description="Manage billboards for your store" />
        <Button onClick={() => router.push(`/${storeId}/billboards/new`)} >
          <Plus className="h-4 w-4 mr-2" />
          Add New
        </Button>
      </div>
      <Separator className="mt-3"/>
      <DataTable columns={columns} data={billboards} searchKey="label" />
      {/* api list  component */}
      <ApiList
        entityName="billboards"
        entityIdName="billboardId"
      />
    </>
  );
};

export default BillboardClient;
