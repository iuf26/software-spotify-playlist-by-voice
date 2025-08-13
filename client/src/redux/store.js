import { configureStore } from "@reduxjs/toolkit";
import { AccountReducer } from "redux/slices/accountSlice";

import { DataForMusicRecommendationReducer } from "./slices/dataForMusicRecommendation";
import { PlaylistRecommendReducer } from "./slices/playlistRecommendSlice";
import { RouteReducer } from "./slices/routeSlice";

export const store = configureStore({
  reducer: {
    account: AccountReducer,
    playlistRecommendation: PlaylistRecommendReducer,
    route: RouteReducer,
    dataForMusicRecommendation: DataForMusicRecommendationReducer,
  },
});
