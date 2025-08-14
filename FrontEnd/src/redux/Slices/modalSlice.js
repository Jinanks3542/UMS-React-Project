import { createSlice } from "@reduxjs/toolkit";

const modalSlice = createSlice({
  name: "modal",
  initialState: { index: null, status: false },
  reducers: {
    modalControl: (state, action) => {
      state.index = action.payload.index;
      state.status = action.payload.status;
    },
  },
});

export const { modalControl } = modalSlice.actions;
console.log('modalSlice reducer:', modalSlice.reducer);
export default modalSlice.reducer;