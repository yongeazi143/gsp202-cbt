"use client";

import React, { useState, useEffect, useMemo } from "react";
import { WorkbookChapter, WorkbookQuestion, CHAPTER_LIST } from "@/lib/types";
import {
  ChevronLeft,
  Search,
  Copy,
  Check,
  Sparkles,
  FileCheck2,
  BookOpen,
  ArrowRight,
  BookMarked,
  Layers,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
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
  const [activeChapterNum, setActiveChapterNum] = useState<number>(initialChapter);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

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

  const activeChapter = chapters.find((c) => c.chapter === activeChapterNum) || chapters[0];

  // Filter questions for active chapter based on search
  const filteredQuestions = useMemo(() => {
    if (!activeChapter) return [];
    if (!searchQuery.trim()) return activeChapter.questions;

    const q = searchQuery.toLowerCase();
    return activeChapter.questions.filter(
      (item) =>
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        (item.notes && item.notes.toLowerCase().includes(q))
    );
  }, [activeChapter, searchQuery]);

  const handleCopySingle = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast("Answer copied to clipboard!", "success", 1600);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyAllChapter = () => {
    if (!activeChapter) return;
    const text = activeChapter.questions
      .map((q) => `Q${q.q_num}: ${q.question}\nANSWER: ${q.answer}\n[Ref: ${q.textbook_ref}]\n`)
      .join("\n---\n\n");
    navigator.clipboard.writeText(text);
    showToast(`Copied all ${activeChapter.questions.length} answers for Chapter ${activeChapter.chapter}!`, "success", 2200);
  };

  const handleNextChapter = () => {
    if (activeChapterNum < 13) {
      setActiveChapterNum((prev) => prev + 1);
      setSearchQuery("");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#080c14] text-slate-100 flex flex-col justify-between p-3.5 sm:p-6 md:p-8 subtle-grid">
      {/* Top Header */}
      <header className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pb-4 border-b border-white/10 mb-6">
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          <div className="flex items-center gap-2">
            {/* Mobile Menu Button for Left Sidebar Drawer */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 transition cursor-pointer active:scale-95"
              title="Open Chapter Selection Sidebar"
              aria-label="Open Chapter Selection Sidebar"
            >
              <Menu size={18} />
            </button>

            <button
              onClick={onBackToDashboard}
              className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-white/10 px-3 py-1.5 rounded-xl text-xs md:text-sm font-semibold text-slate-300 hover:text-white transition cursor-pointer"
            >
              <ChevronLeft size={16} />
              <span>Dashboard</span>
            </button>
          </div>

          <div className="text-right md:text-left">
            <div className="flex items-center gap-2 justify-end md:justify-start">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-400 font-bold">
                PHYSICAL CA WORKBOOK
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] text-emerald-300 font-mono font-bold">
                265 SOLVED
              </span>
            </div>
            <h1 className="text-sm sm:text-lg md:text-xl font-black text-white flex items-center gap-1.5 justify-end md:justify-start">
              <FileCheck2 size={16} className="text-emerald-400 shrink-0" />
              <span>Workbook Answers</span>
            </h1>
          </div>
        </div>

        {activeChapter && (
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              onClick={handleCopyAllChapter}
              className="flex-1 md:flex-none justify-center bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold py-2 px-3 sm:px-3.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-md"
              title="Copy all answers for this chapter"
            >
              <Copy size={14} />
              <span>Copy All Answers</span>
            </button>

            <button
              onClick={() => onLaunchChapterDrill(activeChapterNum)}
              className="flex-1 md:flex-none justify-center bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black py-2 px-3 sm:px-4 rounded-xl shadow-lg shadow-emerald-500/20 transition flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Sparkles size={14} />
              <span>Practice Ch {activeChapterNum}</span>
            </button>
          </div>
        )}
      </header>

      {/* Main Grid: Left Chapter Selector + Right Questions Content (Identical to SummariesView layout) */}
      <div className="max-w-7xl mx-auto w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Mobile Horizontal Chapter Selector */}
        <div className="lg:hidden w-full flex overflow-x-auto no-scrollbar gap-2 p-2 bg-slate-900/90 rounded-xl border border-white/10 sticky top-2 z-10 backdrop-blur-md shadow-lg">
          {CHAPTER_LIST.map((ch) => {
            const isActive = ch.number === activeChapterNum;
            const qCount = chapters.find((c) => c.chapter === ch.number)?.questions.length || 0;
            return (
              <button
                key={ch.number}
                onClick={() => {
                  setActiveChapterNum(ch.number);
                  setSearchQuery("");
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition whitespace-nowrap cursor-pointer shrink-0 ${
                  isActive
                    ? "bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20"
                    : "bg-slate-800 text-slate-300 hover:text-white border border-white/5"
                }`}
              >
                Ch {ch.number} ({qCount} Qs)
              </button>
            );
          })}
        </div>

        {/* Desktop Left Chapter Selector (Sticky Sidebar) */}
        <div className="hidden lg:block lg:col-span-3 glass-panel rounded-2xl p-3 max-h-[750px] overflow-y-auto custom-scrollbar space-y-1.5 sticky top-6">
          <div className="px-3 py-2 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 border-b border-white/5 mb-1 flex items-center justify-between">
            <span>SELECT CHAPTER</span>
            <span className="text-[10px] text-emerald-400 font-mono">13 Chapters</span>
          </div>
          {CHAPTER_LIST.map((ch) => {
            const isActive = ch.number === activeChapterNum;
            const qCount = chapters.find((c) => c.chapter === ch.number)?.questions.length || 0;
            return (
              <button
                key={ch.number}
                onClick={() => {
                  setActiveChapterNum(ch.number);
                  setSearchQuery("");
                }}
                className={`w-full text-left p-3 rounded-xl transition cursor-pointer flex items-start gap-2.5 ${
                  isActive
                    ? "bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20"
                    : "text-slate-300 hover:bg-slate-900/80 hover:text-white"
                }`}
              >
                <span
                  className={`font-mono text-xs font-extrabold px-1.5 py-0.5 rounded shrink-0 ${
                    isActive ? "bg-slate-950 text-emerald-400" : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {ch.number.toString().padStart(2, "0")}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs line-clamp-2 leading-tight">
                    {ch.title}
                  </div>
                  <div
                    className={`text-[10px] font-mono mt-1 ${
                      isActive ? "text-slate-900 font-semibold" : "text-slate-500"
                    }`}
                  >
                    {qCount} Review Questions
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Active Chapter Questions Content */}
        <div className="lg:col-span-9 space-y-6">
          {activeChapter ? (
            <motion.div
              key={activeChapter.chapter}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* Chapter Banner & Search Bar */}
              <div className="glass-panel-glow p-6 md:p-8 rounded-2xl border-emerald-500/30">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2 font-mono text-xs text-emerald-400 font-bold">
                  <span>CHAPTER {activeChapter.chapter.toString().padStart(2, "0")}</span>
                  <span>•</span>
                  <span>TEXTBOOK PAGES {activeChapter.pages}</span>
                  <span>•</span>
                  <span>{activeChapter.questions.length} WORKBOOK QUESTIONS</span>
                </div>
                <h2 className="text-xl md:text-2xl font-extrabold text-white mb-4 leading-tight">
                  {activeChapter.chapter_title}
                </h2>

                {/* In-Chapter Real-time Search */}
                <div className="relative mt-4">
                  <Search
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Search within Chapter ${activeChapter.chapter} questions, blanks, or concepts...`}
                    className="w-full bg-slate-900/90 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs md:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Questions Cards Stream */}
              <div className="space-y-4">
                {filteredQuestions.length > 0 ? (
                  filteredQuestions.map((q) => {
                    const uniqueId = `ch${activeChapter.chapter}_q${q.q_num}`;
                    const isCopied = copiedId === uniqueId;

                    return (
                      <motion.div
                        key={q.q_num}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-panel rounded-2xl p-5 md:p-6 space-y-3.5 hover:border-emerald-500/30 transition shadow-sm"
                      >
                        {/* Question Header Pill */}
                        <div className="flex items-center justify-between gap-2 pb-2 border-b border-white/5">
                          <div className="flex items-center gap-2">
                            <span className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-400 font-mono font-extrabold text-xs flex items-center justify-center shrink-0 border border-emerald-500/20">
                              {q.q_num}
                            </span>
                            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wide">
                              Workbook Question #{q.q_num}
                            </span>
                          </div>
                          {q.textbook_ref && (
                            <span className="px-2 py-0.5 rounded bg-slate-800/80 border border-white/5 text-[11px] font-mono text-emerald-400">
                              Ref: {q.textbook_ref}
                            </span>
                          )}
                        </div>

                        {/* Question Text */}
                        <p className="text-sm md:text-base text-slate-100 font-medium leading-relaxed">
                          {q.question}
                        </p>

                        {/* Verified Official Answer Box */}
                        <div className="bg-gradient-to-r from-emerald-950/30 to-slate-900/90 border border-emerald-500/30 rounded-xl p-3.5 md:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          <div className="flex-1">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 block font-bold mb-1">
                              VERIFIED FILL-IN ANSWER
                            </span>
                            <div className="text-xs md:text-sm font-bold text-white font-mono leading-snug">
                              {q.answer}
                            </div>
                          </div>

                          <button
                            onClick={() => handleCopySingle(q.answer, uniqueId)}
                            className="shrink-0 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 hover:text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer self-end sm:self-auto"
                            title="Copy answer to clipboard"
                          >
                            {isCopied ? (
                              <>
                                <Check size={13} className="text-emerald-400" />
                                <span className="text-emerald-400">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy size={13} />
                                <span>Copy Answer</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Context / Notes */}
                        {q.notes && (
                          <div className="text-xs text-slate-400 flex items-start gap-2 pt-1">
                            <BookMarked
                              size={14}
                              className="text-emerald-400/80 shrink-0 mt-0.5"
                            />
                            <span className="leading-relaxed">{q.notes}</span>
                          </div>
                        )}
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="text-center py-12 glass-panel rounded-2xl space-y-3">
                    <p className="text-sm text-slate-400">
                      No questions matched your search query "{searchQuery}" in Chapter {activeChapter.chapter}.
                    </p>
                    <button
                      onClick={() => setSearchQuery("")}
                      className="px-4 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold hover:bg-emerald-500/30 transition cursor-pointer"
                    >
                      Reset Search Filter
                    </button>
                  </div>
                )}
              </div>

              {/* Bottom Pagination / Next Chapter */}
              {activeChapterNum < 13 && (
                <div className="flex justify-end pt-4">
                  <button
                    onClick={handleNextChapter}
                    className="bg-slate-900 hover:bg-slate-800 border border-white/10 text-white font-bold py-2.5 px-4 rounded-xl transition text-xs flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <span>Proceed to Chapter {activeChapterNum + 1} Answers</span>
                    <ChevronRight size={16} className="text-emerald-400" />
                  </button>
                </div>
              )}
            </motion.div>
          ) : (
            <div className="flex items-center justify-center p-12 text-slate-500 font-mono">
              Loading Official Workbook Solutions...
            </div>
          )}
        </div>
      </div>

      {/* Mobile Chapter Selector Left Sidebar */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden bg-black/80 backdrop-blur-sm flex justify-start animate-in fade-in duration-200"
          onClick={() => setIsDrawerOpen(false)}
        >
          <div
            className="w-[85%] max-w-xs h-full bg-[#0a0e17] border-r border-white/10 shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-left duration-250"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 bg-slate-950/80 border-b border-white/10 flex items-center justify-between">
              <div>
                <div className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
                  WORKBOOK CHAPTERS
                </div>
                <div className="text-[11px] text-slate-400 font-mono">265 Solved Questions</div>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-1.5 custom-scrollbar">
              {CHAPTER_LIST.map((ch) => {
                const isActive = ch.number === activeChapterNum;
                const qCount = chapters.find((c) => c.chapter === ch.number)?.questions.length || 0;
                return (
                  <button
                    key={ch.number}
                    onClick={() => {
                      setActiveChapterNum(ch.number);
                      setIsDrawerOpen(false);
                      setSearchQuery("");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className={`w-full text-left p-3 rounded-xl transition cursor-pointer flex items-start gap-2.5 ${
                      isActive
                        ? "bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20"
                        : "text-slate-300 hover:bg-slate-900/80 hover:text-white"
                    }`}
                  >
                    <span
                      className={`font-mono text-xs font-extrabold px-1.5 py-0.5 rounded shrink-0 ${
                        isActive ? "bg-slate-950 text-emerald-400" : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {ch.number.toString().padStart(2, "0")}
                    </span>
                    <div className="truncate">
                      <div className="text-xs leading-snug truncate font-semibold">{ch.title}</div>
                      <div className={`text-[10px] font-mono ${isActive ? "text-slate-900" : "text-emerald-400"}`}>
                        {qCount} Questions
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="p-3 border-t border-white/10 bg-slate-950/60">
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="w-full py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:text-white"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
