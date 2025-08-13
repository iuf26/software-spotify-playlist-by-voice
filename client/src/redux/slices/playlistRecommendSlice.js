import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { mapSpotifyTrack } from "helpers/mappings";
import Cookies from "js-cookie";

export const playlistRecommendationInitState = {
  tracks: [],
  kidsTracks: []
};

export const PlaylistRecommendSlice = createSlice({
  name: "playlistRecommendation",
  initialState: playlistRecommendationInitState,
  reducers: {
    setTracks: (_state, action) => {
      if (action.payload) {
        const generatedTracks = action.payload.map((elem) =>
          mapSpotifyTrack(elem)
        );
        Cookies.set("tracks", JSON.stringify(generatedTracks));
        return {
          ..._state,
          tracks: [...generatedTracks],
        };
      }else{
        return {
          ..._state,
          tracks: undefined,
        };
      }
    },
    setKidsTracks: (_state, action) => {
      if (action.payload) {
        const generatedTracks = action.payload.map((elem) =>
          mapSpotifyTrack(elem)
        );
        Cookies.set("kidsTracks", JSON.stringify(generatedTracks));
        return {
          ..._state,
          kidsTracks: [...generatedTracks],
        };
      }else{
        return {
          ..._state,
          kidsTracks: undefined,
        };
      }
    }
  },
});

export const PlaylistRecommendActions = PlaylistRecommendSlice.actions;
export const PlaylistRecommendReducer = PlaylistRecommendSlice.reducer;
