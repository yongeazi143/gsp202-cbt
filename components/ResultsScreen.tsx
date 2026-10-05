"use client";

import React, { useEffect } from "react";
import { UserExamResult } from "@/lib/types";
import { Award, CheckCircle, XCircle, RotateCcw, Eye, Clock, BarChart2, Zap, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

interface ResultsScreenProps {
  result: UserExamResult;
  onReviewAnswers: () => void;
  onRetake: () => void;
}

export function ResultsScreen({
  result,
  onReviewAnswers,
  onRetake,
}: ResultsScreenProps) {
  useEffect(() => {
    if (result.scorePercentage >= 50) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
    }
  }, [result.scorePercentage]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  const avgSecondsPerQ =
    result.attemptedQuestions > 0
      ? (result.timeSpentSeconds / result.attemptedQuestions).toFixed(1)
      : "0";

  const getGrade = (percentage: number) => {
    if (percentage >= 70)
      return {
        label: "Distinction (A Grade)",
        color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
        message: "Outstanding mastery! You are fully prepared to ace the GSP 202 exam.",
      };
    if (percentage >= 60)
      return {
        label: "Credit (B Grade)",
        color: "text-blue-400 bg-blue-500/10 border-blue-500/30",
        message: "Solid performance. Review your weak chapters below to reach an A.",
      };
    if (percentage >= 50)
      return {
        label: "Pass (C Grade)",
        color: "text-amber-400 bg-amber-500/10 border-amber-500/30",
        message: "You cleared the pass mark. Practice the speed drills to improve confidence.",
      };
    return {
      label: "Needs Immediate Revision (Below 50%)",
      color: "text-red-400 bg-red-500/10 border-red-500/30",
      message: "Drill chapter by chapter in Study Mode to lock down the core textbook definitions.",
    };
  };

  const grade = getGrade(result.scorePercentage);

  return (
    <div className="min-h-screen w-full bg-[#080c14] text-slate-100 flex flex-col justify-between p-6 md:p-12 subtle-grid">
      <div className="max-w-5xl mx-auto w-full space-y-8 flex-1 flex flex-col justify-center">
        {/* Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10"
        >
          <div>
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-emerald-400 font-bold block mb-1">
              OFFICIAL CBT SCORECARD
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-white">Examination Results</h1>
            <p className="text-xs text-slate-400 pt-0.5">Candidate: <span className="text-white font-bold uppercase">{result.userName}</span> • {new Date(result.date).toLocaleDateString()}</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onReviewAnswers}
              className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs md:text-sm py-3 px-5 rounded-xl border border-white/10 transition flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Eye size={16} />
              <span>Review Solutions</span>
            </button>
            <button
              onClick={onRetake}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs md:text-sm py-3 px-6 rounded-xl shadow-lg shadow-emerald-500/20 transition flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <RotateCcw size={16} />
              <span>Take New Test</span>
            </button>
          </div>
        </motion.div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="glass-panel p-5 rounded-2xl border-white/10"
          >
            <span className="text-[11px] font-mono uppercase text-slate-400 block mb-1">Score Achieved</span>
            <div className="text-3xl md:text-4xl font-mono font-black text-emerald-400">
              {result.correctAnswers} <span className="text-slate-500 font-light text-xl">/ {result.totalQuestions}</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-panel p-5 rounded-2xl border-white/10"
          >
            <span className="text-[11px] font-mono uppercase text-slate-400 block mb-1">Percentage</span>
            <div className="text-3xl md:text-4xl font-mono font-black text-blue-400">
              {Math.round(result.scorePercentage)}%
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="glass-panel p-5 rounded-2xl border-white/10"
          >
            <span className="text-[11px] font-mono uppercase text-slate-400 block mb-1">Total Time</span>
            <div className="text-3xl md:text-4xl font-mono font-black text-amber-400">
              {formatTime(result.timeSpentSeconds)}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="glass-panel p-5 rounded-2xl border-white/10"
          >
            <span className="text-[11px] font-mono uppercase text-slate-400 block mb-1">Speed Pace</span>
            <div className="text-3xl md:text-4xl font-mono font-black text-teal-400">
              {avgSecondsPerQ}s <span className="text-slate-500 font-light text-sm">/ q</span>
            </div>
          </motion.div>
        </div>

        {/* Verdict Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${grade.color}`}
        >
          <div className="flex items-center gap-3">
            <Award size={28} className="shrink-0" />
            <div>
              <div className="font-black text-base md:text-lg">{grade.label}</div>
              <p className="text-xs text-slate-300 pt-0.5">{grade.message}</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider px-3 py-1 bg-white/5 rounded-full border border-white/10">
            {result.mode === "exam" ? "25m Exam Pace" : "Study Mode"}
          </span>
        </motion.div>

        {/* Chapter Breakdown Matrix */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-panel p-6 rounded-2xl space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <BarChart2 size={16} className="text-emerald-400" />
              <span>Chapter Mastery Matrix</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">13 Chapters Tracked</span>
          </div>

          <div className="border border-white/10 rounded-xl overflow-hidden">
            <div className="max-h-64 overflow-y-auto custom-scrollbar">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-900/90 text-slate-400 uppercase font-mono text-[11px] border-b border-white/10 sticky top-0">
                  <tr>
                    <th className="py-3 px-4">Chapter</th>
                    <th className="py-3 px-4">Topic</th>
                    <th className="py-3 px-4 text-center">Score</th>
                    <th className="py-3 px-4 text-right">Mastery</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-200">
                  {Object.entries(result.chapterScores).map(([chNum, item]) => {
                    const pct = Math.round((item.correct / item.total) * 100) || 0;
                    return (
                      <tr key={chNum} className="hover:bg-white/5 transition">
                        <td className="py-2.5 px-4 font-mono font-bold text-emerald-400">CH {chNum.padStart(2, "0")}</td>
                        <td className="py-2.5 px-4 truncate max-w-sm font-medium">{item.title}</td>
                        <td className="py-2.5 px-4 text-center font-mono">
                          {item.correct} / {item.total}
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          <span
                            className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                              pct >= 70
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                : pct >= 50
                                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                : "bg-red-500/20 text-red-300 border border-red-500/30"
                            }`}
                          >
                            {pct}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
