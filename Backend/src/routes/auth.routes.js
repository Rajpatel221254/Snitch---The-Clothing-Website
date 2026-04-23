import express from "express";
import {
  getMe,
  googleAuthCallback,
  login,
  register,
} from "../controller/auth.controller.js";
import {
  validateRegisterUser,
  validateLoginUser,
} from "../validators/auth.validator.js";
import passport from "passport";
import { config } from "../config/config.js";
import { authenticateUser } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @route /api/auth/register
 * @desc Register a user
 * @access Public
 */
router.post("/register", validateRegisterUser, register);

/**
 * @route /api/auth/login
 * @desc Login a user
 * @access Public
 */
router.post("/login", validateLoginUser, login);

/**
 * @route /api/auth/me
 * @desc Get a logged-in user
 * @access Public
 */
router.get('/me',authenticateUser, getMe)

/**
 * @route /api/auth/google
 * @desc Register/login a user through GoogleAuth2.0
 * @access Public
 */
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

/**
 * @route /api/auth/google/callback
 * @desc Callback run after hittin /api/auth/google Api
 * @access Public
 */
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: config.NODE_ENV == "development" ? "http://localhost:5173/login" : "/login",
  }),
  googleAuthCallback,
);

export default router;
