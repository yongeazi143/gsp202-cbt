"use client";

import React, { useState } from "react";
import { 
  X, 
  BookOpen, 
  FileCheck2, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  Lock, 
  Heart, 
  ChevronRight, 
  Layers, 
  Flame,
  User,
  GraduationCap
} from "lucide-react";
import { CHAPTER_LIST } from "@/lib/types";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection?: "dashboard" | "workbook" | "summaries" | "flashcards";
  userName?: string;
  onNavigateDashboard: () => void;
  onNavigateWorkbook: () => void;
  onNavigateSummaries: () => void;
  onNavigateFlashcards: () => void;
  onLaunchChapterDrill?: (chNum: number) => void;
}

export function MobileSidebar({
  isOpen,
  onClose,
  activeSection = "dashboard",
  userName = "Israel",
  onNavigateDashboard,
  onNavigateWorkbook,
  onNavigateSummaries,
  onNavigateFlashcards,
  onLaunchChapterDrill,
}: MobileSidebarProps) {
  const [showChapters, setShowChapters] = useState(false);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 md:hidden bg-black/80 backdrop-blur-sm flex justify-start transition-all"
      onClick={onClose}
    >
      <div 
        className="w-[85%] max-w-[320px] h-full bg-[#0a0e17] border-r border-white/10 shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-left duration-250"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black text-sm shadow-md shadow-emerald-500/20">
              <GraduationCap size={20} className="text-slate-950" />
            </div>
            <div>
              <div className="text-sm font-extrabold text-white tracking-tight flex items-center gap-1.5">
                <span>GSP 202 CBT</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                Candidate: <strong className="text-emerald-300 font-bold uppercase">{userName || "STUDENT"}</strong>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer border border-white/5"
            title="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Nav Content */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-4 custom-scrollbar">
          {/* Main Navigation Links */}
          <div className="space-y-1.5">
            <div className="px-2 pb-1 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
              PLATFORM STUDY SUITE
            </div>

            {/* CBT Exam Dashboard */}
            <button
              onClick={() => {
                onNavigateDashboard();
                onClose();
              }}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition cursor-pointer text-left ${
                activeSection === "dashboard"
                  ? "bg-emerald-500/15 border border-emerald-500/40 text-white font-bold"
                  : "bg-slate-900/60 hover:bg-slate-800/80 border border-white/5 text-slate-300 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${activeSection === "dashboard" ? "bg-emerald-500 text-slate-950" : "bg-emerald-500/10 text-emerald-400"}`}>
                  <Zap size={16} />
                </div>
                <div>
                  <div className="text-xs font-bold">CBT Examination</div>
                  <div className="text-[10px] text-slate-400 font-mono">Exam & Practice Drills</div>
                </div>
              </div>
              <ChevronRight size={14} className={activeSection === "dashboard" ? "text-emerald-400" : "text-slate-600"} />
            </button>

            {/* Workbook Answers */}
            <button
              onClick={() => {
                onNavigateWorkbook();
                onClose();
              }}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition cursor-pointer text-left ${
                activeSection === "workbook"
                  ? "bg-emerald-500/15 border border-emerald-500/40 text-white font-bold"
                  : "bg-slate-900/60 hover:bg-slate-800/80 border border-white/5 text-slate-300 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${activeSection === "workbook" ? "bg-emerald-500 text-slate-950" : "bg-emerald-500/10 text-emerald-400"}`}>
                  <FileCheck2 size={16} />
                </div>
                <div>
                  <div className="text-xs font-bold flex items-center gap-1.5">
                    <span>Workbook Answers</span>
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-mono font-bold">265 Qs</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">Physical CA 13 Chapters</div>
                </div>
              </div>
              <ChevronRight size={14} className={activeSection === "workbook" ? "text-emerald-400" : "text-slate-600"} />
            </button>

            {/* Chapter Summaries */}
            <button
              onClick={() => {
                onNavigateSummaries();
                onClose();
              }}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition cursor-pointer text-left ${
                activeSection === "summaries"
                  ? "bg-emerald-500/15 border border-emerald-500/40 text-white font-bold"
                  : "bg-slate-900/60 hover:bg-slate-800/80 border border-white/5 text-slate-300 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${activeSection === "summaries" ? "bg-emerald-500 text-slate-950" : "bg-emerald-500/10 text-emerald-400"}`}>
                  <BookOpen size={16} />
                </div>
                <div>
                  <div className="text-xs font-bold flex items-center gap-1.5">
                    <span>Chapter Summaries</span>
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-mono font-bold">13 Chs</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">Executive High-Yield Notes</div>
                </div>
              </div>
              <ChevronRight size={14} className={activeSection === "summaries" ? "text-emerald-400" : "text-slate-600"} />
            </button>

            {/* 3D Flashcards */}
            <button
              onClick={() => {
                onNavigateFlashcards();
                onClose();
              }}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition cursor-pointer text-left ${
                activeSection === "flashcards"
                  ? "bg-emerald-500/15 border border-emerald-500/40 text-white font-bold"
                  : "bg-slate-900/60 hover:bg-slate-800/80 border border-white/5 text-slate-300 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${activeSection === "flashcards" ? "bg-emerald-500 text-slate-950" : "bg-blue-500/10 text-blue-400"}`}>
                  <Sparkles size={16} />
                </div>
                <div>
                  <div className="text-xs font-bold flex items-center gap-1.5">
                    <span>3D Flashcards</span>
                    <span className="text-[9px] bg-blue-500/20 text-blue-300 px-1.5 py-0.2 rounded font-mono font-bold">328 Cards</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">Spaced Repetition Memory</div>
                </div>
              </div>
              <ChevronRight size={14} className={activeSection === "flashcards" ? "text-emerald-400" : "text-slate-600"} />
            </button>
          </div>

          {/* Quick Chapter Drills (Collapsible) */}
          {onLaunchChapterDrill && (
            <div className="pt-2 border-t border-white/10 space-y-2">
              <button
                onClick={() => setShowChapters((prev) => !prev)}
                className="w-full flex items-center justify-between px-2 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 hover:text-slate-200 transition"
              >
                <span>QUICK CHAPTER DRILLS (1–13)</span>
                <span className="text-emerald-400 font-bold">{showChapters ? "Hide" : "Show"}</span>
              </button>

              {showChapters && (
                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  {CHAPTER_LIST.map((ch) => (
                    <button
                      key={ch.number}
                      onClick={() => {
                        onLaunchChapterDrill(ch.number);
                        onClose();
                      }}
                      className="bg-slate-900/80 hover:bg-emerald-500/20 border border-white/5 hover:border-emerald-500/30 p-2 rounded-lg text-left transition cursor-pointer group"
                    >
                      <div className="text-[10px] font-mono text-emerald-400 font-bold group-hover:text-emerald-300">
                        Chapter {ch.number}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {ch.title}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Quick Links / System Info */}
          <div className="pt-2 border-t border-white/10 space-y-1">
            <div className="px-2 pb-1 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
              SYSTEM
            </div>
            <a
              href="/authentice-admin"
              className="w-full flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-900/40 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition text-xs font-semibold"
            >
              <Lock size={14} className="text-slate-400" />
              <span>Admin Analytics Portal</span>
            </a>
          </div>
        </div>

        {/* Footer info & CTA */}
        <div className="p-4 border-t border-white/10 bg-slate-950/80 space-y-3">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Question Bank: <strong className="text-white font-bold">493 Qs</strong></span>
            <span className="text-emerald-400 font-bold">v2.0 Clean</span>
          </div>

          <button
            onClick={() => {
              onNavigateDashboard();
              onClose();
            }}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer"
          >
            <Zap size={14} className="fill-slate-950" />
            <span>Go To Exam Setup</span>
          </button>
        </div>
      </div>
    </div>
  );
}
