"use client";

import React from "react";
import { LogOut, Bookmark, User, Clock, Calculator as CalcIcon, BookOpen, ShieldAlert, LayoutGrid } from "lucide-react";
import { TestMode } from "@/lib/types";

interface HeaderProps {
  userName: string;
  mode: TestMode;
  currentChapterTitle?: string;
  timeRemainingSeconds: number;
  isFlagged: boolean;
  onToggleFlag: () => void;
  onExit: () => void;
  onOpenCalc?: () => void;
  onOpenNavigator?: () => void;
}

export function Header({
  userName,
  mode,
  currentChapterTitle,
  timeRemainingSeconds,
  isFlagged,
  onExit,
  onToggleFlag,
  onOpenCalc,
  onOpenNavigator,
}: HeaderProps) {

  const formatTime = (secs: number) => {
    if (secs < 0) secs = 0;
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const isLowTime = mode === "exam" && timeRemainingSeconds < 300; // < 5 mins

  return (
    <header className="bg-[#0b0f17]/90 backdrop-blur-md border-b border-white/10 text-white px-4 md:px-8 py-3 flex items-center justify-between shadow-lg select-none sticky top-0 z-30">
      {/* Left controls */}
      <div className="flex items-center gap-1.5 sm:gap-2.5">
        <button
          onClick={onExit}
          className="flex items-center gap-1.5 text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 px-2.5 sm:px-3 py-1.5 rounded-lg transition cursor-pointer text-slate-300 hover:text-white"
          title="Exit to Setup"
        >
          <LogOut size={15} />
          <span className="hidden sm:inline">Exit Exam</span>
        </button>

        {onOpenCalc && (
          <button
            onClick={onOpenCalc}
            className="flex items-center gap-1.5 text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 px-2 sm:px-3 py-1.5 rounded-lg transition cursor-pointer text-slate-300 hover:text-white"
            title="Calculator"
          >
            <CalcIcon size={15} />
            <span className="hidden sm:inline">Calculator</span>
          </button>
        )}

        <button
          onClick={onToggleFlag}
          className={`flex items-center gap-1.5 text-xs font-semibold px-2 sm:px-3 py-1.5 rounded-lg transition cursor-pointer border ${
            isFlagged
              ? "bg-amber-500/20 border-amber-500/50 text-amber-300"
              : "bg-white/5 hover:bg-white/10 border-white/10 text-slate-300 hover:text-white"
          }`}
          title="Flag question for review"
        >
          <Bookmark size={15} className={isFlagged ? "fill-amber-400" : ""} />
          <span className="hidden xs:inline">{isFlagged ? "Flagged" : "Flag"}</span>
        </button>

        {/* Mobile Palette Button */}
        {onOpenNavigator && (
          <button
            onClick={onOpenNavigator}
            className="md:hidden flex items-center gap-1.5 text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-2.5 py-1.5 rounded-lg transition cursor-pointer"
            title="View Questions Grid"
          >
            <LayoutGrid size={15} />
            <span className="hidden xs:inline">Questions</span>
          </button>
        )}
      </div>

      {/* Center Course/Chapter Pill */}
      <div className="hidden lg:flex items-center gap-2 max-w-lg truncate">
        <div className="bg-slate-900/80 border border-emerald-500/30 px-3.5 py-1 rounded-full text-xs font-semibold text-emerald-300 flex items-center gap-2 truncate">
          <BookOpen size={14} className="text-emerald-400 shrink-0" />
          <span className="truncate">GSP 202 • {currentChapterTitle || "Peace & Conflict"}</span>
        </div>
        <span
          className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded font-bold ${
            mode === "exam" ? "bg-red-500/20 text-red-300 border border-red-500/30" : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
          }`}
        >
          {mode === "exam" ? "Exam Mode" : "Study Mode"}
        </span>
      </div>

      {/* Right User & High-Impact Countdown Timer */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xs font-bold font-mono">
            {userName ? userName.slice(0, 2).toUpperCase() : "IS"}
          </div>
          <span className="tracking-wide uppercase font-bold text-white hidden md:inline">
            {userName || "STUDENT"}
          </span>
        </div>

        {mode === "exam" && (
          <div
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-mono text-sm md:text-base font-extrabold shadow-lg transition-all ${
              isLowTime
                ? "bg-red-600/30 border border-red-500 text-red-200 animate-pulse"
                : "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300"
            }`}
          >
            <Clock size={16} className={isLowTime ? "text-red-400 animate-spin" : "text-emerald-400"} />
            <span>{formatTime(timeRemainingSeconds)}</span>
          </div>
        )}
      </div>
    </header>
  );
}
