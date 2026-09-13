import { useEffect, useRef } from 'react';

// Keyboard shortcut for demo: Alt+1=customer, Alt+2=worker, Alt+3=admin
export function useKeyboardSwitch() {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!e.altKey) return;
      const roleMap: Record<string, 'customer' | 'worker' | 'admin'> = {
        '1': 'customer',
        '2': 'worker',
        '3': 'admin',
      };
      const role = roleMap[e.key];
      if (role) {
        import('../db/store').then(({ useAppStore }) => {
          useAppStore.getState().switchToRole(role);
        });
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);
}
