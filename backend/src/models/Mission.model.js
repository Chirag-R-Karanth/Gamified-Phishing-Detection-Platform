import mongoose from 'mongoose';

const missionSchema = new mongoose.Schema({
  // Basic Info
  title: {
    type: String,
    required: [true, 'Mission title is required'],
    trim: true
  },
  mission_number: {
    type: Number,
    required: true,
    unique: true
  },
  difficulty: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  category: {
    type: String,
    enum: ['credential_theft', 'malware', 'business_compromise', 'gift_card_scam', 'impersonation', 'other'],
    required: true
  },
  
  // Ranger Help Request
  ranger_name: {
    type: String,
    required: true
  },
  ranger_email: {
    type: String,
    required: true
  },
  ranger_request: {
    type: String,
    required: true
  },
  ranger_context_clue: {
    type: String
  },
  
  // Suspicious Email Content
  email_from: {
    type: String,
    required: true
  },
  email_subject: {
    type: String,
    required: true
  },
  email_body_html: {
    type: String,
    required: true
  },
  email_body_sanitized: {
    type: String
  },
  
  // Email Headers/Metadata
  email_headers: {
    from_header: String,
    to_header: String,
    reply_to: String,
    return_path: String,
    received_spf: String,
    dkim_signature: String,
    dmarc_status: String,
    message_id: String,
    date: String,
    x_mailer: String
  },
  
  // Correct Answer
  correct_verdict: {
    type: String,
    enum: ['phishing', 'legitimate'],
    required: true
  },
  
  // Red Flags / Clues
  clues: [{
    indicator: String,
    category: String,
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical']
    },
    explanation: String
  }],
  
  // Feedback Templates
  feedback_templates: {
    perfect_score: String,
    partial_score: String,
    failed: String
  },
  
  // Mission Status
  is_published: {
    type: Boolean,
    default: false
  },
  required_level: {
    type: Number,
    default: 1,
    min: 1
  },
  
  // Statistics
  total_attempts: {
    type: Number,
    default: 0
  },
  correct_attempts: {
    type: Number,
    default: 0
  },
  success_rate: {
    type: Number,
    default: 0
  },
  
  // Metadata
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: Date
}, {
  timestamps: true
});

// Index for faster queries
missionSchema.index({ is_published: 1, required_level: 1 });
missionSchema.index({ mission_number: 1 });
missionSchema.index({ category: 1 });

// Method to update success rate
missionSchema.methods.updateSuccessRate = function() {
  if (this.total_attempts === 0) {
    this.success_rate = 0;
  } else {
    this.success_rate = Math.round((this.correct_attempts / this.total_attempts) * 100);
  }
};

const Mission = mongoose.model('Mission', missionSchema);
export default Mission;
