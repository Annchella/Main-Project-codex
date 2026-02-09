const express = require("express");
const router = express.Router();
const {
    purchaseCourse,
    getMyEnrolledCourses,
    getTutorEnrollments,
    checkEnrollment,
} = require("../controllers/enrollmentController");
const { protect } = require("../middleware/authMiddleware");

router.post("/purchase", protect, purchaseCourse);
router.get("/my", protect, getMyEnrolledCourses);
router.get("/tutor", protect, getTutorEnrollments);
router.get("/check/:courseId", protect, checkEnrollment);

module.exports = router;
