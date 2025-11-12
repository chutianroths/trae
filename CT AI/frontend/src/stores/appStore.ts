import { create } from 'zustand';

export type NetworkStatus = 'online' | 'offline' | 'checking';

interface AppState {
  networkStatus: NetworkStatus;
  isInitialized: boolean;
}

interface AppActions {
  setNetworkStatus: (status: NetworkStatus) => void;
  setInitialized: (initialized: boolean) => void;
}

type AppStore = AppState & AppActions;

const initialState: AppState = {
  networkStatus: 'checking',
  isInitialized: false,
};

export const useAppStore = create<AppStore>((set) => ({
  ...initialState,
  setNetworkStatus: (status) => set({ networkStatus: status }),
  setInitialized: (initialized) => set({ isInitialized: initialized }),
}));
