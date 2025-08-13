import axios from "axios";

const TRANSCRIBE_SPEECH_TO_TEXT = `${process.env.REACT_APP_SER_URI}/speech-to-text`;

export const requestSpeechToTextTranscription = ({recording}) => {
    return axios.postForm(TRANSCRIBE_SPEECH_TO_TEXT,{recording})
}