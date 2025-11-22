import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  xp: number;
  level: number;
  xp_total?: number;
  current_level?: number;
  missions_completed?: any[];
  accuracy_rate?: number;
  total_missions?: number;
  correct_verdicts?: number;
  badges?: any[];
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  refreshUser: (user: User) => void;  // Add this
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => {
        set({
          user: {
            ...user,
            xp: user.xp_total || user.xp || 0,
            level: user.current_level || user.level || 1,
          },
          token,
          isAuthenticated: true,
        });
      },
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },
      refreshUser: (user) => {  // Add this method
        set((state) => ({
          user: {
            ...user,
            xp: user.xp_total || user.xp || 0,
            level: user.current_level || user.level || 1,
          },
        }));
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
