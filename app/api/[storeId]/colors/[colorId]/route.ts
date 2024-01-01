import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

type Props = {
  params: {
    storeId: string;
    colorId: string;
  };
};

export const GET = async (_req: Request, { params }: Props) => {
  try {
    if (!params.colorId) {
      return new NextResponse("Color id is required!", { status: 400 });
    }

    const color = await prismadb.color.findUnique({
      where: {
        id: params.colorId,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log(`Color GET: ${error}`);
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

    if (!params.colorId) {
      return new NextResponse("Color id is required!", { status: 400 });
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

    const updatedColor = await prismadb.color.updateMany({
      where: {
        id: params.colorId,
      },
      data: {
        name,
        value
      },
    });


    return NextResponse.json(updatedColor);
  } catch (error) {
    console.log(`Color PATCH: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const DELETE = async (_req: Request, { params }: Props) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.colorId) {
      return new NextResponse("Color id is required!", { status: 400 });
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

    const deletedColor = await prismadb.color.deleteMany({
      where: {
        id: params.colorId,
      },
    });

    return NextResponse.json(deletedColor);
  } catch (error) {
    console.log(`Color DELETE: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
