import { FamilyRestroom } from "@mui/icons-material";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";

const token = Cookies.get("token");
const decodedToken = token ? jwt_decode(token) : null;

export const accountInitState = {
  isAuthenticated: document.cookie.match(
    /^(.*;)?\s*authenticated\s*=\s*[^;]+(.*)?$/
  )
    ? true
    : false,
  isSpotifyAuth: document.cookie.match(
    /^(.*;)?\s*isSpotifyAuth\s*=\s*[^;]+(.*)?$/
  )
    ? true
    : false,
  username: decodedToken ? decodedToken.username : "",
};

export const AccountSlice = createSlice({
  name: "account",
  initialState: accountInitState,
  reducers: {
    authenticate: (_state, action) => ({
      ..._state,
      ...action.payload,
      isAuthenticated: true,
    }),
    authenticateSpotify: (_state, action) => ({
      ..._state,
      ...action.payload,
      isSpotifyAuth: true,
    }),
    logout: (_state, action) => ({
      ..._state,
      ...action.payload,
      isAuthenticated: false,
      isSpotifyAuth: false,
      username: "",
    }),
  },
});

export const AccountActions = AccountSlice.actions;
export const AccountReducer = AccountSlice.reducer;
