import { create } from 'zustand';
import { db } from './database';
import type { AppUser, UserRole } from '../types';

interface AppState {
  currentUser: AppUser | null;
  currentRole: UserRole | null;
  loginTick: number;
  setCurrentUser: (user: AppUser) => void;
  unreadNotifications: number;
  setUnreadCount: (n: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentUser: null,
  currentRole: null,
  loginTick: 0,
  unreadNotifications: 0,

  setCurrentUser: (user) => {
    const role = (user as any)?.role as UserRole | null;
    set((state) => ({ currentUser: user, currentRole: role, loginTick: state.loginTick + 1 }));
  },

  setUnreadCount: (n) => set({ unreadNotifications: n }),
}));

