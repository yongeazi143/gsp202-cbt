"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, LogOut, X } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "default";
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  isOpen,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-md bg-[#0f172a] border border-white/10 rounded-2xl p-6 shadow-2xl text-slate-100 overflow-hidden"
        >
          {/* Subtle background glow */}
          <div
            className={`absolute top-0 left-1/2 -translate-x-1/2 w-40 h-20 blur-3xl pointer-events-none ${
              variant === "danger"
                ? "bg-rose-500/20"
                : variant === "warning"
                ? "bg-amber-500/20"
                : "bg-emerald-500/20"
            }`}
          />

          <div className="flex items-start gap-4">
            <div
              className={`p-3 rounded-xl shrink-0 ${
                variant === "danger"
                  ? "bg-rose-500/15 border border-rose-500/30 text-rose-400"
                  : variant === "warning"
                  ? "bg-amber-500/15 border border-amber-500/30 text-amber-400"
                  : "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400"
              }`}
            >
              {variant === "danger" ? <LogOut size={24} /> : <AlertTriangle size={24} />}
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-bold text-white font-heading">{title}</h3>
              <p className="mt-1.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                {description}
              </p>
            </div>

            <button
              onClick={onCancel}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition"
            >
              <X size={18} />
            </button>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition cursor-pointer"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition cursor-pointer shadow-lg ${
                variant === "danger"
                  ? "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30"
                  : variant === "warning"
                  ? "bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30"
                  : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30"
              }`}
            >
              {confirmLabel}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
