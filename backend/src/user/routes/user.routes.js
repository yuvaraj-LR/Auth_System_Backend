import express from "express"

import {
    userDetails,
    createNewUser,
    logoutUser,
    userLogin,
    forgetPassword,
    resetUserPassword,
    updatePassword,
    updateUserProfile
} from "../controller/user.controller.js"

const router = express.Router();

// GET routes
router.route("/getUserData/:id").get(userDetails)
router.route("/logout").get(logoutUser);

// POST routes
router.route("/signup").post(createNewUser);
router.route("/login").post(userLogin);
router.route("/password/forget").post(forgetPassword);

// PUT Routes
router.route("/password/reset/:token").put(resetUserPassword);
router.route("/password/update").put(updatePassword);
router.route("/profile/update/:id").put(updateUserProfile);

export default router;