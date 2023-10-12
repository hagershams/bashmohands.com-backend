import AppError from "../../utils/appError.js";
import HandleError from "../utils/errorHandler.js";
export const AuthorizationCheck = (...roles) => {
  return HandleError(async (req, res, next) => {
    if (!roles.includes(req.user.role.toLowerCase()))
      return next(
        new AppError(
          `You Are ${req.user.role}, Not Authorized To Access ..`,
          401
        )
      );
    next();
  });
};
