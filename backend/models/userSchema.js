import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First Name Is Required!"],
    trim: true,
    minLength: [3, "First Name Must Contain At Least 3 Characters!"],
  },
  lastName: {
    type: String,
    trim: true,
    default: "",
    validate: {
      validator: function (value) {
        return !value || value.length >= 3;
      },
      message: "Last Name Must Contain At Least 3 Characters!",
    },
  },
  email: {
    type: String,
    required: [true, "Email Is Required!"],
    unique: true,                // Ensure no duplicates
    lowercase: true,             // Save lowercase
    trim: true,
    validate: [validator.isEmail, "Provide A Valid Email!"],
  },
  phone: {
    type: String,
    required: function () {
      return !this.authProvider;
    },
    unique: true,                // Optional: prevent duplicate numbers
    validate: {
      validator: function (v) {
        return !v || /^[6-9]\d{9}$/.test(v); // India format: 10 digits, start 6-9
      },
      message: "Phone Number Must Be Exactly 10 Digits!",
    },
  },
  dob: {
    type: Date,
  },
  gender: {
    type: String,
    required: function () {
      return !this.authProvider;
    },
    enum: ["Male", "Female"],
  },
  password: {
    type: String,
    required: function () {
      return !this.authProvider;
    },
    minLength: [8, "Password Must Contain At Least 8 Characters!"],
    select: false,
  },
  role: {
    type: String,
    required: [true, "User Role Required!"],
    enum: ["Patient", "Doctor", "Admin"],
  },
  doctorDepartment: {
    type: String,
  },
  docAvatar: {
    public_id: String,
    url: String,
  },
  authProvider: {
    type: String,
    enum: ["google", "github", null],
    default: null,
  },
  providerId: {
    type: String,
    default: null,
  },
});

// Password Hashing
userSchema.pre("save", async function (next) {
  if (!this.password || !this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

// Password Comparison
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// JWT Token
userSchema.methods.generateJsonWebToken = function () {
  const jwtSecret = process.env.JWT_SECRET_KEY || process.env.JWT_SECRET;
  return jwt.sign({ id: this._id }, jwtSecret, {
    expiresIn: process.env.JWT_EXPIRES || "7d",
  });
};

export const User = mongoose.model("User", userSchema);
