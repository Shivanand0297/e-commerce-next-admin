import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

type Props = {
  params: {
    storeId: string;
    sizeId: string;
  };
};

export const GET = async (_req: Request, { params }: Props) => {
  try {
    if (!params.sizeId) {
      return new NextResponse("Size id is required!", { status: 400 });
    }

    const size = await prismadb.size.findUnique({
      where: {
        id: params.sizeId,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log(`Size GET: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const PATCH = async (req: Request, { params }: Props) => {
  try {
    const body = await req.json();
    const { name, value } = body;
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.sizeId) {
      return new NextResponse("Size id is required!", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required!", { status: 400 });
    }

    if (!name || !value) {
      return new NextResponse("name and value are required!", { status: 400 });
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

    const updatedSize = await prismadb.size.updateMany({
      where: {
        id: params.sizeId,
      },
      data: {
        name,
        value
      },
    });


    return NextResponse.json(updatedSize);
  } catch (error) {
    console.log(`Size PATCH: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const DELETE = async (_req: Request, { params }: Props) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.sizeId) {
      return new NextResponse("Size id is required!", { status: 400 });
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

    const deletedSize = await prismadb.size.deleteMany({
      where: {
        id: params.sizeId,
      },
    });

    return NextResponse.json(deletedSize);
  } catch (error) {
    console.log(`Size DELETE: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
