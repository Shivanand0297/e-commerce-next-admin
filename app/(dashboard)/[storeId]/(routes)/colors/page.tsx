import moment from "moment";
import prismadb from "@/lib/prismadb";
import ColorClient from "./components/ColorClient";
import { Suspense } from "react";

type Props = {
  params: {
    storeId: string;
  };
};

const ColorPage = async ({ params }: Props) => {
  const colors = await prismadb.color.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedColors = colors.map((data) => ({
    id: data.id,
    name: data.name,
    value: data.value,
    createdAt: moment(data.createdAt).format("DD, MMM YYYY"),
  }));

  return (
    <Suspense fallback="loading">
      <div className="flex flex-col">
        <div className="flex-1 gap-4 p-8 pt-6">
          <ColorClient colors={formattedColors} />
        </div>
      </div>
    </Suspense>
  );
};

export default ColorPage;
