const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { getUserProfile, getLeaderboard, getXPStats, updateTutorPortfolio, getPublicProfile } = require("../controllers/userController");

router.get("/profile", protect, getUserProfile);
router.get("/profile/:id", protect, getPublicProfile);
router.get("/leaderboard", protect, getLeaderboard);
router.get("/stats", protect, getXPStats);
router.put("/portfolio", protect, updateTutorPortfolio);

module.exports = router;
