const SupportMessage = require("../models/SupportMessage");
const rooms = {}; // roomId : password
const roomUsers = {}; // roomId : [{ socketId, name }]

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // 🔐 JOIN ROOM WITH PASSWORD
    socket.on("join-room", ({ roomId, password, userName }) => {
      console.log(`Join request for room ${roomId} by ${userName}`);
      console.log(`Current roomUsers for ${roomId}:`, roomUsers[roomId]);

      if (!rooms[roomId]) {
        // Create new room
        rooms[roomId] = password;
        roomUsers[roomId] = [];

        socket.join(roomId);

        // Add user to room list
        const user = { socketId: socket.id, name: userName || "Anonymous" };
        roomUsers[roomId].push(user);
        console.log(`Created room. Added user:`, user);

        socket.emit("joined", "Room created");
        io.to(roomId).emit("room-users", roomUsers[roomId]); // Broadcast updated list

      } else if (rooms[roomId] === password) {
        // Join existing room
        socket.join(roomId);

        // Add user if not already present (prevent duplicates if re-joining)
        if (!roomUsers[roomId]) roomUsers[roomId] = [];
        const existingUser = roomUsers[roomId].find(u => u.socketId === socket.id);
        if (!existingUser) {
          roomUsers[roomId].push({ socketId: socket.id, name: userName || "Anonymous" });
        }

        socket.emit("joined", "Joined room");
        io.to(roomId).emit("room-users", roomUsers[roomId]); // Broadcast updated list
      } else {
        socket.emit("room-error", "❌ Invalid room password");
      }
    });

    // 🔁 REAL-TIME CODE
    socket.on("code-change", ({ roomId, code }) => {
      socket.to(roomId).emit("receive-code", code);
    });

    // 💬 REAL-TIME CHAT (Coderoom)
    socket.on("send-message", (data) => {
      const { roomId } = data;
      io.to(roomId).emit("receive-message", data);
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

    // 🛠️ SUPPORT CHAT (Real-time student/tutor with admin)
    socket.on("join-support", (userId) => {
      socket.join(`support_${String(userId)}`);
      console.log(`[Socket] User ${socket.id} joined support room: support_${userId}`);
    });

    socket.on("join-admin-support", () => {
      socket.join("admin_support_lobby");
      console.log(`[Socket] Admin ${socket.id} joined support lobby`);
    });

    socket.on("send-support-message", async (data) => {
      const { supportUserId, message, senderId, senderName, role, isAdmin } = data;
      const room = `support_${String(supportUserId)}`;

      console.log(`[Socket] Support Message from ${senderName} to ${supportUserId}: ${message}`);

      try {
        const newMessage = await SupportMessage.create({
          sender: senderId,
          senderName,
          message,
          role,
          isAdmin,
          supportUserId
        });

        const payload = {
          ...data,
          _id: newMessage._id,
          createdAt: newMessage.createdAt
        };

        // Broadcast to the user's support room (both user and admin listen here)
        io.to(room).emit("receive-support-message", payload);
        console.log(`[Socket] Broadcasted support message to room: ${room}`);

        // If it's a new message from a user, notify the admin lobby
        if (!isAdmin) {
          io.to("admin_support_lobby").emit("new-support-notification", payload);
          console.log(`[Socket] Sent support notification to admin lobby`);
        }
      } catch (error) {
        console.error("Socket error saving support message:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);

      // Remove user from any room they were in
      for (const roomId in roomUsers) {
        const index = roomUsers[roomId].findIndex(u => u.socketId === socket.id);
        if (index !== -1) {
          roomUsers[roomId].splice(index, 1);
          io.to(roomId).emit("room-users", roomUsers[roomId]); // Broadcast updated list
          break; // User can only be in one code room at a time (usually)
        }
      }
    });
  });
};
