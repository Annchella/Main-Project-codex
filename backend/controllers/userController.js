const User = require("../models/User");

exports.getUserProfile = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    const topUsers = await User.find({ role: "user" })
      .select("name xp level badges")
      .sort({ level: -1, xp: -1 })
      .limit(10);
    res.json(topUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getXPStats = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("xp level badges");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTutorPortfolio = async (req, res) => {
  try {
    const { bio, specialization, photo, experience, qualification } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.bio = bio || user.bio;
    user.specialization = specialization || user.specialization;
    user.photo = photo || user.photo;
    user.experience = experience || user.experience;
    user.qualification = qualification || user.qualification;
    user.tutorStatus = "pending"; // Reset to pending for approval

    await user.save();
    res.json({ message: "Portfolio submitted for approval", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPublicProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("name qualification experience bio photo specialization role");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
