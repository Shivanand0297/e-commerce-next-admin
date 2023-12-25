"use client";

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

const BillboardClient = () => {

  const router = useRouter()
  const { storeId } = useParams()

  return (
    <>
      <div className="flex justify-between items-center">
        <Heading title="Billboards(0)" description="Manage billboards for your store" />
        <Button onClick={() => router.push(`/${storeId}/billboards/new`)} >
          <Plus className="h-4 w-4 mr-2" />
          Add New
        </Button>
      </div>
      <Separator className="mt-3"/>
    </>
  );
};

export default BillboardClient;
