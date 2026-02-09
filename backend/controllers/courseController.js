const Course = require("../models/Courses");

/**
 * ================================
 * CREATE COURSE (TUTOR)
 * ================================
 * POST /api/courses
 * Tutor only
 */
exports.createCourse = async (req, res) => {
  try {
    const { title, description, price, thumbnail, modules } = req.body;

    if (!title || !description || !price) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Ensure req.user exists (protect middleware should handle this, but being safe)
    if (!req.user) {
      return res.status(401).json({ message: "User context not found" });
    }

    // Check if tutor is approved (Admin bypass included)
    if (!req.user.isApprovedTutor && req.user.role !== "admin") {
      return res.status(403).json({ message: "Your tutor profile must be approved by admin before creating courses." });
    }

    // Clean modules/lessons to prevent Mongoose validation errors on empty titles
    const cleanedModules = (modules || [])
      .filter(m => m.title && m.title.trim() !== "")
      .map(m => ({
        ...m,
        lessons: (m.lessons || []).filter(l => l.title && l.title.trim() !== "")
      }));

    const course = await Course.create({
      title,
      description,
      price: Number(price),
      thumbnail,
      modules: cleanedModules,
      tutor: req.user._id,
    });

    res.status(201).json(course);
  } catch (error) {
    console.error("Create Course Error Details:", error);
    res.status(500).json({
      message: error.name === 'ValidationError' ? "Validation Error: Ensure all sections and lessons have titles." : error.message
    });
  }
};

/**
 * ================================
 * GET ALL COURSES (USER)
 * ================================
 * GET /api/courses
 * User side – only show approved courses
 */
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isApproved: true })
      .populate("tutor", "name qualification experience bio photo specialization");

    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ================================
 * GET TUTOR'S COURSES
 * ================================
 * GET /api/courses/my
 * Tutor only
 */
exports.getMyCourses = async (req, res) => {
  try {
    const courses = await Course.find({ tutor: req.user._id });

    // 🔥 Dynamically count enrollments for each course
    const Enrollment = require("../models/Enrollment");
    const coursesWithCounts = await Promise.all(courses.map(async (course) => {
      const studentCount = await Enrollment.countDocuments({ course: course._id });
      return {
        ...course._doc,
        studentCount
      };
    }));

    res.json(coursesWithCounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ================================
 * UPDATE COURSE (TUTOR)
 * ================================
 */
exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, thumbnail, modules } = req.body;
    let course = await Course.findById(id);

    if (!course) return res.status(404).json({ message: "Course not found" });

    // Check ownership
    if (course.tutor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this course" });
    }

    // Curriculum cleaning (same as createCourse)
    const cleanedModules = (modules || [])
      .filter(m => m.title && m.title.trim() !== "")
      .map(m => ({
        ...m,
        lessons: (m.lessons || []).filter(l => l.title && l.title.trim() !== "")
      }));

    // Update and reset approval status for security
    course = await Course.findByIdAndUpdate(
      id,
      {
        title,
        description,
        price: Number(price),
        thumbnail,
        modules: cleanedModules,
        isApproved: false,
        status: "pending"
      },
      { new: true }
    );

    res.json(course);
  } catch (error) {
    console.error("Update Course Error:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * ================================
 * DELETE COURSE (TUTOR)
 * ================================
 */
exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);

    if (!course) return res.status(404).json({ message: "Course not found" });

    // Check ownership
    if (course.tutor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this course" });
    }

    await Course.findByIdAndDelete(id);
    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ================================
 * ADMIN: GET PENDING COURSES
 * ================================
 */
exports.getPendingCourses = async (req, res) => {
  try {
    const courses = await Course.find({ status: "pending" })
      .populate("tutor", "name email qualification");
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ================================
 * ADMIN: APPROVE/REJECT COURSE
 * ================================
 */
exports.approveRejectCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'approved' or 'rejected'

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const isApproved = status === "approved";
    const course = await Course.findByIdAndUpdate(
      id,
      { status, isApproved },
      { new: true }
    );

    if (!course) return res.status(404).json({ message: "Course not found" });

    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ================================
 * GET SINGLE COURSE (OPTIONAL)
 * ================================
 * GET /api/courses/:id
 */
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("tutor", "name qualification experience bio photo specialization");

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if requester is authorized to view full content
    // Tutors can see their own (unapproved) courses, Admins can see all.
    // Users can only see if approved.
    const isTutor = req.user?.id === course.tutor?._id.toString();
    const isAdmin = req.user?.role === 'admin';

    if (!course.isApproved && !isTutor && !isAdmin) {
      return res.status(403).json({ message: "Course is not yet approved" });
    }

    // Enrollment Check for users
    if (req.user?.role === 'user' && !isAdmin) {
      const Enrollment = require("../models/Enrollment");
      const isEnrolled = await Enrollment.findOne({ user: req.user.id, course: course._id });

      if (!isEnrolled) {
        // If not enrolled, we might want to return limited info (no lesson content)
        // For now, following the request to "put if user purchases... show visible"
        return res.status(403).json({ message: "Please enroll to access course content", enrolled: false });
      }
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
