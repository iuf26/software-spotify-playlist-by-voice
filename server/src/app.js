import express from "express";
import http from "http";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import { Server as IOServer } from "socket.io";
import { userRoute } from "server/routes/user.route";
import cookieParser from "cookie-parser";
import cors from "cors";
import { streamingRoute } from "server/routes/streaming.route";

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new IOServer(server, {
  cors: {
    origin: `${process.env.CLIENT_ROOT}`,
    methods: ["GET", "POST", "PUT"],
  },
});
const prepareSocketForClientConnection = () => {
  io.on("connection", (socket) => {
      //do something on connectivity success
  });
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/user", userRoute);
app.use("/stream", streamingRoute)
//MongoDB connection
const database = process.env.MONGO_URL;
mongoose.set("strictQuery", true);
mongoose
  .connect(database, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => {})
  .catch((err) => console.error(err));

server.listen(process.env.SERVER_PORT, () => {
  prepareSocketForClientConnection();
});

server.on("close", () => {
  closeDbConnection();
});
