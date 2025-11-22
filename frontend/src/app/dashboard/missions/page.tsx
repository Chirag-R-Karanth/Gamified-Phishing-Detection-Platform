'use client';

import { useAuthStore } from '@/lib/stores/authStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function MissionsPage() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Welcome, {user.name}! 🎯
              </h1>
              <p className="text-gray-600 mt-2">
                Level {user.level} • {user.xp} XP • {user.department}
              </p>
            </div>
            <Button onClick={handleLogout} variant="outline">
              Logout
            </Button>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">
            🚀 Authentication Successful!
          </h2>
          <p className="text-lg">
            Your backend and frontend are fully connected. Next, we'll build the mission system!
          </p>
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div className="bg-white/20 rounded-lg p-4">
              <div className="text-3xl font-bold">{user.level}</div>
              <div className="text-sm">Current Level</div>
            </div>
            <div className="bg-white/20 rounded-lg p-4">
              <div className="text-3xl font-bold">{user.xp}</div>
              <div className="text-sm">Total XP</div>
            </div>
            <div className="bg-white/20 rounded-lg p-4">
              <div className="text-3xl font-bold">0</div>
              <div className="text-sm">Missions Completed</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
