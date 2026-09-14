import { useEffect, useRef } from 'react';
import { switchToRole } from '../db/store';

const GESTURE_CYCLE: ('customer' | 'worker' | 'admin')[] = ['customer', 'worker', 'admin'];

let lastTouchY = 0;

function handleTouchStart(e: TouchEvent) {
  lastTouchY = e.touches[0].clientY;
}

function handleTouchEnd(e: TouchEvent) {
  const diff = lastTouchY - e.changedTouches[0].clientY;
  if (Math.abs(diff) < 60) return;
  if (e.changedTouches.length === 3) {
    const { useAppStore } = require('../db/store');
    const currentRole = useAppStore.getState().currentRole;
    const roleList: ('customer' | 'worker' | 'admin')[] = ['customer', 'worker', 'admin'];
    const idx = roleList.indexOf(currentRole || 'customer');
    const nextIdx = diff > 0 ? (idx + 1) % 3 : (idx + 2) % 3;
    switchToRole(GESTURE_CYCLE[nextIdx]);
  }
}

export function useThreeFingerGesture() {
  const initialized = useRef(false);
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);
}
