import { Suspense } from "react";
import moment from "moment";
import prismadb from "@/lib/prismadb";
import CategoryClient from "./components/CategoryClient";

type Props = {
  params: {
    storeId: string;
  };
};

const CategoriesPage = async ({ params }: Props) => {
  const categories = await prismadb.category.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      billboard: true
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedCategories = categories.map((data) => ({
    id: data.id,
    name: data.name,
    billboardLabel: data.billboard.label,
    createdAt: moment(data.createdAt).format("DD, MMM YYYY"),
  }));

  return (
    <Suspense fallback="loading">
      <div className="flex flex-col">
        <div className="flex-1 gap-4 p-8 pt-6">
          <CategoryClient categories={formattedCategories} />
        </div>
      </div>
    </Suspense>
  );
};

export default CategoriesPage;
