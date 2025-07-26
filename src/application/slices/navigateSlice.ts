import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface NavigateState {
  path?: string | null;
}

const initialState: NavigateState = {
  path: null,
};

const navigateSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updatePath: (state, action: PayloadAction<NavigateState>) => {
      state.path = action.payload.path;
    },
  },
});

export const { updatePath } = navigateSlice.actions;
export default navigateSlice.reducer;
