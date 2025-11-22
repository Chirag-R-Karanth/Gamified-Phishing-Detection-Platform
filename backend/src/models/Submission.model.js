import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mission_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mission',
    required: true
  },
  
  // User's answer
  verdict: {
    type: String,
    enum: ['phishing', 'legitimate'],
    required: true
  },
  
  // User's selected clues/indicators
  selected_clues: [{
    indicator: String,
    category: String
  }],
  
  // Scoring
  is_correct: {
    type: Boolean,
    required: true
  },
  score: {
    type: Number,
    required: true,
    min: 0
  },
  xp_earned: {
    type: Number,
    required: true,
    min: 0
  },
  
  // Feedback
  matched_clues: [String],
  missed_clues: [String],
  feedback_text: String,
  
  // Timing
  time_spent_seconds: {
    type: Number,
    min: 0
  },
  submitted_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate submissions
submissionSchema.index({ user_id: 1, mission_id: 1 }, { unique: true });

const Submission = mongoose.model('Submission', submissionSchema);
export default Submission;
