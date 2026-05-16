import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { UserProfile } from "../../types";

interface AuthState {
  user: UserProfile | null;
  isInitialized: boolean;
}

const initialState: AuthState = {
  user: null,
  isInitialized: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserProfile | null>) {
      state.user = action.payload;
    },
    setInitialized(state) {
      state.isInitialized = true;
    },
  },
});

export const { setUser, setInitialized } = authSlice.actions;
export default authSlice.reducer;