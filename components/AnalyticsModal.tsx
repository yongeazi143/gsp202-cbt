"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, FileCheck, HelpCircle, Layers, BookOpen, Activity, RefreshCw, X, ShieldCheck, Globe } from "lucide-react";
import { fetchPlatformMetrics, PlatformMetrics } from "@/lib/metrics";

interface AnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AnalyticsModal({ isOpen, onClose }: AnalyticsModalProps) {
  const [metrics, setMetrics] = useState<PlatformMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchPlatformMetrics();
    setMetrics(data);
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl bg-[#0d1424] border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl text-slate-100 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <Activity size={22} />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-extrabold text-white font-heading">
                  Platform Analytics & Metrics
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Real-time usage counters & deployment telemetry
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={loadData}
                disabled={loading}
                className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-white/5 rounded-lg transition"
                title="Refresh Metrics"
              >
                <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4 my-6">
            {/* Total Visitors */}
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-emerald-500/40 transition">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-medium">Total Visitors</span>
                <Users size={16} className="text-emerald-400" />
              </div>
              <div className="text-2xl md:text-3xl font-extrabold text-white font-mono">
                {loading ? "..." : metrics?.totalVisitors ?? 1}
              </div>
              <div className="text-[11px] text-emerald-400/80 mt-1 font-mono">Unique Devices</div>
            </div>

            {/* Total Page Views */}
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-blue-500/40 transition">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-medium">Platform Views</span>
                <Globe size={16} className="text-blue-400" />
              </div>
              <div className="text-2xl md:text-3xl font-extrabold text-white font-mono">
                {loading ? "..." : metrics?.totalPageViews ?? 1}
              </div>
              <div className="text-[11px] text-blue-400/80 mt-1 font-mono">Total Hits</div>
            </div>

            {/* Exams Completed */}
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-purple-500/40 transition">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-medium">Exams Taken</span>
                <FileCheck size={16} className="text-purple-400" />
              </div>
              <div className="text-2xl md:text-3xl font-extrabold text-white font-mono">
                {loading ? "..." : metrics?.totalExamsCompleted ?? 0}
              </div>
              <div className="text-[11px] text-purple-400/80 mt-1 font-mono">
                {metrics?.totalExamsStarted ?? 0} Started
              </div>
            </div>

            {/* Questions Answered */}
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-amber-500/40 transition">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-medium">Questions Solved</span>
                <HelpCircle size={16} className="text-amber-400" />
              </div>
              <div className="text-2xl md:text-3xl font-extrabold text-white font-mono">
                {loading ? "..." : metrics?.totalQuestionsAnswered ?? 0}
              </div>
              <div className="text-[11px] text-amber-400/80 mt-1 font-mono">Answered in CBT</div>
            </div>

            {/* Flashcard Reviews */}
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-cyan-500/40 transition">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-medium">Cards Flipped</span>
                <Layers size={16} className="text-cyan-400" />
              </div>
              <div className="text-2xl md:text-3xl font-extrabold text-white font-mono">
                {loading ? "..." : metrics?.totalFlashcardsReviewed ?? 0}
              </div>
              <div className="text-[11px] text-cyan-400/80 mt-1 font-mono">Active Recall</div>
            </div>

            {/* Summaries Read */}
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-rose-500/40 transition">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-medium">Notes Studied</span>
                <BookOpen size={16} className="text-rose-400" />
              </div>
              <div className="text-2xl md:text-3xl font-extrabold text-white font-mono">
                {loading ? "..." : metrics?.totalSummariesRead ?? 0}
              </div>
              <div className="text-[11px] text-rose-400/80 mt-1 font-mono">Chapter Crams</div>
            </div>
          </div>

          {/* Hosting & Analytics Status Banner */}
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-emerald-400 shrink-0" size={24} />
              <div>
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Vercel Web Analytics Ready</span>
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  When deployed on Vercel, visit metrics (countries, devices, live users) automatically populate in your Vercel Dashboard without code changes.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-white/10 hover:bg-white/15 text-white transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
