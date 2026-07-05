import { useUIStore } from '@/store/uiStore';

export const useToast = () => {
  const addToast = useUIStore((state) => state.addToast);

  return {
    success: (message: string, duration?: number) => addToast('success', message, duration),
    warning: (message: string, duration?: number) => addToast('warning', message, duration),
    danger: (message: string, duration?: number) => addToast('danger', message, duration),
    info: (message: string, duration?: number) => addToast('info', message, duration),
  };
};
