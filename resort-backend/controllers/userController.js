const admin = require("../config/firebase-config");
const Users = require("../models/userModel");
const bcrypt = require("bcrypt");
const crypto = require('crypto');
const jwt = require("jsonwebtoken");

// register
exports.userRegister = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new Users({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
    });
    await newUser.save();
    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
};

// Login
exports.userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid Password" });
    }

    // token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(200).json({ message: "Login successful", token, id: user._id });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};

// update user details
exports.updateUserDetails = async ( req, res ) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;
    const updatedUser = await Users.findByIdAndUpdate(
      id,
      { name, email, password },
      { new : true}
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "user not found." });
    }
    res.status(200).json({
      message: "user updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user details:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}

// get user details
exports.getUserDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Users.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user details", error });
  }
};

// google signup
exports.googleSignUp = async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ message: "ID token is required" });
    }
    // Verify the Firebase ID token
    const token = await admin.auth().verifyIdToken(idToken);
    const { email, name } = token;
    const role = email === process.env.admin ? "admin" : "user";

    let user = await Users.findOne({ email });
    if (!user) {
      const randomPassword = crypto.randomBytes(16).toString('hex');
      user = new Users({
        name,
        email,
        password: randomPassword,
        role,
      });
      await user.save();
    }
    const loginToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Return user data
    res.status(200).json({
      message: "Google sign-up successful",
      loginToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error in Google sign-up:", error);
    res.status(500).json({ message: "Error during Google sign-up", error });
  }
};
