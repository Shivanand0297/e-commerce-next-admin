import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

type Props = {
  params: {
    storeId: string;
    billboardId: string;
  };
};

export const GET = async (_req: Request, { params }: Props) => {
  try {
    if (!params.billboardId) {
      return new NextResponse("Billboard id is required!", { status: 400 });
    }
    const billboard = await prismadb.billboard.findUnique({
      where: {
        id: params.billboardId,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log(`Billboard GET: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const PATCH = async (req: Request, { params }: Props) => {
  try {
    const body = await req.json();
    const { label, imageUrl } = body;
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.billboardId) {
      return new NextResponse("Billboard id is required!", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required!", { status: 400 });
    }

    if (!label || !imageUrl) {
      return new NextResponse("label and image is required!", { status: 400 });
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

    const updatedBillboard = await prismadb.billboard.updateMany({
      where: {
        id: params.storeId,
      },
      data: {
        label,
        imageUrl,
      },
    });

    return NextResponse.json(updatedBillboard);
  } catch (error) {
    console.log(`Billboard PATCH: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const DELETE = async (_req: Request, { params }: Props) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.billboardId) {
      return new NextResponse("Billboard id is required!", { status: 400 });
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

    const deletedBillboard = await prismadb.billboard.deleteMany({
      where: {
        id: params.billboardId,
      },
    });

    return NextResponse.json(deletedBillboard);
  } catch (error) {
    console.log(`Billboard DELETE: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
