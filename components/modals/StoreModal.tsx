"use client";

import React, { useState } from "react";
import Modal from "@/components/ui/modal";
import * as z from "zod";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setModal } from "@/store/features/modal/modalSlice";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import axios from "axios";
import toast from "react-hot-toast";

const formSchema = z.object({
  name: z.string().min(2, "Name must contain atleast 2 character(s)").max(50, "Name is too long"),
});

const StoreModal = () => {
  const dispatch = useAppDispatch();

  // modal state
  const isOpen = useAppSelector((state) => state.modal.isOpen);

  // TODO: Use react query instead of axios adn manage server state
  const [isLoading, setIsloading] = useState<boolean>(false);
  const onClose = () => dispatch(setModal(false));

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(payload: z.infer<typeof formSchema>) {
    try {
      setIsloading(true);
      const { data } = await axios.post("/api/stores", payload);
      window.location.assign(`/${data.id}`)
    } catch (error) {
      toast.error("Problem creating store !");
      console.error(error)
    } finally {
      setIsloading(false);
    }
  }

  return (
    <Modal
      title="Create Store"
      description="Add a new store to manage products and catagories"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="space-y-4 pt-2 pb-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your store name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end items-center w-full  gap-x-3">
              <Button variant="outline" disabled={isLoading} onClick={() => dispatch(setModal(false))}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  );
};

export default StoreModal;
