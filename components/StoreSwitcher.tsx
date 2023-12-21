"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { setModal } from "@/store/features/modal/modalSlice";
import { Store } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import {
  Check,
  ChevronsUpDown,
  PlusCircle,
  Store as StoreIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

type StoreSwitcherProps = {
  className?: string;
  storeItems: Store[];
};

const StoreSwitcher = ({ className, storeItems = [] }: StoreSwitcherProps) => {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const formattedItems = storeItems.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const currentStore = formattedItems.find((item) => item.value === params.storeId);

  const onStoreSelect = (store: { label: string; value: string }) => {
    setIsOpen(false);
    router.push(`/${store.value}`);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          aria-expanded={isOpen}
          aria-label="Select Store"
          role="combobox"
          className={cn("w-[200px] justify-between", className)}
        >
          <StoreIcon className="mr-2 h-4 w-4" />
          {currentStore?.label}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 rounded-lg">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search store..." />
            <CommandEmpty>No Store found.</CommandEmpty>
            <CommandGroup heading="Stores">
              {formattedItems.map((store) => (
                <CommandItem 
                  key={store.label}
                  onSelect={() => onStoreSelect(store)}
                >
                  <StoreIcon className="mr-2 h-4 w-4" />
                  {store.label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4 shrink-0",
                      currentStore?.value === store.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setIsOpen(false);
                  dispatch(setModal(true));
                }}
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                <span>Create Store</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default StoreSwitcher;
