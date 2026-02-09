const mongoose = require("mongoose");
const Chat = require("../models/Chat");
const Enrollment = require("../models/Enrollment");
const Course = require("../models/Courses");

// Helper to check if string is valid ObjectId
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// Send a message
exports.sendMessage = async (req, res) => {
    try {
        const { recipientId, courseId, message } = req.body;
        const senderId = req.user.id;

        if (!recipientId || !courseId || !message) {
            return res.status(400).json({ message: "Missing required fields (recipientId, courseId, message)" });
        }

        if (!isValidId(recipientId) || !isValidId(courseId)) {
            return res.status(400).json({ message: "Invalid ID format for recipient or course" });
        }

        // Optional: Verify enrollment if sender is a student
        if (req.user.role === "user") {
            const enrollment = await Enrollment.findOne({ user: senderId, course: courseId });
            if (!enrollment) {
                return res.status(403).json({ message: "You must be enrolled in this course to ask doubts." });
            }
        }

        const newMessage = new Chat({
            sender: senderId,
            recipient: recipientId,
            course: courseId,
            message,
        });

        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        console.error("DEBUG [sendMessage] Error:", error);
        res.status(500).json({ message: "Error sending message", error: error.message });
    }
};

// Get message history between two users for a specific course
exports.getMessages = async (req, res) => {
    try {
        const { otherUserId, courseId } = req.params;
        const userId = req.user.id;

        if (!isValidId(otherUserId) || !isValidId(courseId)) {
            console.error(`DEBUG [getMessages] Invalid IDs: otherUserId=${otherUserId}, courseId=${courseId}`);
            return res.status(400).json({ message: "Invalid ID format" });
        }

        const messages = await Chat.find({
            course: courseId,
            $or: [
                { sender: userId, recipient: otherUserId },
                { sender: otherUserId, recipient: userId },
            ],
        })
            .populate("sender", "name")
            .sort({ createdAt: 1 });

        res.status(200).json(messages);
    } catch (error) {
        console.error("DEBUG [getMessages] Error:", error);
        res.status(500).json({ message: "Error fetching messages", error: error.message });
    }
};

// Get list of students who have messaged a tutor for their courses
exports.getTutorDoubts = async (req, res) => {
    try {
        const tutorId = req.user.id;

        // Find all courses by this tutor
        const tutorCourses = await Course.find({ tutor: tutorId });
        const courseIds = tutorCourses.map(c => c._id);

        if (courseIds.length === 0) {
            return res.status(200).json([]);
        }

        // Find unique students who messaged this tutor for these courses
        const doubts = await Chat.aggregate([
            { $match: { recipient: new mongoose.Types.ObjectId(tutorId), course: { $in: courseIds } } },
            {
                $group: {
                    _id: "$sender",
                    lastMessage: { $last: "$message" },
                    lastTimestamp: { $last: "$createdAt" },
                    courseId: { $last: "$course" }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "studentInfo"
                }
            },
            {
                $lookup: {
                    from: "courses",
                    localField: "courseId",
                    foreignField: "_id",
                    as: "courseInfo"
                }
            },
            { $unwind: { path: "$studentInfo", preserveNullAndEmptyArrays: true } },
            { $unwind: { path: "$courseInfo", preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    studentName: { $ifNull: ["$studentInfo.name", "Unknown Student"] },
                    studentEmail: { $ifNull: ["$studentInfo.email", "N/A"] },
                    courseTitle: { $ifNull: ["$courseInfo.title", "Unknown Course"] },
                    lastMessage: 1,
                    lastTimestamp: 1,
                    courseId: 1,
                    studentId: "$_id"
                }
            },
            { $sort: { lastTimestamp: -1 } }
        ]);

        res.status(200).json(doubts);
    } catch (error) {
        console.error("DEBUG [getTutorDoubts] Error:", error);
        res.status(500).json({ message: "Error fetching doubts", error: error.message });
    }
};
