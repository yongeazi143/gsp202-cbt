"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = "info", duration = 3500) => {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const newToast: ToastItem = { id, message, type, duration };

      setToasts((prev) => [...prev.slice(-3), newToast]); // keep max 4 at once

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      {/* Toast Notification Container */}
      <div className="fixed top-14 sm:top-4 right-3 left-3 sm:left-auto sm:w-96 z-50 pointer-events-none flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map((t) => {
            const icons = {
              success: <CheckCircle2 className="text-emerald-400 shrink-0" size={18} />,
              error: <AlertCircle className="text-rose-400 shrink-0" size={18} />,
              warning: <AlertTriangle className="text-amber-400 shrink-0" size={18} />,
              info: <Info className="text-cyan-400 shrink-0" size={18} />,
            };

            const borderColors = {
              success: "border-emerald-500/40 bg-[#0d1f18]/95 text-emerald-100",
              error: "border-rose-500/40 bg-[#230f14]/95 text-rose-100",
              warning: "border-amber-500/40 bg-[#231a0e]/95 text-amber-100",
              info: "border-cyan-500/40 bg-[#0c1c24]/95 text-cyan-100",
            };

            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: -15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border backdrop-blur-xl shadow-2xl ${borderColors[t.type]}`}
              >
                <div className="mt-0.5">{icons[t.type]}</div>
                <div className="flex-1 text-xs md:text-sm font-medium leading-relaxed">
                  {t.message}
                </div>
                <button
                  onClick={() => removeToast(t.id)}
                  className="p-1 text-slate-400 hover:text-white transition rounded-md hover:bg-white/10 shrink-0"
                  aria-label="Dismiss toast"
                >
                  <X size={14} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
