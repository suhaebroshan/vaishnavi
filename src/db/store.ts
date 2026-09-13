import { create } from 'zustand';
import type { AppUser, UserRole } from '../types';
import { db } from './database';

interface AppState {
  currentUser: AppUser | null;
  currentRole: UserRole | null;
  setCurrentUser: (user: AppUser) => void;
  switchToRole: (role: UserRole) => Promise<void>;
  unreadNotifications: number;
  setUnreadCount: (n: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentUser: null,
  currentRole: null,
  unreadNotifications: 0,

  setCurrentUser: (user) => set({ currentUser: user }),

  setUnreadCount: (n) => set({ unreadNotifications: n }),

  switchToRole: async (role: UserRole) => {
    let target: AppUser | undefined;
    if (role === 'customer') target = await db.customers.get('c1');
    else if (role === 'worker') target = await db.workers.get('w1');
    else if (role === 'admin') target = await db.admins.get('admin1');

    if (target) {
      const unread = await db.notifications.where('userId').equals(target.id).filter((n: any) => !n.reading).count();
      set({ currentUser: target as AppUser, currentRole: role, unreadNotifications: unread });
    }
  },
}));
