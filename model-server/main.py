import json
import librosa
import librosa.display
import numpy as np
from flask import Flask, request
import io
from matplotlib import pyplot as plt
from PIL import Image
from tensorflow import keras

preditionDictionary = {
    "0": "happy",
    "1": "sad"
}


def getIndexForMaxValueInArray(array):
    index = 0
    maximum = -1
    maxValueIndex = 0
    for elem in array:
        if elem > maximum:
            maximum = elem
            maxValueIndex = index
        index += 1
    return maxValueIndex


def predict(imageInBytes):
    model = keras.models.load_model('ml-model.h5')
    imageArray = np.array(imageInBytes)[None, ...]
    prediction = model.predict(imageArray / 255)[0]
    index = getIndexForMaxValueInArray(prediction)
    predictedEmotion = preditionDictionary[str(index)]
    return predictedEmotion, prediction


# receive a path to an audio recording and a path for result , converts an audio image to required format for ALEXNET CNN arhitecture input
# audioFile : path to audio file or I/0 Buffer
# returns resulted RGB image from combining Mel spectogram(log mel), delta,delta-delta in bytes
def convertAudioToImage(audioFile):
    # EXTRAGEREA DE FEATURE-URI CU LIBROSA
    data, samplerate = librosa.load(audioFile, sr=16000)
    mel_spect = librosa.feature.melspectrogram(y=data, sr=samplerate)
    mel_spect = librosa.power_to_db(mel_spect, ref=np.max)
    mel_spect_delta = librosa.feature.delta(mel_spect)
    mel_spect_delta_delta = librosa.feature.delta(mel_spect, order=2)

    # SETARI PLOT
    plt.gca().set_axis_off()
    plt.subplots_adjust(top=1, bottom=0, right=1, left=0, hspace=0, wspace=0)
    plt.margins(0, 0)
    plt.gca().xaxis.set_major_locator(plt.NullLocator())
    plt.gca().yaxis.set_major_locator(plt.NullLocator())

    # COMPUNERE IMAGINE RGB R - MEL S
    librosa.display.specshow(mel_spect)
    r = io.BytesIO()
    plt.savefig(r, format='jpg', bbox_inches='tight')
    librosa.display.specshow(mel_spect_delta)
    g = io.BytesIO()
    plt.savefig(g, format='jpg', bbox_inches='tight')
    librosa.display.specshow(mel_spect_delta_delta)
    b = io.BytesIO()
    plt.savefig(b, format='jpg', bbox_inches='tight')
    plt.close()
    r.seek(0)
    img_mel_spect = Image.open(r)

    g.seek(0)
    img_mel_spect_delta = Image.open(g)
    b.seek(0)
    img_mel_spect_delta_delta = Image.open(b)
    res = Image.merge('RGB', (
        img_mel_spect.getchannel('R'), img_mel_spect_delta.getchannel('G'), img_mel_spect_delta_delta.getchannel('B')))

    # RESIZE IMAGE FOR CNN ARHITECTURE INPUT FORMAT
    res = res.resize((227, 227))
    r.close()
    g.close()
    b.close()
    return res


app = Flask(__name__)


@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        recordingFile = request.files.get('recording')
        if recordingFile is not None and recordingFile.filename == "":
            return json.dumps({"error": "no recording file provided"})
        try:
            if recordingFile is not None:
                fileBytes = io.BytesIO(recordingFile.read())
                rgbImage = convertAudioToImage(fileBytes)
                emotion, predictionArray = predict(rgbImage)
                response = {
                    "predictedEmotion": emotion,
                    "predictionArray": predictionArray.tolist()
                }
                return json.dumps(response)
        except Exception as e:
            return json.dumps({"error": str(e)})
    return "Could not start operation"


if __name__ == '__main__':
    app.run(port=8081)
