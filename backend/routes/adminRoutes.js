const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/authMiddleware");
const {
    getPendingTutors,
    approveRejectTutor,
    getAllCoursesAdmin,
    deleteCourseAdmin,
    getAllUsers,
    deleteUser
} = require("../controllers/adminController");

// User Management Routes
router.get("/users", protect, adminOnly, getAllUsers);
router.delete("/users/:id", protect, adminOnly, deleteUser);

// Tutor Approval Routes
router.get("/tutors/pending", protect, adminOnly, getPendingTutors);
router.patch("/tutors/:id/approve", protect, adminOnly, approveRejectTutor);

// Global Course Management for Admin
router.get("/courses", protect, adminOnly, getAllCoursesAdmin);
router.delete("/courses/:id", protect, adminOnly, deleteCourseAdmin);

module.exports = router;
