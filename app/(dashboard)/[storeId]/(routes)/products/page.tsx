import moment from "moment";
import prismadb from "@/lib/prismadb";
import { Suspense } from "react";
import { formateCurrency } from "@/lib/utils";
import ProductClient from "./components/ProductClient";

type Props = {
  params: {
    storeId: string;
  };
};

const ProductPage = async ({ params }: Props) => {
  const products = await prismadb.product.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      category: true, 
      size: true,
      color: true
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedProducts = products.map((data) => ({
    id: data.id,
    name: data.name,
    isFeatured: data.isFeatured,
    isArchived: data.isArchived,
    price: formateCurrency.format(data.price.toNumber()),
    category: data.category.name,
    size: data.size.name,
    color: data.color.value,
    createdAt: moment(data.createdAt).format("DD, MMM YYYY"),
  }));

  return (
    <Suspense fallback="loading">
      <div className="flex flex-col">
        <div className="flex-1 gap-4 p-8 pt-6">
          <ProductClient products={formattedProducts} />
        </div>
      </div>
    </Suspense>
  );
};

export default ProductPage;
