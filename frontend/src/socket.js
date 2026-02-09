import { io } from "socket.io-client";

const socket = io("https://main-project-codex-five.vercel.app", {
  transports: ["websocket"],
  autoConnect: true,
});

export default socket;
