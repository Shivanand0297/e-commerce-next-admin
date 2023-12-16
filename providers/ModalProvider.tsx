"use client";

import { useEffect, useState } from "react";
import StoreModal from "@/components/modals/StoreModal";

const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // to avoid next hydration error
  if (!isMounted) {
    return null;
  }

  return (
    <>
      <StoreModal />
    </>
  );
};

export default ModalProvider;
