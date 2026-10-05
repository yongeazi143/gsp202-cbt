"use client";

import React, { useState } from "react";
import { Question, UserExamResult } from "@/lib/types";
import { CheckCircle2, XCircle, ChevronLeft, RotateCcw, Lightbulb, BookOpen, Bookmark } from "lucide-react";
import { motion } from "framer-motion";

interface ReviewScreenProps {
  questions: Question[];
  result: UserExamResult;
  onBackToScore: () => void;
  onRetake: () => void;
}

export function ReviewScreen({
  questions,
  result,
  onBackToScore,
  onRetake,
}: ReviewScreenProps) {
  const [filter, setFilter] = useState<"all" | "wrong" | "flagged">("all");

  const filteredQuestions = questions.filter((q) => {
    const userChoice = result.userAnswers[q.id];
    const isWrong = userChoice !== q.answer;
    const isFlagged = result.flaggedQuestionIds.includes(q.id);

    if (filter === "wrong") return isWrong;
    if (filter === "flagged") return isFlagged;
    return true;
  });

  return (
    <div className="min-h-screen w-full bg-[#080c14] text-slate-100 pb-16 subtle-grid">
      {/* Top sticky header */}
      <header className="bg-[#0b0f17]/95 backdrop-blur-md border-b border-white/10 px-3 sm:px-6 md:px-8 py-3 sticky top-0 z-30 shadow-xl flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onBackToScore}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-white/10 px-3 py-1.5 rounded-lg text-xs md:text-sm font-semibold cursor-pointer text-slate-300 hover:text-white transition"
          >
            <ChevronLeft size={16} />
            <span>Scorecard</span>
          </button>
          <span className="font-bold text-xs sm:text-sm hidden sm:inline text-white">
            Question-by-Question Solution Review
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Filter tabs */}
          <div className="bg-slate-900/90 border border-white/10 p-0.5 sm:p-1 rounded-xl flex text-[11px] sm:text-xs font-semibold">
            <button
              onClick={() => setFilter("all")}
              className={`px-2 sm:px-3 py-1 rounded-lg cursor-pointer transition ${
                filter === "all"
                  ? "bg-emerald-500 text-slate-950 font-black shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              All ({questions.length})
            </button>
            <button
              onClick={() => setFilter("wrong")}
              className={`px-2 sm:px-3 py-1 rounded-lg cursor-pointer transition ${
                filter === "wrong"
                  ? "bg-red-500 text-white font-black shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Wrong ({questions.filter((q) => result.userAnswers[q.id] !== q.answer).length})
            </button>
            <button
              onClick={() => setFilter("flagged")}
              className={`px-2 sm:px-3 py-1 rounded-lg cursor-pointer transition ${
                filter === "flagged"
                  ? "bg-amber-400 text-slate-950 font-black shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Flagged ({result.flaggedQuestionIds.length})
            </button>
          </div>

          <button
            onClick={onRetake}
            className="bg-slate-800 hover:bg-slate-700 text-white px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs font-bold border border-white/10 transition flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw size={13} />
            <span className="hidden sm:inline">New Test</span>
          </button>
        </div>
      </header>

      {/* Main Review List */}
      <main className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">
        {filteredQuestions.length === 0 ? (
          <div className="glass-panel p-16 text-center rounded-2xl border-white/10 text-slate-400">
            No questions match this filter criteria!
          </div>
        ) : (
          filteredQuestions.map((q, idx) => {
            const userChoice = result.userAnswers[q.id];
            const isCorrect = userChoice === q.answer;
            const isFlagged = result.flaggedQuestionIds.includes(q.id);

            return (
              <motion.div
                key={q.id || idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`glass-panel rounded-2xl p-6 md:p-7 border-2 transition ${
                  isCorrect ? "border-emerald-500/40" : "border-red-500/40"
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-emerald-400">
                      Q{questions.findIndex((x) => x.id === q.id) + 1}
                    </span>
                    <span className="text-xs bg-slate-900 border border-white/10 text-slate-300 px-2.5 py-0.5 rounded-lg font-mono">
                      Chapter {q.chapter}: {q.chapter_title}
                    </span>
                    {isFlagged && (
                      <span className="flex items-center gap-1 text-xs bg-amber-500/10 border border-amber-500/30 text-amber-300 px-2 py-0.5 rounded-md font-bold">
                        <Bookmark size={11} className="fill-amber-400" />
                        <span>Flagged</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-xs font-bold">
                    {isCorrect ? (
                      <span className="flex items-center gap-1.5 text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
                        <CheckCircle2 size={15} />
                        <span>Correct</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-red-300 bg-red-500/10 border border-red-500/30 px-3 py-1 rounded-full">
                        <XCircle size={15} />
                        <span>Incorrect</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Question Prompt */}
                <h3 className="text-base md:text-lg font-medium text-slate-100 mb-5 leading-relaxed">
                  {q.question}
                </h3>

                {/* Options list */}
                <div className="space-y-2.5 mb-5">
                  {(["A", "B", "C", "D"] as const).map((key) => {
                    const optText = q.options[key];
                    if (!optText) return null;

                    const isUserPick = userChoice === key;
                    const isRightAnswer = q.answer === key;

                    let optBg = "bg-slate-900/60 border-white/5 text-slate-300";
                    let badgeBg = "bg-slate-800 text-slate-400";

                    if (isRightAnswer) {
                      optBg = "bg-emerald-500/15 border-emerald-500/60 text-white font-semibold ring-1 ring-emerald-500/40";
                      badgeBg = "bg-emerald-500 text-slate-950 font-black";
                    } else if (isUserPick && !isRightAnswer) {
                      optBg = "bg-red-500/15 border-red-500/60 text-white font-semibold ring-1 ring-red-500/40";
                      badgeBg = "bg-red-500 text-white font-black";
                    }

                    return (
                      <div
                        key={key}
                        className={`flex items-start gap-3.5 p-3.5 rounded-xl border text-sm transition ${optBg}`}
                      >
                        <span className={`w-7 h-7 rounded-lg font-mono font-bold flex items-center justify-center shrink-0 border border-white/10 text-xs ${badgeBg}`}>
                          {key}
                        </span>
                        <div className="flex-1 pt-0.5">{optText}</div>
                        {isRightAnswer && (
                          <span className="text-[11px] font-mono bg-emerald-500 text-slate-950 px-2.5 py-0.5 rounded font-black uppercase">
                            Correct Answer
                          </span>
                        )}
                        {isUserPick && !isRightAnswer && (
                          <span className="text-[11px] font-mono bg-red-500 text-white px-2.5 py-0.5 rounded font-black uppercase">
                            Your Choice
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                <div className="bg-slate-900/90 border border-emerald-500/30 p-5 rounded-xl text-xs md:text-sm text-slate-300 leading-relaxed space-y-2">
                  <div className="flex items-center gap-2 font-bold text-emerald-400">
                    <Lightbulb size={16} />
                    <span>Textbook Solution & Academic Reference</span>
                  </div>
                  <p className="text-slate-200">{q.explanation}</p>
                  {q.source_pages && (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono font-semibold pt-1 border-t border-white/5">
                      <BookOpen size={13} />
                      <span>Textbook Source: Pages {q.source_pages}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </main>
    </div>
  );
}
