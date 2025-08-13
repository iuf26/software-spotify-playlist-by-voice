import { io } from "socket.io-client";
let socketId = null;
export const socket = io(`${process.env.REACT_APP_SERVER}`);
socket.on("connect",() => {
    socketId = socket.id;
})
