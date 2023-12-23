import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

type Props = {
  params: {
    storeId: string;
  };
};

export const PATCH = async (req: Request, { params }: Props) => {
  try {
    const body = await req.json();
    const { name } = body;
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required!", { status: 400 });
    }

    if (!name) {
      return new NextResponse("Store name is required!", { status: 400 });
    }

    const updatedStore = await prismadb.store.updateMany({
      where: {
        id: params.storeId,
        userId,
      },
      data: {
        name,
      },
    });

    return NextResponse.json(updatedStore);
  } catch (error) {
    console.log(`Store PATCH: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const DELETE = async (_req: Request, { params }: Props) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required!", { status: 400 });
    }

    const updatedStore = await prismadb.store.deleteMany({
      where: {
        id: params.storeId,
        userId,
      },
    });

    return NextResponse.json(updatedStore);
  } catch (error) {
    console.log(`Store DELETE: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
