import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface UserProfile {
  name: string;
  email: string;
  [key: string]: unknown;
}

interface AuthState {
  user: UserProfile | null;
  accessToken: string | null;
  setAccessToken: (token: string) => void;
  setUser: (user: UserProfile) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      user: null,
      accessToken: null,
      setAccessToken: (token) => set({ accessToken: token }, false, 'setAccessToken'),
      setUser: (user) => set({ user }, false, 'setUser'),
      clearAuth: () => set({ user: null, accessToken: null }, false, 'clearAuth'),
    }),
    { name: 'AuthStore' },
  ),
);
