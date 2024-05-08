import express from "express"

import {
    getUserDetail,
    getAllUsers,
    userDetails,
    createNewUser,
    logoutUser,
    userLogin,
    forgetPassword,
    resetUserPassword,
    updatePassword,
    updateUserProfile,
    sendOTP,
    verifyOTP
} from "../controller/user.controller.js"

import {auth} from "../../../middleware/auth.js";

const router = express.Router();

// GET routes
router.route("/getDetails").get(getUserDetail);
router.route("/getAllUsers").get(auth, getAllUsers);
router.route("/:userId").get(userDetails)
router.route("/logout").get(logoutUser);

// POST routes
router.route("/signup").post(createNewUser);
router.route("/login").post(userLogin);
router.route("/password/forget").post(forgetPassword);
router.route("/login/sendOTP").post(sendOTP);
router.route("/login/verifyOTP").post(verifyOTP);

// PUT Routes/
router.route("/password/reset/:token").put(resetUserPassword);
router.route("/password/update").put(updatePassword);
router.route("/profile/update/:id").put(auth, updateUserProfile);

export default router;