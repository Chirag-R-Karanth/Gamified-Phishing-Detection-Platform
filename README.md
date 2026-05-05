# Gamified Phishing Detection Training Platform

A full-stack web application that helps users learn to identify phishing emails through interactive, gamified training while collecting gameplay data to train a machine learning model.

## 🎮 Features

- **Authentication System**: Secure signup/login with JWT and bcrypt
- **Interactive Training Simulator**: Gamified phishing detection challenges
- **Real-time Feedback**: Instant feedback with explanations
- **Analytics Dashboard**: Track accuracy, level, score, and progress
- **Leaderboard**: Compete with other users
- **ML Analytics Pipeline**: Adaptive difficulty and personalized training
- **Smooth Animations**: Anime.js for engaging UI transitions
- **Responsive Design**: Modern SaaS-style UI with soothing gradient theme

## 📁 Project Structure

```
phishing-detection-platform/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── styles/          # CSS files
│   │   ├── utils/           # Helper functions
│   │   ├── api/             # API calls
│   │   └── App.jsx
│   └── package.json
├── backend/                 # Node.js + Express server
│   ├── models/              # Mongoose schemas
│   ├── routes/              # API routes
│   ├── controllers/         # Route handlers
│   ├── middleware/          # Auth & validation
│   ├── config/              # Configuration files
│   ├── server.js            # Entry point
│   └── package.json
├── ml-model/               # Python ML pipeline
│   ├── train.py            # Model training
│   ├── predict.py          # Predictions
│   ├── feature_extraction.py
│   └── requirements.txt
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- Python (v3.8+)
- MongoDB (local or Atlas)

### Backend Setup
```bash
cd backend
npm install
# Create .env file with:
# MONGODB_URI=your_mongodb_uri
# JWT_SECRET=your_jwt_secret
# PORT=5000
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### ML Model Setup
```bash
cd ml-model
pip install -r requirements.txt
python train.py
```

## 📊 Database Schema

### Users Collection
```javascript
{
  username: String,
  email: String,
  password: String (hashed),
  level: Number,
  score: Number,
  accuracy: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Game Sessions Collection
```javascript
{
  user_id: ObjectId,
  total_questions: Number,
  correct_answers: Number,
  timestamp: Date
}
```

### Responses Collection
```javascript
{
  user_id: ObjectId,
  message_id: ObjectId,
  user_choice: String (phishing/safe),
  correct_answer: String,
  time_taken: Number,
  timestamp: Date
}
```

### Phishing Dataset Collection
```javascript
{
  message_content: String,
  label: String (phishing/safe),
  extracted_features: Object,
  created_at: Date
}
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### Training
- `POST /api/training/submit-response` - Submit training response
- `GET /api/training/message` - Get next phishing message

### Dashboard
- `GET /api/dashboard` - User dashboard data

### Leaderboard
- `GET /api/leaderboard` - Top users ranking

### ML Analytics
- `GET /api/analytics/predictions` - Get ML predictions

## 🎨 Design System

- **Color Theme**: Purple (#7C3AED) and Blue (#3B82F6) gradients
- **Layout**: Card-based with minimal text and icons
- **Responsive**: Mobile-first design
- **Animations**: Smooth transitions using Anime.js

## 📈 ML Features

- URL pattern analysis
- Keyword extraction (urgent, verify, login, etc.)
- Sender/domain pattern detection
- User behavior pattern learning
- Adaptive difficulty adjustment
- Weakness analysis and recommendations

## 🛠️ Technologies Used

### Frontend
- React 18
- Anime.js
- Axios
- CSS3

### Backend
- Node.js
- Express
- Mongoose
- JWT
- bcrypt

### ML
- Python
- scikit-learn
- pandas
- numpy

### Database
- MongoDB

## 📝 License

MIT
