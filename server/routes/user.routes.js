import express from 'express';
import {
  getUserProfile,
  updateProfile,
} from '../controllers/user.controller.js';
import protect from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/:username', getUserProfile);
router.put('/profile', protect, updateProfile);

export default router;
