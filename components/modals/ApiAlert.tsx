"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Check, Copy, Server } from "lucide-react";
import { Badge, BadgeProps } from "@/components/ui/badge";
import { Button } from "../ui/button";
import { useState } from "react";
import toast from "react-hot-toast";

type ApiAlertProps = {
  title: string;
  description: string;
  variant: "public" | "admin";
};

const textMap: Record<ApiAlertProps["variant"], string> = {
  public: "Public",
  admin: "Admin",
};

const variantMap: Record<ApiAlertProps["variant"], BadgeProps["variant"]> = {
  public: "secondary",
  admin: "destructive",
};

const ApiAlert = ({ title, description, variant = "public" }: ApiAlertProps) => {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(description)
        .then(() => {
          setIsCopied(true)
          toast.success("Copied !")
        })
        .catch(() => setIsCopied(false));
    } else {
      toast.error("Copy feature is available only in secure contexts (https)");
    }

    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };

  return (
    <Alert>
      <Server className="h-4 w-4" />
      <AlertTitle className="flex items-center gap-2 w-full">
        {title}
        <Badge variant={variantMap[variant]}>
          {textMap[variant]}
        </Badge>
      </AlertTitle>
      <AlertDescription className="mt-4 flex justify-between items-center gap-4 w-full">
        <code className="relative rounded-sm px-[0.3rem] py-[0.2rem] bg-muted font-mono text-sm font-semibold">
          {description}
        </code>
        <Button variant="outline" size="icon" onClick={handleCopy}>
          {isCopied ? <Check className="h-4 w-4 border rounded-md" /> : <Copy className="h-4 w-4 border rounded-md" />}
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default ApiAlert;
