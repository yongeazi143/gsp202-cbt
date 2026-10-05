"use client";

import React from "react";
import { Question } from "@/lib/types";
import { X } from "lucide-react";

interface QuestionNavigatorProps {
  questions: Question[];
  currentIndex: number;
  userAnswers: Record<string, "A" | "B" | "C" | "D">;
  flaggedIds: string[];
  onSelectQuestion: (index: number) => void;
  onClose?: () => void;
}

export function QuestionNavigator({
  questions,
  currentIndex,
  userAnswers,
  flaggedIds,
  onSelectQuestion,
  onClose,
}: QuestionNavigatorProps) {
  const attemptedCount = Object.keys(userAnswers).length;

  return (
    <aside className="w-full md:w-64 bg-[#0a0e17]/95 md:bg-[#0a0e17]/80 backdrop-blur-md border-r border-white/10 flex flex-col h-full select-none">
      {/* Attempt counter banner */}
      <div className="p-4 bg-slate-900/60 border-b border-white/10 flex items-center justify-between">
        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
          ATTEMPTED MATRIX
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            {attemptedCount} / {questions.length}
          </span>
          {onClose && (
            <button
              onClick={onClose}
              className="md:hidden p-1 text-slate-400 hover:text-white rounded hover:bg-white/10 transition"
              title="Close Matrix"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Grid container */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <div className="grid grid-cols-5 gap-2">
          {questions.map((q, idx) => {
            const isCurrent = idx === currentIndex;
            const isAttempted = Boolean(userAnswers[q.id]);
            const isFlagged = flaggedIds.includes(q.id);

            let cellStyle = "bg-slate-900/60 text-slate-400 border border-white/5 hover:border-white/20 hover:text-white";

            if (isAttempted) {
              cellStyle = "bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 font-bold";
            }

            if (isCurrent) {
              cellStyle = "border-2 border-emerald-400 bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/30 scale-105 z-10";
            }

            if (isFlagged && !isCurrent) {
              cellStyle = "bg-amber-500/20 border border-amber-500 text-amber-300 font-bold";
            }

            return (
              <button
                key={q.id || idx}
                onClick={() => onSelectQuestion(idx)}
                className={`relative h-10 rounded-lg text-xs font-mono flex items-center justify-center transition-all cursor-pointer ${cellStyle}`}
                title={`Question ${idx + 1}${isAttempted ? " (Answered)" : ""}${isFlagged ? " (Flagged)" : ""}`}
              >
                {idx + 1}
                {isFlagged && !isCurrent && (
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-amber-400 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="p-3.5 bg-slate-900/90 border-t border-white/10 text-[11px] text-slate-400 grid grid-cols-2 gap-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-emerald-500/30 border border-emerald-500/50" />
          <span>Attempted</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-slate-800 border border-white/10" />
          <span>Pending</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-emerald-500" />
          <span>Current</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-amber-500/40 border border-amber-500" />
          <span>Flagged</span>
        </div>
      </div>
    </aside>
  );
}
