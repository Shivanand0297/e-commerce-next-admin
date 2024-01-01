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
    const { name, value } = body;
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name || !value) {
      return new NextResponse("Name and value are required!", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required to create a color!", { status: 400 });
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

    const color = await prismadb.color.create({
      data: {
        name, 
        value,
        storeId: params.storeId,
      },
    });

    if (!color) {
      return new NextResponse("Color not created", { status: 500 });
    }

    return NextResponse.json(color);
  } catch (error) {
    console.log("Color POST:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};

export const GET = async (_req: Request, { params }: Props) => {
  try {
    if (!params.storeId) {
      return new NextResponse("Store id is required to fetch colors !", { status: 400 });
    }

    const colors = await prismadb.color.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(colors);
  } catch (error) {
    console.log("Color GET:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
