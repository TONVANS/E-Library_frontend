import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: number;
  type: ToastType;
  title: string;
  description?: string;
}

interface ToastState {
  toasts: Toast[];
  show: (toast: Omit<Toast, 'id'>, duration?: number) => void;
  dismiss: (id: number) => void;
}

let nextId = 1;

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],

  show: (toast, duration = 3500) => {
    const id = nextId++;
    // Keep at most 4 on screen so a burst of actions doesn't cover the page
    set({ toasts: [...get().toasts.slice(-3), { ...toast, id }] });
    setTimeout(() => get().dismiss(id), duration);
  },

  dismiss: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
}));

// NestJS returns `message` as a string, or a string[] from ValidationPipe
function apiErrorMessage(err: unknown, fallback: string) {
  const message = (err as { response?: { data?: { message?: string | string[] } } })?.response
    ?.data?.message;
  if (Array.isArray(message)) return message.join(', ');
  return message || fallback;
}

// Callable from anywhere (event handlers, stores) without a hook
export const toast = {
  success: (title: string, description?: string) =>
    useToastStore.getState().show({ type: 'success', title, description }),
  error: (title: string, description?: string) =>
    useToastStore.getState().show({ type: 'error', title, description }, 5000),
  info: (title: string, description?: string) =>
    useToastStore.getState().show({ type: 'info', title, description }),
  apiError: (err: unknown, fallback: string) =>
    useToastStore.getState().show({ type: 'error', title: apiErrorMessage(err, fallback) }, 5000),
};
