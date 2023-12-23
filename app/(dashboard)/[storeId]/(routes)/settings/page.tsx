import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

import Heading from "@/components/ui/heading";
import prismadb from "@/lib/prismadb";
import SettingForm from "./components/SettingForm";
import { Separator } from "@/components/ui/separator";
import { auth } from "@clerk/nextjs";

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
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SettingForm initialData={store} />
      </div>
    </div>
  );
};

export default SettingsPage;
