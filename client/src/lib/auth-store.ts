import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@shared/schema';

interface AuthStore {
  user: User | null;
  userId: string;
  setUser: (user: User | null) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      userId: 'guest',
      setUser: (user) => set({ 
        user, 
        userId: user?.id || 'guest' 
      }),
      logout: () => set({ 
        user: null, 
        userId: 'guest' 
      }),
      refreshUser: async () => {
        const { userId } = get();
        if (!userId || userId === 'guest') {
          return;
        }

        try {
          const response = await fetch('/api/auth/me', {
            headers: {
              'x-user-id': userId,
            },
          });

          if (response.ok) {
            const updatedUser = await response.json();
            set({ user: updatedUser });
          } else if (response.status === 401 || response.status === 404) {
            // User no longer exists or invalid, logout
            set({ user: null, userId: 'guest' });
          }
        } catch (error) {
          console.error('Failed to refresh user data:', error);
        }
      },
    }),
    {
      name: 'woodinn-auth',
    }
  )
);
