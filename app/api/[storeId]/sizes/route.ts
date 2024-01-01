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
      return new NextResponse("Store id is required to create a size!", { status: 400 });
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

    const size = await prismadb.size.create({
      data: {
        name, 
        value,
        storeId: params.storeId,
      },
    });

    if (!size) {
      return new NextResponse("Size not created", { status: 500 });
    }

    return NextResponse.json(size);
  } catch (error) {
    console.log("Size POST:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};

export const GET = async (_req: Request, { params }: Props) => {
  try {
    if (!params.storeId) {
      return new NextResponse("Store id is required to fetch sizes !", { status: 400 });
    }

    const sizes = await prismadb.size.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(sizes);
  } catch (error) {
    console.log("Size GET:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
