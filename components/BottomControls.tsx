"use client";

import React from "react";
import { ChevronLeft, ChevronRight, CheckSquare, Eye, EyeOff, Zap } from "lucide-react";
import { TestMode } from "@/lib/types";

interface BottomControlsProps {
  mode: TestMode;
  currentIndex: number;
  totalQuestions: number;
  hasAnsweredCurrent: boolean;
  showExplanation: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onToggleExplanation: () => void;
  onSubmit: () => void;
}

export function BottomControls({
  mode,
  currentIndex,
  totalQuestions,
  hasAnsweredCurrent,
  showExplanation,
  onPrevious,
  onNext,
  onToggleExplanation,
  onSubmit,
}: BottomControlsProps) {
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === totalQuestions - 1;

  return (
    <footer className="fixed md:sticky bottom-0 left-0 right-0 z-40 shrink-0 w-full bg-[#0b0f17]/95 backdrop-blur-lg border-t border-white/10 px-3 sm:px-6 md:px-8 py-2.5 sm:py-3 shadow-2xl pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-2 sm:gap-3">
        {/* Previous Button */}
        <button
          onClick={onPrevious}
          disabled={isFirst}
          className={`flex items-center gap-1.5 px-3.5 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition cursor-pointer shrink-0 ${
            isFirst
              ? "bg-slate-900 border border-white/5 text-slate-600 cursor-not-allowed"
              : "bg-slate-900 hover:bg-slate-800 border border-white/10 text-white hover:border-white/20 active:scale-95"
          }`}
          title="Previous question"
        >
          <ChevronLeft size={16} />
          <span>Prev</span>
        </button>

        {/* Center Button (Submit or Toggle Explanation) */}
        <div className="flex items-center gap-2">
          {mode === "study" ? (
            <button
              onClick={onToggleExplanation}
              disabled={!hasAnsweredCurrent}
              className={`flex items-center gap-1.5 px-3.5 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition cursor-pointer border ${
                !hasAnsweredCurrent
                  ? "bg-slate-900 border-white/5 text-slate-600 cursor-not-allowed"
                  : showExplanation
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20"
                  : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20"
              }`}
              title={showExplanation ? "Hide solution rationale" : "Show solution rationale"}
            >
              {showExplanation ? <EyeOff size={15} /> : <Eye size={15} />}
              <span>{showExplanation ? "Hide Info" : "Explain"}</span>
            </button>
          ) : (
            <button
              onClick={onSubmit}
              className="flex items-center gap-1.5 px-3.5 sm:px-6 py-2.5 rounded-xl font-black text-xs sm:text-sm text-slate-950 bg-red-500 hover:bg-red-400 shadow-md shadow-red-500/20 transition cursor-pointer active:scale-95 uppercase tracking-wider"
              title="Submit examination"
            >
              <CheckSquare size={15} />
              <span>Submit</span>
            </button>
          )}
        </div>

        {/* Next / Finish Button */}
        {mode === "study" && isLast ? (
          <button
            onClick={onSubmit}
            className="flex items-center gap-1.5 px-4 sm:px-6 py-2.5 rounded-xl font-black text-xs sm:text-sm text-slate-950 bg-emerald-500 hover:bg-emerald-400 shadow-md shadow-emerald-500/20 transition cursor-pointer active:scale-95 uppercase tracking-wide shrink-0"
            title="Finish study session"
          >
            <span>Finish</span>
            <CheckSquare size={15} />
          </button>
        ) : (
          <button
            onClick={onNext}
            disabled={isLast}
            className={`flex items-center gap-1.5 px-4 sm:px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition cursor-pointer shrink-0 ${
              isLast
                ? "bg-slate-900 border border-white/5 text-slate-600 cursor-not-allowed"
                : "bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black shadow-md shadow-emerald-500/20 active:scale-95"
            }`}
            title="Next question"
          >
            <span className="font-black">Next</span>
            <ChevronRight size={16} />
          </button>
        )}
      </div>
    </footer>
  );
}
