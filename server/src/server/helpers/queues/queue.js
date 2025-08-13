import { readdir } from "fs/promises";
import { extname, join } from "path";
import Throttle from "throttle";
import { PassThrough } from "stream";
import { ffprobe } from "@dropb/ffprobe";
import ffprobeStatic from "ffprobe-static";

ffprobe.path = ffprobeStatic.path;

class Queue {
  constructor() {
    this.clients = new Map();
    this.tracks = [];
    this.index = 0;
  }

  addClient() {
    const client = new PassThrough();
    const id = this.clients.size;
    this.clients.set(id, client);
    return { client, id };
  }

  removeClient(id) {}
  async start() {
    const track = this.currentTrack;
    if (!track) return;
    this.playing = true;
    //constructor for Throttle takes in bps (bytes per second), so we divide bitrate by 8
    this.throttle = new Throttle(track.bitrate / 8);
    this.stream
      .pipe(this.throttle)
      .on("data", (chunk) => this.broadcast(chunk))
      .on("end", () => this.play(true))
      .on("error", () => this.play(true));
  }

  play(useNewTrack = false) {
    if (useNewTrack || !this.currentTrack) {
      this.getNextTrack();
      this.loadTrackStream();
      this.start();
    } else {
      this.resume();
    }
  }

  pause() {
    if (!this._started() || !this.playing) return;
    this.playing = false;
    this.throttle.removeAllListeners("end");
    this.throttle.end();
  }

  resume() {
    if (!this.started() || this.playing) return;
    this.start();
  }

  broadcast(chunk) {
    this.clients.forEach((client) => {
      client.write(chunk);
    });
  }

  async loadTracks(dir) {
    let filenames = await readdir(dir);

    filenames = filenames.filter((filename) => extname(filename) === ".mp3");
    const filepaths = filenames.map((filename) => join(dir, filename));
    //Bitrates allows us to control the rate of audio streaming
    const promises = filepaths.map(async (filepath) => {
      const bitrate = await this.getTrackBitrate(filepath);

      return { filepath, bitrate };
    });

    this.tracks = await Promise.all(promises);
  }

  async getTrackBitrate(filepath) {
    const data = await ffprobe(filepath);
    const bitrate = data?.format?.bit_rate;
    return bitrate ? parseInt(bitrate) : 128000;
  }

  getNextTrack() {
    // Loop back to the first track

    if (this.index >= this.tracks.length - 1) {
      this.index = 0;
    }

    const track = this.tracks[this.index++];
    this.currentTrack = track;

    return track;
  }

  loadTrackStream() {
    const track = this.currentTrack;
    if (!track) return;

    this.stream = createReadStream(track.filepath);
  }

  _started() {
    return this.stream && this.throttle && this.currentTrack;
  }
}
const queue = new Queue();
export default queue;
