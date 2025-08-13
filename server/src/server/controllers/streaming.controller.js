import { artistIds } from "server/helpers/artistIds";
import { artists, saveArtistsIdsFromSpotifyApis } from "server/helpers/artists";
import { ERROR, sendResponse, SUCCESS } from "server/helpers/response.helper";
import {
  getTracksFromArtists,
  kidsGenre,
  refreshAccesTokenForUser,
  refreshSpotifyAccesTokenForUser,
} from "server/helpers/streaming.helper";
import User from "server/models/User";
import SpotifyWebApi from "spotify-web-api-node";

export const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI,
});

export const scopes = [
  "user-read-private",
  "user-read-email",
  "playlist-modify-public",
  "playlist-modify-private",
];

const getArtistsNamesFromText = ({ text, words }) => {
  //This function could be optimized

  const artistsFound = [];
  let result;
  text = text.toLowerCase();
  artists.forEach(function (artist) {
    const regexp = new RegExp(
      "\\b" + artist.toLowerCase().replace(/\./g, "\\.") + "\\b"
    );

    if (regexp.exec(text) !== null) {
      artistsFound.push(artist);
    }
  });

  artistsFound.forEach((artist) => {
    if (result) {
      result = `${result},${artistIds[artist]}`;
    } else {
      result = `${artistIds[artist]}`;
    }
  });

  return { result, artistsFound };
};

export const getMusicRecommandationsKids = async (req, res) => {
  let recommendation;
  const { detectedEmotion } = req.body;
  const { userId } = req.params;
  const { spotify_refresh_token, spotify_acces_token } = await User.findOne({
    email: userId,
  });
  const seed_genres = kidsGenre(detectedEmotion);
  spotifyApi.setAccessToken(spotify_acces_token);
  spotifyApi.setRefreshToken(spotify_refresh_token);
  const body = {
    seed_genres,
  };

  try {
    recommendation = await spotifyApi.getRecommendations(body);
    return sendResponse(res, 200, "Kids Music Recommandations retrieved", SUCCESS, {
      recommendation,
    });
  } catch (error) {
    //token expired
    const response = await refreshSpotifyAccesTokenForUser(userId, spotifyApi);
    if (response) {
      console.info("Access token for spotify api is refreshed");
      const { spotify_acces_token } = await User.findOne({ email: userId });
      spotifyApi.setAccessToken(spotify_acces_token);
      recommendation = await spotifyApi.getRecommendations({ ...body });
      return sendResponse(
        res,
        200,
        "Kids Music Recommandations retrieved",
        SUCCESS,
        {
          recommendation,
        }
      );
    } else {
      console.info("Could not refresh access token for children music recommendations request");
    }
  }
};

export const getMusicRecommandations = async (req, res) => {
  const { detectedEmotion } = req.body;
  let text = req.body.text ? req.body.text : "";
  let words = req.body.words ? req.body.words : [];
  let result, artistsFound;
  let recommendation;
  const { userId } = req.params;
  const { spotify_refresh_token, spotify_acces_token } = await User.findOne({
    email: userId,
  });
  const seed_genres = detectedEmotion;

  if (text) {
    const res = getArtistsNamesFromText({ text, words });
    result = res.result;
    artistsFound = res.artistsFound;
  }

  spotifyApi.setAccessToken(spotify_acces_token);
  spotifyApi.setRefreshToken(spotify_refresh_token);
  let body;
  if (!result || result === "") {
    body = {
      seed_genres,
    };
  } else {
    body = {
      seed_genres,
      seed_artists: result,
    };
  }

  try {
    recommendation = await spotifyApi.getRecommendations(body);
    const artistsTracks = await getTracksFromArtists(artistsFound, spotifyApi);
    return sendResponse(res, 200, "Music Recommandations retrieved", SUCCESS, {
      recommendation,
      artistsFound: artistsFound.join(),
      artistsTracks,
    });
  } catch (error) {
    if (error.statusCode === 401) {
      //token expired
      const response = await refreshSpotifyAccesTokenForUser(
        userId,
        spotifyApi
      );
      if (response) {
        console.info("Access token for spotify api is refreshed");
        const { spotify_acces_token } = await User.findOne({ email: userId });
        spotifyApi.setAccessToken(spotify_acces_token);
        const artistsTracks = await getTracksFromArtists(
          artistsFound,
          spotifyApi
        );
        recommendation = await spotifyApi.getRecommendations({ ...body });
        return sendResponse(
          res,
          200,
          "Music Recommandations retrieved",
          SUCCESS,
          {
            recommendation,
            artistsFound: artistsFound.join(),
            artistsTracks,
          }
        );
      } else {
        console.info("Could not refresh access token");
      }
    }
  }
};

export const createSpotifyPlaylist = async (req, res) => {
  const { userId } = req.params;
  const { playlistName } = req.body;
  const { spotify_refresh_token, spotify_acces_token } = await User.findOne({
    email: userId,
  });
  spotifyApi.setAccessToken(spotify_acces_token);
  spotifyApi.setRefreshToken(spotify_refresh_token);
  try {
    const response = await spotifyApi.createPlaylist(playlistName, {
      public: true,
      description: "Listen Up!",
    });
    const playlistId = response.body.id;
    return sendResponse(res, 200, "Playlist created", SUCCESS, {
      playlistId,
    });
  } catch (error) {
    console.info({ error: err });
    return sendResponse(res, 505, "Could not create playlist", ERROR);
  }
};

const retrieveSpotifyCredentialsForUser = async ({ email }) => {
  const { spotify_refresh_token, spotify_acces_token } = await User.findOne({
    email,
  });

  return { spotify_refresh_token, spotify_acces_token };
};

export const addPlaylistTracks = async (req, res) => {
  const { playlistId } = req.params;
  //tracks, list of strings representing spotify's track uri
  const { tracks, userId } = req.body;
  const { spotify_refresh_token, spotify_acces_token } =
    await retrieveSpotifyCredentialsForUser({ email: userId });

  spotifyApi.setAccessToken(spotify_acces_token);
  spotifyApi.setRefreshToken(spotify_refresh_token);

  try {
    console.info("Tracks successfully added to playlist");
    await spotifyApi.addTracksToPlaylist(playlistId, tracks);
    return sendResponse(res, 200, "Added tracks to playlist", SUCCESS, {
      playlistId,
    });
  } catch (error) {
    console.info(error);
    return sendResponse(res, 505, "Could not add track to playlist", ERROR);
  }
};

export const saveArtistsIds = async (req, res) => {
  await saveArtistsIdsFromSpotifyApis(spotifyApi);
  res.end();
};
