const Enrollment = require("../models/Enrollment");
const Course = require("../models/Courses");

/**
 * Purchase/Enroll in a course
 */
exports.purchaseCourse = async (req, res) => {
    try {
        const { courseId } = req.body;
        const userId = req.user._id;

        // Check if course exists and is approved
        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: "Course not found" });
        if (!course.isApproved) return res.status(403).json({ message: "Course is not approved for purchase" });

        // Check if already enrolled
        const existingEnrollment = await Enrollment.findOne({ user: userId, course: courseId });
        if (existingEnrollment) {
            return res.status(400).json({ message: "Already enrolled in this course" });
        }

        const enrollment = await Enrollment.create({
            user: userId,
            course: courseId,
        });

        res.status(201).json(enrollment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get enrolled courses for the logged-in user
 */
exports.getMyEnrolledCourses = async (req, res) => {
    try {
        const enrollments = await Enrollment.find({ user: req.user._id })
            .populate({
                path: "course",
                populate: { path: "tutor", select: "name qualification" }
            })
            .sort({ createdAt: -1 });

        res.json(enrollments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Check if the user is enrolled in a specific course
 */
exports.checkEnrollment = async (req, res) => {
    try {
        const { courseId } = req.params;
        const enrollment = await Enrollment.findOne({ user: req.user._id, course: courseId });
        res.json({ enrolled: !!enrollment });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
/**
 * Get all enrollments for courses owned by the logged-in tutor
 */
exports.getTutorEnrollments = async (req, res) => {
    try {
        const tutorId = req.user._id;

        // Find all courses owned by this tutor
        const tutorCourses = await Course.find({ tutor: tutorId }).select("_id");
        const courseIds = tutorCourses.map(c => c._id);

        // Find all enrollments for these courses
        const enrollments = await Enrollment.find({ course: { $in: courseIds } })
            .populate("user", "name email")
            .populate("course", "title thumbnail")
            .sort("-createdAt");

        res.json(enrollments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
