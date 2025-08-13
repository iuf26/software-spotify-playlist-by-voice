import { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import AudiotrackIcon from "@mui/icons-material/Audiotrack";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { CssBaseline } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Fab from "@mui/material/Fab";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/system";
import { colorPurple, colorPurplePowder } from "assets/styles/colors";
import { TopBar } from "components/Pages/LandingPage/TopBar";
import { Player } from "components/RecordingFunctionality/components/Player";
import { Recorder } from "components/RecordingFunctionality/components/Recorder";
import useRecordingsList from "components/RecordingFunctionality/hooks/use-recordings-list";
import useRecorder from "components/RecordingFunctionality/hooks/useRecorder";
import {
  mapSpeech2TextTranscription,
  mapSpotifyRecommendationsTracks,
} from "helpers/mappings";
import { requestSpotifyGeneratedPlaylist } from "helpers/streaming";
import { requestSpeechToTextTranscription } from "helpers/voiceCommands";
import { useSnackbar } from "notistack";
import { selectUsername } from "redux/selectors/accountSelector";
import {
  selectDetectedArtists,
  selectPredictedEmotion,
} from "redux/selectors/dataForMusicRecommendationSelectors";
import { selectRecommendedTracks } from "redux/selectors/recommendationSelector";
import { DataForMusicRecommendationActions } from "redux/slices/dataForMusicRecommendation";
import { PlaylistRecommendActions } from "redux/slices/playlistRecommendSlice";
import { Button } from "semantic-ui-react";

import { MenuDrawer } from "../LandingPage/MenuDrawer";
import { TracksList } from "../Tracks/TracksList";
import DjInfoDialog from "./DjInfoDialog";
import { PredictEmotionFabButton } from "./PredictEmotionFabButton";
import { PredictedEmotionDialog } from "./PredictedEmotionDialog";

const StyledDiv = styled("div")(({ theme }) => ({
  backgroundColor: colorPurple,
  padding: theme.spacing(1),
}));
export const DjPage = () => {
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
  const { recordings, deleteAudio, predictEmotion } = useRecordingsList(audio);
  const { enqueueSnackbar } = useSnackbar();
  const [seedArtists, setSeedArtists] = useState();
  const [transcription, setTranscription] = useState();
  const currentPredictedEmotion = useSelector(selectPredictedEmotion);
  const currentTracks = useSelector(selectRecommendedTracks);
  const currentDetectedArtists = useSelector(selectDetectedArtists);

  const voiceAnalyzed = () => {
    setLoading(false);
    setPredictionFinished(true);
  };

  const transcribeVoiceToText = useCallback(({ audio }) => {
    requestSpeechToTextTranscription({ recording: audio })
      .then((resp) => mapSpeech2TextTranscription(resp))
      .then((resp) => {
        setTranscription(resp);
        voiceAnalyzed();
      })
      .catch((err) => {
        voiceAnalyzed();
      });
  }, []);

  const onPredict = useCallback(() => {
    predictEmotion(setPredictionFinished, setLoading, setPrediction, username);
    transcribeVoiceToText({ audio });
  }, [
    audio,
    username,
    setLoading,
    setPrediction,
    predictEmotion,
    setPredictionFinished,
    transcribeVoiceToText,
  ]);

  const onGeneratePlaylistClick = useCallback(() => {
    setGeneratePlaylistLoading(true);
    // setPlaylistRetrieved(false);
    let text = transcription?.text ? transcription?.text : "";
    let words = transcription?.words ? transcription?.words : [];
    requestSpotifyGeneratedPlaylist(prediction, text, words)
      .then((prediction) => mapSpotifyRecommendationsTracks(prediction))
      .then(({ tracks, seedArtists }) => {
        dispatch(PlaylistRecommendActions.setTracks(tracks));
        dispatch(
          DataForMusicRecommendationActions.setDetectedArtists(seedArtists)
        );
        setGeneratePlaylistLoading(false);
        setPlaylistRetrieved(true);
        setSeedArtists(seedArtists);
      })
      .catch((error) => console.error(error));
  }, [prediction, dispatch, transcription]);

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
              {((playlistRetrieved && !generatePlaylistLoading) ||
                currentDetectedArtists) && (
                <Grow
                  in={true}
                  style={{ transformOrigin: "2 2 2" }}
                  {...(true ? { timeout: 1000 } : {})}
                >
                  {
                    <Typography variant="h5">
                      {seedArtists?.length === 0 ||
                      currentDetectedArtists[0] === "" ? (
                        <p>
                          No artists were detected, but we picked randomly for
                          you ones
                        </p>
                      ) : (
                        <>
                          I created your playlist starting from detected artists{" "}
                          <strong style={{ color: colorPurplePowder }}>
                            {seedArtists}
                          </strong>
                        </>
                      )}
                    </Typography>
                  }
                </Grow>
              )}
            </Box>
          ) : null}
        </Box>
        {/* <Grow
          in={false}
          style={{ transformOrigin: "2 2 2" }}
          {...(true ? { timeout: 1000 } : {})}
        >
          <TracksList />
        </Grow> */}
        {/* <TracksList /> */}
      </Box>
      {(playlistRetrieved || currentTracks?.length > 0) && <TracksList />}
    </Box>
  );
};
