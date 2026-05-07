import express from 'express';
import { getNextMessage, submitResponse } from '../controllers/trainingController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/message', protect, getNextMessage);
router.post('/submit-response', protect, submitResponse);

export default router;
