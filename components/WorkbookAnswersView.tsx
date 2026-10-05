"use client";

import React, { useState, useEffect, useMemo } from "react";
import { WorkbookChapter, WorkbookQuestion, CHAPTER_LIST } from "@/lib/types";
import { ChevronLeft, BookOpen, Search, Copy, Check, Sparkles, BookMarked, Layers, FileCheck2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/context/ToastContext";

interface WorkbookAnswersViewProps {
  onBackToDashboard: () => void;
  onLaunchChapterDrill: (chapterNum: number) => void;
  initialChapter?: number;
}

export function WorkbookAnswersView({
  onBackToDashboard,
  onLaunchChapterDrill,
  initialChapter = 1,
}: WorkbookAnswersViewProps) {
  const { showToast } = useToast();
  const [chapters, setChapters] = useState<WorkbookChapter[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<number | "all">(initialChapter);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/data/workbook_answers.json")
      .then((res) => res.json())
      .then((data) => {
        if (data.chapters) {
          setChapters(data.chapters);
        }
      })
      .catch((err) => console.error("Error loading workbook answers", err));
  }, []);

  // Filter questions based on chapter and search query
  const filteredChapters = useMemo(() => {
    let result = chapters;

    if (selectedChapter !== "all") {
      result = result.filter((ch) => ch.chapter === selectedChapter);
    }

    if (!searchQuery.trim()) return result;

    const q = searchQuery.toLowerCase();
    return result
      .map((ch) => ({
        ...ch,
        questions: ch.questions.filter(
          (item) =>
            item.question.toLowerCase().includes(q) ||
            item.answer.toLowerCase().includes(q) ||
            (item.notes && item.notes.toLowerCase().includes(q))
        ),
      }))
      .filter((ch) => ch.questions.length > 0);
  }, [chapters, selectedChapter, searchQuery]);

  const totalQuestionsInView = useMemo(() => {
    return filteredChapters.reduce((acc, ch) => acc + ch.questions.length, 0);
  }, [filteredChapters]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast("Answer copied to clipboard!", "success", 1800);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen w-full bg-[#080c14] text-slate-100 flex flex-col justify-between p-3.5 sm:p-6 md:p-8 subtle-grid">
      {/* Top Header */}
      <header className="max-w-6xl mx-auto w-full flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToDashboard}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-white/10 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition cursor-pointer"
          >
            <ChevronLeft size={16} />
            <span>Dashboard</span>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-400 font-bold">
                CONTINUOUS ASSESSMENT
              </span>
              <span className="px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-[10px] text-purple-300 font-mono font-bold">
                OFFICIAL SOLUTIONS
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white flex items-center gap-2">
              <FileCheck2 size={22} className="text-emerald-400" />
              <span>CA Workbook Solutions & Fill-In Answers</span>
            </h1>
          </div>
        </div>

        {selectedChapter !== "all" && (
          <button
            onClick={() => onLaunchChapterDrill(Number(selectedChapter))}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm py-2 px-4 rounded-xl shadow-lg shadow-emerald-500/20 transition flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Sparkles size={14} />
            <span>Practice Ch {selectedChapter} CBT</span>
          </button>
        )}
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto w-full flex-1 space-y-6">
        {/* Search & Stats Bar */}
        <div className="glass-panel p-3 sm:p-4 rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by question, answer, scholar, or keyword..."
              className="w-full bg-slate-900/90 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
            />
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 text-xs font-mono text-slate-400 shrink-0">
            <span>Showing:</span>
            <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
              {totalQuestionsInView} Question{totalQuestionsInView !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Chapter Selection Pills (Horizontally Scrollable) */}
        <div className="flex overflow-x-auto no-scrollbar gap-2 p-1.5 bg-slate-900/80 rounded-xl border border-white/5 sticky top-2 z-20 backdrop-blur-md shadow-lg">
          <button
            onClick={() => setSelectedChapter("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition whitespace-nowrap cursor-pointer shrink-0 ${
              selectedChapter === "all"
                ? "bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20"
                : "bg-slate-800 text-slate-300 hover:text-white border border-white/5"
            }`}
          >
            All 13 Chapters
          </button>
          {CHAPTER_LIST.map((ch) => {
            const isActive = ch.number === selectedChapter;
            return (
              <button
                key={ch.number}
                onClick={() => setSelectedChapter(ch.number)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition whitespace-nowrap cursor-pointer shrink-0 ${
                  isActive
                    ? "bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20"
                    : "bg-slate-800 text-slate-300 hover:text-white border border-white/5"
                }`}
              >
                Ch {ch.number}
              </button>
            );
          })}
        </div>

        {/* Questions List */}
        {filteredChapters.length === 0 ? (
          <div className="glass-panel p-16 text-center rounded-2xl border-white/10 text-slate-400">
            No questions found matching your search query. Try another keyword!
          </div>
        ) : (
          <div className="space-y-8">
            {filteredChapters.map((ch) => (
              <div key={ch.chapter} className="space-y-4">
                {/* Chapter Banner */}
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-black bg-emerald-500 text-slate-950 px-2 py-0.5 rounded">
                      CH {ch.chapter}
                    </span>
                    <h2 className="text-base sm:text-lg font-bold text-white">
                      {ch.chapter_title}
                    </h2>
                  </div>
                  <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                    Textbook Pages {ch.pages}
                  </span>
                </div>

                {/* Questions Grid / Stack */}
                <div className="grid grid-cols-1 gap-4">
                  {ch.questions.map((q) => {
                    const uniqueId = `ch${ch.chapter}_q${q.q_num}`;
                    const isCopied = copiedId === uniqueId;

                    return (
                      <motion.div
                        key={uniqueId}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-panel p-4 sm:p-5 rounded-2xl border border-white/10 hover:border-emerald-500/40 transition space-y-3 relative group"
                      >
                        {/* Question Header */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 rounded-lg">
                              Q{q.q_num}
                            </span>
                            <span className="text-[11px] font-mono text-slate-400">
                              Ref: {q.textbook_ref}
                            </span>
                          </div>

                          <button
                            onClick={() => handleCopy(q.answer, uniqueId)}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer border ${
                              isCopied
                                ? "bg-emerald-500 text-slate-950 border-emerald-400 font-bold"
                                : "bg-white/5 hover:bg-white/10 text-slate-300 border-white/10 hover:text-white"
                            }`}
                            title="Copy verified answer"
                          >
                            {isCopied ? <Check size={13} /> : <Copy size={13} />}
                            <span>{isCopied ? "Copied!" : "Copy Answer"}</span>
                          </button>
                        </div>

                        {/* Question Text */}
                        <div className="text-xs sm:text-sm font-medium text-slate-200 leading-relaxed">
                          {q.question}
                        </div>

                        {/* Verified Fill-in Answer Box */}
                        <div className="p-3 sm:p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-xs sm:text-sm font-semibold flex items-start gap-2.5">
                          <span className="text-emerald-400 font-mono text-xs font-black uppercase shrink-0 mt-0.5">
                            Answer:
                          </span>
                          <span className="flex-1 text-white font-bold leading-relaxed selection:bg-emerald-400 selection:text-slate-950">
                            {q.answer}
                          </span>
                        </div>

                        {/* Context & Notes */}
                        {q.notes && (
                          <div className="text-[11px] sm:text-xs text-slate-400 leading-relaxed pl-2 border-l-2 border-emerald-500/30 pt-0.5">
                            <span className="text-slate-300 font-semibold">Exam Context: </span>
                            {q.notes}
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
