import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  email?: string | null;
  id?: string | null;
  name?: string | null;
  role?: string[] | null;
}

interface AuthState {
  token?: string | null;
  user: UserState | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<AuthState>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout: () => initialState,
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
