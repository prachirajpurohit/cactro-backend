import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Unauthorised request");
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(404, "Unauthorised");
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Err0r: ", error);
    throw new ApiError(401, error?.message || "Invalid  token");
  }
});