import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FarmState {
  id: number | null;
  name: string | null;
  current?: boolean;
  serviceSymbol?: string | null;
  volumeUnitSymbol?: string | null;
  weightUnitSymbol?: string | null;
  currencyUnitSymbol?: string | null;
}

const initialState: FarmState[] = [];

const farmSlice = createSlice({
  name: "farm",
  initialState,
  reducers: {
    setFarms: (_state, action: PayloadAction<FarmState[]>) => {
      return action.payload;
    },
    clearFarms: () => {
      return [];
    },
  },
});

export const { setFarms, clearFarms } = farmSlice.actions;
export default farmSlice.reducer;
