import { createSlice } from "@reduxjs/toolkit";

type ThemeState = "light" | "dark";

const initialState = "light" as ThemeState;

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      return state === "light" ? "dark" : "light";
    },
  },
});

export const { toggleTheme } = themeSlice.actions;

export default themeSlice.reducer;
