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
    const { label, imageUrl } = body;
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!label || !imageUrl) {
      return new NextResponse("label and image required!", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required to make a billboard!", { status: 400 });
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

    const billboard = await prismadb.billboard.create({
      data: {
        label,
        imageUrl,
        storeId: params.storeId,
      },
    });

    if (!billboard) {
      return new NextResponse("Billboard not created", { status: 500 });
    }

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("Billboard POST:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};

export const GET = async (_req: Request, { params }: Props) => {
  try {
    if (!params.storeId) {
      return new NextResponse("Store id is required to fetch billboards !", { status: 400 });
    }

    const billboards = await prismadb.billboard.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(billboards);
  } catch (error) {
    console.log("Billboard GET:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
