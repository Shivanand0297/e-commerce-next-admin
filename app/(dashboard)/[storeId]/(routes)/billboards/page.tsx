import moment from "moment";
import prismadb from "@/lib/prismadb";
import BillboardClient from "./components/BillboardClient";

type Props = {
  params: {
    storeId: string;
  };
};

const BillboardsPage = async ({ params }: Props) => {
  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedBillboards = billboards.map((data) => ({
    id: data.id,
    label: data.label,
    createdAt: moment(data.createdAt).format("DD, MMM YYYY"),
  }));

  return (
    <div className="flex flex-col">
      <div className="flex-1 gap-4 p-8 pt-6">
        <BillboardClient billboards={formattedBillboards} />
      </div>
    </div>
  );
};

export default BillboardsPage;
