import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import AddIcon from "@mui/icons-material/Add";
import { Divider, Icon, Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Fab from "@mui/material/Fab";
import Input from "@mui/material/Input";
import { Box } from "@mui/system";
import { mapResponse } from "helpers/mappings";
import { addPlaylistToSpotifyAccount } from "helpers/streaming";
import { useSnackbar } from "notistack";
import { selectUsername } from "redux/selectors/accountSelector";
import { selectRecommendedKidsTracks, selectRecommendedTracks } from "redux/selectors/recommendationSelector";
import { Message } from "semantic-ui-react";

import { TrackItem } from "./TrackItem";

export const TracksListKids = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [playlistName, setPlaylistName] = useState();
  const [playlistAddedToSpotify, setPlaylistAddedToSpotify] = useState(false);
  const [playlistAddLoading, setPlaylistAddLoading] = useState(false);

  const tracks = useSelector(selectRecommendedKidsTracks);
  const username = useSelector(selectUsername);

  const onPlaylistNameChange = (e) => {
    setPlaylistName(e.target.value);
  };

  const onAddToSpotifyClick = useCallback(async () => {
    if (!playlistName || playlistName.length <= 0) {
      enqueueSnackbar("Write your playlist name", { variant: "warning" });
      return;
      //username,tracks,playlistName
    }

    if (!username) {
      enqueueSnackbar("Invalid username", { variant: "error" });
      return;
    }

    setPlaylistAddLoading(true);

    const response = await addPlaylistToSpotifyAccount({
      username,
      tracks,
      playlistName,
    });

    if (response) {
      //TO DO :refactor, this, send message from server to client
      const { message, severity } = mapResponse(response);
      enqueueSnackbar(message, { variant: severity });
    } else {
      enqueueSnackbar("Could not create playlist!", { variant: "error" });
    }

    setPlaylistAddLoading(false);
  }, [enqueueSnackbar, playlistName, username, tracks]);

  return (
    <Box
      display="flex"
      component="main"
      sx={{ flexGrow: 5, p: 10 }}
      padding={0}
      marginTop={9}
      justifyContent="center"
      marginLeft="12rem"
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          verticalAlign: "center",
        }}
      >
        <div style={{ display: "flex", gap: "1rem" }}>
          <div
            style={{
              width: "210px",
              height: "210px",
              backgroundImage: `url("assets/images/spotify-album-image-test.jpg")`,
            }}
          >
            <img
              src={tracks.length > 0 && tracks[0].albumImages[1].url}
              alt="first artist from album"
              width="210px"
              height="210px"
              style={{ boxShadow: `0px 0px 15px 0px #1A1A1A` }}
            />
          </div>
          <div style={{ marginTop: "2rem" }}>
            <Input
              placeholder="My new playlist"
              sx={{ fontSize: "40px" }}
              onInput={onPlaylistNameChange}
            />
            <Typography variant="h5">{tracks.length} songs</Typography>
            {playlistAddLoading ? (
              <CircularProgress color="secondary" size="2.5rem" sx={{marginLeft:"2.7rem",marginTop:"1rem"}}/>
            ) : (
              <Fab
                variant="extended"
                size="small"
                color="secondary"
                aria-label="add"
                onClick={onAddToSpotifyClick}
                sx={{ marginTop: "1rem", fontSize: "10px", width: "10rem" }}
              >
                <AddIcon />
                Add to Spotify
              </Fab>
            )}
          </div>
        </div>
        {/* Table header */}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            cursor: "pointer",
            whiteSpace: "nowrap",
            padding: "5px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              position: "sticky",
            }}
          >
            <div style={{ width: "7rem", color: "#424242" }}>
              <strong># Title</strong>
            </div>
            <div style={{ color: "#424242" }}>
              <strong>Artist</strong>
            </div>
            <div style={{ color: "#424242" }}>
              <strong>Time</strong>
            </div>
          </div>
          <Divider variant="fullWidth" />
          {tracks?.map((track, index) => (
            <TrackItem
              title={track.title}
              artist={track.artist}
              durationMs={track.durationMs}
              presentationImage={track.albumImages[2]}
              index={index + 1}
              previewUrl={track.previewUrl}
            />
          ))}
        </div>
      </div>
    </Box>
  );
};
