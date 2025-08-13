import User from "server/models/User";

export const getSpotifyRefreshedAccesToken = (refreshToken, spotifyApi) => {
  spotifyApi.setRefreshToken(refreshToken);
  return spotifyApi.refreshAccessToken(); //resp.body.access_token
};

export const validateSpotifyAccesToken = async (req, res, next) => {};

export const extractSpotifyRefreshToken = async (req, res, next) => {
  const { username } = res.locals.decodedJwt;
  const { spotify_refresh_token } = await User.findOne({ email: username });
  res.locals.spotifyRefreshAccesToken = spotify_refresh_token;
  next();
};

export const refreshSpotifyAccesTokenForUser = async (userId, spotifyApi) => {
  try {
    const { spotify_refresh_token } = await User.findOne({ email: userId });
    spotifyApi.setRefreshToken(spotify_refresh_token);
    const responseRefreshToken = await spotifyApi.refreshAccessToken();
    const freshAccessToken = responseRefreshToken.body.access_token;

    await User.findOneAndUpdate(
      { email: userId },
      {
        $set: { spotify_acces_token: freshAccessToken },
      }
    );
    return true;
  } catch (error) {
    console.info("error thrown in refreshSpotifyAccesTokenForUser");
    console.info(error);
    return false;
  }
};

const tracksMapped = (tracks) => {
  return tracks.map((elem) => {
    return {
      durationMs: elem.duration_ms,
      previewUrl: elem.preview_url,
      externalUrl: elem.external_urls.spotify,
      apiTrackPrivateUrl: elem.href,
      title: elem.name,
      artist: elem.artists[0].name,
      artistId: elem.artists[0].id,
      artists: elem.artists,
      albumImages: elem.album.images,
      trackUri: elem.uri,
    };
  });
};

export const getTracksFromArtists = async (
  artists,
  spotifyApi,
  tracksToGetForEachArtist
) => {
  let result = [];
  if (!artists || !artists?.length) return result;
  for (let i = 0; i < artists.length; i++) {
    const tracks = await spotifyApi.searchTracks(artists[i], {
      limit: tracksToGetForEachArtist,
      market: "US",
      country: "US",
    });
    //const mappedTracksForSinger = tracksMapped(tracks.body.tracks.items);

    const mappedTracksForSinger = tracks.body.tracks.items;
    result = result.concat(mappedTracksForSinger);
  }

  return result;
};

export const kidsGenre = (emotion) => {
  switch (emotion) {
    case "happy":
      return "children,happy,disney,dance";
    case "sad":
      return "sleep,children,disney,ambient";
    default:
      return null;
  }
};
