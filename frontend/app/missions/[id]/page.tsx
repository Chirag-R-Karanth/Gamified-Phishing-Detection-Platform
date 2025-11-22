'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/authStore';
import { getMission, submitMission, Mission, SubmissionResult } from '@/lib/api/missions';
import { getProfile } from '@/lib/api/auth';  // Add this import at top

export default function MissionViewerPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, token, isAuthenticated, setAuth } = useAuthStore();

  const [mission, setMission] = useState<Mission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEmail, setShowEmail] = useState(false);
  const [verdict, setVerdict] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    fetchMission();
  }, [isAuthenticated, id]);

  const fetchMission = async () => {
    if (!token || !id) return;

    try {
      setLoading(true);
      const response = await getMission(id as string, token);
      setMission(response.data.mission);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };



const handleSubmit = async () => {
  if (!verdict || !mission || !token) return;

  try {
    setSubmitting(true);
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    
    const response = await submitMission(
      mission._id,
      verdict,
      [],
      timeSpent,
      token
    );

    setResult(response);

    // Fetch fresh user data from backend
    try {
      const profileResponse = await getProfile(token);
      const freshUser = profileResponse.data.user;
      
      setAuth(freshUser, token);
    } catch (profileErr) {
      console.error('Failed to refresh profile:', profileErr);
    }
  } catch (err: any) {
    setError(err.message);
  } finally {
    setSubmitting(false);
  }
};


  if (!isAuthenticated || !user) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading mission...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!mission) {
    return null;
  }

  // Results Modal
  if (result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full">
          <div className="text-center">
            <div className="text-6xl mb-4">
              {result.submission.is_correct ? '🎉' : '😔'}
            </div>
            <h2 className="text-3xl font-bold mb-2">
              {result.submission.is_correct ? 'Correct!' : 'Not Quite'}
            </h2>
            <p className="text-gray-600 mb-6">
              {result.submission.feedback_text}
            </p>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    +{result.xpEarned} XP
                  </div>
                  <div className="text-sm text-gray-600">Earned</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-indigo-600">
                    {result.submission.score}
                  </div>
                  <div className="text-sm text-gray-600">Score</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">
                    Level {result.newLevel}
                  </div>
                  <div className="text-sm text-gray-600">Current Level</div>
                </div>
              </div>
            </div>

            {/* NEW BADGES SECTION - THIS IS WHAT WE ADDED! */}
            {result.newBadges && result.newBadges.length > 0 && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
                <h3 className="font-bold text-purple-900 mb-3">
                  🎖️ New Badges Earned!
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {result.newBadges.map((badge: any, idx: number) => (
                    <div
                      key={idx}
                      className="bg-white border border-purple-300 rounded-lg p-3 text-center"
                    >
                      <div className="text-3xl mb-1">{badge.icon}</div>
                      <div className="font-semibold text-sm text-purple-900">
                        {badge.name}
                      </div>
                      <div className="text-xs text-purple-700">
                        {badge.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="text-left bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm font-semibold text-blue-900 mb-2">
                ✅ Correct Answer: <span className="uppercase">{result.correctAnswer}</span>
              </p>
              {result.clues && result.clues.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-semibold text-blue-900 mb-2">
                    🔍 Key Indicators:
                  </p>
                  <ul className="space-y-1">
                    {result.clues.map((clue: any, idx: number) => (
                      <li key={idx} className="text-sm text-blue-800">
                        • {clue.indicator}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <button
              onClick={() => router.push('/missions')}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Back to Missions
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Mission #{mission.mission_number}: {mission.title}
              </h1>
              <p className="text-sm text-gray-600">
                Difficulty: Level {mission.difficulty} • Category: {mission.category}
              </p>
            </div>
            <button
              onClick={() => router.push('/missions')}
              className="text-gray-600 hover:text-gray-900"
            >
              ← Back
            </button>
          </div>
        </div>

        {/* Ranger Help Request */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-4">
          <div className="flex items-start gap-4">
            <div className="text-4xl">👤</div>
            <div className="flex-1">
              <div className="font-semibold text-blue-900 mb-1">
                {mission.ranger_name} ({mission.ranger_email})
              </div>
              <p className="text-blue-800 text-sm leading-relaxed">
                {mission.ranger_request}
              </p>
              {!showEmail && (
                <button
                  onClick={() => setShowEmail(true)}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
                >
                  📧 View Forwarded Email
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Email Display */}
        {showEmail && (
          <>
            <div className="bg-white border rounded-lg shadow mb-4">
              <div className="border-b px-6 py-3 bg-gray-50">
                <div className="text-sm space-y-1">
                  <div><span className="font-semibold">From:</span> {mission.email_from}</div>
                  <div><span className="font-semibold">Subject:</span> {mission.email_subject}</div>
                </div>
              </div>
              <div className="p-6">
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: mission.email_body_html }}
                />
              </div>
            </div>

            {/* Verdict Selection */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold mb-4">Your Verdict:</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  onClick={() => setVerdict('phishing')}
                  className={`p-6 border-2 rounded-lg text-center transition ${
                    verdict === 'phishing'
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:border-red-300'
                  }`}
                >
                  <div className="text-4xl mb-2">🚨</div>
                  <div className="font-bold text-lg">PHISHING</div>
                  <div className="text-sm text-gray-600">This is a scam</div>
                </button>

                <button
                  onClick={() => setVerdict('legitimate')}
                  className={`p-6 border-2 rounded-lg text-center transition ${
                    verdict === 'legitimate'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <div className="text-4xl mb-2">✅</div>
                  <div className="font-bold text-lg">LEGITIMATE</div>
                  <div className="text-sm text-gray-600">This is safe</div>
                </button>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!verdict || submitting}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Submit Verdict'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
