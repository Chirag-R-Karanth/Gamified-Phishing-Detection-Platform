import React, { useEffect, useRef, useState } from 'react';
import anime from 'animejs';
import api from '../api/axios';

const Leaderboard = () => {
  const listRef = useRef(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await api.get('/leaderboard');
        setUsers(response.data);
      } catch (error) {
        console.error('Failed to fetch leaderboard', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  useEffect(() => {
    if (!loading && users.length > 0 && listRef.current) {
      anime({
        targets: listRef.current.children,
        translateX: [-50, 0],
        opacity: [0, 1],
        delay: anime.stagger(100),
        easing: 'easeOutQuad',
        duration: 600
      });
    }
  }, [loading, users]);

  if (loading) {
    return <div className="leaderboard"><h1 className="gradient-text">Loading Rankings...</h1></div>;
  }

  return (
    <div className="leaderboard">
      <h1 className="gradient-text" style={{marginBottom: '2rem'}}>Global Rankings</h1>
      
      <div className="glass-card">
        <div className="leaderboard-header" style={{display: 'grid', gridTemplateColumns: '80px 1fr 100px 100px', fontWeight: 'bold', padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)'}}>
          <span>Rank</span>
          <span>Agent Name</span>
          <span>Level</span>
          <span>Score</span>
        </div>
        
        <div className="leaderboard-list" ref={listRef}>
          {users.map((user, index) => {
            const rank = index + 1;
            return (
              <div key={user._id} style={{
                display: 'grid', 
                gridTemplateColumns: '80px 1fr 100px 100px', 
                padding: '1rem', 
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                alignItems: 'center',
                background: rank === 1 ? 'rgba(255, 117, 140, 0.1)' : 'transparent'
              }}>
                <span style={{color: rank <= 3 ? 'var(--accent)' : 'inherit', fontWeight: 'bold'}}>
                  #{rank}
                </span>
                <span>{user.username}</span>
                <span>{user.level}</span>
                <span className="gradient-text" style={{fontWeight: 'bold'}}>{user.score}</span>
              </div>
            );
          })}
          {users.length === 0 && (
             <div style={{padding: '1rem'}}>No ranked agents found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
