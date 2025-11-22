'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/stores/authStore';
import { getMissions } from '@/lib/api/missions';
import Link from 'next/link';

export default function AdminDashboard() {
  const { token } = useAuthStore();
  const [stats, setStats] = useState({
    totalMissions: 0,
    publishedMissions: 0,
    draftMissions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    if (!token) return;

    try {
      const response = await getMissions(token);
      const missions = response.data.missions;
      
      setStats({
        totalMissions: missions.length,
        publishedMissions: missions.filter((m: any) => m.is_published).length,
        draftMissions: missions.filter((m: any) => !m.is_published).length,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome to Admin Dashboard
        </h2>
        <p className="text-gray-600">
          Manage missions, view statistics, and monitor training progress
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Missions</p>
              <p className="text-3xl font-bold text-gray-900">
                {loading ? '...' : stats.totalMissions}
              </p>
            </div>
            <div className="text-4xl">📧</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Published</p>
              <p className="text-3xl font-bold text-green-600">
                {loading ? '...' : stats.publishedMissions}
              </p>
            </div>
            <div className="text-4xl">✅</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Drafts</p>
              <p className="text-3xl font-bold text-yellow-600">
                {loading ? '...' : stats.draftMissions}
              </p>
            </div>
            <div className="text-4xl">📝</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-4">
          <Link
            href="/admin/create-mission"
            className="flex items-center gap-3 p-4 border-2 border-indigo-200 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition"
          >
            <span className="text-3xl">➕</span>
            <div>
              <div className="font-semibold">Create New Mission</div>
              <div className="text-sm text-gray-600">Add a phishing scenario</div>
            </div>
          </Link>

          <Link
            href="/missions"
            className="flex items-center gap-3 p-4 border-2 border-blue-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition"
          >
            <span className="text-3xl">📋</span>
            <div>
              <div className="font-semibold">View All Missions</div>
              <div className="text-sm text-gray-600">Manage existing content</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
