"use client";

import React from "react";
import { LogOut, Bookmark, Clock, BookOpen, Menu } from "lucide-react";
import { TestMode } from "@/lib/types";

interface HeaderProps {
  userName: string;
  mode: TestMode;
  currentChapterTitle?: string;
  timeRemainingSeconds: number;
  isFlagged: boolean;
  onToggleFlag: () => void;
  onExit: () => void;
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
    <header className="bg-[#0b0f17]/90 backdrop-blur-md border-b border-white/10 text-white px-3 sm:px-6 md:px-8 py-2.5 sm:py-3 flex items-center justify-between shadow-lg select-none sticky top-0 z-30">
      {/* Left controls - Clean Icon Buttons without text */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Mobile Left Sidebar Menu Button */}
        {onOpenNavigator && (
          <button
            onClick={onOpenNavigator}
            className="md:hidden p-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 transition cursor-pointer active:scale-95"
            title="Navigation Menu"
            aria-label="Navigation Menu"
          >
            <Menu size={18} />
          </button>
        )}

        {/* Exit Button */}
        <button
          onClick={onExit}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition cursor-pointer text-slate-300 hover:text-white active:scale-95"
          title="Exit Session"
          aria-label="Exit Session"
        >
          <LogOut size={16} />
        </button>

        {/* Flag Button */}
        <button
          onClick={onToggleFlag}
          className={`p-2 rounded-xl transition cursor-pointer border active:scale-95 ${
            isFlagged
              ? "bg-amber-500/20 border-amber-500/50 text-amber-300"
              : "bg-white/5 hover:bg-white/10 border-white/10 text-slate-300 hover:text-white"
          }`}
          title={isFlagged ? "Question flagged" : "Flag question"}
          aria-label={isFlagged ? "Question flagged" : "Flag question"}
        >
          <Bookmark size={16} className={isFlagged ? "fill-amber-400" : ""} />
        </button>
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
            className={`flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-xl font-mono text-sm md:text-base font-extrabold shadow-md transition-all ${
              isLowTime
                ? "bg-red-600/30 border border-red-500 text-red-200"
                : "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300"
            }`}
          >
            <Clock size={16} className={isLowTime ? "text-red-400" : "text-emerald-400"} />
            <span>{formatTime(timeRemainingSeconds)}</span>
          </div>
        )}
      </div>
    </header>
  );
}
