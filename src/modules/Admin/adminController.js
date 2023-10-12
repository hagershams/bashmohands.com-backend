// Admin Controller
// Third Parties Imports
import argon from 'argon2';
import catchAsync from '../../../middlewares/utils/catchAsync.js';

// Local Imports
import { createAdminValidation } from './adminValidation.js';
import AppError from '../../../middlewares/error/appError.js';
import Response from '../../../middlewares/utils/response.js';
import prisma from '../../../Database/prisma/prismaClient.js';

/**
 * @desc    Create An Admin
 * @route   POST /api/admin
 * @access  Developers Only
 */
export const createAdmin = catchAsync(async (req, res, next) => {
  // Extract user input from req body
  const { firstName, lastName, email, password } = req.body;

  // Validate user input
  const { error, value } = createAdminValidation.validate({
    firstName,
    lastName,
    email,
    password,
  });
  if (error) return next(new AppError(error, 400));

  //   Hash password
  const hashedPassword = await argon.hash(password);

  // create new Admin
  const newAdmin = await prisma.admin.create({
    data: {
      firstName,
      lastName,
      email,
      password: hashedPassword,
    },
  });

  Response(res, 'Admin Created.', 201, newAdmin);
});
