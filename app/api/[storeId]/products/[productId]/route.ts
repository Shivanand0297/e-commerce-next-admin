import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

type Props = {
  params: {
    storeId: string;
    productId: string;
  };
};

export const GET = async (_req: Request, { params }: Props) => {
  try {
    if (!params.productId) {
      return new NextResponse("Product id is required!", { status: 400 });
    }
    const product = await prismadb.product.findUnique({
      where: {
        id: params.productId,
      },
      include: {
        images: true,
        category: true,
        size: true,
        color: true,
      }
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log(`Product GET: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const PATCH = async (req: Request, { params }: Props) => {
  try {
    const body = await req.json();

    const { name, images, price, categoryId, colorId, sizeId, isFeatured, isArchived } = body;

    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.productId) {
      return new NextResponse("Product id is required!", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required!", { status: 400 });
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

    await prismadb.product.update({
      where: {
        id: params.productId,
      },
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
          deleteMany: {}
        }
      },
    });

    const updatedProducts = await prismadb.product.update({
      where: {
        id: params.productId,
      },
      data: {
        images: {
          createMany: {
            data: images.map((data: { url: string }) => data),
          }
        }
      }
    })

    return NextResponse.json(updatedProducts);
  } catch (error) {
    console.log(`Product PATCH: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const DELETE = async (_req: Request, { params }: Props) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.productId) {
      return new NextResponse("Product id is required!", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required!", { status: 400 });
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

    const deletedProduct = await prismadb.product.deleteMany({
      where: {
        id: params.productId,
      },
    });

    return NextResponse.json(deletedProduct);
  } catch (error) {
    console.log(`Product DELETE: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
