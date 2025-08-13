import { Icon } from "semantic-ui-react";
import useRecordingsList from "../../hooks/use-recordings-list";
import { RecordItem } from "./RecordItem";
import "./styles.css";

export default function RecordingsList({ audio }) {
  const { recordings, deleteAudio, predictEmotion } = useRecordingsList(audio);

  return (
    <div className="recordings-container">
      {recordings.length > 0 ? (
        <>
          <h1>Your recordings</h1>
          <div className="recordings-list">
            {recordings.map((record) => <RecordItem key={record.key} record={record} deleteAudio={deleteAudio} predictEmotion={predictEmotion} />)}
          </div>
        </>
      ) : (
        <div className="no-records">
          <Icon name="exclamation circle" size="large" />
          <br></br>
          <span>You don't have any records </span>
        </div>
      )}
    </div>
  );
}
