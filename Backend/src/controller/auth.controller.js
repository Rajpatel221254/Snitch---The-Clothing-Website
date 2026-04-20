import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

function sendTokenResponse(user, res, message) {
  const token = jwt.sign(
    { id: user._id, email: user.email },
    config.JWT_SECRET,
    {
      expiresIn: "1d",
    },
  );

  res.cookie("token", token);

  res.status(201).json({
    message,
    user: {
      email: user.email,
      contact: user.contact,
      fullname: user.fullname,
      role: user.role,
    },
    token,
  });
}

export const register = async (req, res) => {
  try {
    const { email, contact, password, fullname, isSeller } = req.body;

    const existingUser = await userModel.findOne({
      $or: [{ email }, { contact }],
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email or contact already exists" });
    }

    const User = await userModel.create({
      email,
      contact,
      password,
      fullname,
      role: isSeller ? "seller" : "buyer",
    });

    await sendTokenResponse(User, res, "User registered successfully");
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    await sendTokenResponse(user, res, "Login successful");
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const googleAuthCallback = async (req, res) => {
  const { id, displayName, emails, photos } = req.user;
  const email = emails[0].value;
  const profilePic = photos[0].value;

  let user = await userModel.findOne({ email });

  if (!user) {
    user = await userModel.create({
      email,
      fullname: displayName,
      googleId: id,
    });
  }


  const token = jwt.sign(
    { id: user._id, email: user.email },
    config.JWT_SECRET,
    {
      expiresIn: "1d",
    },
  );

  res.cookie("token", token);

  res.redirect("http://localhost:5173"); // Redirect to homepage or dashboard after successful login
};
