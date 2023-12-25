"use client";

import { useEffect, useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { ImagePlus, Trash } from "lucide-react";
import Image from "next/image";

type Props = {
  url: string[];
  disabled: boolean;
  onChange: (url: string) => void;
  onRemove: () => void;
};

const ImageUpload = ({ url, disabled, onChange, onRemove }: Props) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const onUpload = (results: any) => onChange(results.info.secure_url);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <div className="mb-4 flex items-center gap-4">
        {url.map((url) => (
          <div key={url} className="group relative w-[200px] h-[200px] rounded-md overflow-hidden">
            <div className="hidden group-hover:block absolute top-2 right-2 z-10">
              <Button 
                type="button" 
                variant="destructive" 
                disabled={disabled}
                onClick={() => onRemove()} 
              >
                <Trash className="w-4 h-4" />
              </Button>
            </div>
            <Image fill className="object-cover" alt="billboard" src={url} />
          </div>
        ))}
      </div>
      <CldUploadWidget uploadPreset="dtsfeogv" onUpload={onUpload}>
        {({ open }) => {
          return (
            <Button 
              type="button" 
              variant="secondary" 
              disabled={disabled}
              onClick={() => open()} 
            >
              <ImagePlus className="h4 w-4 mr-3" />
              Upload an image
            </Button>
          );
        }}
      </CldUploadWidget>
    </>
  );
};

export default ImageUpload;
