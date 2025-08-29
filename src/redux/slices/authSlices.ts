import { getCookie, setCookie } from "../../utils/helper";
import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    value: "",
  },
  reducers: {
    getToken: (state) => {
      state.value = getCookie("token") as string;
    },
    setToken: (state, action) => {
      const token = action.payload;
      setCookie("token", token, 365);
      state.value = token;
    },
  },
});

export const { getToken, setToken } = authSlice.actions;
export default authSlice.reducer;
