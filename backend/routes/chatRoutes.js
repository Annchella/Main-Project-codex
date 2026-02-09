const express = require("express");
const router = express.Router();
const { sendMessage, getMessages, getTutorDoubts } = require("../controllers/chatController");
const { protect, tutorOnly } = require("../middleware/authMiddleware");

router.post("/send", protect, sendMessage);
router.get("/history/:courseId/:otherUserId", protect, getMessages);
router.get("/tutor/doubts", protect, tutorOnly, getTutorDoubts);

module.exports = router;
