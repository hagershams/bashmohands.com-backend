import jwt from 'jsonwebtoken';
import AppError from '../error/appError.js';
import catchAsync from '../utils/catchAsync.js';
import prisma from '../../Database/prisma/prismaClient.js';

//After Sign In .. Creating session token
export const createToken = user => {
  let { id, email, firstName, lastName, handler } = user; //changable    //user means (admin - instractor - client)
  let iat = Date.now();
  let token = jwt.sign(
    { id, email, firstName, lastName, handler, iat },
    process.env.TOKEN_SECRET,
    { expiresIn: process.env.TOKEN_EXPIRES_IN }
  ); //any change in keys?    //the private key
  return token;
};

export const authenticate = catchAsync(async (req, res, next) => {
  /**
   * Desc Get token from cookie if production
   *      Get token from header if development
   */
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else {
    throw new AppError('Token Is not found, please provide one!', 400);
  }

  //Step 2 ==> Verify Token
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    if (!decoded) return next(new AppError('Not Valied Token ..', 403));
  } catch (error) {
    return next(new AppError('Invalid Token!', 403));
  }

  //Step 3 ==> User of Token is exist or not ... Adding role
  console.log(decoded);

  let user = await prisma.user.findUnique({ where: { id: decoded.id } });

  if (!user) return next(new AppError('Not-Exist User Of This Token..', 404));
  //console.log(user);

  //Step 4 ==> Check Token Creation Time
  if (user.changePasswordAt) {
    let ChangeTime = parseInt(user.changePasswordAt.getTime() / 1000);
    //console.log(ChangeTime , '-------',decoded.iat/1000);
    if (ChangeTime > decoded.iat / 1000)
      return next(new AppError('Not Valied Token As Password Changed ..', 403));
  }

  //Step 5 ==> Check Last Log out Time
  if (user.loggedOutAt) {
    let LogOutTime = parseInt(user.loggedOutAt.getTime() / 1000);
    //console.log(LogOutTime , '-------',decoded.iat/1000);
    if (LogOutTime > decoded.iat / 1000)
      return next(new AppError('Not Valied Token You have Logged Out..', 403));
  }
  req.user = user;
  next();
});

export const isMine = catchAsync(async (req, res, next) => {
  if (req.user.role === 'ADMIN') return next();
  else if (req.params.userName == req.user.handler) {
    console.log(req.params.userName, req.user.handler);

    return next();
  } else
    return next(
      new AppError('You donot have access to perform this action', 403)
    );
});
