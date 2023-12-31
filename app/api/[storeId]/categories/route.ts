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
    const { name, billboardId } = body;
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name || !billboardId) {
      return new NextResponse("Name and billboard are required!", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required to create a category!", { status: 400 });
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

    const category = await prismadb.category.create({
      data: {
        name, 
        billboardId,
        storeId: params.storeId,
      },
    });

    if (!category) {
      return new NextResponse("Category not created", { status: 500 });
    }

    return NextResponse.json(category);
  } catch (error) {
    console.log("Category POST:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};

export const GET = async (_req: Request, { params }: Props) => {
  try {
    if (!params.storeId) {
      return new NextResponse("Store id is required to fetch categories !", { status: 400 });
    }

    const categories = await prismadb.category.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.log("Category GET:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
