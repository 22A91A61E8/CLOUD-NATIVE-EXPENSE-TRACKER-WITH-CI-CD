
const User = require('../models/User')
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "1h" }); 
};

// Register User


exports.registerUser = async (req, res) => {
  const { fullName, email, password, profileImageUrl } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    console.log("Register route hit");

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User already exists");
      return res.status(400).json({ message: "Email already in use" });
    }

    console.log("Creating user...");
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = Date.now() + 10 * 60 * 1000;

    const user = await User.create({
      fullName,
      email,
      password,
      profileImageUrl,
      otp,
      otpExpiry,
    });

    console.log(`User created: ${user.email}`);
    console.log("Sending email...");
    const mail_message = `
Hi ${user.fullName},

Welcome to Cortexa!
To complete your registration and verify your email address, please use the following One-Time Password (OTP):

🔐 Your OTP: ${otp}

This OTP is valid for the next 10 minutes. Please do not share this code with anyone for your account's security.

If you didnt request this, please ignore this email or reach out to our support team.

Thank you,  
The Cortexa Team 
`;
    await sendEmail(email, "Welcome to Cortexa! Verify your email", mail_message);
    console.log("Email sent successfully");

    const token = generateToken(user._id);

    // ✅ Final response to frontend
    return res.status(201).json({
      message: "Registered. Please verify your email using OTP sent to your inbox.",
      user,
      token,
    });

  } catch (err) {
    console.error("❌ Registration failed:", err);
    return res.status(500).json({
      message: "Registration failed",
      error: err.message || "Unknown error",
    });
  }
};

// Login User
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
  if (!email || !password) { 
    return res.status(400).json({ message: "All fields are required" }); 
  }
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword (password))) { 
        return res.status(400).json({ message: "Invalid credentials" });
    }
    
    res.status(200).json({
        id: user._id,
        user,
        token: generateToken(user._id),
    });
  } catch (err){
    res
      .status (500) 
      .json({ message: "Error registering user", error: err.message });
  }
}; 

// Get User Info
exports.getUserInfo = async (req, res) => {
   try {
    const user = await User.findById(req.user.id).select("-password");
    
    if (!user) {
        return res.status(404).json({ message: "User not found" }); 
    }

    res.status(200).json(user);
  } catch (err){
    res
      .status (500) 
      .json({ message: "Error registering user", error: err.message });
  }
};


// controllers/authController.js
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
  return res.status(400).json({ message: "User not found" });
}

if (String(user.otp) !== String(otp)) {
  return res.status(400).json({ message: "Invalid OTP" });
}

if (user.otpExpiry < Date.now()) {
  return res.status(400).json({ message: "OTP expired" });
}


    user.isEmailVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.status(200).json({
      message: "Email verified successfully",
      token: generateToken(user._id),
      user,
    });
  } catch (err) {
    res.status(500).json({ message: "Verification failed", error: err.message });
  }
};


// exports.resendOtp = async (req, res) => {
//   const { email } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ message: "User not found" });

//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     const otpExpiry = Date.now() + 10 * 60 * 1000;

//     user.otp = otp;
//     user.otpExpiry = otpExpiry;
//     await user.save();

//     await sendEmail(email, "Your new OTP", `Your OTP is ${otp}`);

//     res.status(200).json({ message: "OTP sent again to your email" });
//   } catch (err) {
//     res.status(500).json({ message: "Resending OTP failed", error: err.message });
//   }
// // };
