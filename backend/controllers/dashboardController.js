import User from '../models/User.js';
import Response from '../models/Response.js';

export const getDashboardData = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const totalResponses = await Response.countDocuments({ user_id: req.user.id });
    const correctResponses = await Response.countDocuments({ 
      user_id: req.user.id, 
      $expr: { $eq: ["$user_choice", "$correct_answer"] } 
    });

    const accuracy = totalResponses > 0 ? (correctResponses / totalResponses) * 100 : 0;

    // Update user accuracy
    user.accuracy = accuracy;
    await user.save();

    // Fetch 5 most recent responses
    const recentActivity = await Response.find({ user_id: req.user.id })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      user,
      stats: {
        totalResponses,
        correctResponses,
        accuracy: accuracy.toFixed(2)
      },
      recentActivity
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
