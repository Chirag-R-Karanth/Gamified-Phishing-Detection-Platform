import React, { useEffect, useRef, useState } from 'react';
import anime from 'animejs';
import api from '../api/axios';

const TrainingSimulator = () => {
  const containerRef = useRef(null);
  const [currentMessage, setCurrentMessage] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);

  const fetchNextMessage = async () => {
    setLoading(true);
    setFeedback(null);
    try {
      const response = await api.get('/training/message');
      const data = response.data;
      if (data.message_content) {
        data.parsed_content = JSON.parse(data.message_content);
      }
      setCurrentMessage(data);
    } catch (error) {
      console.error('Failed to fetch message', error);
      // Fallback local message if DB isn't running
      setCurrentMessage({
        _id: 'local_1',
        parsed_content: {
          from: "admin@fallback-security.com",
          subject: "URGENT: Verify your account",
          body: "Please click the link to verify your account immediately. http://secure-verify-now.com"
        }
      });
    } finally {
      setLoading(false);
      // Re-trigger entrance animation
      if (containerRef.current) {
        anime({
          targets: containerRef.current,
          scale: [0.95, 1],
          opacity: [0, 1],
          easing: 'easeOutExpo',
          duration: 1000
        });
      }
    }
  };

  useEffect(() => {
    // Fetch user score first, then fetch message
    const initializeSimulator = async () => {
      try {
        const statsRes = await api.get('/dashboard');
        if (statsRes.data && statsRes.data.user) {
          setScore(statsRes.data.user.score);
        }
      } catch (err) {
        console.error("Could not fetch user score", err);
      }
      fetchNextMessage();
    };
    
    initializeSimulator();
  }, []);

  const handleChoice = async (isPhishing) => {
    const userChoice = isPhishing ? 'phishing' : 'safe';
    try {
      const response = await api.post('/training/submit-response', {
        message_id: currentMessage._id,
        user_choice: userChoice,
        time_taken: 5000 // mock time taken
      });
      
      const { isCorrect, explanation, new_score } = response.data;
      setFeedback({ isCorrect, message: explanation });
      setScore(new_score);

      animateFeedback(isCorrect);
    } catch (error) {
      // Fallback logic if API fails
      const isCorrect = isPhishing === true; // Assume local fallback is phishing
      setFeedback({ 
        isCorrect, 
        message: isCorrect ? 'Great job spotting the indicators!' : 'This was actually phishing.' 
      });
      if (isCorrect) setScore(s => s + 10);
      animateFeedback(isCorrect);
    }
  };

  const animateFeedback = (isCorrect) => {
    anime({
      targets: containerRef.current,
      translateX: isCorrect ? [0, -10, 10, -10, 10, 0] : 0, // Shake on correct? Wait, shake on incorrect.
      scale: isCorrect ? [1, 1.05, 1] : 1, // Pop on correct
      duration: isCorrect ? 500 : 600,
      easing: 'easeInOutSine'
    });
    if (!isCorrect) {
      anime({
        targets: containerRef.current,
        translateX: [0, -10, 10, -10, 10, 0],
        duration: 600,
        easing: 'easeInOutSine'
      });
    }
  };

  if (loading) {
    return <div className="training-simulator"><h1 className="gradient-text">Loading Threat...</h1></div>;
  }

  return (
    <div className="training-simulator">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1 className="gradient-text" style={{margin: 0}}>Threat Simulation</h1>
        <div className="glass-card" style={{ padding: '0.5rem 1rem', display: 'flex', gap: '1rem' }}>
          <span>Score: <strong className="gradient-text">{score}</strong></span>
        </div>
      </div>
      <p style={{marginBottom: '2rem'}}>Analyze the message below and determine its safety.</p>

      <div className="glass-card" ref={containerRef} style={{maxWidth: '600px', margin: '0 auto'}}>
        <div className="email-header" style={{borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', marginBottom: '1rem'}}>
          <p><strong>From:</strong> {currentMessage?.parsed_content?.from}</p>
          <p><strong>Subject:</strong> {currentMessage?.parsed_content?.subject}</p>
        </div>
        
        <div className="email-body" style={{lineHeight: '1.6', whiteSpace: 'pre-wrap'}}>
          <p>{currentMessage?.parsed_content?.body}</p>
        </div>

        {feedback && (
          <div className="feedback-panel" style={{
            marginTop: '2rem', 
            padding: '1rem', 
            background: feedback.isCorrect ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', 
            border: `1px solid ${feedback.isCorrect ? '#10b981' : '#ef4444'}`,
            borderRadius: '8px'
          }}>
            <h3 style={{ color: feedback.isCorrect ? '#10b981' : '#ef4444', marginTop: 0 }}>
              {feedback.isCorrect ? 'Mission Success!' : 'Mission Failed!'}
            </h3>
            <p>{feedback.message}</p>
            <button className="btn" style={{marginTop: '1rem', width: '100%'}} onClick={fetchNextMessage}>Next Scenario</button>
          </div>
        )}

        {!feedback && (
          <div className="action-buttons" style={{display: 'flex', gap: '1rem', marginTop: '2rem'}}>
            <button className="btn" style={{background: 'linear-gradient(135deg, #ff0844, #ffb199)', flex: 1}} onClick={() => handleChoice(true)}>Report Phishing</button>
            <button className="btn" style={{background: 'linear-gradient(135deg, #0ba360, #3cba92)', flex: 1}} onClick={() => handleChoice(false)}>Mark as Safe</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainingSimulator;
