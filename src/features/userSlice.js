import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: { data: { name: "abc", pic: "xyz", id: [] } },
  reducers: {
    login: (state, action) => {
      state.data = action.payload;
    },
    logout: (state) => {
      state.data.name = null;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
