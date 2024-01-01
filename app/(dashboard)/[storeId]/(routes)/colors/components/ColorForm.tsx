"use client";

import axios from "axios";
import toast from "react-hot-toast";
import * as z from "zod";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Color } from "@prisma/client";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Heading from "@/components/ui/heading";
import AlertModal from "@/components/modals/AlertModal";

type Props = {
  initialData: Color | null;
};

const formSchema = z.object({
  name: z.string().min(2, "Name must contain atleast 2 character(s)").max(50, "Name is too long"),
  value: z.string()
    .regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, "Please provide a valid hex value")
    .min(3, "Value must contain atleast 3 character(s)")
    .max(7, "Value is too long"),
});

type SettingFormValues = z.infer<typeof formSchema>;

const ColorForm = ({ initialData }: Props) => {
  const router = useRouter();
  const { storeId, colorId } = useParams();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const pageData = {
    title: !!initialData ? "Edit color" : "Create color",
    description: !!initialData ? "Edit a color" : "Add a new color",
    toastMessage: !!initialData ? "Color updated." : "Color created.",
    action: !!initialData ? "Save changes" : "Create",
  };

  const form = useForm<SettingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      value: "",
    },
  });

  const onSubmit = async (payload: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      if(!!initialData) {
        await axios.patch(`/api/${storeId}/colors/${colorId}`, payload);
      } else {
        await axios.post(`/api/${storeId}/colors`, payload);
      }
      router.push(`/${storeId}/colors`)
      router.refresh();
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
      await axios.delete(`/api/${storeId}/colors/${colorId}`);
      router.push(`/${storeId}/colors`)
      router.refresh();
      toast.success("Color deleted successfully");
    } catch (error) {
      toast.error("Make sure you delete all catagories using this color first !");
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
          <Button variant="destructive" color="sm" onClick={() => setIsOpen(true)} disabled={isLoading}>
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-4 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <Input placeholder="color name" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input placeholder="value" type="color" {...field} disabled={isLoading} />
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

export default ColorForm;