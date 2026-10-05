"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Lock,
  Activity,
  Users,
  Globe,
  FileCheck,
  CheckCircle2,
  BookOpen,
  Sparkles,
  RefreshCw,
  ArrowLeft,
  LogOut,
  HelpCircle,
  Copy,
  Check,
  Terminal,
  Server,
  TrendingUp,
} from "lucide-react";
import { fetchPlatformMetrics, PlatformMetrics } from "@/lib/metrics";

export default function AuthenticeAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passkey, setPasskey] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [loadingMetrics, setLoadingMetrics] = useState<boolean>(false);
  const [metrics, setMetrics] = useState<PlatformMetrics | null>(null);
  const [copiedJson, setCopiedJson] = useState<boolean>(false);

  // Check existing session
  useEffect(() => {
    const session = sessionStorage.getItem("gsp202_admin_session");
    if (session === "authorized") {
      setIsAuthenticated(true);
      loadMetrics();
    }
  }, []);

  const loadMetrics = async () => {
    setLoadingMetrics(true);
    try {
      const data = await fetchPlatformMetrics();
      setMetrics(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingMetrics(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = passkey.trim().toLowerCase();
    if (cleanPin === "2024" || cleanPin === "admin" || cleanPin === "israel") {
      sessionStorage.setItem("gsp202_admin_session", "authorized");
      setIsAuthenticated(true);
      setErrorMsg("");
      setPasskey("");
      loadMetrics();
    } else {
      setErrorMsg("Unauthorized: Invalid Admin Passkey");
      setPasskey("");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("gsp202_admin_session");
    setIsAuthenticated(false);
    setMetrics(null);
  };

  const handleCopyJson = () => {
    if (!metrics) return;
    navigator.clipboard.writeText(JSON.stringify(metrics, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  // If not authenticated, show secure terminal login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full bg-[#070b12] text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md bg-[#0c121d] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl relative z-10"
        >
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 shadow-lg shadow-emerald-500/10">
              <Shield size={28} />
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400 font-mono font-bold uppercase tracking-wider mb-2">
              <Terminal size={11} />
              <span>Admin Gateway</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Command Authentication
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Private platform telemetry & usage analytics
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono font-bold uppercase text-slate-400 mb-1.5">
                Master Passkey
              </label>
              <div className="relative">
                <input
                  type="password"
                  autoFocus
                  value={passkey}
                  onChange={(e) => {
                    setPasskey(e.target.value);
                    if (errorMsg) setErrorMsg("");
                  }}
                  placeholder="Enter administrator passkey..."
                  className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-4 py-3 text-sm text-center tracking-widest text-white font-mono focus:outline-none focus:border-emerald-500 transition placeholder:text-slate-600 placeholder:tracking-normal"
                />
              </div>
            </div>

            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs text-center font-medium"
              >
                {errorMsg}
              </motion.div>
            )}

            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3 px-4 rounded-xl transition text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20 active:scale-98"
            >
              <Lock size={16} />
              <span>Authenticate & Enter</span>
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-white/5 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-emerald-400 transition"
            >
              <ArrowLeft size={14} />
              <span>Return to GSP 202 Student CBT</span>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // Authenticated Telemetry Dashboard
  return (
    <div className="min-h-screen w-full bg-[#070b12] text-slate-100 p-4 sm:p-8 md:p-12 relative">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Top Navigation & Status */}
        <header className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] text-emerald-400 font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>System Online • Live Telemetry</span>
              </span>
              <span className="text-xs text-slate-500 font-mono">/authentice-admin</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <Activity size={26} className="text-emerald-400" />
              <span>GSP 202 Platform Telemetry</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Active student engagements, exam completions, and question bank metrics
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={loadMetrics}
              disabled={loadingMetrics}
              className="bg-slate-900/90 hover:bg-slate-800 border border-white/10 text-white font-semibold py-2.5 px-3.5 rounded-xl transition text-xs flex items-center gap-2 cursor-pointer shadow-md"
              title="Refresh live counters"
            >
              <RefreshCw size={14} className={loadingMetrics ? "animate-spin text-emerald-400" : "text-slate-400"} />
              <span>Refresh</span>
            </button>

            <button
              onClick={handleCopyJson}
              className="bg-slate-900/90 hover:bg-slate-800 border border-white/10 text-white font-semibold py-2.5 px-3.5 rounded-xl transition text-xs flex items-center gap-2 cursor-pointer shadow-md"
              title="Copy telemetry snapshot as JSON"
            >
              {copiedJson ? (
                <>
                  <Check size={14} className="text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={14} className="text-slate-400" />
                  <span>Export JSON</span>
                </>
              )}
            </button>

            <Link
              href="/"
              className="bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold py-2.5 px-3.5 rounded-xl transition text-xs flex items-center gap-1.5"
            >
              <ArrowLeft size={14} />
              <span>Open CBT Portal</span>
            </Link>

            <button
              onClick={handleLogout}
              className="bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 font-semibold py-2.5 px-3 rounded-xl transition text-xs flex items-center gap-1.5 cursor-pointer"
              title="Lock Admin Terminal"
            >
              <LogOut size={14} />
              <span>Exit</span>
            </button>
          </div>
        </header>

        {/* Primary Metric KPI Cards */}
        <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Unique Visitors */}
          <div className="bg-[#0d1422] border border-white/10 rounded-2xl p-4 sm:p-5 relative overflow-hidden group hover:border-emerald-500/40 transition">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Unique Visitors
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Users size={16} />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              {loadingMetrics ? "..." : metrics?.totalVisitors ?? 1}
            </div>
            <div className="text-[11px] text-emerald-400/90 mt-1 font-mono flex items-center gap-1">
              <TrendingUp size={12} />
              <span>Unique student devices</span>
            </div>
          </div>

          {/* Platform Impressions */}
          <div className="bg-[#0d1422] border border-white/10 rounded-2xl p-4 sm:p-5 relative overflow-hidden group hover:border-blue-500/40 transition">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Platform Hits
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <Globe size={16} />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              {loadingMetrics ? "..." : metrics?.totalPageViews ?? 1}
            </div>
            <div className="text-[11px] text-blue-400/90 mt-1 font-mono">
              Total sessions loaded
            </div>
          </div>

          {/* Exams Started */}
          <div className="bg-[#0d1422] border border-white/10 rounded-2xl p-4 sm:p-5 relative overflow-hidden group hover:border-amber-500/40 transition">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Exams Started
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <FileCheck size={16} />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              {loadingMetrics ? "..." : metrics?.totalExamsStarted ?? 0}
            </div>
            <div className="text-[11px] text-amber-400/90 mt-1 font-mono">
              Timed test launches
            </div>
          </div>

          {/* Exams Completed */}
          <div className="bg-[#0d1422] border border-white/10 rounded-2xl p-4 sm:p-5 relative overflow-hidden group hover:border-teal-500/40 transition">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Exams Completed
              </span>
              <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center">
                <CheckCircle2 size={16} />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              {loadingMetrics ? "..." : metrics?.totalExamsCompleted ?? 0}
            </div>
            <div className="text-[11px] text-teal-400/90 mt-1 font-mono">
              Submitted for grading
            </div>
          </div>

          {/* Questions Solved */}
          <div className="bg-[#0d1422] border border-white/10 rounded-2xl p-4 sm:p-5 relative overflow-hidden group hover:border-purple-500/40 transition">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Questions Solved
              </span>
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <HelpCircle size={16} />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              {loadingMetrics ? "..." : metrics?.totalQuestionsAnswered ?? 0}
            </div>
            <div className="text-[11px] text-purple-400/90 mt-1 font-mono">
              From 252 question pool
            </div>
          </div>

          {/* Flashcards Reviewed */}
          <div className="bg-[#0d1422] border border-white/10 rounded-2xl p-4 sm:p-5 relative overflow-hidden group hover:border-pink-500/40 transition">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Flashcards Flipped
              </span>
              <div className="w-8 h-8 rounded-lg bg-pink-500/10 text-pink-400 flex items-center justify-center">
                <Sparkles size={16} />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              {loadingMetrics ? "..." : metrics?.totalFlashcardsReviewed ?? 0}
            </div>
            <div className="text-[11px] text-pink-400/90 mt-1 font-mono">
              Flashcard study interactions
            </div>
          </div>

          {/* Summaries Read */}
          <div className="bg-[#0d1422] border border-white/10 rounded-2xl p-4 sm:p-5 relative overflow-hidden group hover:border-cyan-500/40 transition">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Summaries Read
              </span>
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                <BookOpen size={16} />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              {loadingMetrics ? "..." : metrics?.totalSummariesRead ?? 0}
            </div>
            <div className="text-[11px] text-cyan-400/90 mt-1 font-mono">
              Chapter guide consultations
            </div>
          </div>

          {/* Question Bank Coverage */}
          <div className="bg-[#0d1422] border border-white/10 rounded-2xl p-4 sm:p-5 relative overflow-hidden group hover:border-emerald-500/40 transition">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Question Bank
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Server size={16} />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              252 Qs
            </div>
            <div className="text-[11px] text-emerald-400/90 mt-1 font-mono">
              13 Chapters + Ch 1 WB (24 Qs)
            </div>
          </div>
        </section>

        {/* Real-time Event Feed */}
        <section className="bg-[#0c121d] border border-white/10 rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Activity size={18} className="text-emerald-400" />
              <h2 className="text-sm sm:text-base font-bold text-white">
                Live Activity Stream (Recent 15 Events)
              </h2>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Synced from local telemetry engine
            </span>
          </div>

          {metrics?.recentEvents && metrics.recentEvents.length > 0 ? (
            <div className="divide-y divide-white/5 max-h-96 overflow-y-auto custom-scrollbar">
              {metrics.recentEvents.map((evt, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                    <div>
                      <span className="font-mono font-bold text-slate-200 uppercase">
                        {evt.type.replace(/_/g, " ")}
                      </span>
                      {evt.details && Object.keys(evt.details).length > 0 && (
                        <span className="text-[11px] text-slate-500 ml-2 font-mono">
                          {JSON.stringify(evt.details)}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500 shrink-0">
                    {new Date(evt.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-slate-500 font-mono">
              No recent events logged yet. Activities will appear here as candidates use the platform.
            </div>
          )}
        </section>

        {/* Platform Footnote */}
        <footer className="pt-4 text-center text-xs text-slate-500 font-mono">
          UNN GSP 202 CBT System Administration Terminal • Private & Confidential
        </footer>
      </div>
    </div>
  );
}
