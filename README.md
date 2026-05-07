# Gamified Phishing Detection Training Platform

A full-stack web application that helps users learn to identify phishing emails through interactive, gamified training while collecting gameplay data to train a machine learning model.

## 🎮 Features

- **Authentication System**: Secure signup/login with JWT and bcrypt.
- **Interactive Training Simulator**: Gamified phishing detection challenges using real-world phishing datasets.
- **Real-time Feedback**: Instant feedback with explanations, dynamically tracked score, and leveling system.
- **Analytics Dashboard**: Track accuracy, level, score, and progress across all your agents.
- **Leaderboard**: Compete with other users globally for the top ranking.
- **ML Analytics Pipeline**: Custom-built Python pipeline comparing Logistic Regression, Random Forest, Gradient Boosting, and Support Vector Machine on highly realistic synthetic data.
- **Dynamic Visuals**: Beautiful SaaS-style UI with soothing dark gradients (`#0f172a` to `#1e1b4b`) and glassmorphism cards.
- **Smooth Animations**: Integrated `anime.js` for staggered micro-animations and interactive feedback (e.g., screen shakes on incorrect selections).

## 📁 Project Structure

```
phishing-detection-platform/
├── frontend/                 # React application (Vite)
│   ├── src/
│   │   ├── api/             # Axios instance with JWT interception
│   │   ├── pages/           # Dashboard, Simulator, Leaderboard, Auth
│   │   ├── styles/          # App and global CSS with animations
│   │   ├── App.jsx          # Protected routing logic
│   │   └── main.jsx         # Entry point
│   ├── package.json
│   └── vite.config.js
├── backend/                 # Node.js + Express server
│   ├── models/              # Mongoose schemas (User, PhishingDataset, etc.)
│   ├── routes/              # Auth, Training, Dashboard, Leaderboard API routes
│   ├── controllers/         # Route handlers
│   ├── middleware/          # JWT Auth validation
│   ├── config/              # MongoDB connection
│   ├── seed_data.js         # Initial realistic MongoDB seeder script
│   └── server.js            # Entry point
└── ml-model/               # Python ML pipeline
    ├── dataset.py          # Highly realistic synthetic data generator
    ├── train_lr.py         # Logistic Regression training
    ├── train_rf.py         # Random Forest training
    ├── train_gb.py         # Gradient Boosting training
    ├── train_svm.py        # Support Vector Machine training
    ├── compare_models.py   # Accuracy and time comparison tool
    └── requirements.txt
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- Python (v3.8+)
- MongoDB (local instance or Atlas connection string)

### Backend Setup
```bash
cd backend
npm install

# Setup your environment variables
cp .env.example .env
# Open .env and add your MongoDB Atlas string and a secure JWT Secret

# Seed the database with initial phishing scenarios
node seed_data.js

# Start the server (runs on port 5000)
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*(The frontend runs on port 3000 and automatically proxies `/api` requests to the backend).*

### ML Model Setup
```bash
cd ml-model
pip install -r requirements.txt

# Generate realistic data and compare all 4 algorithms
python compare_models.py
```

## 📊 Database Schema

### Users Collection
- `username`: String
- `email`: String
- `password`: String (hashed via bcrypt)
- `level`: Number
- `score`: Number
- `accuracy`: Number

### Game Sessions & Responses Collections
- `user_id`: ObjectId
- `message_id`: ObjectId
- `user_choice`: String (phishing/safe)
- `correct_answer`: String
- `time_taken`: Number

### Phishing Dataset Collection
- `message_content`: JSON String (From, Subject, Body)
- `label`: String (phishing/safe)
- `extracted_features`: Object

## 📈 ML Features

The `dataset.py` generator simulates a complex real-world phishing corpus, featuring:
- **`url_entropy`**: The character randomness of a URL.
- **`domain_age_days`**: Age of the domain (simulating short-lived malicious domains vs. compromised older domains).
- **`sender_domain_mismatch`**: Simulating spoofed headers.
- **`body_richness`**: The HTML-to-text ratio.
- **`has_https`**: Recognizing that many modern phishing attacks use valid SSL certificates.

Models evaluated include **Logistic Regression**, **Random Forest**, **Gradient Boosting**, and **SVM**.

## 🛠️ Technologies Used

- **Frontend**: React 18, Vite, React-Router, Anime.js, Axios, Lucide-React
- **Backend**: Node.js, Express, Mongoose, JWT, bcrypt
- **ML**: Python, scikit-learn, pandas, numpy
- **Database**: MongoDB

## 📝 License
MIT
