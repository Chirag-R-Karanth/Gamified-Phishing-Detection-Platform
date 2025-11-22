import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  // Basic Info
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  
  // Role-based access
  role: {
    type: String,
    enum: ['user', 'trainer', 'admin'],
    default: 'user'
  },
  department: {
    type: String,
    default: 'General'
  },
  
  // Gamification
  xp_total: {
    type: Number,
    default: 0,
    min: 0
  },
  current_level: {
    type: Number,
    default: 1,
    min: 1
  },
  badges: [{
  badge_id: String,
  name: String,
  icon: String,
  earned_at: {
    type: Date,
    default: Date.now
  }
}],

  
  // Mission tracking
  missions_completed: [{
    mission_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Mission'
    },
    completed_at: Date,
    score: Number,
    verdict: String
  }],
  
  
  // Statistics
  total_missions: {
    type: Number,
    default: 0
  },
  correct_verdicts: {
    type: Number,
    default: 0
  },
  accuracy_rate: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  
  // Account status
  is_active: {
    type: Boolean,
    default: true
  },
  last_login: Date,
  
  recent_missions: [{
  title: String,
  score: Number,
  date: Date
}],

  created_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash if password is modified
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to calculate level based on XP
userSchema.methods.calculateLevel = function() {
  const XP_THRESHOLDS = {
    1: 0,
    2: 500,
    3: 1000,
    4: 2000,
    5: 3500,
    6: 5500,
    7: 8000,
    8: 11000,
    9: 15000,
    10: 20000
  };
  
  const level = Object.keys(XP_THRESHOLDS)
    .reverse()
    .find(lvl => this.xp_total >= XP_THRESHOLDS[lvl]);
  
  this.current_level = parseInt(level) || 1;
  return this.current_level;
};

// Method to update accuracy rate
userSchema.methods.updateAccuracy = function() {
  if (this.total_missions === 0) {
    this.accuracy_rate = 0;
  } else {
    this.accuracy_rate = Math.round((this.correct_verdicts / this.total_missions) * 100);
  }
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

const User = mongoose.model('User', userSchema);
export default User;
