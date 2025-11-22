'use client';

import { useAuthStore } from '@/lib/stores/authStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Profile() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) return null;

  // Fallback for demonstration
  const recentMissions = user.recent_missions && user.recent_missions.length > 0
    ? user.recent_missions
    : [
      { title: "Suspicious PayPal Email", score: 105, date: "2025-10-21T22:45:00Z" },
      { title: "Amazon Account Suspension", score: 88, date: "2025-10-20T20:19:00Z" },
      { title: "Office 365 Password Expiring", score: 73, date: "2025-10-18T07:45:00Z" }
    ];

  return (
    <>
      <style jsx>{`
        .profile-bg {
          min-height: 100vh;
          background: linear-gradient(135deg, #312e81 0%, #8b5cf6 65%, #f472b6 100%);
          padding: 0;
          margin: 0;
        }
        .topbar {
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(14px);
          padding: 28px 0 20px 0;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .user-section {
          display: flex;
          align-items: center;
          gap: 18px;
          margin-bottom: 8px;
        }
        .user-avatar {
          background: linear-gradient(135deg,#fbbf24 10%,#a78bfa 90%);
          width: 70px;
          height: 70px;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.6rem;
          color: #fff;
          box-shadow: 0 4px 16px #8b5cf688;
        }
        .user-info {
          color: white;
        }
        .name {
          font-size: 2rem;
          font-weight: bold;
          margin-bottom: 5px;
        }
        .np {
          font-size: 13px;
          color: #f3e8ff;
        }
        .btn {
          padding: 8px 24px;
          border-radius: 12px;
          font-weight: bold;
          font-size: 15px;
          border: none;
          cursor: pointer;
          background: linear-gradient(135deg,#fbbf24,#f472b6);
          color: #312e81;
          margin-top: 18px;
          margin-bottom: 8px;
          box-shadow: 0 2px 10px #fbbf2488;
          transition: 0.2s;
        }
        .btn:hover {
          background: linear-gradient(135deg, #f472b6,#fbbf24);
        }
        .card-outer {
          max-width: 560px;
          margin: 40px auto 0 auto;
        }
        .card {
          background: rgba(35,16,58,0.82);
          border-radius: 28px;
          box-shadow: 0 8px 40px #312e8160;
          padding: 32px 40px 32px 40px;
          border: 1px solid #a78bfa44;
        }
        .level {
          color: #fde047;
          font-size: 34px;
          font-weight: bold;
          margin-bottom: 3px;
          text-align: center;
        }
        .xp-bar-container {
          margin: 15px 0 26px 0;
        }
        .xp-bar-labels {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #f3e8ff;
        }
        .xp-bar {
          height: 12px;
          background: #20123e;
          border-radius: 8px;
          overflow: hidden;
          margin-top: 4px;
        }
        .xp-bar-fill {
          height: 100%;
          border-radius: 8px;
          box-shadow: 0 0 10px #fbbf24;
          background: linear-gradient(90deg,#fbbf24,#a78bfa,#f472b6);
          transition: width 0.35s;
        }
        .statsRow {
          display: flex;
          justify-content: space-between;
          color: #fde047;
          margin: 26px 0 18px 0;
        }
        .statValue {
          font-size: 1.5rem;
          font-weight: 700;
        }
        .statLabel {
          color: #ddd6fe; 
          font-size: 14px;
          font-weight: 400;
        }
        .badgesTitle {
          font-size: 20px;
          color: #fbbf24;
          margin:28px 0 11px 0;
          font-weight: 700;
          text-align:center;
        }
        .badges {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          justify-content: center;
        }
        .badge {
          padding: 14px 18px;
          background: rgba(255,255,255,0.08);
          border-radius: 13px;
          color: #fff;
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 19px;
          border: 1px solid #fde04744;
        }
        .recent-title {
          margin-top: 30px;
          text-align: center;
          color: #fbbf24;
          font-weight: 700;
          font-size: 19px;
          letter-spacing: 0.02em;
        }
        .recent-list {
          margin: 17px 0 0 0;
          padding: 0;
          list-style: none;
        }
        .recent-mission {
          background: rgba(248, 113, 113, 0.07);
          margin: 0 0 7px 0;
          padding: 9px 14px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #f3e8ff;
          font-size: 15px;
          border: 1px solid #a78bfa33;
        }
        .recent-mission span:first-child {
          font-weight: 500;
          color: #fbbf24;
          flex: 1 1 50%;
        }
        .recent-mission span:nth-child(2) {
          color: #38bdf8;
          font-weight: 600;
          font-size: 15px;
        }
        .recent-mission span:last-child {
          color: #fef9c3;
          font-size: 13px;
          margin-left: 18px;
          flex-shrink: 0;
        }
      `}</style>
      <div className="profile-bg">
        <div className="topbar">
          <div className="card-outer">
            <div className="user-section">
              <div className="user-avatar">{user.name[0]?.toUpperCase()}</div>
              <div className="user-info">
                <div className="name">{user.name}</div>
                <div className="np">{user.email}</div>
                <div className="np">Level {user.level} • XP: {user.xp}</div>
              </div>
            </div>
            <button className="btn" onClick={()=>{
              logout(); router.push('/login');
            }}>Logout</button>
          </div>
        </div>
        <div className="card-outer">
          <div className="card">
            <div className="level">Level {user.level}</div>
            <div className="xp-bar-container">
              <div className="xp-bar-labels">
                <span>{user.xp} XP</span>
                <span>{user.level * 500 - user.xp} XP to level {user.level + 1}</span>
              </div>
              <div className="xp-bar">
                <div className="xp-bar-fill" style={{
                  width: `${(user.xp / (user.level * 500)) * 100}%`
                }}/>
              </div>
            </div>
            <div className="statsRow">
              <div>
                <div className="statValue">{user.xp}</div>
                <div className="statLabel">XP</div>
              </div>
              <div>
                <div className="statValue">{user.missions_completed?.length || 0}</div>
                <div className="statLabel">Completed</div>
              </div>
              <div>
                <div className="statValue">{user.accuracy_rate || 0}%</div>
                <div className="statLabel">Accuracy</div>
              </div>
            </div>
            <div className="badgesTitle">Badges Earned</div>
            <div className="badges">
              {(user.badges && user.badges.length > 0
                ? user.badges
                : [{ name: "No badges yet! Complete missions to earn badges.", icon: "🎖️" }]
              ).map((badge: any, i: number) => (
                <span className="badge" key={i}>
                  {badge.icon} {badge.name}
                </span>
              ))}
            </div>
            <div className="recent-title">Recent Missions</div>
            <ul className="recent-list">
              {recentMissions.map((m, i) => (
                <li key={i} className="recent-mission">
                  <span>{m.title}</span>
                  <span>{m.score} pts</span>
                  <span>{new Date(m.date).toLocaleDateString()} {new Date(m.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
