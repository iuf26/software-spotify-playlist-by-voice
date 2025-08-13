import React from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

import { mappingGeneratePlaylistRequest } from "helpers/mappings";
import { requestSpotifyGeneratedPlaylist } from "helpers/streaming";
import { selectUsername } from "redux/selectors/accountSelector";
import { DataForMusicRecommendationActions } from "redux/slices/dataForMusicRecommendation";

export function deleteAudio(audioKey, setRecordings) {
  setRecordings((prevState) =>
    prevState.filter((record) => record.key !== audioKey)
  );
}

export function predictEmotion(
  file,
  setIsFinished,
  setIsLoading,
  setPrediction,
  username,
  dispatcher
) {
  const formData = new FormData();
  setIsLoading(true);
  setIsFinished(false);
  formData.append("recording", file);
  fetch(process.env.REACT_APP_SER_URI, {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((response) => {
      const prediction = mappingGeneratePlaylistRequest(response, username);
      setPrediction({ ...prediction });
      dispatcher(
        DataForMusicRecommendationActions.setPredictedEmotion(
          prediction.detectedEmotion
        )
      );

      // setIsFinished(true);
      // setIsLoading(false);
    })
    .catch((error) => console.error(error));
}
