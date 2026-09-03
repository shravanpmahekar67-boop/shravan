import { create } from 'zustand';
import { syncPendingIncidents } from '../utils/syncManager';
import { getPendingIncidents } from '../utils/offlineStore';

interface NetworkState {
  isOnline: boolean;
  isSyncing: boolean;
  pendingCount: number;
  lastSyncTime: string | null;
  toggleOnlineMode: () => Promise<void>;
  setOnline: (online: boolean) => void;
  triggerSync: () => Promise<{ syncedCount: number; errors: any[] }>;
  checkPendingCount: () => Promise<number>;
}

export const useNetworkStore = create<NetworkState>((set, get) => ({
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  isSyncing: false,
  pendingCount: 0,
  lastSyncTime: null,

  toggleOnlineMode: async () => {
    const nextState = !get().isOnline;
    set({ isOnline: nextState });
    console.log(`[NETWORK STORE] Mode toggled manually to: ${nextState ? 'ONLINE' : 'OFFLINE'}`);

    if (nextState) {
      await get().triggerSync();
    } else {
      await get().checkPendingCount();
    }
  },

  setOnline: (online: boolean) => {
    set({ isOnline: online });
    if (online) {
      get().triggerSync();
    } else {
      get().checkPendingCount();
    }
  },

  checkPendingCount: async () => {
    try {
      const items = await getPendingIncidents();
      const count = items.length;
      set({ pendingCount: count });
      return count;
    } catch {
      return 0;
    }
  },

  triggerSync: async () => {
    const currentOnline = get().isOnline;
    if (!currentOnline) {
      await get().checkPendingCount();
      return { syncedCount: 0, errors: ['Mode is offline'] };
    }

    set({ isSyncing: true });
    try {
      const result = await syncPendingIncidents();
      await get().checkPendingCount();
      set({
        isSyncing: false,
        lastSyncTime: new Date().toLocaleTimeString()
      });
      return result;
    } catch (err) {
      set({ isSyncing: false });
      return { syncedCount: 0, errors: [err] };
    }
  }
}));

// Initialize global network event listeners
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    console.log('[NETWORK EVENT] Browser online event detected.');
    useNetworkStore.getState().setOnline(true);
  });

  window.addEventListener('offline', () => {
    console.log('[NETWORK EVENT] Browser offline event detected.');
    useNetworkStore.getState().setOnline(false);
  });

  window.addEventListener('resq-sync-complete', () => {
    useNetworkStore.getState().checkPendingCount();
  });

  // Initial pending check
  useNetworkStore.getState().checkPendingCount();
}
