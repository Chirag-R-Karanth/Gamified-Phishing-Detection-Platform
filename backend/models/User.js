import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  level: {
    type: Number,
    default: 1
  },
  score: {
    type: Number,
    default: 0
  },
  accuracy: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
