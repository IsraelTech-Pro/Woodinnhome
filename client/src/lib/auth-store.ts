import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@shared/schema';

interface AuthStore {
  user: User | null;
  userId: string;
  setUser: (user: User | null) => void;
  logout: () => void;
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
    }),
    {
      name: 'woodinn-auth',
    }
  )
);
