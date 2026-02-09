const mongoose = require("mongoose");
const Challenge = require("./models/Challenge");
require("dotenv").config();

const challenges = [
    {
        title: "Sum of Two Numbers",
        description: "Write a function that takes two numbers as input and returns their sum.",
        difficulty: "Easy",
        baseCode: "// Read a and b from stdin\n// Example: const [a, b] = fs.readFileSync(0, 'utf8').split(' ').map(Number);\n// console.log(a + b);",
        testCases: [
            { input: "1 2", expectedOutput: "3" },
            { input: "10 20", expectedOutput: "30" },
        ],
    },
    {
        title: "Check Even or Odd",
        description: "Write a program that reads an integer and prints 'Even' if it is even, and 'Odd' if it is odd.",
        difficulty: "Easy",
        baseCode: "// Read n from stdin\n// Example: const n = parseInt(fs.readFileSync(0, 'utf8'));",
        testCases: [
            { input: "4", expectedOutput: "Even" },
            { input: "7", expectedOutput: "Odd" },
            { input: "0", expectedOutput: "Even" },
        ],
    },
    {
        title: "Max of Three Numbers",
        description: "Read three integers separated by spaces and print the largest one.",
        difficulty: "Easy",
        baseCode: "// Example: const nums = fs.readFileSync(0, 'utf8').split(' ').map(Number);",
        testCases: [
            { input: "5 12 8", expectedOutput: "12" },
            { input: "-1 -5 -3", expectedOutput: "-1" },
            { input: "100 100 50", expectedOutput: "100" },
        ],
    },
    {
        title: "Find String Length",
        description: "Read a string from input and print its length.",
        difficulty: "Easy",
        baseCode: "// Example: const str = fs.readFileSync(0, 'utf8').trim();",
        testCases: [
            { input: "LearnFlek", expectedOutput: "9" },
            { input: "AI", expectedOutput: "2" },
            { input: "Antigravity", expectedOutput: "11" },
        ],
    },
    {
        title: "Leap Year Checker",
        description: "Read a year and print 'true' if it's a leap year, otherwise 'false'.",
        difficulty: "Easy",
        baseCode: "// A year is leap if divisible by 4 but not 100, or divisible by 400.",
        testCases: [
            { input: "2024", expectedOutput: "true" },
            { input: "2023", expectedOutput: "false" },
            { input: "2000", expectedOutput: "true" },
            { input: "1900", expectedOutput: "false" },
        ],
    },
    {
        title: "Reverse a String",
        description: "Write a function that reverses the given string.",
        difficulty: "Medium",
        baseCode: "function reverseString(str) {\n  // Write your code here\n}",
        testCases: [
            { input: "hello", expectedOutput: "olleh" },
            { input: "world", expectedOutput: "dlrow" },
        ],
    },
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        await Challenge.deleteMany({});
        await Challenge.insertMany(challenges);
        console.log("Challenges seeded successfully!");
        process.exit();
    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
};

seedDB();
