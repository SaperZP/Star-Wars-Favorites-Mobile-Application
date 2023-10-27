import { configureStore } from "@reduxjs/toolkit";
import fansReducer from "./fansReducer";

export const store = configureStore({
  reducer: {
    fans: fansReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
