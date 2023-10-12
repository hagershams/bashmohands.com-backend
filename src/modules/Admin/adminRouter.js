// Third Parties Imports
import express from 'express';

// Local Imports
import { createAdmin } from './adminController.js';
const router = express.Router();

/**
 * @desc    Create new admin route
 * @route   POST /api/admin
 * @access  Developers Only
 */
router.post('/', createAdmin);

export default router;
