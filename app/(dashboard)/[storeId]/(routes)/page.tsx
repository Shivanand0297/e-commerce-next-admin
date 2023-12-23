import prismadb from "@/lib/prismadb";
import { redirect } from "next/navigation";

type DashboardProps = {
  params: { storeId: string };
};

const Dashboard = async ({ params }: DashboardProps) => {
  if (!params.storeId) {
    redirect("/");
  }

  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
    },
  });

  if (!store) {
    redirect("/");
  }

  return (
    <>
      <p>Dashboard : {store.name}</p>
    </>
  );
};

export default Dashboard;
