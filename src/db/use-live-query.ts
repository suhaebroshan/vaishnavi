import { useState, useEffect, useRef } from 'react';
import { db } from './database';

/**
 * useLiveQuery<T> — re-renders whenever any DB table changes.
 * Subscribes to Dexie add/update/delete events so data is fresh within ~300ms.
 * Factory may return T or Promise<T>.
 */
export function useLiveQuery<T>(key: string, factory: () => T | Promise<T>): T {
  const [value, setValue] = useState<T>(() => {
    try {
      const r = factory();
      return r instanceof Promise ? ({} as T) : r;
    } catch {
      return {} as T;
    }
  });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const factoryRef = useRef(factory);
  factoryRef.current = factory;

  useEffect(() => {
    // Eager initial load
    const run = async () => {
      const r = await factoryRef.current();
      setValue(r as T);
    };
    run();

    // Subscribe to all Dexie change events across every store
    const tables = [
      db.bookings, db.messages, db.notifications, db.users,
      db.workers, db.customers, db.admins, db.payments,
      db.reviews, db.addresses, db.services, db.ads,
      db.bookingEvents,
    ];

    const unsubFns = tables.flatMap(table =>
      ['add', 'update', 'delete'].map(eventType =>
        (table as any).on(eventType, () => {
          if (timerRef.current) clearTimeout(timerRef.current);
          timerRef.current = setTimeout(async () => {
            const r = await factoryRef.current();
            setValue(r as T);
          }, 300);
        })
      )
    );

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      unsubFns.forEach(fn => { try { fn(); } catch {} });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return value;
}
