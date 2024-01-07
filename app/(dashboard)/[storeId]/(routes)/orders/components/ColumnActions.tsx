"use client";

import axios from "axios";
import toast from "react-hot-toast";
import AlertModal from "@/components/modals/AlertModal";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BillboardColumn } from "./columns";
import { Copy, Edit, MoreHorizontal, Trash, View } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Props = {
  data: BillboardColumn;
};

const ColumnActions = ({ data }: Props) => {
  const [mounted, setMounted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const router = useRouter();
  const { storeId } = useParams();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(data.id)
        .then(() => {
          toast.success("Copied !")
        })
        .catch(() => toast.error("Copy Failed !"));
    } else {
      toast.error("Copy feature is available only in secure contexts (https)");
    }
  };

  const handleEdit = () => {
    router.push(`/${storeId}/billboards/${data.id}`);
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/${storeId}/billboards/${data.id}`);
      router.refresh();
      toast.success("Billboard deleted successfully");
    } catch (error) {
      toast.error("Make sure you delete all catagories using this billboard first !");
      console.error(error);
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <span className="sr-only">Open Menu</span>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={handleCopy}>
            <Copy className="w-4 h-4 mr-3" /> Copy
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleEdit}>
            <Edit className="w-4 h-4 mr-3" /> Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsOpen(true)}>
            <Trash className="w-4 h-4 mr-3" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertModal
        isOpen={isOpen}
        isLoading={isLoading}
        title="Are You Sure ?"
        description="This action cannot be undone !"
        onClose={() => setIsOpen(false)}
        onConfirm={handleDelete}
      />
    </>
  );
};

export default ColumnActions;
