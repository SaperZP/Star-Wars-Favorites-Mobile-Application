import { PeopleResponseType } from "../types/commonTypes";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAdditionalData, getPeople } from "../api/api";

type peopleFetchType = {
  loading: boolean;
  peopleResponse: PeopleResponseType | null;
};

const initialState: peopleFetchType = {
  loading: false,
  peopleResponse: null
};

const peopleSlice = createSlice({
  name: "people",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getPeopleFromServer.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(getPeopleFromServer.fulfilled, (state, action) => {
      state.peopleResponse = action.payload;
      state.loading = false;
    });
  }
});

export const getPeopleFromServer = createAsyncThunk(
  "people/fetch",
  (input: { searchString?: string; page?: number }) =>
    getPeople(input.searchString, input.page).then((res) =>
      getAdditionalData(res)
    )
);

export default peopleSlice.reducer;
export const { actions } = peopleSlice;
