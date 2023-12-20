import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { name } = body;

    if (!userId) {
      throw new NextResponse("Unauthorized !", { status: 401 });
    }

    if (!name) {
      throw new NextResponse("Name is required!", { status: 400 });
    }

    const store = await prismadb.store.create({
      data: {
        name,
        userId,
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    console.log(`Stores: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
