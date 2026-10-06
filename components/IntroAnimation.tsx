"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Sparkles, BookOpen } from "lucide-react";

interface IntroAnimationProps {
  onComplete: () => void;
}

export function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500); // smooth exit
    }, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-50 bg-[#080c14] flex flex-col items-center justify-center text-white subtle-grid select-none"
        >
          {/* Ambient background glow */}
          <div className="absolute w-96 h-96 rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />

          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col items-center text-center p-6 relative z-10"
          >
            {/* Logo Badge */}
            <motion.div
              initial={{ rotate: -15, scale: 0.5 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 p-[2px] shadow-2xl shadow-emerald-500/30 mb-6 flex items-center justify-center"
            >
              <div className="w-full h-full bg-[#0b0f17] rounded-[14px] flex items-center justify-center text-emerald-400">
                <ShieldCheck size={40} />
              </div>
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-1.5"
            >
              <span className="text-xs font-mono uppercase tracking-[0.3em] text-emerald-400 font-bold">
                UNIVERSITY OF NIGERIA, NSUKKA
              </span>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                GSP 202 CBT PORTAL
              </h1>
              <p className="text-xs md:text-sm text-slate-400 max-w-sm mx-auto font-medium pt-1">
                Peace & Conflict Resolution
              </p>
            </motion.div>

            {/* Progress line */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "160px" }}
              transition={{ delay: 0.5, duration: 1.1, ease: "easeInOut" }}
              className="h-1 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full mt-8 shadow-sm shadow-emerald-400"
            />

            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-[11px] font-mono text-slate-500 mt-3 uppercase tracking-wider"
            >
              Loading Question...
            </motion.span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
