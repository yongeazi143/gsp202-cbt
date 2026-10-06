"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Flashcard, CHAPTER_LIST } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCw, CheckCircle2, RefreshCcw, ChevronLeft, ChevronRight, Shuffle, BookOpen, Sparkles, Filter, Award } from "lucide-react";
import { useToast } from "@/context/ToastContext";

interface FlashcardsViewProps {
  onBackToDashboard: () => void;
  initialChapter?: number;
}

export function FlashcardsView({ onBackToDashboard, initialChapter }: FlashcardsViewProps) {
  const { showToast } = useToast();

  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<number | "all">(initialChapter || "all");
  const [cardFilter, setCardFilter] = useState<"all" | "workbook" | "textbook">("all");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [masteredIds, setMasteredIds] = useState<string[]>([]);
  const [needsReviewIds, setNeedsReviewIds] = useState<string[]>([]);

  useEffect(() => {
    fetch("/data/flashcards.json")
      .then((res) => res.json())
      .then((data: Flashcard[]) => {
        setFlashcards(data);
      })
      .catch((err) => console.error("Error loading flashcards", err));

    // Load saved progress from localStorage
    try {
      const savedMastered = localStorage.getItem("gsp202_flashcards_mastered");
      if (savedMastered) setMasteredIds(JSON.parse(savedMastered));
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Filtered flashcards list
  const activeDeck = useMemo(() => {
    let list = flashcards;
    if (selectedChapter !== "all") {
      list = list.filter((fc) => fc.chapter === selectedChapter);
    }
    if (cardFilter === "workbook") {
      list = list.filter((fc) => fc.category === "workbook_question");
    } else if (cardFilter === "textbook") {
      list = list.filter((fc) => fc.category !== "workbook_question");
    }
    return list;
  }, [flashcards, selectedChapter, cardFilter]);

  // Reset index when changing chapter or filter
  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [selectedChapter, cardFilter]);

  // Keyboard navigation listener (Space = flip, ArrowLeft = prev, ArrowRight = next, 1 = review, 2 = mastered)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === "Space") {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "1") {
        handleMarkReview();
      } else if (e.key === "2") {
        handleMarkMastered();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, activeDeck, isFlipped]);

  const currentCard = activeDeck[currentIndex];

  const handleNext = () => {
    if (currentIndex < activeDeck.length - 1) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex((prev) => prev + 1), 120);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex((prev) => prev - 1), 120);
    }
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    setFlashcards((prev) => [...prev].sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
    showToast("Deck shuffled for randomized recall.", "info", 1500);
  };

  const handleMarkMastered = () => {
    if (!currentCard) return;
    const newMastered = Array.from(new Set([...masteredIds, currentCard.id]));
    setMasteredIds(newMastered);
    setNeedsReviewIds((prev) => prev.filter((id) => id !== currentCard.id));
    localStorage.setItem("gsp202_flashcards_mastered", JSON.stringify(newMastered));
    showToast("Card marked as Mastered! 🌟", "success", 1200);
    handleNext();
  };

  const handleMarkReview = () => {
    if (!currentCard) return;
    setNeedsReviewIds((prev) => Array.from(new Set([...prev, currentCard.id])));
    setMasteredIds((prev) => prev.filter((id) => id !== currentCard.id));
    showToast("Card marked for review.", "warning", 1200);
    handleNext();
  };

  const getCategoryBadge = (cat: Flashcard["category"]) => {
    switch (cat) {
      case "scholar_definition":
        return { label: "Scholar Definition", color: "bg-blue-500/15 text-blue-300 border-blue-500/30" };
      case "date_treaty":
        return { label: "Date & Treaty", color: "bg-amber-500/15 text-amber-300 border-amber-500/30" };
      case "acronym":
        return { label: "Vital Acronym", color: "bg-purple-500/15 text-purple-300 border-purple-500/30" };
      case "case_study":
        return { label: "African Case Study", color: "bg-teal-500/15 text-teal-300 border-teal-500/30" };
      case "workbook_question":
        return { label: "Workbook Review Q", color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" };
      default:
        return { label: "Core Concept", color: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" };
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#080c14] text-slate-100 flex flex-col justify-between p-4 md:p-8 subtle-grid">
      {/* Top Header */}
      <header className="max-w-5xl mx-auto w-full flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pb-3.5 border-b border-white/10">
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          <button
            onClick={onBackToDashboard}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-white/10 px-3 py-1.5 rounded-xl text-xs md:text-sm font-semibold text-slate-300 hover:text-white transition cursor-pointer"
          >
            <ChevronLeft size={16} />
            <span>Dashboard</span>
          </button>
          <div className="text-right md:text-left">
            <h1 className="text-sm sm:text-lg md:text-xl font-black text-white flex items-center gap-1.5 justify-end md:justify-start">
              <Sparkles size={16} className="text-emerald-400 shrink-0" />
              <span>3D Flashcards</span>
            </h1>
            <span className="text-[10px] text-slate-400 font-mono block">
              328 Spaced Repetition Cards
            </span>
          </div>
        </div>

        {/* Mastered Counter & Actions */}
        <div className="flex items-center justify-between md:justify-end gap-2 sm:gap-3">
          <div className="flex-1 md:flex-none justify-center bg-slate-900/90 border border-white/10 px-3 py-1.5 rounded-xl flex items-center justify-center gap-3 text-xs font-mono">
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 size={13} />
              <span>{masteredIds.length} Mastered</span>
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-amber-400 font-bold">
              {needsReviewIds.length} Review
            </span>
          </div>

          <button
            onClick={handleShuffle}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white transition cursor-pointer shrink-0"
            title="Shuffle Flashcards"
          >
            <Shuffle size={16} />
          </button>
        </div>
      </header>

      {/* Main Flashcard Arena */}
      <main className="max-w-3xl mx-auto w-full flex-1 flex flex-col justify-center py-6">
        {/* Deck Type Filter Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-3 border-b border-white/5">
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
            <span className="text-slate-400 font-bold uppercase text-[10px] mr-1">Deck:</span>
            <button
              onClick={() => setCardFilter("all")}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                cardFilter === "all"
                  ? "bg-slate-800 text-white border border-white/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              All ({flashcards.length})
            </button>
            <button
              onClick={() => setCardFilter("workbook")}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                cardFilter === "workbook"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span>Workbook Questions</span>
              <span className="text-[10px] bg-emerald-500/30 text-emerald-200 px-1.5 py-0.5 rounded font-mono font-bold">265 Qs</span>
            </button>
            <button
              onClick={() => setCardFilter("textbook")}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                cardFilter === "textbook"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Core Concepts (63)
            </button>
          </div>
        </div>

        {/* Chapter Filter Pill Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 custom-scrollbar">
          <button
            onClick={() => setSelectedChapter("all")}
            className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition whitespace-nowrap cursor-pointer ${
              selectedChapter === "all"
                ? "bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20"
                : "bg-slate-900/80 text-slate-400 hover:text-white border border-white/5"
            }`}
          >
            All 13 Chapters ({activeDeck.length})
          </button>
          {CHAPTER_LIST.map((ch) => {
            const count = flashcards.filter((f) => f.chapter === ch.number).length;
            return (
              <button
                key={ch.number}
                onClick={() => setSelectedChapter(ch.number)}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition whitespace-nowrap cursor-pointer ${
                  selectedChapter === ch.number
                    ? "bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20"
                    : "bg-slate-900/80 text-slate-400 hover:text-white border border-white/5"
                }`}
              >
                Ch {ch.number} ({count})
              </button>
            );
          })}
        </div>

        {/* 3D Flip Card Container */}
        {currentCard ? (
          <div className="perspective-1000 w-full min-h-[360px] md:min-h-[400px] flex items-center justify-center">
            <motion.div
              onClick={() => setIsFlipped((prev) => !prev)}
              className="w-full h-full cursor-pointer relative select-none"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div
                className={`w-full min-h-[360px] md:min-h-[400px] rounded-3xl p-8 md:p-12 transition-all duration-500 transform-style-3d glass-panel-glow border-2 flex flex-col justify-between relative ${
                  isFlipped
                    ? "bg-slate-900/95 border-emerald-400/60 shadow-2xl shadow-emerald-950/40"
                    : "bg-slate-900/85 border-white/10 hover:border-white/25 shadow-xl"
                }`}
              >
                {/* Top Card Badge */}
                <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-slate-400 font-bold">
                      CARD {currentIndex + 1} / {activeDeck.length}
                    </span>
                    <span className="text-[11px] font-mono bg-slate-800 text-emerald-400 px-2.5 py-0.5 rounded border border-white/5">
                      Ch {currentCard.chapter}
                    </span>
                  </div>

                  <span
                    className={`text-[11px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
                      getCategoryBadge(currentCard.category).color
                    }`}
                  >
                    {getCategoryBadge(currentCard.category).label}
                  </span>
                </div>

                {/* Card Center Content */}
                <div className="py-8 flex flex-col items-center justify-center text-center">
                  {!isFlipped ? (
                    <motion.div
                      key="front"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-4"
                    >
                      <span className="text-xs font-mono uppercase tracking-[0.2em] text-slate-400 block font-semibold">
                        QUESTION / PROMPT
                      </span>
                      <h2 className="text-xl md:text-3xl font-bold text-white leading-relaxed max-w-2xl mx-auto">
                        {currentCard.front}
                      </h2>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="back"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-4"
                    >
                      <span className="text-xs font-mono uppercase tracking-[0.2em] text-emerald-400 block font-black">
                        CORRECT VERIFIED ANSWER
                      </span>
                      <div className="text-2xl md:text-4xl font-extrabold text-white leading-tight max-w-2xl mx-auto">
                        {currentCard.back}
                      </div>
                      {currentCard.detail && (
                        <p className="text-xs md:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed pt-2 font-medium">
                          {currentCard.detail}
                        </p>
                      )}
                    </motion.div>
                  )}
                </div>

                {/* Bottom Card Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs text-slate-400 font-mono">
                  <span>
                    {currentCard.source_pages
                      ? `Textbook Pages: ${currentCard.source_pages}`
                      : currentCard.chapter_title}
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <RotateCw size={13} className="animate-spin-slow" />
                    <span>Click or Press [Space] to Flip</span>
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="glass-panel p-16 text-center rounded-2xl text-slate-400">
            No flashcards available for this chapter!
          </div>
        )}

        {/* Action Controls & Spaced Repetition Buttons */}
        <div className="mt-6 grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-between gap-2.5 sm:gap-4">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`col-span-1 sm:flex-none flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition cursor-pointer ${
              currentIndex === 0
                ? "bg-slate-900 border border-white/5 text-slate-600 cursor-not-allowed"
                : "bg-slate-900 hover:bg-slate-800 border border-white/10 text-white active:scale-95"
            }`}
          >
            <ChevronLeft size={16} />
            <span>Prev<span className="hidden sm:inline">ious [←]</span></span>
          </button>

          <button
            onClick={handleNext}
            disabled={currentIndex === activeDeck.length - 1}
            className={`col-span-1 sm:hidden flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
              currentIndex === activeDeck.length - 1
                ? "bg-slate-900 border border-white/5 text-slate-600 cursor-not-allowed"
                : "bg-slate-900 hover:bg-slate-800 border border-white/10 text-white active:scale-95"
            }`}
          >
            <span>Next</span>
            <ChevronRight size={16} />
          </button>

          {/* Review vs Mastered Toggles */}
          <div className="col-span-2 sm:col-span-1 flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={handleMarkReview}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 transition cursor-pointer active:scale-95"
            >
              <RefreshCcw size={14} />
              <span>Review Again<span className="hidden md:inline"> [1]</span></span>
            </button>

            <button
              onClick={handleMarkMastered}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 rounded-xl font-black text-xs sm:text-sm bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 transition cursor-pointer active:scale-95"
            >
              <CheckCircle2 size={15} />
              <span>Mastered<span className="hidden md:inline"> [2]</span></span>
            </button>
          </div>

          <button
            onClick={handleNext}
            disabled={currentIndex === activeDeck.length - 1}
            className={`hidden sm:flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs md:text-sm transition cursor-pointer ${
              currentIndex === activeDeck.length - 1
                ? "bg-slate-900 border border-white/5 text-slate-600 cursor-not-allowed"
                : "bg-slate-900 hover:bg-slate-800 border border-white/10 text-white active:scale-95"
            }`}
          >
            <span>Next [→]</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </main>

      <footer className="text-center text-[11px] font-mono text-slate-500 pt-4">
        Keyboard Shortcuts: [Space] to flip card • [←] / [→] to navigate • [1] for Review • [2] for Mastered
      </footer>
    </div>
  );
}
