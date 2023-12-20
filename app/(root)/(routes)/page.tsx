"use client";
import { useEffect } from "react";

import { setModal } from "@/store/features/modal/modalSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

const SetupPage = () => {

  const isOpen = useAppSelector((state) => state.modal.isOpen);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if(!isOpen){
      dispatch(setModal(true))
    }
  }, [isOpen, dispatch])

  return null;
};

export default SetupPage;