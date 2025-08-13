import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

export const dataForMusicRecommendationInitState = {
  predictedEmotion: "",
  detectedArtists: [],
};

export const DataForMusicRecommendationSlice = createSlice({
  name: "dataForMusicRecommendation",
  initialState: dataForMusicRecommendationInitState,
  reducers: {
    setPredictedEmotion: (_state, action) => {
      if (action.payload) {
      Cookies.set("lastPredictedEmotion", action.payload);
      return { ..._state, predictedEmotion: action.payload };
      }
      else{
        return { ..._state, predictedEmotion: undefined };
      }
    },
    setDetectedArtists: (_state, action) => {
      if (action.payload) {
        const detectedArtists = action.payload.split(",");
        Cookies.set("lastDetectedArtists", JSON.stringify(detectedArtists));
        return { ..._state, detectedArtists: [...detectedArtists] };
      } else {
        return { ..._state, detectedArtists: undefined };
      }
    },
  },
});

export const DataForMusicRecommendationActions =
  DataForMusicRecommendationSlice.actions;
export const DataForMusicRecommendationReducer =
  DataForMusicRecommendationSlice.reducer;
