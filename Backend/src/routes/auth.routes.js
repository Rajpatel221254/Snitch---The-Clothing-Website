import express from "express";
import {
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

const router = express.Router();

router.post("/register", validateRegisterUser, register);

router.post("/login", validateLoginUser, login);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: config.NODE_ENV == "development" ? "http://localhost:5173/login" : "/login",
  }),
  googleAuthCallback,
);

export default router;
