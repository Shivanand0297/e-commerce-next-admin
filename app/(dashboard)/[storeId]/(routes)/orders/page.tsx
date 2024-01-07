import moment from "moment";
import prismadb from "@/lib/prismadb";
import BillboardClient from "./components/BillboardClient";
import { Suspense } from "react";
import OrderClient from "./components/BillboardClient";

type Props = {
  params: {
    storeId: string;
  };
};

const OrdersPage = async ({ params }: Props) => {
  const orders = await prismadb.order.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      orderItems: {
        include: {
          product: true
        }
      }
    }
  });

  const formattedOrders = orders.map((order) => ({
    id: order.id,
    phone: order.phone,
    address: order.address,
    products: order.orderItems.map((order) => order.product).join(", "),
    totalPrice: order.orderItems.reduce((total, item) => {
      return total + Number(item.product.price)
    }, 0),
    createdAt: moment(order.createdAt).format("DD, MMM YYYY"),
    isPaid: order.isPaid,
  }));

  return (
    <Suspense fallback="loading">
      <div className="flex flex-col">
        <div className="flex-1 gap-4 p-8 pt-6">
          <OrderClient orders={formattedOrders} />
        </div>
      </div>
    </Suspense>
  );
};

export default OrdersPage;
