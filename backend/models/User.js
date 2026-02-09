const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "tutor", "user"],
      default: "user",
    },
    qualification: {
      type: String,
      default: "",
    },
    experience: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    specialization: {
      type: String,
      default: "",
    },
    photo: {
      type: String,
      default: "",
    },
    isApprovedTutor: {
      type: Boolean,
      default: false,
    },
    tutorStatus: {
      type: String,
      enum: ["pending", "approved", "rejected", "not_submitted"],
      default: "not_submitted",
    },
    xp: {
      type: Number,
      default: 0,
    },
    level: {
      type: Number,
      default: 1,
    },
    badges: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

// Hash password before save (Mongoose v7+ compatible)
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
