"use client";

import Modal from "@/components/ui/modal";
import { Button } from "../ui/button";

type Props = {
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
}

const AlertModal = ({ isOpen, isLoading, description, title, onClose, onConfirm }: Props) => {
  return (
    <Modal 
      title={title} 
      description={description} 
      isOpen={isOpen} 
      onClose={onClose} 
    >
      <div className="pt-6 flex justify-end items-center gap-2 w-full">
        <Button variant="outline" type="button" onClick={onClose} disabled={isLoading} >
          Cancel
        </Button>
        <Button variant="destructive" type="button" onClick={onConfirm} disabled={isLoading} >
          Continue
        </Button>
      </div>
    </Modal>
  )
}

export default AlertModal