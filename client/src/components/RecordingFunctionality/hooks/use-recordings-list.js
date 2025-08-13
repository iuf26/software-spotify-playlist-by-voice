import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import generateKey from "components/RecordingFunctionality/utils/generate-key";

import { deleteAudio, predictEmotion } from "../handlers/recordings-list";

export default function useRecordingsList(audio) {
  const [recordings, setRecordings] = useState();
  const dispatcher = useDispatch();

  useEffect(() => {
    if (audio) {
      setRecordings((prevState) => {
        return { key: generateKey(), audio };
      });
    }
  }, [audio]);

  return {
    recordings,
    deleteAudio: (audioKey) => deleteAudio(audioKey, setRecordings),
    predictEmotion: (setIsFinished, setIsLoading, setPrediction, username) => {
      const file = recordings.audio;
      predictEmotion(
        file,
        setIsFinished,
        setIsLoading,
        setPrediction,
        username,
        dispatcher
      );
    },
  };
}
