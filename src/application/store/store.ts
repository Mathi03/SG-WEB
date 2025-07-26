import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import navigateReducer from "../slices/navigateSlice";
import farmReducer from "../slices/farmSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    navigate: navigateReducer,
    farm: farmReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
