"use client";

import React from "react";
import Modal from "@/components/ui/modal";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setModal } from "@/store/features/modal/modalSlice";

const StoreModal = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.modal.isOpen)

  const onClose = () => {
    dispatch(setModal(false));
  };

  return (
    <Modal
      title="Create Store"
      description="Add a new store to manage products and catagories"
      isOpen={isOpen}
      onClose={onClose}
    >
      Future create store form
    </Modal>
  );
};

export default StoreModal;
