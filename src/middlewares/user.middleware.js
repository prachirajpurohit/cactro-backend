import { ApiError } from "../utils/ApiError.js";

export const requireRole = (role) => {
  return (req, _, next) => {
    if (req.user.role !== role) {
      throw new ApiError(403, `Access denied. ${role} only!`);
    }
    next();
  };
};