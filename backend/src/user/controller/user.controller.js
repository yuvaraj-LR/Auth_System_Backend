import { encryptedPwd, passwordMatch } from "../../../middleware/encryptPwd.js";
import { sendPasswordResetEmail } from "../../../utils/email/passwordReset.js";
import { sendWelcomeEmail } from "../../../utils/email/welcomeMail.js";
import { sendOTPForLogin } from "../../../utils/email/sendLoginOTP.js";
import { ErrorHandler } from "../../../utils/errorHandler.js";
import { sendToken } from "../../../utils/sendToken.js";

import {
    createNewUserRepo,
    findUserRepo,
    findUserListRepo,
    updateUserProfileRepo,
    requestForgetPassword,
    findUserForPasswordResetRepo,
    resetPasswordRepo,
    sendOTPRepo
} from "../model/user.repository.js"

export const createNewUser = async(req, res, next) => {
    try {
        const {name, email, password} = req.body;

        let user = {
            name, 
            email,
            "password": await encryptedPwd(password)
        }

        // Save a new user.
        const newUser = await createNewUserRepo(user);
        await sendToken(newUser, res, 200);

        // Send a welcme mail.
        await sendWelcomeEmail(newUser);
    } catch (err) {
        //  handle error for duplicate email
        if (err.name === 'MongoServerError' && err.code === 11000) {
            return next(new ErrorHandler(400, "Email is already registered."));
        }else {
            return next(new ErrorHandler(400, err));
        }
    }
}

export const userLogin = async(req, res, next) => {
    const {email, password} = req.body;

    // If no email and password.
    if(!email || !password) {
        return next(new ErrorHandler(400, "Please enter email and password."))
    }

    // If no user found.
    const user = await findUserRepo({email}, true);
    if (!user) {
        return next(
            new ErrorHandler(401, "user not found! please register!!")
        );
    }

    // Check for password.
    const isPasswordMatch = await passwordMatch(password, user.password);
    if (!isPasswordMatch) {
        return next(new ErrorHandler(401, "Invalid passsword!"));
    }

    // After successful login, send token.
    await sendToken(user, res, 200);
}

export const getAllUsers = async(req, res, next) => {
    const userData = await findUserListRepo();
    console.log(userData, "dataaa....");

    // Check for no user.
    if(!userData) {
        return next(
            new ErrorHandler(401, "No users available, expect you.")
        );
    }

    return res.status(200).json({
        success: true,
        userData: userData
    })
}

export const userDetails = async(req, res, next) => {
    const {userId} = req.params;
    
    // If no user found.    
    const user = await findUserRepo({_id: userId}, true);
    if (!user) {
        return next(
            new ErrorHandler(401, "user not found! please register!!")
        );
    }

    return res.status(200).json({
        success: true,
        userData: user
    });
}

export const logoutUser = async(req, res, next) => {
    res
    .status(200)
    .cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({ success: true, msg: "Logout Successful." });
}

export const updateUserProfile = async(req, res, next) => {
    const { name, email } = req.body;

    try {
        const updatedUserDetails = await updateUserProfileRepo(req.user._id, {
        name,
        email,
        });
        res.status(201).json({ success: true, updatedUserDetails });
    } catch (error) {
        return next(new ErrorHandler(400, error));
    }
}

export const updatePassword = async(req, res, next) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    console.log(currentPassword, newPassword, confirmPassword);

    try {
        // If no currentpassword given.
        if(!currentPassword) {
            return next(new ErrorHandler(401, "pls enter current password"));
        }

        const user = await findUserRepo({ _id: req.user._id }, true);
        // If currentPassword mismatch.
        const passwordMatched = await passwordMatch(currentPassword, user.password);
        if (!passwordMatched) {
            return next(new ErrorHandler(401, "Incorrect current password!"));
        }

        // New and confirm password mismatch.
        if(!newPassword || newPassword != confirmPassword) {
            return next(new ErrorHandler(401, "new password and confirm password are mismatch."));
        }

        // Save to db.
        user.password = await encryptedPwd(newPassword);
        await user.save();
        await sendToken(user, res, 200);
    } catch (error) {
        return next(new ErrorHandler(400, error));
    }
}

export const forgetPassword = async(req, res, next) => {
    const {email} = req.body;

    // If no email is provided.
    if(!email) {
        return next(new ErrorHandler(400, "Please provide email."));
    }

    // If no user is found.
    let user = await findUserRepo({email});
    if(!user) {
        return res.status(404).json({success: false, msg: "No such user found."})
    }

    // Check if there is an existing reset password token and if it has expired
    if (user.resetPasswordToken && user.resetPasswordExpire > Date.now()) {
        return res.status(400).json({ success: false, msg: "Token already exists." });
    }

    let token = await user.getResetPasswordToken();
    await sendPasswordResetEmail(user, token);
    
    await requestForgetPassword(user, token);

    return res.status(200).json({success: true, msg: "Reset password link has been sent to your registered email."})
}

export const resetUserPassword = async(req, res, next) => {
    try {
        const {token} = req.params;
        console.log(token, "tokenennn..");
    
        const user = await findUserRepo({"resetPasswordToken": token});
        await findUserForPasswordResetRepo(token);
    
        const {password, confirmPassword} = req.body;
    
        if(password != confirmPassword) {
            return next(new ErrorHandler(400, "Mismatch password and confirmPassword."));
        }
    
        let encryptedPass = await encryptedPwd(password);
        await resetPasswordRepo(user, encryptedPass);
    
        return res.status(200).json({success: true, msg: "Password reset successfully."})
    } catch (error) {
        return next(new ErrorHandler(400, error));
    }
}

export const sendOTP = async(req, res, next) => {
    try {
        const { email } = req.body;

        // If no email and password.
        if(!email) {
            return next(new ErrorHandler(400, "Please enter email."))
        }

        // If no user found.
        const user = await findUserRepo({email}, true);
        if (!user) {
            return next(
                new ErrorHandler(401, "user not found! please register!!")
            );
        }

        const otp = Math.floor(100000 + Math.random() * 900000);

        user.otp = otp;
        user.otpExpired = Date.now() + (15 * 60 * 1000);
        await user.save();

        await sendOTPForLogin(user, otp);
        
        return res.status(200).json({
            status: true,
            msg: "OTP sent to mail successfully.",
        });
    } catch (error) {
        return next(new ErrorHandler(400, error));
    }
}

export const verifyOTP = async(req, res, next) => {
    try {
        const {email, otp} = req.body;

        // If no email and password.
        if(!email || !otp) {
            return next(new ErrorHandler(400, "Please enter email and OTP."));
        }

        // If no user found.
        const user = await findUserRepo({email}, true);
        if (!user) {
            return next(
                new ErrorHandler(401, "user not found! please register!!")
            );
        }

        const checkOTP = user.otp === otp;
        const validTime = user.otpExpired < Date.now();

        if(!checkOTP) {
            return res.status(400).json({
                success: false,
                msg: "OTP mismatch."
            })
        }
        
        if(validTime) {
            return res.status(400).json({
                success: "false",
                msg: "OTP time expired."
            })
        }

        await sendToken(user, res, 200);
    } catch (error) {
        return next(new ErrorHandler(400, error));
    }

}
