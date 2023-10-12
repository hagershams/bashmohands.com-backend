// Imports
import express from 'express';
import {
  // forgetPassword,
  // register,
  signIn,
  // forgotPassword,
} from './authController.js';

// Router App
const router = express.Router();

// SEC Auth Endpoints

// Register endpoint
// router.post('/register', register);

// Sigin endpoint
router.post('/signin', signIn);

// Forget Password
// router.post('/forget-password', forgotPassword);

// // Reset Password
// router.get('/resetPassword/:reset-token');
// Router Expors
export default router;
