// Sign in
import argon from 'argon2';
import prisma from '../../Database/prisma/prismaClient.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../error/appError.js';
import { createToken } from './Authentication.js';
import Response from '../utils/response.js';

export const signIn = catchAsync(async (req, res, next) => {
  // Get email & password from request
  const { email, password } = req.body;

  if (!email || !password)
    return next(new AppError('Please Provide valid email and password!', 400));
  // check if user exists
  let user = await prisma.user.findUnique({ where: { email } });

  // check if password & email match
  if (!user || !(await argon.verify(user.password, password)))
    return next(new AppError('Wrong Email or Password! Sign Up insted?!'), 404);

  // create new token
  const token = createToken(user);
  if (!token) return next(new AppError('Something Went Wrong!'), 500);

  // sign user in
  // Send Welcome Email
  // ..........
  // Send Response with created Token
  Response(res, 'User Logged in successfully.', 200, { user, token });
});
