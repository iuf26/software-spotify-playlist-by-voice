import * as React from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

export const Player = () => {
  //extract currently playing song from redux context
  const currentlyPlaying = "http://localhost:8080/stream/spotify/track";
  return (
    <AudioPlayer
      autoPlay
      src={currentlyPlaying}
      onPlay={(e) => {}}
      // other props here
    />
  );
};
