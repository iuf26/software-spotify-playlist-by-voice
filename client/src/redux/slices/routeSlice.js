import { createSlice } from "@reduxjs/toolkit";

export const RouteInitState = {
  route: "/home",
};

export const RouteSlice = createSlice({
  name: "route",
  initialState: RouteInitState,
  reducers: {
    setRoute: (_state, action) => ({
      ..._state,
      route:action.payload,
    }),
  },
});

export const RouteActions = RouteSlice.actions;
export const RouteReducer = RouteSlice.reducer;
