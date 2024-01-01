import moment from "moment";
import prismadb from "@/lib/prismadb";
import SizeClient from "./components/SizeClient";
import { Suspense } from "react";

type Props = {
  params: {
    storeId: string;
  };
};

const SizePage = async ({ params }: Props) => {
  const sizes = await prismadb.size.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedSizes = sizes.map((data) => ({
    id: data.id,
    name: data.name,
    value: data.value,
    createdAt: moment(data.createdAt).format("DD, MMM YYYY"),
  }));

  return (
    <Suspense fallback="loading">
      <div className="flex flex-col">
        <div className="flex-1 gap-4 p-8 pt-6">
          <SizeClient sizes={formattedSizes} />
        </div>
      </div>
    </Suspense>
  );
};

export default SizePage;
