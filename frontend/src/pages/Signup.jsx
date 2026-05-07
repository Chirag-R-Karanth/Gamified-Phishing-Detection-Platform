import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import api from '../api/axios';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await api.post('/auth/signup', { username, email, password });
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', width: '100%' }}>
      <div className="glass-card" style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}>
        <Shield size={48} className="brand-icon" style={{ margin: '0 auto 1rem' }} />
        <h2 className="gradient-text" style={{ marginBottom: '2rem' }}>Recruit Registration</h2>
        
        {error && <p style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            className="input-field" 
            placeholder="Agent Codename" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input 
            type="email" 
            className="input-field" 
            placeholder="Agent Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input 
            type="password" 
            className="input-field" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn" style={{ width: '100%', marginTop: '1rem' }}>Register</button>
        </form>
        
        <p style={{ marginTop: '1.5rem', color: '#94a3b8' }}>
          Already an agent? <Link to="/login" style={{ color: 'var(--secondary)' }}>Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
