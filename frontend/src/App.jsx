import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import TrainingSimulator from './pages/TrainingSimulator';
import Leaderboard from './pages/Leaderboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { Shield, LayoutDashboard, Trophy, LogOut } from 'lucide-react';
import './styles/App.css';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  if (!isAuthenticated) {
    return <Login />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <div className="app-container">
        <nav className="sidebar">
          <div className="brand">
            <Shield className="brand-icon" size={32} />
            <h2 className="gradient-text">PhishGuard</h2>
          </div>
          <ul className="nav-links">
            <li>
              <Link to="/" className="nav-item">
                <LayoutDashboard size={20} /> Dashboard
              </Link>
            </li>
            <li>
              <Link to="/training" className="nav-item">
                <Shield size={20} /> Training
              </Link>
            </li>
            <li>
              <Link to="/leaderboard" className="nav-item">
                <Trophy size={20} /> Leaderboard
              </Link>
            </li>
          </ul>
          <div className="nav-footer">
            <button className="logout-btn" onClick={() => {
              localStorage.removeItem('isAuthenticated');
              window.location.href = '/login';
            }}>
              <LogOut size={20} /> Logout
            </button>
          </div>
        </nav>
        <main className="main-content">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/training" element={<ProtectedRoute><TrainingSimulator /></ProtectedRoute>} />
            <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
