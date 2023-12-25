import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";
import SettingForm from "./components/SettingForm";

type SettingsProps = {
  params: { storeId: string };
};

const SettingsPage = async ({ params }: SettingsProps) => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
      userId,
    },
  });

  if (!store) {
    redirect("/");
  }

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SettingForm initialData={store} />
      </div>
    </div>
  );
};

export default SettingsPage;
