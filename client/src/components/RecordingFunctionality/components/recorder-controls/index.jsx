import { useRef } from "react";
import { formatMinutes, formatSeconds } from "../../utils/format-time";
import "./styles.css";
import { Icon } from "semantic-ui-react";

export default function RecorderControls({ recorderState, handlers,addRecording }) {
  const { recordingMinutes, recordingSeconds, initRecording } = recorderState;
  const { startRecording, saveRecording, cancelRecording } = handlers;
  const inputRef = useRef();

  return (
    <div className="controls-container">
      <div className="recorder-display">
        <div className="recording-time">
          {initRecording && <div className="recording-indicator"></div>}
          <span>{formatMinutes(recordingMinutes)}</span>
          <span>:</span>
          <span>{formatSeconds(recordingSeconds)}</span>
        </div>
        {initRecording && (
          <div className="cancel-button-container">
            <button
              className="cancel-button"
              title="Cancel recording"
              onClick={cancelRecording}
            >
              <Icon name={"times"} size="small" />
            </button>
          </div>
        )}
      </div>
      <div className="start-button-container">
        {initRecording ? (
          <button
            className="start-button"
            title="Save recording"
            disabled={recordingSeconds === 0}
            onClick={saveRecording}
          >
            <Icon name={"save"} />
          </button>
        ) : (
          <button
            className="start-button"
            title="Start recording"
            onClick={startRecording}
          >
            <Icon name="microphone" />
          </button>
        )}
        <button
          className="start-button"
          title="Upload file"
          onClick={() => inputRef.current.click()}
        >
          <Icon name={"file alternate"} />
        </button>
        <input
          type="file"
          onChange={(event) => addRecording(event.target.files[0])}
          hidden
          accept="audio/wav"
          ref={inputRef}
        />
      </div>
    </div>
  );
}
