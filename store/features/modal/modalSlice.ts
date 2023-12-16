import { PayloadAction, createSlice } from "@reduxjs/toolkit"

type InitialState = {
  isOpen: boolean
}

const initialState: InitialState = {
  isOpen: false,
}

export const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    setModal: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
  }
})

export const { setModal } = modalSlice.actions;
export const modalReducer = modalSlice.reducer;
