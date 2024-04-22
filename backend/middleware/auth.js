import jwt from "jsonwebtoken";

import UserModel from "../src/user/model/user.schema.js"
import { ErrorHandler } from "../utils/errorHandler.js";

export const auth = async (req, res, next) => {
    const { token } = req.cookies;
    
    if (!token) {
      return next(new ErrorHandler(401, "login to access this route!"));
    }

    const decodedData = await jwt.verify(token, process.env.JWT_SCERET);
    req.user = await UserModel.findById(decodedData.id);
    next();
  };