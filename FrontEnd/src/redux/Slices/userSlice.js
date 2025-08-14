import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "users",
  initialState: [],
  reducers: {
    setUsers: (state, action) => action.payload,
  },
  setLoading: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    setError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
});

export const { setUsers,setLoading, setError } = userSlice.actions;
console.log('userSlice reducer:', userSlice.reducer);
export default userSlice.reducer;