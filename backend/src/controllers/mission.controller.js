import Mission from '../models/Mission.model.js';
import User from '../models/User.model.js';
import Submission from '../models/Submission.model.js';

// Badge definitions
const BADGES = {
  FIRST_MISSION: {
    id: 'first_mission',
    name: 'First Steps',
    icon: '🎯',
    description: 'Complete your first mission',
    requirement: (user) => user.total_missions >= 1
  },
  PERFECT_FIVE: {
    id: 'perfect_five',
    name: 'Perfect Five',
    icon: '⭐',
    description: 'Complete 5 missions with 100% accuracy',
    requirement: (user) => user.total_missions >= 5 && user.correct_verdicts >= 5
  },
  EAGLE_EYE: {
    id: 'eagle_eye',
    name: 'Eagle Eye',
    icon: '🦅',
    description: 'Maintain 100% accuracy across 10 missions',
    requirement: (user) => user.total_missions >= 10 && user.accuracy_rate === 100
  },
  LEVEL_FIVE: {
    id: 'level_five',
    name: 'Expert Ranger',
    icon: '👑',
    description: 'Reach Level 5',
    requirement: (user) => user.current_level >= 5
  },
  MISSION_MASTER: {
    id: 'mission_master',
    name: 'Mission Master',
    icon: '🏆',
    description: 'Complete all available missions',
    requirement: (user) => user.total_missions >= 10
  }
};

// Check and award new badges
async function checkAndAwardBadges(user) {
  const newBadges = [];
  const currentBadgeIds = user.badges.map(b => b.badge_id);

  for (const [key, badge] of Object.entries(BADGES)) {
    if (!currentBadgeIds.includes(badge.id) && badge.requirement(user)) {
      user.badges.push({
        badge_id: badge.id,
        name: badge.name,
        icon: badge.icon,
        earned_at: new Date()
      });
      newBadges.push(badge);
    }
  }

  return newBadges;
}


// Get all published missions for user
export const getMissions = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    const missions = await Mission.find({
      is_published: true,
      required_level: { $lte: user.current_level }
    })
    .select('-email_body_html -clues -correct_verdict -feedback_templates')
    .sort({ mission_number: 1 });

    res.json({
      success: true,
      data: { missions }
    });
  } catch (error) {
    console.error('Get missions error:', error);
    res.status(500).json({ error: 'Failed to fetch missions' });
  }
};

// Get single mission details
export const getMission = async (req, res) => {
  try {
    const { id } = req.params;
    
    const mission = await Mission.findById(id)
      .select('-correct_verdict -clues -feedback_templates');

    if (!mission) {
      return res.status(404).json({ error: 'Mission not found' });
    }

    // Check if user has required level
    const user = await User.findById(req.user._id);
    if (mission.required_level > user.current_level) {
      return res.status(403).json({ 
        error: 'Level requirement not met' 
      });
    }

    res.json({
      success: true,
      data: { mission }
    });
  } catch (error) {
    console.error('Get mission error:', error);
    res.status(500).json({ error: 'Failed to fetch mission' });
  }
};

// Submit mission verdict
export const submitMission = async (req, res) => {
  try {
    const { missionId } = req.params;
    const { verdict, selectedClues, timeSpent } = req.body;

    // Get mission and user
    const mission = await Mission.findById(missionId);
    const user = await User.findById(req.user._id);

    if (!mission) {
      return res.status(404).json({ error: 'Mission not found' });
    }

    // Check if mission is already done
    const existingSubmission = await Submission.findOne({
      user_id: user._id,
      mission_id: mission._id
    });

    if (existingSubmission) {
      return res.status(400).json({ 
        error: 'Mission already completed' 
      });
    }

    // Calculate score
    const isCorrect = verdict === mission.correct_verdict;
    const baseScore = 100;
    const difficultyMultiplier = 1 + (mission.difficulty * 0.25);

    let clueAccuracy = 0;
    if (selectedClues && mission.clues.length > 0) {
      const correctClues = selectedClues.filter(sc => 
        mission.clues.some(mc => mc.indicator === sc)
      );
      clueAccuracy = correctClues.length / mission.clues.length;
    }

    const finalScore = isCorrect 
      ? Math.round(baseScore * difficultyMultiplier * (0.7 + 0.3 * clueAccuracy))
      : 0;

    const xpEarned = finalScore;

    // Save submission
    const submission = new Submission({
      user_id: user._id,
      mission_id: mission._id,
      verdict,
      selected_clues: selectedClues || [],
      is_correct: isCorrect,
      score: finalScore,
      xp_earned: xpEarned,
      matched_clues: selectedClues || [],
      missed_clues: mission.clues.map(c => c.indicator),
      feedback_text: isCorrect 
        ? mission.feedback_templates?.perfect_score || 'Excellent job!' 
        : mission.feedback_templates?.failed || 'Review clues and try again.',
      time_spent_seconds: timeSpent || 0
    });

    await submission.save();

    // ✅ Update user stats
    user.xp_total += xpEarned;
    user.total_missions += 1;
    if (isCorrect) user.correct_verdicts += 1;

    // Recalculate level & accuracy
    user.calculateLevel();
    user.updateAccuracy();

    user.missions_completed.push({
      mission_id: mission._id,
      completed_at: new Date(),
      score: finalScore,
      verdict
    });

    // ✅ Add Recent Mission Tracking (NEW)
    const recentMission = {
      title: mission.title,
      score: finalScore,
      date: new Date()
    };

    // Push to array and limit to 5 recent missions (latest on top)
    user.recent_missions = [recentMission, ...(user.recent_missions || [])].slice(0, 5);

    // ✅ Check & award new badges
    const newBadges = await checkAndAwardBadges(user);

    // Save user
    await user.save();

    // ✅ Update mission stats
    mission.total_attempts += 1;
    if (isCorrect) mission.correct_attempts += 1;
    mission.updateSuccessRate();
    await mission.save();

    // ✅ Response
    res.json({
      success: true,
      data: {
        submission,
        xpEarned,
        newLevel: user.current_level,
        totalXp: user.xp_total,
        correctAnswer: mission.correct_verdict,
        clues: mission.clues,
        newBadges,
        recentMissions: user.recent_missions // now visible in frontend
      }
    });
    
  } catch (error) {
    console.error('Submit mission error:', error);
    res.status(500).json({ error: 'Failed to submit mission' });
  }
};


// Create mission (admin only)
export const createMission = async (req, res) => {
  try {
    const missionData = req.body;
    missionData.created_by = req.user._id;
    
    const mission = new Mission(missionData);
    await mission.save();

    res.status(201).json({
      success: true,
      message: 'Mission created successfully',
      data: { mission }
    });
  } catch (error) {
    console.error('Create mission error:', error);
    res.status(500).json({ error: 'Failed to create mission' });
  }
};

// Get leaderboard
export const getLeaderboard = async (req, res) => {
  try {
    const topUsers = await User.find({ is_active: true })
      .select('name department xp_total current_level accuracy_rate total_missions correct_verdicts')
      .sort({ xp_total: -1 })
      .limit(10);

    res.json({
      success: true,
      data: { leaderboard: topUsers }
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
};

// Get all missions (including locked ones for preview)
export const getAllMissions = async (req, res) => {
  try {
    const missions = await Mission.find({ is_published: true })
      .select('title mission_number difficulty category ranger_name required_level total_attempts success_rate')
      .sort({ mission_number: 1 });

    res.json({
      success: true,
      data: { missions }
    });
  } catch (error) {
    console.error('Get all missions error:', error);
    res.status(500).json({ error: 'Failed to fetch missions' });
  }
};

