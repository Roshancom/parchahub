"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AlertCircle, CheckCircle2, X } from "lucide-react";

type ToastType = "success" | "error";

type ToastItem = {
  id: number;
  type: ToastType;
  message: string;
};

type UseToastReturn = {
  toasts: ToastItem[];
  showToast: (type: ToastType, message: string) => void;
  dismissToast: (id: number) => void;
};

let nextId = 0;

export const useToast = (): UseToastReturn => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timersRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const showToast = useCallback(
    (type: ToastType, message: string) => {
      const id = nextId++;
      setToasts((prev) => [...prev, { id, type, message }]);

      const timer = setTimeout(() => {
        dismissToast(id);
      }, 5000);
      timersRef.current.set(id, timer);
    },
    [dismissToast],
  );

  useEffect(() => {
    return () => {
      timersRef.current.forEach((timer) => clearTimeout(timer));
      timersRef.current.clear();
    };
  }, []);

  return { toasts, showToast, dismissToast };
};

const ICONS: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />,
  error: <AlertCircle size={18} className="text-red-500 shrink-0" />,
};

const STYLES: Record<ToastType, string> = {
  success:
    "border-emerald-200 bg-emerald-50",
  error: "border-red-200 bg-red-50",
};

export function ToastContainer({ toasts, dismissToast }: { toasts: ToastItem[]; dismissToast: (id: number) => void }) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
      {toasts.map((item) => (
        <div
          key={item.id}
          className={`flex items-start gap-3 rounded-2xl border px-4 py-3 shadow-soft text-sm ${STYLES[item.type]}`}
        >
          {ICONS[item.type]}
          <p className="flex-1 text-neutral-800">{item.message}</p>
          <button
            onClick={() => dismissToast(item.id)}
            className="shrink-0 text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
