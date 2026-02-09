const Challenge = require("../models/Challenge");
const User = require("../models/User");
const axios = require("axios");

const LANGUAGE_MAP = {
    javascript: 63,
    python: 71,
    java: 62,
    cpp: 54,
};

// Helper: Calculate XP needed for next level
const getXPForLevel = (level) => level * 100;

exports.getChallenges = async (req, res) => {
    try {
        const challenges = await Challenge.find().select("-testCases");
        res.json(challenges);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getChallengeById = async (req, res) => {
    try {
        const challenge = await Challenge.findById(req.params.id);
        if (!challenge) return res.status(404).json({ message: "Challenge not found" });
        res.json(challenge);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.submitChallenge = async (req, res) => {
    try {
        const { challengeId, code, language } = req.body;

        // Only users with role "user" can submit challenges
        if (req.user.role !== "user") {
            return res.status(403).json({ message: "Only students can submit challenges" });
        }

        const challenge = await Challenge.findById(challengeId);
        if (!challenge) return res.status(404).json({ message: "Challenge not found" });

        const languageId = LANGUAGE_MAP[language];
        if (!languageId) return res.status(400).json({ message: "Unsupported language" });

        const results = [];
        let allPassed = true;

        for (const testCase of challenge.testCases) {
            const submitRes = await axios.post(
                "https://ce.judge0.com/submissions?wait=true",
                {
                    source_code: code,
                    language_id: languageId,
                    stdin: testCase.input,
                },
                {
                    headers: { "Content-Type": "application/json" },
                }
            );

            const actualOutput = (submitRes.data.stdout || "").trim();
            const errorOutput = (submitRes.data.stderr || submitRes.data.compile_output || "").trim();
            const expectedOutput = (testCase.expectedOutput || "").trim();
            const passed = actualOutput === expectedOutput;

            if (!passed) allPassed = false;

            results.push({
                input: testCase.input,
                expected: expectedOutput,
                actual: actualOutput,
                error: errorOutput,
                passed,
                status: submitRes.data.status?.description,
            });
        }

        let xpAwarded = 0;
        let leveledUp = false;

        if (allPassed) {
            try {
                xpAwarded = 50;
                const user = await User.findById(req.user._id);
                if (user) {
                    user.xp = (user.xp || 0) + xpAwarded;

                    // Check level up (Level 1: 100, Level 2: 200, etc.)
                    const xpNeeded = getXPForLevel(user.level || 1);
                    if (user.xp >= xpNeeded) {
                        user.xp -= xpNeeded;
                        user.level = (user.level || 1) + 1;
                        leveledUp = true;
                    }
                    await user.save();
                    console.log(`XP Credited: User ${user.email} now has ${user.xp} XP and is Level ${user.level}`);
                }
            } catch (err) {
                console.error("XP Crediting Error:", err.message);
                // We don't fail the whole request if only XP awarding fails, 
                // but we should set xpAwarded back to 0 for the response.
                xpAwarded = 0;
            }
        }

        res.json({
            allPassed,
            results,
            xpAwarded,
            leveledUp
        });
    } catch (error) {
        console.error("Submission Error:", error.message);
        res.status(500).json({ message: "Challenge submission failed" });
    }
};
