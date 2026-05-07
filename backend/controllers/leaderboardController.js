import User from '../models/User.js';

export const getLeaderboard = async (req, res) => {
  try {
    // Top 10 users by score
    const topUsers = await User.find({})
      .select('username score level accuracy')
      .sort({ score: -1 })
      .limit(10);
      
    res.json(topUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
