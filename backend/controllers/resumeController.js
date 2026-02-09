const Resume = require('../models/Resume');

// Create resume
const createResume = async (req, res) => {
    try {
        const resume = await Resume.create({
            ...req.body,
            userId: req.user._id
        });
        res.json(resume);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all resumes for a user
const getAllResumes = async (req, res) => {
    try {
        const resumes = await Resume.find({ userId: req.user._id }).sort({ updatedAt: -1 });
        res.json(resumes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get single resume
const getSingleResume = async (req, res) => {
    try {
        const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
        if (!resume) return res.status(404).json({ message: "Resume not found" });
        res.json(resume);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update resume
const updateResume = async (req, res) => {
    try {
        const resume = await Resume.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            req.body,
            { new: true }
        );
        if (!resume) return res.status(404).json({ message: "Resume not found" });
        res.json(resume);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createResume,
    getAllResumes,
    getSingleResume,
    updateResume,
};