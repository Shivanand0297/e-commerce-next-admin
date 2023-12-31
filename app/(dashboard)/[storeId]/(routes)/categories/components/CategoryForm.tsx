"use client";

import axios from "axios";
import toast from "react-hot-toast";
import * as z from "zod";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Billboard, Category } from "@prisma/client";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Heading from "@/components/ui/heading";
import AlertModal from "@/components/modals/AlertModal";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Props = {
  initialData: Category | null;
  billboards: Billboard[];
};

const formSchema = z.object({
  name: z.string().min(2, "Name must contain atleast 2 character(s)").max(50, "Name is too long"),
  billboardId: z.string().min(1),
});

type SettingFormValues = z.infer<typeof formSchema>;

const CategoryForm = ({ initialData, billboards }: Props) => {
  const router = useRouter();
  const { storeId, categoryId } = useParams();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const pageData = {
    title: !!initialData ? "Edit categories" : "Create categories",
    description: !!initialData ? "Edit categories" : "Add new categories",
    toastMessage: !!initialData ? "Category updated." : "Category created.",
    action: !!initialData ? "Save changes" : "Create",
  };

  const form = useForm<SettingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      billboardId: "",
    },
  });

  const onSubmit = async (payload: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      if (!!initialData) {
        await axios.patch(`/api/${storeId}/categories/${categoryId}`, payload);
      } else {
        await axios.post(`/api/${storeId}/categories`, payload);
      }
      router.push(`/${storeId}/categories`);
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
      await axios.delete(`/api/${storeId}/categories/${categoryId}`);
      router.refresh();
      router.push(`/${storeId}/categories`);
      toast.success("Category deleted successfully");
    } catch (error) {
      toast.error("Make sure you delete all catagories using this categories first !");
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
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input placeholder="Category name" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="billboardId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billboard</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Billboard" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {billboards.map((billboard) => (
                        <SelectItem value={billboard.id} key={billboard.id}>
                          {billboard.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

export default CategoryForm;
