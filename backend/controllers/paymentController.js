const Purchase = require("../models/Purchase");
const Enrollment = require("../models/Enrollment");
const Course = require("../models/Courses");
const crypto = require("crypto");

/**
 * Create Mock Order
 */
exports.createOrder = async (req, res) => {
    try {
        const { courseId } = req.body;
        const userId = req.user.id;

        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: "Course not found" });

        // Check if already enrolled
        const existingEnrollment = await Enrollment.findOne({ user: userId, course: courseId });
        if (existingEnrollment) {
            return res.status(400).json({ message: "Already enrolled in this course" });
        }

        // Generate a mock order ID
        const mockOrderId = `order_${crypto.randomBytes(8).toString('hex')}`;

        // Save initial purchase record
        const purchase = await Purchase.create({
            user: userId,
            course: courseId,
            orderId: mockOrderId,
            amount: course.price,
            status: "pending",
        });

        res.status(201).json({
            id: mockOrderId,
            amount: course.price,
            currency: "INR",
            courseName: course.title
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Process Simulated Payment
 */
exports.verifyPayment = async (req, res) => {
    try {
        const { orderId } = req.body;

        const purchase = await Purchase.findOne({ orderId });
        if (!purchase) {
            return res.status(404).json({ message: "Purchase record not found" });
        }

        if (purchase.status === "completed") {
            return res.status(400).json({ message: "Payment already processed" });
        }

        // Simulate successful processing
        purchase.status = "completed";
        purchase.paymentId = `pay_${crypto.randomBytes(8).toString('hex')}`;
        await purchase.save();

        // Create Enrollment
        await Enrollment.create({
            user: purchase.user,
            course: purchase.course,
        });

        res.status(200).json({ message: "Simulated payment successful" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get all purchases (Admin)
 */
exports.getAllPurchases = async (req, res) => {
    try {
        const purchases = await Purchase.find()
            .populate("user", "name email")
            .populate("course", "title price")
            .sort("-createdAt");
        res.json(purchases);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get tutor-specific purchases
 */
exports.getTutorPurchases = async (req, res) => {
    try {
        const tutorId = req.user.id;
        const tutorCourses = await Course.find({ tutor: tutorId }).select("_id");
        const courseIds = tutorCourses.map(c => c._id);

        const purchases = await Purchase.find({ course: { $in: courseIds }, status: "completed" })
            .populate("user", "name email")
            .populate("course", "title price")
            .sort("-createdAt");

        res.json(purchases);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
