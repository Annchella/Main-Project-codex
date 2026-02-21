const User = require("../models/User");
const Course = require("../models/Courses");

/**
 * Get all pending tutor portfolios
 */
exports.getPendingTutors = async (req, res) => {
    try {
        const tutors = await User.find({ role: "tutor", tutorStatus: "pending" });
        res.json(tutors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Approve or Reject a tutor portfolio
 */
exports.approveRejectTutor = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'approved' or 'rejected'

        if (!["approved", "rejected"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const isApproved = status === "approved";
        const tutor = await User.findByIdAndUpdate(
            id,
            {
                tutorStatus: status,
                isApprovedTutor: isApproved
            },
            { new: true }
        );

        if (!tutor) return res.status(404).json({ message: "Tutor not found" });

        res.json({ message: `Tutor ${status} successfully`, tutor });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Admin: Get all courses (for editing/deleting)
 */
exports.getAllCoursesAdmin = async (req, res) => {
    try {
        const courses = await Course.find().populate("tutor", "name email");
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Admin: Delete any course
 */
exports.deleteCourseAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        await Course.findByIdAndDelete(id);
        res.json({ message: "Course deleted by admin" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
/**
 * Admin: Get all users (Students & Tutors)
 */
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: { $in: ["user", "tutor"] } }).select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Admin: Delete a user
 */
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) return res.status(404).json({ message: "User not found" });
        if (user.role === "admin") return res.status(403).json({ message: "Cannot delete an admin" });

        await User.findByIdAndDelete(id);
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
