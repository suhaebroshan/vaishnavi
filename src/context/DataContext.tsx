import React from 'react';
import type { UserRole } from '../types';
import { useAppStore } from '../db/store';

interface DBSubscription {
  key: string;
  value: any[];
}

const DataContext = React.createContext<{
  subscriptions: Map<string, DBSubscription>;
}>({ subscriptions: new Map() });

export function useDBSubscription() {
  return useContext(DataContext);
}

import { useContext } from 'react';

export function DBProvider({ children }: { children: React.ReactNode }) {
  const [subscriptions] = React.useState<Map<string, DBSubscription>>(new Map());

  return (
    <DataContext.Provider value={{ subscriptions }}>
      {children}
    </DataContext.Provider>
  );
}
