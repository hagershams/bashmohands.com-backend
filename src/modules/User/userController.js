// User Controller

import { createUserValidation } from './userValidation.js';
import AppError from '../../../middlewares/error/appError.js';
import Response from '../../../middlewares/utils/response.js';
import catchAsync from '../../../middlewares/utils/catchAsync.js';
import upload from '../../../middlewares/services/uploads/multer.js';
import uploadFileToCloudMiddleware from '../../../middlewares/services/uploads/uploadToCloud.js';
import resizeImageMiddleware from '../../../middlewares/services/uploads/resizeImage.js';
import prisma from '../../../Database/prisma/prismaClient.js';
import argon from 'argon2';
import { createToken } from '../../../middlewares/auth/Authentication.js';

/**
 * @desc    Upload Photo Middleware
 */
export const uploadUserPhotos = upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'coverImage', maxCount: 1 },
]);
/**
 * @desc    Resize Image Using sharp
 */
export const resizeUserPhoto = resizeImageMiddleware(200, 200);
/**
 * @desc    Upload Photo Middleware
 */
export const uploadToCloud = uploadFileToCloudMiddleware;
/**
 * @desc    Register An User
 * @route   POST /api/user
 * @access   Public
 */
export const registerNewUser = catchAsync(async (req, res, next) => {
  // Extract Info from request body
  const { firstName, lastName, email, handler, password } = req.body;

  console.log(req.body);

  // Validate Info
  const { error, value } = createUserValidation.validate({
    firstName,
    lastName,
    email,
    handler,
    password,
  });

  if (error) return next(new AppError(error, 400));

  //   Hash password
  const hashedPassword = await argon.hash(password);

  // create New User
  const newUser = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      handler,
      password: hashedPassword,
    },
  });

  delete newUser.password;
  // create new token
  const token = createToken(newUser);
  if (!token) return next(new AppError('Something Went Wrong!'), 500);

  if (process.env.NODE_ENV == 'production') {
    res.cookie('a_token', token, {
      httpOnly: true, // Helps protect against cross-site scripting (XSS) attacks
      secure: true, // Set to 'true' if using HTTPS
      sameSite: 'Strict', // Protects against cross-site request forgery (CSRF) attacks
      maxAge: 3600000, // Cookie expiration time in milliseconds (e.g., 1 hour)
    });
  }
  // sign user in
  // Send Welcome Email
  // ..........
  // Send Response with created Token
  Response(res, 'User Logged in successfully.', 200, { newUser, token });
});

/**
 * @desc    Update An User
 * @route   PATCH /api/user/:userName/update
 * @access   Public
 */
export const updateUser = catchAsync(async (req, res, next) => {
  // Extract User info from request
  const {
    firstName,
    lastName,
    email,
    handler,
    phone,
    jobTitle,
    bio,
    country,
    experience,
    hourlyRate,
  } = req.body;

  // Cannot update password using this endpoint
  if (req.body.password)
    return next('Cannot update user password using this endpoint!', 400);
  // Validate Info

  const { error, value } = createUserValidation.validate({
    firstName,
    lastName,
    email,
    handler,
    phone,
    jobTitle,
    bio,
    country,
    experience,
    hourlyRate,
  });

  // Update User info
  const updatedUser = await prisma.user.update({
    where: {
      handler: req.params.userName,
    },
    data: {
      ...req.body,
      photo: req.userProfileImage,
      coverImage: req.userCoverImage,
    },
  });

  // Send Response
  Response(res, 'User Updated Successfully.', 200, updatedUser);
});

/**
 * @desc    Get ALL User
 * @route   GET /api/user
 * @access   Public
 */
export const getAllUsers = catchAsync(async (req, res, next) => {});

/**
 * @desc    Get An User
 * @route   GET /api/user/:userName
 * @access   Public
 */
export const getUser = catchAsync(async (req, res, next) => {
  // Get User Name From parameters
  const { userName } = req.params;

  // Fetch User Info from database
  let userTarget = await prisma.user.findUnique({
    where: {
      handler: userName,
    },
  });
  if (!userTarget)
    return next(new AppError('No user found with that userName!', 400));

  /**
   * If user is client, execlude teacher fields from response
   * else return the Whole response
   */

  if (userTarget.isInstructor)
    return Response(res, 'Instructor Info.', 200, userTarget);
  // Client Info
  userTarget = {
    id: userTarget.id,
    firstName: userTarget.firstName,
    lastName: userTarget.lastName,
    jobTitle: userTarget.jobTitle,
    bio: userTarget.bio,
    topics: userTarget.topics,
    photo: userTarget.photo,
    coverImage: userTarget.coverImage,
    hourlyRate: userTarget.hourlyRate,
    rating: userTarget.rating,
    country: userTarget.country,

    // handler: userTarget.handler,
    // email: userTarget.email,
    // phone: userTarget.phone,
    // NID_Verified: userTarget.NID_Verified,
  };

  Response(res, 'Client Info.', 200, userTarget);
});

/**
 * @desc    Delete An User
 * @route   DELETE /api/user/:id
 * @access   Admin
 */
export const deleteUser = catchAsync(async (req, res, next) => {});
/**
 * @desc    Set User Availability
 * @route   GET /api/user/:userName/set-availabilty
 * @access   Public
 */
export const setUserAvailability = catchAsync(async (req, res, next) => {
  // Get User Name From parameters
  const { userName } = req.params;

  // Fetch User Info from database
  let userTarget = await prisma.user.findUnique({
    where: {
      handler: userName,
    },
  });
  if (!userTarget)
    return next(new AppError('No user found with that userName!', 400));

  await prisma.user.update({
    where: {
      handler: userName,
    },
    data: { availability: !userTarget.availability },
  });
  Response(res, 'User Availability Set To True.', 200, {
    userAvailability: !userTarget.availability,
  });
});
/**
 * @desc    Get User Availability
 * @route   GET /api/user/:userName/availabilty
 * @access   Public
 */
export const getUserAvailability = catchAsync(async (req, res, next) => {
  // Get User Name From parameters
  const { userName } = req.params;

  // Fetch User Info from database
  let userTarget = await prisma.user.findUnique({
    where: {
      handler: userName,
    },
  });
  if (!userTarget)
    return next(new AppError('No user found with that userName!', 400));

  Response(res, 'User Availability Response.', 200, {
    userAvailability: userTarget.availability,
  });
});
