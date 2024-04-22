import UserModel from "./user.schema.js";
import mongoose from "mongoose";
import { ObjectId } from "mongoose";

const userSchema = new mongoose.Schema({

})

const UserModel = mongoose.model("User", userSchema);
export default UserModel;