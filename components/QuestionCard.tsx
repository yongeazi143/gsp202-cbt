"use client";

import React from "react";
import { Question, TestMode } from "@/lib/types";
import { CheckCircle2, XCircle, Sparkles, BookOpen, Lightbulb, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  mode: TestMode;
  selectedOption?: "A" | "B" | "C" | "D";
  showExplanation: boolean;
  onSelectOption: (option: "A" | "B" | "C" | "D") => void;
}

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  mode,
  selectedOption,
  showExplanation,
  onSelectOption,
}: QuestionCardProps) {
  const optionsKeys: Array<"A" | "B" | "C" | "D"> = ["A", "B", "C", "D"];
  const isStudy = mode === "study";
  const hasAnswered = Boolean(selectedOption);

  return (
    <div className="flex-1 flex flex-col overflow-y-auto p-4 md:p-10 w-full max-w-5xl mx-auto custom-scrollbar">
      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="flex-1 flex flex-col justify-between"
        >
          <div>
            {/* Top Question Metas */}
            <div className="flex flex-wrap items-center justify-between pb-4 mb-6 border-b border-white/10 gap-3">
              <div className="flex items-center gap-3">
                <span className="text-xl md:text-2xl font-black text-white font-mono">
                  {questionNumber.toString().padStart(2, "0")} <span className="text-slate-500 font-light text-base">/ {totalQuestions}</span>
                </span>
                <span className="text-xs bg-slate-900 border border-white/10 text-emerald-400 font-mono font-bold px-2.5 py-1 rounded-lg">
                  Chapter {question.chapter}
                </span>
                {(question.type === "workbook_ca" || (question as any).is_workbook) && (
                  <span className="text-xs bg-purple-500/20 border border-purple-500/40 text-purple-300 font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                    <span>📝 CA Workbook Question</span>
                  </span>
                )}
              </div>

              {question.prediction_weight && (
                <div
                  className={`flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-semibold border ${
                    question.prediction_weight === "high"
                      ? "bg-amber-500/10 text-amber-300 border-amber-500/30"
                      : "bg-blue-500/10 text-blue-300 border-blue-500/30"
                  }`}
                >
                  <Sparkles size={13} className={question.prediction_weight === "high" ? "text-amber-400" : "text-blue-400"} />
                  <span>
                    {question.prediction_weight === "high" ? "High Exam Frequency" : "Core Concept"}
                  </span>
                </div>
              )}
            </div>

            {/* Question Text */}
            <div className="mb-8">
              <h2 className="text-lg md:text-2xl font-medium text-slate-100 leading-relaxed tracking-normal">
                {question.question}
              </h2>
            </div>

            {/* Options A, B, C, D */}
            <div className="grid grid-cols-1 gap-3.5 mb-8">
              {optionsKeys.map((key) => {
                const optionText = question.options[key];
                if (!optionText) return null;

                const isSelected = selectedOption === key;
                const isCorrect = question.answer === key;

                let containerStyle =
                  "border-white/10 bg-slate-900/60 hover:bg-slate-800/80 hover:border-white/20 text-slate-200";
                let badgeStyle = "bg-slate-800 text-slate-300 border-white/10";
                let radioStyle = "border-slate-600";

                if (isSelected) {
                  containerStyle =
                    "border-emerald-500/80 bg-emerald-500/10 text-white shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/50";
                  badgeStyle = "bg-emerald-500 text-slate-950 font-black border-emerald-500";
                  radioStyle = "border-emerald-400 bg-emerald-400";
                }

                // Study mode instant feedback
                if (isStudy && hasAnswered) {
                  if (isCorrect) {
                    containerStyle =
                      "border-emerald-500 bg-emerald-500/20 text-emerald-100 ring-2 ring-emerald-400";
                    badgeStyle = "bg-emerald-500 text-slate-950 font-black";
                    radioStyle = "border-emerald-400 bg-emerald-400";
                  } else if (isSelected && !isCorrect) {
                    containerStyle =
                      "border-red-500 bg-red-500/20 text-red-100 ring-2 ring-red-400";
                    badgeStyle = "bg-red-500 text-white font-black";
                    radioStyle = "border-red-400 bg-red-400";
                  }
                }

                return (
                  <motion.div
                    key={key}
                    whileHover={{ scale: 1.006 }}
                    whileTap={{ scale: 0.995 }}
                    onClick={() => onSelectOption(key)}
                    className={`flex items-start gap-4 p-4 md:p-5 rounded-xl border cursor-pointer transition-all select-none ${containerStyle}`}
                  >
                    {/* Letter badge */}
                    <div
                      className={`w-8 h-8 rounded-lg font-mono font-bold text-sm flex items-center justify-center shrink-0 border transition ${badgeStyle}`}
                    >
                      {key}
                    </div>

                    {/* Option Text */}
                    <div className="flex-1 text-sm md:text-base leading-relaxed pt-0.5 font-medium">
                      {optionText}
                    </div>

                    {/* Radio indicator */}
                    <div className="shrink-0 mt-1 flex items-center">
                      {isStudy && hasAnswered ? (
                        <>
                          {isCorrect && <CheckCircle2 className="text-emerald-400" size={22} />}
                          {isSelected && !isCorrect && <XCircle className="text-red-400" size={22} />}
                        </>
                      ) : (
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${radioStyle}`}
                        >
                          {isSelected && <div className="w-2 h-2 rounded-full bg-slate-950" />}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Study Mode Explanation Panel */}
          {isStudy && hasAnswered && showExplanation && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 p-6 rounded-2xl border border-emerald-500/30 glass-panel-glow text-slate-200"
            >
              <div className="flex items-center gap-2 mb-3 text-emerald-400 font-bold text-base">
                <Lightbulb size={20} className="text-emerald-400" />
                <span>Textbook Solution & Academic Rationale</span>
              </div>

              <div className="text-xs font-semibold text-slate-300 mb-3 space-y-1">
                <p>
                  <strong className="text-white">Topic:</strong> {question.chapter_title}
                </p>
                {question.source_pages && (
                  <p className="flex items-center gap-1.5 text-emerald-400">
                    <BookOpen size={13} />
                    <span>Reference: Official Textbook Pages {question.source_pages}</span>
                  </p>
                )}
              </div>

              <div className="text-sm md:text-base text-slate-200 leading-relaxed border-t border-white/10 pt-3">
                {question.explanation}
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
