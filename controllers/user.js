import { Users } from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendCookie } from "../utils/features.js";
import Errorhandler from "../middleware/error.js";

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    let user = await Users.findOne({ email });

    if (user) {
      return next(new Errorhandler("User already exists", 400));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user = await Users.create({
      name,
      email,
      password: hashedPassword,
    });

    sendCookie(user, res, "Registered Successfully", 201);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    let user = await Users.findOne({ email }).select("+password");

    if (!user) {
      return next(new Errorhandler("User not exists, Register First", 400));
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return next(new Errorhandler("Invalid Email or Password", 400));
    }

    sendCookie(user, res, `Welcome Back ${user.name}`, 200);
  } catch (error) {
    next(error);
  }
};

// export const getAllUsers = async (req, res) => {};

export const getMyProfile = (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

export const logout = (req, res) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      sameSite : process.env.NODE_ENV === 'Development' ? 'lax' : 'none',
      secure : process.env.NODE_ENV === 'Development' ? false : true
    })
    .json({
      success: true,
      message: "Logged Out Successfully",
    });
};

