import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

type RootLayoutProps = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: RootLayoutProps) {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // finding the first store user have
  // if user have already created store or not

  const store = await prismadb.store.findFirst({
    where: {
      userId,
    },
  });

  // if yes show him the store 
  if (store) {
    redirect(`/${store.id}`);
  }

  // else navigate him to root modal to create store;
  return(
    <>
      {children}
    </>
  );
};
