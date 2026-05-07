import React, { useEffect, useRef, useState } from 'react';
import anime from 'animejs';
import api from '../api/axios';

const Dashboard = () => {
  const cardRef = useRef(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/dashboard');
        setDashboardData(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!loading && cardRef.current) {
      anime({
        targets: cardRef.current.children,
        translateY: [20, 0],
        opacity: [0, 1],
        delay: anime.stagger(100),
        easing: 'easeOutElastic(1, .8)',
        duration: 800
      });
    }
  }, [loading]);

  if (loading) {
    return <div className="dashboard"><h1 className="gradient-text">Loading Data...</h1></div>;
  }

  const { user, stats, recentActivity } = dashboardData || { user: { level: 0, score: 0 }, stats: { accuracy: '0.00' }, recentActivity: [] };

  return (
    <div className="dashboard">
      <h1 className="gradient-text" style={{marginBottom: '2rem'}}>Welcome Back, Agent</h1>
      
      <div className="dashboard-grid" ref={cardRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
        <div className="glass-card stat-card" style={{color: 'var(--text-main)'}}>
          <h3>Current Level</h3>
          <p className="stat-value gradient-text" style={{fontSize: '3rem', margin: '1rem 0'}}>{user.level}</p>
          <p>Keep training to level up!</p>
        </div>
        
        <div className="glass-card stat-card" style={{color: 'var(--text-main)'}}>
          <h3>Total Score</h3>
          <p className="stat-value gradient-text" style={{fontSize: '3rem', margin: '1rem 0'}}>{user.score}</p>
          <p>Global points earned</p>
        </div>
        
        <div className="glass-card stat-card" style={{color: 'var(--text-main)'}}>
          <h3>Accuracy Rate</h3>
          <p className="stat-value gradient-text" style={{fontSize: '3rem', margin: '1rem 0'}}>{stats.accuracy}%</p>
          <p>Based on all threats</p>
        </div>
      </div>

      <div className="glass-card mt-8" style={{ marginTop: '2rem' }}>
        <h2 style={{marginTop: 0}}>Recent Activity</h2>
        
        {(!recentActivity || recentActivity.length === 0) ? (
          <div>
            <p>No recent activity detected. Ready for your next training module?</p>
            <button className="btn" style={{marginTop: '1rem'}}>Start Training</button>
          </div>
        ) : (
          <div className="activity-list" style={{display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem'}}>
            {recentActivity.map((activity, idx) => {
              const isCorrect = activity.user_choice === activity.correct_answer;
              return (
                <div key={idx} style={{
                  padding: '1rem',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.4)',
                  borderLeft: `4px solid ${isCorrect ? '#10b981' : '#ef4444'}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <strong>Threat Identified: </strong> 
                    {isCorrect ? 'Successfully Correct' : 'Failed Identification'}
                  </div>
                  <div style={{color: 'var(--text-muted)', fontSize: '0.9rem'}}>
                    {new Date(activity.createdAt).toLocaleDateString()}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
