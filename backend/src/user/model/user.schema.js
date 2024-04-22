import UserModel from "./user.schema.js";
import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { ObjectId } from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "user name is requires"],
        maxLength: [30, "user name can't exceed 30 characters"],
        minLength: [2, "name should have atleast 2 charcters"],
      },
      email: {
        type: String,
        required: [true, "user email is requires"],
        unique: true,
        validate: [validator.isEmail, "pls enter a valid email"],
      },
      password: {
        type: String,
        required: [true, "Please enter your password"],
        select: false,
      },
      gender: {
        type: String,
        required: [true, "Please enter your gender"],
      }

})

const UserModel = mongoose.model("User", userSchema);
export default UserModel;