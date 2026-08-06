import { create } from 'zustand';

export type AuthTab = 'login' | 'register' | 'forgot';

interface AuthModalState {
  isOpen: boolean;
  activeTab: AuthTab;
  openModal: (tab?: AuthTab) => void;
  closeModal: () => void;
  setTab: (tab: AuthTab) => void;
}

export const useAuthModalStore = create<AuthModalState>((set) => ({
  isOpen: false,
  activeTab: 'login',
  openModal: (tab = 'login') => set({ isOpen: true, activeTab: tab }),
  closeModal: () => set({ isOpen: false }),
  setTab: (tab) => set({ activeTab: tab }),
}));