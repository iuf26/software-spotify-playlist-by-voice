import { useState } from "react";
import { Icon } from "semantic-ui-react";

export function RecordItem({ deleteAudio, predictEmotion, record }) {
  const [isPredictionLoading, setIsPredictionLoading] = useState(false);
  const [isPredictionFinished, setIsPredictionFinished] = useState(false);
  const [prediction, setPrediction] = useState();
  const emotions = {
    happy: (
      <p title="happy" style={{ cursor: "pointer", fontSize: "20px" }}>
        Happy
      </p>
    ),
    sad: (
      <p title="sad" style={{ cursor: "pointer", fontSize: "20px" }}>
        Sad
      </p>
    ),
  };
  const onPredict = () => {
    setIsPredictionLoading(true);
    setIsPredictionFinished(false);
    predictEmotion(
      record.key,
      setIsPredictionFinished,
      setIsPredictionLoading,
      setPrediction
    );
  };
  return (
    <div style={{ borderBottom: "solid 0.3px", padding: "0.5rem" }}>
      <p style={{ cursor: "pointer", fontSize: "1rem", fontWeight: "bold" }}>
        {record.audio.name}
      </p>
      <div className="record" key={record.key}>
        <audio controls src={URL.createObjectURL(record.audio)} />
        <div className="delete-button-container">
          <button
            className="delete-button"
            title="Delete this audio"
            onClick={() => deleteAudio(record.key)}
          >
            <Icon name={"trash"} />
          </button>
          <button
            className="delete-button"
            title="Predict emotion for this audio"
            onClick={onPredict}
          >
            {isPredictionLoading ? (
              <Icon loading name="spinner" />
            ) : (
              <Icon name={"chart line"} />
            )}
          </button>
        </div>
      </div>
      {isPredictionFinished ? (
        <div>
          Prediction:{" "}
          <p style={{ fontWeight: "bold" }}>
            {emotions[prediction.predictedEmotion]}
          </p>
          <br></br>
          <div>
            Scores:
            <table className="prediction-table">
              <tr>
                <th>Happy</th>
                <th>Sad</th>
              </tr>
              <tr>
                <td>{prediction?.predictionArray[0]}</td>
                <td>{prediction?.predictionArray[1]}</td>
              </tr>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  );
}
