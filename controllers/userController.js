import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";

import User from "../model/userModel.js";
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
  UnAuthenticatedError,
} from "../middlewares/errors.js";

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    throw new BadRequestError("Please Provide all fields");

  const userExist = await User.findOne({ email });

  if (userExist) throw new ConflictError("User already exists , Please Login");

  const salt = await bcrypt.genSalt(10);
  const hashedpassword = await bcrypt.hash(password, salt);

  await User.create({
    name,
    email,
    password: hashedpassword,
  });

  res
    .status(StatusCodes.CREATED)
    .json({ success: `New user is created : ${name} ` });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const userExist = await User.findOne({ email });

  if (!userExist) throw new NotFoundError("User does't exists please , Signup");

  const verified = await userExist.comparePasswords(password);
  if (!verified) throw new BadRequestError("Invalid Credentials");

  const accessToken = jwt.sign(
    { userID: userExist._id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "30m" }
  );
  const refreshToken = jwt.sign(
    { userID: userExist._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "2d" }
  );

  await User.findOneAndUpdate(
    { _id: userExist._id },
    {
      refreshToken,
    }
  );

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    sameSite: "None",
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
  });
  res.status(StatusCodes.OK).json({ accessToken });
};

export const refreshTokenHandler = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) throw new UnAuthenticatedError("Invalid User");

  const refreshToken = cookies.jwt;

  const userExist = await User.findOne({ refreshToken });

  if (!userExist)
    throw new ForbiddenError("user is not allow to make this request");

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (
      err ||
      !mongoose.Types.ObjectId.isValid(decoded.userID) ||
      !userExist._id.equals(decoded.userID)
    )
      throw new ForbiddenError("user is not allow to make this request 2");

    const accessToken = jwt.sign(
      { userID: decoded.userID },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30m" }
    );

    res.status(StatusCodes.OK).json({ accessToken });
  });
};

export const userLogout = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    res.sendStatus(StatusCodes.NO_CONTENT);
  }

  const refreshToken = cookies.jwt;

  const userExist = await User.findOne({ refreshToken });

  if (!userExist) {
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });
    res.sendStatus(StatusCodes.NO_CONTENT);
  }

  await User.findOneAndUpdate(
    { refreshToken },
    {
      refreshToken: "",
    }
  );

  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });
  res.sendStatus(StatusCodes.NO_CONTENT);
};
