import mongoose from 'mongoose';

const phishingDatasetSchema = new mongoose.Schema({
  message_content: {
    type: String,
    required: true
  },
  label: {
    type: String,
    enum: ['phishing', 'safe'],
    required: true
  },
  extracted_features: {
    type: Object, // Could be specific features like has_urls, urgent_words, etc.
    default: {}
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('PhishingDataset', phishingDatasetSchema);
