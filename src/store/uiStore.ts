import { create } from 'zustand';

export interface ToastItem {
  id: string;
  type: 'success' | 'warning' | 'danger' | 'info';
  message: string;
  duration?: number;
}

interface UIStore {
  toasts: ToastItem[];
  addToast: (type: ToastItem['type'], message: string, duration?: number) => void;
  removeToast: (id: string) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  toasts: [],
  addToast: (type, message, duration = 3000) => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({
      toasts: [...state.toasts, { id, type, message, duration }],
    }));
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, duration);
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));
