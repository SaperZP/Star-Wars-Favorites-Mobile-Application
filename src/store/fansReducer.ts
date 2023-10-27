import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type fansType = {
  male: string[];
  female: string[];
  others: string[];
};

const initialState: fansType = {
  male: [],
  female: [],
  others: []
};

const TodosSlice = createSlice({
  name: "fans",
  initialState,
  reducers: {}
});

// export const { } = TodosSlice.actions;
export default TodosSlice.reducer;
