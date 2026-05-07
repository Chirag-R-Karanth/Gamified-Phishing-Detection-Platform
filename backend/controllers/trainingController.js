import PhishingDataset from '../models/PhishingDataset.js';
import Response from '../models/Response.js';
import User from '../models/User.js';

export const getNextMessage = async (req, res) => {
  try {
    // Basic implementation: get a random message
    // In a real scenario, this would use ML to pick an adaptive difficulty message
    const count = await PhishingDataset.countDocuments();
    if (count === 0) {
      return res.status(404).json({ message: 'No training messages available' });
    }
    const random = Math.floor(Math.random() * count);
    const message = await PhishingDataset.findOne().skip(random);
    
    res.json({
      _id: message._id,
      message_content: message.message_content,
      // Intentionally omitting 'label' so the user doesn't know the answer
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const submitResponse = async (req, res) => {
  try {
    const { message_id, user_choice, time_taken } = req.body;
    
    const message = await PhishingDataset.findById(message_id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    const isCorrect = message.label === user_choice;

    // Save response
    await Response.create({
      user_id: req.user.id,
      message_id,
      user_choice,
      correct_answer: message.label,
      time_taken
    });

    // Update user stats
    const user = await User.findById(req.user.id);
    user.score += isCorrect ? 10 : 0;
    
    // Simplistic level up logic
    if (user.score > user.level * 50) {
      user.level += 1;
    }
    await user.save();

    res.json({
      isCorrect,
      correct_answer: message.label,
      new_score: user.score,
      new_level: user.level,
      explanation: isCorrect ? 'Great job spotting the indicators!' : 'This was actually ' + message.label + '. Pay attention to URLs and urgency keywords.'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
