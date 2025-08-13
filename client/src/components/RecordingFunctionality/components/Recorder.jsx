import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";

import HeadsetIcon from "@mui/icons-material/Headset";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import { Box } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Fab from "@mui/material/Fab";
import Typography from "@mui/material/Typography";
import { colorPurpleElectric, colorPurplePowder } from "assets/styles/colors";
import RecorderControls from "components/RecordingFunctionality/components/recorder-controls";
import RecordingsList from "components/RecordingFunctionality/components/recordings-list";
import useRecorder from "components/RecordingFunctionality/hooks/useRecorder";
import {
  formatMinutes,
  formatSeconds,
} from "components/RecordingFunctionality/utils/format-time";
import { KID_MODE } from "helpers/mappings";
import { kidsModeRandomPhrases } from "helpers/streaming";
import { useSnackbar } from "notistack";
import { DataForMusicRecommendationActions } from "redux/slices/dataForMusicRecommendation";
import { PlaylistRecommendActions } from "redux/slices/playlistRecommendSlice";
import "semantic-ui-css/semantic.min.css";

export const Recorder = ({
  handlers,
  recorderState,
  predictionLoading,
  setShowPredictEmotionButton,
  setPredictionFinished,
  setPlaylistRetrieved,
  mode,
  phraseForKids,
}) => {
  const [pulse, setPulse] = useState(false);
  const [recordingState, setRecordingState] = useState("stop");
  const [kidsPhrase, setKidsPhrase] = useState(() => kidsModeRandomPhrases());
  const { recordingMinutes, recordingSeconds } = recorderState;
  const { startRecording, saveRecording } = handlers;
  const [showInstructionsForKidsMode, setShowInstructionsForKidsMode] =
    useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const buttonSx = {
    bgcolor: "linear-gradient(to right, #41295a, #2f0743);",
    width: "10rem",
    height: "10rem",
    boxShadow: `0px 0px 5px 0px #3A373B`,
  };
  const handleListenButtonClick = useCallback(() => {
    if (mode === KID_MODE) {
      setShowInstructionsForKidsMode(
        (showInstructionsForKidsMode) => !showInstructionsForKidsMode
      );
    }
    setPulse((prev) => !prev);
    if (recordingState === "stop") {
      dispatch(PlaylistRecommendActions.setTracks(null));
      dispatch(DataForMusicRecommendationActions.setPredictedEmotion(null));
      dispatch(DataForMusicRecommendationActions.setDetectedArtists(null));
      const newKidsPhrase = kidsModeRandomPhrases();
      startRecording();
      setPlaylistRetrieved(false);
      setPredictionFinished(false);
      setKidsPhrase(newKidsPhrase);
      setShowPredictEmotionButton(false);
    } else {
      enqueueSnackbar("Your recording was saved", { variant: "info" });
      saveRecording();
      setShowPredictEmotionButton(true);
    }
    setRecordingState((prev) => (prev === "start" ? "stop" : "start"));
  }, [
    recordingState,
    dispatch,
    startRecording,
    setPlaylistRetrieved,
    setPredictionFinished,
    setShowPredictEmotionButton,
    enqueueSnackbar,
    saveRecording,
    mode,
  ]);

  return (
    <Box
      display="flex"
      width="100%"
      height="15rem"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      gap={3}
      margin={0}
      marginTop="10rem"
      padding={0}
    >
      {mode === KID_MODE ? (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
        >
          <Typography variant="h4">
            Hi kiddo! I'm{" "}
            <strong style={{ color: colorPurplePowder }}>DJ!</strong>
          </Typography>
          {showInstructionsForKidsMode && (
            <Typography variant="h5">
              Press me and start reading the pink phrase out loud
            </Typography>
          )}
        </Box>
      ) : (
        <Typography variant="h4">
          Hi! I'm <strong style={{ color: colorPurplePowder }}>DJ!</strong>
        </Typography>
      )}
      {/* <Typography variant="h4">
       Tap the headphones button to start recording your voice
      </Typography> */}
      <div>
        <Fab
          sx={buttonSx}
          onClick={handleListenButtonClick}
          size="large"
          color="secondary"
          className={pulse ? "pulse" : ""}
        >
          {mode === KID_MODE ? (
            <InsertEmoticonIcon sx={{ fontSize: "80px" }} />
          ) : (
            <HeadsetIcon sx={{ fontSize: "80px" }} />
          )}
        </Fab>
      </div>
      {mode === KID_MODE && recordingState === "start" && (
        <Typography variant="h5">
          <strong style={{ color: colorPurplePowder }}>{kidsPhrase}</strong>
        </Typography>
      )}
      {mode === KID_MODE && predictionLoading && (
        <CircularProgress
          size={168}
          sx={{
            color: colorPurplePowder, //#E09AF1
            position: "absolute",
            top: "18.6rem",
            marginTop: 0,
            marginLeft: "0",
          }}
        />
      )}
      {mode !== KID_MODE && predictionLoading && (
        <CircularProgress
          size={168}
          sx={{
            color: colorPurplePowder, //#E09AF1
            position: "absolute",
            top: "17.6rem",
            marginTop: 0,
            marginLeft: "0",
          }}
        />
      )}
    </Box>
  );
};
