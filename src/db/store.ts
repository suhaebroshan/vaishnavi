import { create } from 'zustand';
import { db } from './database';
import type { AppUser, UserRole } from '../types';

interface AppState {
  currentUser: AppUser | null;
  currentRole: UserRole | null;
  setCurrentUser: (user: AppUser) => void;
  unreadNotifications: number;
  setUnreadCount: (n: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentUser: null,
  currentRole: null,
  unreadNotifications: 0,

  setCurrentUser: (user) => {
    const role = (user as any)?.role as UserRole | null;
    set({ currentUser: user, currentRole: role });
  },

  setUnreadCount: (n) => set({ unreadNotifications: n }),
}));

// ── Separate async helper for landing page & store-based switching ──
export async function switchToRole(role: UserRole): Promise<void> {
  let target: any = null;
  if (role === 'customer') target = await db.customers.get('c1');
  else if (role === 'worker') target = await db.workers.get('w1');
  else if (role === 'admin') target = await db.admins.get('admin1');

  if (target) {
    const unread = await db.notifications.where('userId').equals(target.id).filter((n: any) => !n.reading).count();
    const { useAppStore: store } = await import('./store');
    store.getState().setCurrentUser(target);
    store.getState().setUnreadCount(unread);
  }
}
