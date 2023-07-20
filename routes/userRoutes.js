import express from "express";
import {
  loginUser,
  registerUser,
  refreshTokenHandler,
  userLogout,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/refresh", refreshTokenHandler);
router.get("/logout", userLogout);

export default router;
