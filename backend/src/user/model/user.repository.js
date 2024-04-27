import mongoose from "mongoose";
import UserModel from "./user.schema.js";

// Save a user in db.
export const createNewUserRepo = async (user) => {
    return await new UserModel(user).save();
}

// Find something in db.
export const findUserRepo = async (factor, withPassword = false) => {
    if(withPassword) return await UserModel.findOne(factor).select("+password");
    else return await UserModel.findOne(factor);
}

// Get all data from DB.
export const findUserListRepo = async() => {
    return await UserModel.find();
}

// Find the user by its hashtoken.
export const findUserForPasswordResetRepo = async (hashtoken) => {
    return await UserModel.findOne({
      resetPasswordToken: hashtoken,
      resetPasswordExpire: { $gt: Date.now() },
    });
  };

// Update user Details.
export const updateUserProfileRepo = async(userId, data) => {
    return await UserModel.findOneAndUpdate(userId, data, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });
}

// Store the resetPassword token.
export const requestForgetPassword = async(user, token) => {
    return await UserModel.updateOne(
        {email: user.email},
        {
            "resetPasswordToken": token,
            "resetPasswordExpire": Date.now() + 10 * 60 * 1000
        }
    )
}

// Reset the password.
export const resetPasswordRepo = async(user, password) => {
    return await UserModel.updateOne(
        {email: user.email},
        {password: password}
    )
}

// Send OTP
export const sendOTPRepo = async (user) => {
    try {
        
    } catch (error) {
        
    }
}