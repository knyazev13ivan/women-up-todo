import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface ITaskState {
  [key: string]: string;
}

const initialState: ITaskState = {
  name: 'test',
};

const slice = createSlice({
  name: "list",
  initialState,
  reducers: {
    change: (
      state,
      { payload: { name } }: PayloadAction<ITaskState>
    ) => {
      state.name = name;
    },
  },
});

export const { change } = slice.actions;

export default slice.reducer;
