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

//---------------------Different Functions----------------------------------------------------------------------//

// export const getAllUsers = async (req, res)=>{

//     const users = await Users.find({});
//     console.log(req.query);

//     res.json({
//         success : true,
//         users : users
//     })
// }

// export const register = async (req, res)=>{

//     const {name, email, password} = req.body;

//     await Users.create({
//         name, email, password
//     })

//     res.status(201).cookie('tokenP', 'valtok', {
//         httpOnly: true,
//     }).json({
//         success : true,
//         message : 'User created successfully',
//     })

// }

// export const getUserDetails = async (req, res)=>{
//     // const {id} = req.query;

//     const {id} = req.params
//     const user = await Users.findById(id);
//     console.log(req.params);

//     res.json({
//         success :true,
//         user
//     })
// }

// export const updateUser = async (req, res)=>{

//     const {id} = req.params
//     const user = await Users.findById(id);

//     res.json({
//         success :true,
//         message : 'Updated'
//     })
// }

// export const deleteUser = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const user = await Users.findById(id);
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found',
//       });
//     }

//     await Users.deleteOne({ _id: id });

//     res.json({
//       success: true,
//       message: 'User deleted successfully',
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Server error',
//       error: error.message,
//     });
//   }
// };
