const mongoose = require("mongoose");

const ResumeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    title: { type: String, required: true },
    personal: {
        name: String,
        email: String,
        phone: String,
        summary: String,
    },
    experience: [
        {
            company: String,
            role: String,
            startDate: String,
            endDate: String,
            description: String,
        },
    ],
    education: [
        {
            institution: String,
            degree: String,
            year: String,
        },
    ],
    skills: [String],
    projects: [
        {
            title: String,
            link: String,
            description: String,
        }
    ],
    certificates: [
        {
            name: String,
            issuer: String,
            date: String,
        }
    ],
    template: { type: String, default: 'classic' },
}, { timestamps: true });


module.exports = mongoose.model('Resume', ResumeSchema);