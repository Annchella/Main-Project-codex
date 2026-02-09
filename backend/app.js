const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/resumes", require("./routes/resumeRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));


app.use(cors());
app.use(express.json());
const compileRoutes = require("./routes/compileRoutes");
app.use("/api/compile", compileRoutes);
const liveClassRoutes = require("./routes/liveClassRoutes");

app.use("/api/live-classes", liveClassRoutes);
const aiRoutes = require("./routes/aiRoutes");
app.use("/api/ai", aiRoutes);
const challengeRoutes = require("./routes/challengeRoutes");
app.use("/api/challenges", challengeRoutes);
const aiInterviewRoutes = require("./routes/aiInterviewRoutes");
app.use("/api/ai-interview", aiInterviewRoutes);




const courseRoutes = require("./routes/courseRoutes");
app.use("/api/courses", courseRoutes);
const enrollmentRoutes = require("./routes/enrollmentRoutes");
app.use("/api/enrollments", enrollmentRoutes);
const paymentRoutes = require("./routes/paymentRoutes");
app.use("/api/payment", paymentRoutes);
const chatRoutes = require("./routes/chatRoutes");
app.use("/api/chats", chatRoutes);

module.exports = app;
