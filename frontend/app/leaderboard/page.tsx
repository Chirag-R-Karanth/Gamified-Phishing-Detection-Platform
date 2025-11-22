'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/stores/authStore';
import { getLeaderboard } from '@/lib/api/missions';

interface LeaderboardUser {
  _id: string;
  name: string;
  department: string;
  xp_total: number;
  current_level: number;
  accuracy_rate: number;
  total_missions: number;
  correct_verdicts: number;
}

export default function LeaderboardPage() {
  const { user, token, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    fetchLeaderboard();
  }, [isAuthenticated, router]);

  const fetchLeaderboard = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const response = await getLeaderboard(token);
      setLeaderboard(response.data.leaderboard);
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

  if (!isAuthenticated || !user) {
    return null;
  }

  const getRankEmoji = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
    if (rank === 2) return 'bg-gradient-to-r from-gray-300 to-gray-500';
    if (rank === 3) return 'bg-gradient-to-r from-orange-400 to-orange-600';
    return 'bg-gradient-to-r from-blue-400 to-blue-600';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link href="/missions" className="text-gray-600 hover:text-gray-900">
                ← Back to Missions
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">
                🏆 Leaderboard
              </h1>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-lg p-8 text-white mb-8">
          <h2 className="text-3xl font-bold mb-2">Top Cyber Rangers 🎯</h2>
          <p className="text-purple-100">
            The best phishing detectors in the organization!
          </p>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="text-gray-500">Loading leaderboard...</div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {!loading && leaderboard.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No rankings yet
            </h3>
            <p className="text-gray-500">
              Complete missions to appear on the leaderboard!
            </p>
          </div>
        )}

        <div className="space-y-3">
          {leaderboard.map((player, index) => {
            const rank = index + 1;
            const isCurrentUser = player._id === user._id;

            return (
              <div
                key={player._id}
                className={`bg-white rounded-lg shadow p-6 transition ${
                  isCurrentUser ? 'ring-2 ring-blue-500' : 'hover:shadow-md'
                }`}
              >
                <div className="flex items-center gap-6">
                  {/* Rank */}
                  <div className={`${getRankColor(rank)} text-white rounded-lg p-4 text-center min-w-[80px]`}>
                    <div className="text-3xl font-bold">
                      {getRankEmoji(rank)}
                    </div>
                  </div>

                  {/* User Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-bold text-gray-900">
                        {player.name}
                        {isCurrentUser && (
                          <span className="ml-2 text-sm font-normal text-blue-600">
                            (You)
                          </span>
                        )}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {player.department} • Level {player.current_level}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <div className="text-2xl font-bold text-indigo-600">
                          {player.xp_total}
                        </div>
                        <div className="text-xs text-gray-600">Total XP</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">
                          {player.correct_verdicts}
                        </div>
                        <div className="text-xs text-gray-600">Correct</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-600">
                          {player.total_missions}
                        </div>
                        <div className="text-xs text-gray-600">Completed</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-orange-600">
                          {player.accuracy_rate}%
                        </div>
                        <div className="text-xs text-gray-600">Accuracy</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Your Rank */}
        {!loading && leaderboard.length > 0 && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-bold text-blue-900 mb-2">Your Ranking</h3>
            {leaderboard.find(p => p._id === user._id) ? (
              <p className="text-blue-800">
                You're currently ranked{' '}
                <strong>#{leaderboard.findIndex(p => p._id === user._id) + 1}</strong> with{' '}
                <strong>{user.xp} XP</strong>!
              </p>
            ) : (
              <p className="text-blue-800">
                Complete more missions to make it to the top 10! 🚀
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
