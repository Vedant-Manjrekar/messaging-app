import { createSlice } from "@reduxjs/toolkit";

const searchSlice = createSlice({
  name: "user",
  initialState: { data: { searchData : ""} },
  reducers: {
    searchVal: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { searchVal } = searchSlice.actions;
export default searchSlice.reducer;
