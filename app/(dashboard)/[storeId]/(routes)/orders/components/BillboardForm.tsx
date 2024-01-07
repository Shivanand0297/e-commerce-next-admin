"use client";

import axios from "axios";
import toast from "react-hot-toast";
import * as z from "zod";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Billboard } from "@prisma/client";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Heading from "@/components/ui/heading";
import AlertModal from "@/components/modals/AlertModal";
import ImageUpload from "@/components/ui/ImageUpload";

type Props = {
  initialData: Billboard | null;
};

const formSchema = z.object({
  label: z.string().min(2, "Name must contain atleast 2 character(s)").max(50, "Name is too long"),
  imageUrl: z.string().min(1),
});

type SettingFormValues = z.infer<typeof formSchema>;

const BillboardForm = ({ initialData }: Props) => {
  const router = useRouter();
  const { storeId, billboardId } = useParams();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const pageData = {
    title: !!initialData ? "Edit billboard" : "Create billboard",
    description: !!initialData ? "Edit a billboard" : "Add a new billboard",
    toastMessage: !!initialData ? "Billboard updated." : "Billboard created.",
    action: !!initialData ? "Save changes" : "Create",
  };

  const form = useForm<SettingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      label: "",
      imageUrl: "",
    },
  });

  const onSubmit = async (payload: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      if(!!initialData) {
        await axios.patch(`/api/${storeId}/billboards/${billboardId}`, payload);
      } else {
        await axios.post(`/api/${storeId}/billboards`, payload);
      }
      router.push(`/${storeId}/billboards`)
      router.refresh(); // to fetch the store data again in the form
      toast.success(pageData.toastMessage);
    } catch (error) {
      toast.error("Something went wrong !");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/${storeId}/billboards/${billboardId}`);
      router.refresh();
      router.push(`/${storeId}/billboards`)
      toast.success("Billboard deleted successfully");
    } catch (error) {
      toast.error("Make sure you delete all catagories using this billboard first !");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <Heading title={pageData.title} description={pageData.description} />
        {!!initialData && (
          <Button variant="destructive" size="sm" onClick={() => setIsOpen(true)} disabled={isLoading}>
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background Image</FormLabel>
                <FormControl>
                  <ImageUpload
                    disabled={isLoading}
                    url={field.value ? [field.value] : []}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange("")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input placeholder="Your store label" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {pageData.action}
          </Button>
        </form>
      </Form>
      <Separator />
      <AlertModal
        isOpen={isOpen}
        isLoading={isLoading}
        onClose={() => setIsOpen(false)}
        onConfirm={handleDelete}
        title="Are you sure ?"
        description="This action cannot be undone!"
      />
    </>
  );
};

export default BillboardForm;
