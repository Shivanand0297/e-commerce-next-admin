import { combineReducers } from "@reduxjs/toolkit";
import { modalReducer } from "@/store/features/modal/modalSlice";

const appReducers = combineReducers({
  modal: modalReducer,
})
export default appReducers;