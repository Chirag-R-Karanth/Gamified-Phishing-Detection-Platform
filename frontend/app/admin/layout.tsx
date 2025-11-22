'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/authStore';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Only check once on mount
    const checkAuth = () => {
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }
      
      if (user && user.role !== 'admin' && user.role !== 'trainer') {
        router.push('/missions');
        return;
      }

      setIsChecking(false);
    };

    checkAuth();
  }, []); // Empty dependency array - only run once!

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Show loading while checking
  if (isChecking) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-500">Loading admin panel...</div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!isAuthenticated || !user || (user.role !== 'admin' && user.role !== 'trainer')) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <div className="bg-indigo-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-6">
              <h1 className="text-xl font-bold">🛡️ Admin Panel</h1>
              <nav className="flex gap-4">
                <Link
                  href="/admin"
                  className="hover:text-indigo-200 transition"
                >
                  Dashboard
                </Link>
                <Link
                  href="/admin/create-mission"
                  className="hover:text-indigo-200 transition"
                >
                  Create Mission
                </Link>
                <Link
                  href="/missions"
                  className="hover:text-indigo-200 transition"
                >
                  View Missions
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm">
                {user.name} ({user.role})
              </span>
              <button
                onClick={handleLogout}
                className="px-3 py-1 bg-indigo-700 hover:bg-indigo-800 rounded transition text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}
