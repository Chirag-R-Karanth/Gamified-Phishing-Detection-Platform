import express from 'express';
import { 
  getMissions, 
  getMission, 
  submitMission,
  createMission,
  getLeaderboard,
  getAllMissions
} from '../controllers/mission.controller.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.middleware.js';

const router = express.Router();  // THIS MUST BE HERE FIRST!

// Routes AFTER router is created
router.get('/leaderboard', authenticateToken, getLeaderboard);
router.get('/all', authenticateToken, getAllMissions);  // ADD THIS LINE

// User routes
router.get('/', authenticateToken, getMissions);
router.get('/:id', authenticateToken, getMission);
router.post('/:missionId/submit', authenticateToken, submitMission);

// Admin routes
router.post('/create', authenticateToken, authorizeRole('admin', 'trainer'), createMission);

export default router;
