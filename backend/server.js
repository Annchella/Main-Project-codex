const app = require("./app");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const server = http.createServer(app);

const allowedOrigins = [
  "http://localhost:3000",
  "https://main-project-codex-ov1i.vercel.app",
];

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  },
});

require("./socket/socketHandler")(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
