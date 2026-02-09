const rooms = {}; // roomId : password

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // 🔐 JOIN ROOM WITH PASSWORD
    socket.on("join-room", ({ roomId, password }) => {
      console.log("Join request:", roomId);

      if (!rooms[roomId]) {
        rooms[roomId] = password;
        socket.join(roomId);
        socket.emit("joined", "Room created");
      } else if (rooms[roomId] === password) {
        socket.join(roomId);
        socket.emit("joined", "Joined room");
      } else {
        socket.emit("room-error", "❌ Invalid room password");
      }
    });

    // 🔁 REAL-TIME CODE
    socket.on("code-change", ({ roomId, code }) => {
      socket.to(roomId).emit("receive-code", code);
    });

    // 🗯️ DOUBT CLEARING CHAT (Real-time student-tutor)
    socket.on("join-doubt-chat", ({ courseId, studentId, tutorId }) => {
      const doubtRoomId = `doubt_${String(courseId)}_${String(studentId)}_${String(tutorId)}`;
      socket.join(doubtRoomId);
      console.log(`[Socket] User ${socket.id} joined room: ${doubtRoomId}`);
    });

    // 📢 NOTIFICATION LOBBIES
    socket.on("join-tutor-lobby", (tutorId) => {
      socket.join(`tutor_lobby_${String(tutorId)}`);
      console.log(`[Socket] Tutor entered lobby: ${tutorId}`);
    });

    socket.on("join-user-lobby", (userId) => {
      socket.join(`user_lobby_${String(userId)}`);
      console.log(`[Socket] User entered lobby: ${userId}`);
    });

    socket.on("send-doubt", (data) => {
      const { courseId, studentId, tutorId, message, senderId, senderName, courseTitle, studentName, tutorName } = data;
      const doubtRoomId = `doubt_${String(courseId)}_${String(studentId)}_${String(tutorId)}`;
      const recipientLobby = senderId === studentId ? `tutor_lobby_${String(tutorId)}` : `user_lobby_${String(studentId)}`;

      const payload = {
        message,
        senderId,
        senderName,
        courseId,
        studentId,
        studentName,
        tutorName,
        courseTitle,
        time: new Date().toLocaleTimeString(),
      };

      console.log(`[Socket] Message in ${doubtRoomId} from ${senderName}: ${message}`);
      console.log(`[Socket] Target Lobby: ${recipientLobby}`);

      // 1. Send to the specific chat room
      io.to(doubtRoomId).emit("receive-doubt", payload);

      // 2. Notify the recipient's lobby
      io.to(recipientLobby).emit("new-message-notification", payload);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });
};
