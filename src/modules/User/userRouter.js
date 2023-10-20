// Third Parties Imports
import express from 'express';

// Local Imports
import {
  registerNewUser,
  uploadUserPhotos,
  resizeUserPhoto,
  uploadToCloud,
  getUser,
  getUserAvailability,
  setUserAvailability,
  updateUser,
} from '../User/userController.js';
import {
  isMine,
  authenticate,
} from '../../../middlewares/auth/Authentication.js';
const router = express.Router();

/**
 * @desc    Create new User route
 * @route   POST /api/user
 * @access  Public
 */
router.post('/', registerNewUser);
/**
 * @desc    Updatr User route
 * @route   PATCH POST /api/user/:userName/update
 * @access  User itself
 */
router.patch(
  '/:userName/update-info',
  isMine,
  uploadUserPhotos,
  resizeUserPhoto,
  uploadToCloud,
  updateUser
);
/**
 * @desc    Get User Profile route
 * @route   POST /api/user/:userName
 * @access  Public
 */
router.get('/:userName',
  authenticate,
  isMine,
  getUser
);
/**
 * @desc    Set User Availability
 * @route   GET /api/user/:userName/set-availabilty
 * @access   Public
 */
router.get(
  '/:userName/set-availability',
  authenticate,
  isMine,
  setUserAvailability
);
/**
 * @desc    Get User Availability
 * @route   GET /api/user/:userName/availabilty
 * @access   Public
 */
router.get('/:userName/availability', getUserAvailability);

export default router;
