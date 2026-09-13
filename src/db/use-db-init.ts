import { useEffect } from 'react';
import { seedDatabase } from './seed';

export function useDatabaseInit() {
  useEffect(() => {
    seedDatabase().catch(console.error);
  }, []);
}
