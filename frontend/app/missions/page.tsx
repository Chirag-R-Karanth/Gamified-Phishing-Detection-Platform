'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/stores/authStore';
import { getMissions, Mission } from '@/lib/api/missions';

export default function MissionsPage() {
  const { user, token, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    fetchMissions();
  }, [isAuthenticated, router]);

  const fetchMissions = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const response = await getMissions(token);
      setMissions(response.data.missions);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!isAuthenticated || !user) return null;

  const getCategoryEmoji = (category: string) => {
    const emojis: any = {
      credential_theft: '🔐',
      malware: '🦠',
      business_compromise: '💼',
      gift_card_scam: '🎁',
      impersonation: '🎭',
      other: '📧'
    };
    return emojis[category] || '📧';
  };

  return (
    <>
      <style jsx>{`
        .page-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #1e1b4b 0%, #7c3aed 50%, #db2777 100%);
          padding: 0;
          margin: 0;
        }
        .header {
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(20px);
          padding: 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }
        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
        }
        .title {
          color: white;
          font-size: 32px;
          font-weight: 900;
          margin: 0 0 8px 0;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        .subtitle {
          color: #e9d5ff;
          font-size: 16px;
          margin: 0;
          font-weight: 500;
        }
        .button-group {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        .btn {
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 700;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 14px;
        }
         .btn-primary {
  background: linear-gradient(135deg, #60a5fa, #3b82f6);
  color: white;
  font-weight: 800;
  text-shadow: 0 1px 2px rgba(0,0,0,0.3);
  box-shadow: 0 4px 12px rgba(0,0,0,0.4);
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.6);
}
.btn-secondary {
  background: linear-gradient(135deg, #fde047, #facc15);
  color: #1e293b;
  font-weight: 900;
  text-shadow: none;
  box-shadow: 0 4px 12px rgba(0,0,0,0.4);
}
.btn-secondary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(250, 204, 21, 0.6);
  background: linear-gradient(135deg, #facc15, #fde047);
}

        .btn-outline {
          background: rgba(255, 255, 255, 0.15);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        .btn-outline:hover {
          background: rgba(255, 255, 255, 0.25);
        }
        .content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 32px 24px;
        }
        .stats-card {
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 24px;
          padding: 32px;
          margin-bottom: 32px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 24px;
          margin-bottom: 24px;
        }
        .stat-item {
          text-align: center;
        }
        .stat-value {
          font-size: 48px;
          font-weight: 900;
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
        }
        .stat-label {
          color: #e9d5ff;
          font-size: 14px;
          margin-top: 8px;
          font-weight: 600;
        }
        .progress-bar-container {
          margin-top: 20px;
        }
        .progress-info {
          display: flex;
          justify-content: space-between;
          color: #f3e8ff;
          font-size: 14px;
          margin-bottom: 8px;
          font-weight: 600;
        }
        .progress-bar {
          height: 14px;
          background: rgba(0, 0, 0, 0.4);
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #7c3aed, #db2777);
          border-radius: 12px;
          transition: width 0.5s ease;
          box-shadow: 0 0 10px rgba(124, 58, 237, 0.5);
        }
        .section-title {
          color: white;
          font-size: 28px;
          font-weight: 900;
          margin-bottom: 24px;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        .mission-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
        }
        .mission-card {
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          padding: 28px;
          transition: all 0.3s ease;
          cursor: pointer;
          text-decoration: none;
          display: block;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        }
        .mission-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(139, 92, 246, 0.5);
          border-color: rgba(255, 255, 255, 0.4);
        }
        .mission-header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 20px;
        }
        .mission-emoji {
          font-size: 56px;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
        }
        .difficulty-badge {
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          color: white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }
        .difficulty-1 {
          background: linear-gradient(135deg, #10b981, #34d399);
        }
        .difficulty-2 {
          background: linear-gradient(135deg, #f59e0b, #fbbf24);
        }
        .difficulty-3 {
          background: linear-gradient(135deg, #ef4444, #f87171);
        }
        .mission-title {
          color: white;
          font-size: 19px;
          font-weight: 700;
          margin: 0 0 12px 0;
          line-height: 1.4;
        }
        .mission-from {
          color: #e9d5ff;
          font-size: 14px;
          margin-bottom: 16px;
          font-weight: 500;
        }
        .mission-stats {
          display: flex;
          justify-content: space-between;
          color: #d8b4fe;
          font-size: 13px;
          padding-top: 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.2);
          font-weight: 600;
        }
        .loading {
          text-align: center;
          color: white;
          font-size: 18px;
          padding: 60px 0;
        }
        .error {
          background: rgba(239, 68, 68, 0.3);
          border: 1px solid rgba(239, 68, 68, 0.5);
          color: #fecaca;
          padding: 16px;
          border-radius: 12px;
          margin-bottom: 24px;
        }
      `}</style>

      <div className="page-container">
        <div className="header">
          <div className="header-content">
            <div>
              <h1 className="title">🎯 Phishing Training Missions</h1>
              <p className="subtitle">{user.name} • Level {user.level} • {user.xp} XP</p>
            </div>
            <div className="button-group">
              <Link href="/profile" className="btn btn-primary">
                👤 Profile
              </Link>
              <Link href="/leaderboard" className="btn btn-secondary">
                🏆 Leaderboard
              </Link>
              {(user.role === 'admin' || user.role === 'trainer') && (
                <Link href="/admin" className="btn btn-secondary">
                  🛡️ Admin
                </Link>
              )}
              <button onClick={handleLogout} className="btn btn-outline">
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="content">
          <div className="stats-card">
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-value">{user.level}</div>
                <div className="stat-label">Level</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{user.xp}</div>
                <div className="stat-label">Total XP</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{user.missions_completed?.length || 0}</div>
                <div className="stat-label">Completed</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{user.accuracy_rate || 0}%</div>
                <div className="stat-label">Accuracy</div>
              </div>
            </div>
            <div className="progress-bar-container">
              <div className="progress-info">
                <span>Progress to Level {user.level + 1}</span>
                <span><strong>{(user.level * 500) - user.xp} XP needed</strong></span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${(user.xp / (user.level * 500)) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {loading && <div className="loading">Loading missions...</div>}
          {error && <div className="error">⚠️ {error}</div>}

          {!loading && missions.length > 0 && (
            <>
              <h2 className="section-title">Available Missions</h2>
              <div className="mission-grid">
                {missions.map((mission) => (
                  <Link
                    key={mission._id}
                    href={`/missions/${mission._id}`}
                    className="mission-card"
                  >
                    <div className="mission-header">
                      <div className="mission-emoji">{getCategoryEmoji(mission.category)}</div>
                      <span className={`difficulty-badge difficulty-${mission.difficulty}`}>
                        Level {mission.difficulty}
                      </span>
                    </div>
                    <h3 className="mission-title">
                      Mission #{mission.mission_number}: {mission.title}
                    </h3>
                    <p className="mission-from">👤 From: {mission.ranger_name}</p>
                    <div className="mission-stats">
                      <span>🎯 {mission.total_attempts} attempts</span>
                      <span>✅ {mission.success_rate}% success</span>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
