"use client";

import axios from "axios";
import toast from "react-hot-toast";
import * as z from "zod";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Store } from "@prisma/client";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Heading from "@/components/ui/heading";
import AlertModal from "@/components/modals/AlertModal";
import ApiAlert from "@/components/modals/ApiAlert";
import useOrigin from "@/hooks/useOrigin";

type Props = {
  initialData: Store;
};

const formSchema = z.object({
  name: z.string().min(2, "Name must contain atleast 2 character(s)").max(50, "Name is too long"),
});

type SettingFormValues = z.infer<typeof formSchema>;

const SettingForm = ({ initialData }: Props) => {
  const router = useRouter();
  const { storeId } = useParams();
  const origin = useOrigin();
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const form = useForm<SettingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData.name,
    },
  });

  const onSubmit = async (payload: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      await axios.patch(`/api/stores/${storeId}`, payload);
      router.refresh(); // to fetch the store data again in the form
      toast.success("Store updated successfully");
    } catch (error) {
      toast.error("Problem Updating store !");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStoreDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/stores/${storeId}`);
      router.refresh();
      // router.push("/");
      window.location.assign("/")
      toast.success("Store deleted successfully");
    } catch (error) {
      toast.error("Make sure you delete all products and catagories first !");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <>
      <div className="flex justify-between items-center">
        <Heading title="Setting" description="Manage Store Preferences" />
        <Button variant="destructive" size="sm" onClick={() => setIsOpen(true)} disabled={isLoading}>
          <Trash className="h-4 w-4" />
        </Button>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your store name" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            Save Changes
          </Button>
        </form>
      </Form>
      <Separator />
      <AlertModal
        isOpen={isOpen}
        isLoading={isLoading}
        onClose={() => setIsOpen(false)}
        onConfirm={handleStoreDelete}
        title="Are you sure ?"
        description="This action cannot be undone!"
      />
      <ApiAlert 
        title="NEXT_PUBLIC_API_URL" 
        description={`${origin}/api/${storeId}`}
        variant="public"
      />
    </>
  );
};

export default SettingForm;
