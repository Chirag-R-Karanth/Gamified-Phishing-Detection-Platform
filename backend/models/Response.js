import mongoose from 'mongoose';

const responseSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PhishingDataset',
    required: true
  },
  user_choice: {
    type: String,
    enum: ['phishing', 'safe'],
    required: true
  },
  correct_answer: {
    type: String,
    enum: ['phishing', 'safe'],
    required: true
  },
  time_taken: {
    type: Number,
    required: true // Time in milliseconds or seconds
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Response', responseSchema);
