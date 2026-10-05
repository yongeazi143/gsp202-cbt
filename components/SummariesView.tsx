"use client";

import React, { useState, useEffect } from "react";
import { ChapterSummary, CHAPTER_LIST } from "@/lib/types";
import { ChevronLeft, BookOpen, User, Calendar, Award, Sparkles, Lightbulb, ShieldCheck, ArrowRight, Layers, FileText, Menu, X } from "lucide-react";
import { motion } from "framer-motion";

interface SummariesViewProps {
  onBackToDashboard: () => void;
  onLaunchChapterDrill: (chapterNum: number) => void;
  onOpenFlashcardsForChapter: (chapterNum: number) => void;
  initialChapter?: number;
}

export function SummariesView({
  onBackToDashboard,
  onLaunchChapterDrill,
  onOpenFlashcardsForChapter,
  initialChapter = 1,
}: SummariesViewProps) {
  const [summaries, setSummaries] = useState<ChapterSummary[]>([]);
  const [activeChapterNum, setActiveChapterNum] = useState<number>(initialChapter);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  useEffect(() => {
    fetch("/data/summaries.json")
      .then((res) => res.json())
      .then((data: ChapterSummary[]) => {
        setSummaries(data);
      })
      .catch((err) => console.error("Error loading summaries", err));
  }, []);

  const activeSummary = summaries.find((s) => s.chapter === activeChapterNum) || summaries[0];

  return (
    <div className="min-h-screen w-full bg-[#080c14] text-slate-100 flex flex-col justify-between p-3.5 sm:p-6 md:p-8 subtle-grid">
      {/* Top Header */}
      <header className="max-w-7xl mx-auto w-full flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10 mb-6">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Menu Button for Left Sidebar Drawer */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="lg:hidden flex items-center gap-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 px-2.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer active:scale-95"
            title="Open Chapter Selection Sidebar"
          >
            <Menu size={16} />
            <span className="font-mono">Chapters</span>
          </button>

          <button
            onClick={onBackToDashboard}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-white/10 px-3 py-1.5 rounded-xl text-xs md:text-sm font-semibold text-slate-300 hover:text-white transition cursor-pointer"
          >
            <ChevronLeft size={16} />
            <span>Dashboard</span>
          </button>
          <div>
            <h1 className="text-base sm:text-xl md:text-2xl font-black text-white flex items-center gap-2">
              <BookOpen size={18} className="text-emerald-400 shrink-0" />
              <span>Executive Cram Summaries</span>
            </h1>
            <span className="text-[10px] sm:text-xs text-slate-400 font-mono">
              High-Yield Revision Notes across all 13 Chapters
            </span>
          </div>
        </div>

        {activeSummary && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenFlashcardsForChapter(activeChapterNum)}
              className="bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/30 text-blue-300 text-xs font-bold py-2 px-3.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            >
              <Layers size={14} />
              <span>Ch {activeChapterNum} Flashcards</span>
            </button>
            <button
              onClick={() => onLaunchChapterDrill(activeChapterNum)}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black py-2 px-4 rounded-xl shadow-lg shadow-emerald-500/20 transition flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Sparkles size={14} />
              <span>Practice Ch {activeChapterNum}</span>
            </button>
          </div>
        )}
      </header>

      {/* Main Grid: Left Chapter Selector + Right Summary Content */}
      <div className="max-w-7xl mx-auto w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Mobile Horizontal Chapter Selector */}
        <div className="lg:hidden w-full flex overflow-x-auto no-scrollbar gap-2 p-2 bg-slate-900/90 rounded-xl border border-white/10 sticky top-2 z-10 backdrop-blur-md shadow-lg">
          {CHAPTER_LIST.map((ch) => {
            const isActive = ch.number === activeChapterNum;
            return (
              <button
                key={ch.number}
                onClick={() => setActiveChapterNum(ch.number)}
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

        {/* Desktop Left Chapter Selector */}
        <div className="hidden lg:block lg:col-span-3 glass-panel rounded-2xl p-3 max-h-[750px] overflow-y-auto custom-scrollbar space-y-1.5">
          <div className="px-3 py-2 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 border-b border-white/5 mb-1">
            SELECT CHAPTER
          </div>
          {CHAPTER_LIST.map((ch) => {
            const isActive = ch.number === activeChapterNum;
            return (
              <button
                key={ch.number}
                onClick={() => setActiveChapterNum(ch.number)}
                className={`w-full text-left p-3 rounded-xl transition cursor-pointer flex items-start gap-2.5 ${
                  isActive
                    ? "bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20"
                    : "text-slate-300 hover:bg-slate-900/80 hover:text-white"
                }`}
              >
                <span
                  className={`font-mono text-xs font-extrabold px-1.5 py-0.5 rounded ${
                    isActive ? "bg-slate-950 text-emerald-400" : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {ch.number.toString().padStart(2, "0")}
                </span>
                <span className="text-xs line-clamp-2 leading-tight flex-1">
                  {ch.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right Active Summary Content */}
        <div className="lg:col-span-9 space-y-6">
          {activeSummary ? (
            <motion.div
              key={activeSummary.chapter}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* Chapter Banner */}
              <div className="glass-panel-glow p-6 md:p-8 rounded-2xl border-emerald-500/30">
                <div className="flex items-center gap-2 mb-2 font-mono text-xs text-emerald-400 font-bold">
                  <span>CHAPTER {activeSummary.chapter.toString().padStart(2, "0")}</span>
                  <span>•</span>
                  <span>TEXTBOOK PAGES {activeSummary.pages}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4 leading-tight">
                  {activeSummary.title}
                </h2>
                <p className="text-sm md:text-base text-slate-300 leading-relaxed">
                  {activeSummary.coreOverview}
                </p>
              </div>

              {/* Key Scholars & Exact Definitions */}
              {activeSummary.keyScholars && activeSummary.keyScholars.length > 0 && (
                <div className="glass-panel p-6 rounded-2xl border-white/10 space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2 font-mono">
                    <User size={16} />
                    <span>Key Scholars & Definitions (High Exam Probability)</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {activeSummary.keyScholars.map((sc, i) => (
                      <div key={i} className="bg-slate-900/80 border border-white/5 rounded-xl p-4 space-y-1">
                        <div className="text-sm font-bold text-white flex items-center justify-between">
                          <span>{sc.name}</span>
                          {sc.bookOrQuote && (
                            <span className="text-[11px] font-mono text-slate-400 italic font-normal">
                              {sc.bookOrQuote}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {sc.concept}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Dates & Treaties + Acronyms side-by-side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Dates & Treaties */}
                {activeSummary.keyDatesAndTreaties && activeSummary.keyDatesAndTreaties.length > 0 && (
                  <div className="glass-panel p-6 rounded-2xl border-white/10 space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2 font-mono">
                      <Calendar size={16} />
                      <span>Historic Dates & Treaties</span>
                    </h3>
                    <div className="space-y-3">
                      {activeSummary.keyDatesAndTreaties.map((dt, i) => (
                        <div key={i} className="bg-slate-900/60 p-3 rounded-xl border border-white/5 flex items-start gap-3">
                          <span className="font-mono text-xs font-black text-amber-400 bg-amber-500/10 px-2 py-1 rounded shrink-0">
                            {dt.year}
                          </span>
                          <div className="text-xs">
                            <strong className="text-white block font-semibold">{dt.event}</strong>
                            <span className="text-slate-400">{dt.significance}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Acronyms */}
                {activeSummary.vitalAcronyms && activeSummary.vitalAcronyms.length > 0 && (
                  <div className="glass-panel p-6 rounded-2xl border-white/10 space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-purple-400 flex items-center gap-2 font-mono">
                      <FileText size={16} />
                      <span>Essential Acronyms</span>
                    </h3>
                    <div className="space-y-3">
                      {activeSummary.vitalAcronyms.map((ac, i) => (
                        <div key={i} className="bg-slate-900/60 p-3 rounded-xl border border-white/5 space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-xs text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded">
                              {ac.acronym}
                            </span>
                            <span className="text-xs text-white font-bold">{ac.full}</span>
                          </div>
                          <p className="text-xs text-slate-400 pl-1">{ac.meaning}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Case Studies */}
              {activeSummary.caseStudies && activeSummary.caseStudies.length > 0 && (
                <div className="glass-panel p-6 rounded-2xl border-white/10 space-y-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-teal-400 flex items-center gap-2 font-mono">
                    <Award size={16} />
                    <span>African & Nigerian Case Studies</span>
                  </h3>
                  <div className="space-y-3">
                    {activeSummary.caseStudies.map((cs, i) => (
                      <div key={i} className="bg-slate-900/70 p-4 rounded-xl border border-white/5 space-y-1">
                        <strong className="text-sm font-bold text-white block">{cs.name}</strong>
                        <p className="text-xs text-slate-300 leading-relaxed">{cs.summary}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* High-Yield Exam Tips */}
              {activeSummary.highYieldExamTips && activeSummary.highYieldExamTips.length > 0 && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 p-6 rounded-2xl space-y-3 text-slate-200">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2 font-mono">
                    <Lightbulb size={18} />
                    <span>Lecturers&apos; Question Setting Pattern (Exam Traps)</span>
                  </h3>
                  <ul className="space-y-2 text-xs md:text-sm text-slate-200 list-disc list-inside leading-relaxed">
                    {activeSummary.highYieldExamTips.map((tip, i) => (
                      <li key={i} className="pl-1">{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          ) : (
            <div className="glass-panel p-16 text-center rounded-2xl text-slate-400">
              Loading executive summary...
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
                  CHAPTER DIRECTORY
                </div>
                <div className="text-[11px] text-slate-400 font-mono">13 Executive Summaries</div>
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
                return (
                  <button
                    key={ch.number}
                    onClick={() => {
                      setActiveChapterNum(ch.number);
                      setIsDrawerOpen(false);
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
                    <span className="text-xs leading-snug line-clamp-2">{ch.title}</span>
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
