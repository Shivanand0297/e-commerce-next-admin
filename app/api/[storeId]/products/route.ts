import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

type Props = {
  params: {
    storeId: string;
  };
};

export const POST = async (req: Request, { params }: Props) => {
  try {
    const body = await req.json();
    const { name, images, price, categoryId, colorId, sizeId, isFeatured, isArchived } = body;

    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required!", { status: 400 });
    }

    if (!images) {
      return new NextResponse("Images are required!", { status: 400 });
    }

    if (!price) {
      return new NextResponse("Price is required!", { status: 400 });
    }

    if (!categoryId) {
      return new NextResponse("Category is required!", { status: 400 });
    }

    if (!colorId) {
      return new NextResponse("color is required!", { status: 400 });
    }

    if (!sizeId) {
      return new NextResponse("size is required!", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required to make a product!", { status: 400 });
    }

    // checking if a store exists in db with the logged in user
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const product = await prismadb.product.create({
      data: {
        name,
        price,
        categoryId,
        sizeId,
        colorId,
        isFeatured,
        isArchived,
        storeId: params.storeId,
        images: {
          createMany: {
            data: images.map((data: { url: string }) => data),
          },
        },
      },
    });

    if (!product) {
      return new NextResponse("Product not created", { status: 500 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.log("Product POST:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};

export const GET = async (req: Request, { params }: Props) => {
  try {
    if (!params.storeId) {
      return new NextResponse("Store id is required to fetch products !", { status: 400 });
    }

    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const colorId = searchParams.get("colorId") || undefined;
    const sizeId = searchParams.get("sizeId") || undefined;
    const isFeatured = searchParams.get("isFeatured");

    const products = await prismadb.product.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        colorId,
        sizeId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include: {
        images: true,
        color: true,
        category: true,
        size: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.log("Product GET:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
