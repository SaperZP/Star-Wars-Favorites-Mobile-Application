import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FansType, Person } from "../types/commonTypes";
import { defineGender } from "../utils";

const initialState: FansType = {
  favorites: {
    male: [],
    female: [],
    others: [],
  },
};

const FansSlice = createSlice({
  name: "fans",
  initialState,
  reducers: {
    toggleFanStatus: (state, action: PayloadAction<Person>) => {
      const gender = defineGender(action.payload.gender);

      if (state.favorites[gender].includes(action.payload.url)) {
        state.favorites[gender] = state.favorites[gender].filter(
          (item) => item !== action.payload.url,
        );
      } else {
        state.favorites[gender].push(action.payload.url);
      }
    },
    resetState: (state) => {
      state.favorites = initialState.favorites;
    },
  },
});

export const { toggleFanStatus, resetState } = FansSlice.actions;
export default FansSlice.reducer;
