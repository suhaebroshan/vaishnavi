import { useEffect } from 'react';
import { useAppStore } from '../db/store';
import { db } from '../db/database';

// Keyboard shortcut for demo: Alt+1=customer, Alt+2=worker, Alt+3=admin
export function useKeyboardSwitch() {
  useEffect(() => {
    const handler = async (e: KeyboardEvent) => {
      if (!e.altKey) return;
      const roleMap: Record<string, 'customer' | 'worker' | 'admin'> = {
        '1': 'customer',
        '2': 'worker',
        '3': 'admin',
      };
      const role = roleMap[e.key];
      if (!role) return;
      let target: any = null;
      if (role === 'customer') target = await db.customers.get('c1');
      else if (role === 'worker') target = await db.workers.get('w1');
      else if (role === 'admin') target = await db.admins.get('admin1');
      if (target) useAppStore.getState().setCurrentUser(target);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);
}
