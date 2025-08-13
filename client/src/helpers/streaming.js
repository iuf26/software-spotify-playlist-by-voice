import axios from "axios";

import { mapResponse } from "./mappings";

export const SPOTIFY_LOGIN_REQUEST = `${process.env.REACT_APP_SERVER}/stream/spotify/login`;
const SPOTIFY_GENERATE_PLAYLIST_REQUEST = `${process.env.REACT_APP_SERVER}/stream/spotify/recommandations`;
const SPOTIFY_GENERATE_KIDS_PLAYLIST_REQUEST = `${process.env.REACT_APP_SERVER}/stream/spotify/kids-recommandations`;
const SPOTIFY_CREATE_PLAYLIST = `${process.env.REACT_APP_SERVER}/stream/spotify/playlist`;
const SPOTIFY_ADD_TRACKS_TO_PLAYLIST = `${process.env.REACT_APP_SERVER}/stream/spotify/playlist/tracks`;

export const requestSpotifyLogin = (username) => {
  return axios.get(`${SPOTIFY_LOGIN_REQUEST}/${username}`, {
    withCredentials: true,
  });
};

export const requestSpotifyGeneratedPlaylist = (
  { username, detectedEmotion, loudness, tempo },
  text = "",
  words = []
) => {
  const body = {
    detectedEmotion,
    loudness,
    tempo,
    text,
    words,
  };
  return axios.post(`${SPOTIFY_GENERATE_PLAYLIST_REQUEST}/${username}`, body, {
    withCredentials: true,
  });
};

export const requestSpotifyKidsGeneratedPlaylist = ({
  username,
  detectedEmotion,
}) => {
  const body = {
    detectedEmotion,
  };
  return axios.post(
    `${SPOTIFY_GENERATE_KIDS_PLAYLIST_REQUEST}/${username}`,
    body,
    {
      withCredentials: true,
    }
  );
};

//should return also the id of the createdPlaylist
export const requestSpotifyCreatePlaylist = ({ username, playlistName }) => {
  return axios.post(
    `${SPOTIFY_CREATE_PLAYLIST}/${username}`,
    {
      playlistName,
    },
    {
      withCredentials: true,
    }
  );
};

export const requestSpotifyAddTracksToPlaylist = ({
  username,
  tracksUris,
  playlistId,
}) => {
  const body = {
    tracks: tracksUris,
    userId: username,
  };
  return axios.post(`${SPOTIFY_ADD_TRACKS_TO_PLAYLIST}/${playlistId}`, body, {
    withCredentials: true,
  });
};

export const addPlaylistToSpotifyAccount = async ({
  username,
  tracks,
  playlistName,
}) => {
  try {
    //1.Create playlist
    const responseCreatePlaylist = await requestSpotifyCreatePlaylist({
      username,
      playlistName,
    });
    tracks = tracks.map((track) => track.trackUri);
    const {
      body: { playlistId },
    } = mapResponse(responseCreatePlaylist);

    //2. Add tracks
    const responseAddTracks = await requestSpotifyAddTracksToPlaylist({
      username,
      tracksUris: tracks,
      playlistId,
    });
    return responseAddTracks;
  } catch (error) {
    console.error(error);
    return false;
  }
};

//Returns a random integer in [0, max)
export const  getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
}

export const kidsModeRandomPhrases = () => {
  const motivationalPhrases = [
    "If you can dream it, you can do it!",

    "A person's a person, no matter how small!",

    "No one is perfect - that's why pencils have erasers",

    "Even miracles take a little time",

    "Just keep swimming!",

    "A true friend is the greatest of all blessings",

    "Be kind whenever possible. It is always possible",
  ];
  const randomNumber = getRandomInt(motivationalPhrases.length);
  return motivationalPhrases[randomNumber];

};
