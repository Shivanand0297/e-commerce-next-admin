"use client";

import Heading from "@/components/ui/heading";
import { OrderColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";

type Props = {
  orders: OrderColumn[];
}

const OrderClient = ({ orders }: Props) => {

  return (
    <>
      <Heading title={`Orders(${orders.length})`} description="Manage orders for your store" />
      <Separator/>
      <DataTable columns={columns} data={orders} searchKey="products" />
    </>
  );
};

export default OrderClient;
