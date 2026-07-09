import { create } from 'zustand';

interface StoreState {
    user: any | null;
    setUser: (user: any) => void;
    logout: () => void;
}

export const useStore = create<StoreState>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    logout: () => set({ user: null }),
}));
