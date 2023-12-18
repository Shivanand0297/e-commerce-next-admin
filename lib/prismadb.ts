import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const prismadb = globalThis.prisma || new PrismaClient();

// to prevent multiple instance of the prismaclient during hot reloading
if(process.env.NODE_ENV !== "production"){ 
  globalThis.prisma = prismadb;
}
export default prismadb;
