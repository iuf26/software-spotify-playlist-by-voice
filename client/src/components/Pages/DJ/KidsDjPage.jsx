import { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import AudiotrackIcon from "@mui/icons-material/Audiotrack";
import { CssBaseline } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Fab from "@mui/material/Fab";
import Grow from "@mui/material/Grow";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/system";
import { colorPurplePowder } from "assets/styles/colors";
import { TopBar } from "components/Pages/LandingPage/TopBar";
import { Recorder } from "components/RecordingFunctionality/components/Recorder";
import useRecordingsList from "components/RecordingFunctionality/hooks/use-recordings-list";
import useRecorder from "components/RecordingFunctionality/hooks/useRecorder";
import {
  KID_MODE,
  mapSpeech2TextTranscription,
  mapSpotifyKidsRecommendationsTracks,
  mapSpotifyRecommendationsTracks,
} from "helpers/mappings";
import {
  kidsModeRandomPhrases,
  requestSpotifyGeneratedPlaylist,
  requestSpotifyKidsGeneratedPlaylist,
} from "helpers/streaming";
import { requestSpeechToTextTranscription } from "helpers/voiceCommands";
import { useSnackbar } from "notistack";
import { selectUsername } from "redux/selectors/accountSelector";
import {
  selectDetectedArtists,
  selectPredictedEmotion,
} from "redux/selectors/dataForMusicRecommendationSelectors";
import {
  selectRecommendedKidsTracks,
  selectRecommendedTracks,
} from "redux/selectors/recommendationSelector";
import { DataForMusicRecommendationActions } from "redux/slices/dataForMusicRecommendation";
import { PlaylistRecommendActions } from "redux/slices/playlistRecommendSlice";

import { MenuDrawer } from "../LandingPage/MenuDrawer";
import { TracksList } from "../Tracks/TracksList";
import { TracksListKids } from "../Tracks/TracksListKids";
import { PredictEmotionFabButton } from "./PredictEmotionFabButton";

export const KidsDjPage = () => {
  const dispatch = useDispatch();
  const username = useSelector(selectUsername);
  const [prediction, setPrediction] = useState();
  const [loading, setLoading] = useState(false);
  const [showPredictEmotionButton, setShowPredictEmotionButton] =
    useState(false);
  const [predictionFinished, setPredictionFinished] = useState(false);
  const [generatePlaylistLoading, setGeneratePlaylistLoading] = useState(false);
  const [playlistRetrieved, setPlaylistRetrieved] = useState(false);
  const { recorderState, addRecording, ...handlers } = useRecorder();
  const { audio } = recorderState;
  const { predictEmotion } = useRecordingsList(audio);
  const currentPredictedEmotion = useSelector(selectPredictedEmotion);
  const currentTracks = useSelector(selectRecommendedKidsTracks);

  useEffect(() => {
    if (prediction?.detectedEmotion) {
      setPredictionFinished(true);
      setLoading(false);
    }
  }, [prediction]);

  const onPredict = useCallback(() => {
    predictEmotion(setPredictionFinished, setLoading, setPrediction, username);
    //setLoading(false)
  }, [
    username,
    setLoading,
    setPrediction,
    predictEmotion,
    setPredictionFinished,
  ]);

  const onGeneratePlaylistClick = useCallback(() => {
    setGeneratePlaylistLoading(true);
    requestSpotifyKidsGeneratedPlaylist(prediction)
      .then((resp) => mapSpotifyKidsRecommendationsTracks(resp))
      .then(({ tracks }) => {
        //STORE FOR KIDS RECOMMENDATIONS
        dispatch(PlaylistRecommendActions.setKidsTracks(tracks));
        setGeneratePlaylistLoading(false);
        setPlaylistRetrieved(true);
        setLoading(false);
        setPredictionFinished(true);
      })
      .catch((error) => console.error(error));
  }, [prediction, dispatch]);

  return (
    <Box
      sx={{
        display: "flex",
        padding: 0,
        margin: 0,
      }}
      flexDirection="column"
    >
      <Box
        sx={{
          display: "flex",
          padding: 0,
          margin: 0,
        }}
      >
        <CssBaseline />
        <TopBar />
        <MenuDrawer />
        <Box
          component="main"
          sx={{ flexGrow: 1, p: 3 }}
          display="flex"
          justifyContent={"center"}
          alignItems="center"
          flexDirection="column"
          margin={0}
          padding={0}
          marginTop={4}
          gap={4}
        >
          <Recorder
            recorderState={recorderState}
            handlers={handlers}
            addRecording={addRecording}
            predictionLoading={loading}
            setShowPredictEmotionButton={setShowPredictEmotionButton}
            setPredictionFinished={setPredictionFinished}
            setPlaylistRetrieved={setPlaylistRetrieved}
            mode={KID_MODE}
          />
          {showPredictEmotionButton && !predictionFinished && !loading && (
            <PredictEmotionFabButton onClick={onPredict} />
          )}
          {(predictionFinished && prediction?.detectedEmotion) ||
          (currentPredictedEmotion && currentTracks?.length > 0) ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              flexDirection="column"
              gap={1}
              sx={{
                borderRadius: "10%",
                padding: "3rem",
              }}
              marginTop={-5}
            >
              <Grow
                in={true}
                style={{ transformOrigin: "2 2 2" }}
                {...(true ? { timeout: 1000 } : {})}
              >
                {
                  <Typography variant="h4">
                    DJ predicted you are{" "}
                    <strong style={{ color: colorPurplePowder }}>
                      {prediction?.detectedEmotion || currentPredictedEmotion}
                    </strong>
                  </Typography>
                }
              </Grow>
              <Grow
                in={true}
                style={{ transformOrigin: "2 2 2" }}
                {...(true ? { timeout: 2000 } : {})}
              >
                {generatePlaylistLoading ? (
                  <CircularProgress color="secondary" />
                ) : (
                  <Fab
                    size="large"
                    variant="extended"
                    sx={{ backgroundColor: "#1DB954" }}
                    onClick={onGeneratePlaylistClick}
                  >
                    <AudiotrackIcon sx={{ mr: 1 }} />
                    Generate playlist
                  </Fab>
                )}
              </Grow>
              <br></br>
              {playlistRetrieved && !generatePlaylistLoading && (
                <Grow
                  in={true}
                  style={{ transformOrigin: "2 2 2" }}
                  {...(true ? { timeout: 1000 } : {})}
                >
                  {
                    <Typography variant="h5">
                      I created your playlist starting from detected artists{" "}
                    </Typography>
                  }
                </Grow>
              )}
            </Box>
          ) : null}
        </Box>
      </Box>
      {(playlistRetrieved || currentTracks?.length > 0) && <TracksListKids />}
    </Box>
  );
};
