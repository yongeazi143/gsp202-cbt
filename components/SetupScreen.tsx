import React, { useState, useMemo } from "react";
import { CHAPTER_LIST, ExamSessionConfig, TestMode, Question } from "@/lib/types";
import { BookOpen, Clock, Check, ChevronRight, Award, Sparkles, User, Zap, Flame, Filter, Sliders, Activity, FileCheck2 } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/context/ToastContext";
import { Footer } from "@/components/Footer";

interface SetupScreenProps {
  userName: string;
  allQuestions: Question[];
  onUpdateUserName: (name: string) => void;
  onStartExam: (config: ExamSessionConfig) => void;
  onOpenFlashcards: () => void;
  onOpenSummaries: () => void;
  onOpenWorkbookAnswers: () => void;
}

export function SetupScreen({
  userName,
  allQuestions,
  onUpdateUserName,
  onStartExam,
  onOpenFlashcards,
  onOpenSummaries,
  onOpenWorkbookAnswers,
}: SetupScreenProps) {

  const { showToast } = useToast();

  const [mode, setMode] = useState<TestMode>("exam");
  const [selectedChapters, setSelectedChapters] = useState<number[]>(
    CHAPTER_LIST.map((c) => c.number)
  );
  const [timeLimitMinutes, setTimeLimitMinutes] = useState<number>(25);
  const [questionCount, setQuestionCount] = useState<number>(70);
  const [showInstructions, setShowInstructions] = useState<boolean>(false);

  // Calculate questions available in selected chapters
  const availableQuestionsCount = useMemo(() => {
    if (allQuestions.length === 0) return 228; // fallback estimate
    return allQuestions.filter((q) => selectedChapters.includes(q.chapter)).length;
  }, [allQuestions, selectedChapters]);

  // Actual number that will be served
  const effectiveCount = Math.min(questionCount, availableQuestionsCount);

  const toggleChapter = (num: number) => {
    if (selectedChapters.includes(num)) {
      if (selectedChapters.length > 1) {
        setSelectedChapters(selectedChapters.filter((c) => c !== num));
      } else {
        showToast("At least one chapter must remain selected.", "warning");
      }
    } else {
      setSelectedChapters([...selectedChapters, num].sort((a, b) => a - b));
    }
  };

  const selectAllChapters = () => {
    setSelectedChapters(CHAPTER_LIST.map((c) => c.number));
    showToast("All 13 chapters selected (228 questions available).", "success");
  };

  const clearAllChapters = () => {
    setSelectedChapters([1]); // keep at least 1
    showToast("Scope reset to Chapter 1.", "info");
  };

  const handleSetPreset = (preset: number) => {
    if (preset > availableQuestionsCount) {
      setQuestionCount(availableQuestionsCount);
      showToast(
        `Selected chapters contain ${availableQuestionsCount} questions. Adjusted to maximum ${availableQuestionsCount}.`,
        "info"
      );
    } else {
      setQuestionCount(preset);
    }
  };

  const handleModeChange = (newMode: TestMode) => {
    setMode(newMode);
    if (newMode === "exam") {
      setTimeLimitMinutes(25);
      setQuestionCount(Math.min(70, availableQuestionsCount));
      showToast("Switched to Full Exam Mode (25 Mins Max)", "info");
    } else {
      setTimeLimitMinutes(25);
      setQuestionCount(Math.min(25, availableQuestionsCount));
      showToast("Switched to Study & Practice Mode (Instant Explanations)", "info");
    }
  };


  const handleConfirmStart = () => {
    onStartExam({
      mode,
      selectedChapters,
      questionCount: effectiveCount,
      timeLimitMinutes: mode === "exam" ? timeLimitMinutes : (timeLimitMinutes || 0),
    });
  };

  if (showInstructions) {
    return (
      <div className="min-h-screen w-full bg-[#080c14] text-slate-100 flex flex-col justify-between p-6 md:p-12 subtle-grid">
        <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col justify-center">
          {/* Top Bar */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10 mb-8"
          >
            <div>
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-emerald-400 font-bold block mb-1">
                PRE-EXAM BRIEFING
              </span>
              <h1 className="text-2xl md:text-4xl font-extrabold text-white">
                CBT Examination Rules & Guidelines
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs px-3 py-1.5 rounded-full font-mono font-bold flex items-center gap-1.5">
                <Clock size={14} />
                <span>{timeLimitMinutes} Mins • {effectiveCount} Questions</span>
              </span>
            </div>
          </motion.div>

          {/* Two column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-7 glass-panel rounded-2xl p-6 md:p-8 space-y-5"
            >
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <BookOpen size={20} className="text-emerald-400" />
                <span>Examination Protocols</span>
              </h2>

              <ul className="space-y-4 text-sm text-slate-300 leading-relaxed">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <strong className="text-white">Selected Scope:</strong> Testing{" "}
                    <span className="text-emerald-400 font-bold">{selectedChapters.length} chapter(s)</span> with{" "}
                    <span className="text-amber-400 font-bold">{effectiveCount} questions</span>.
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <strong className="text-white">Timing Pace:</strong> Total allotted time is{" "}
                    <span className="text-amber-400 font-bold">{timeLimitMinutes} Minutes</span>.
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <strong className="text-white">Keyboard Navigation:</strong> Use keys{" "}
                    <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-xs font-mono text-emerald-300">A</kbd>,{" "}
                    <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-xs font-mono text-emerald-300">B</kbd>,{" "}
                    <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-xs font-mono text-emerald-300">C</kbd>,{" "}
                    <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-xs font-mono text-emerald-300">D</kbd> to select answers,{" "}
                    <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-xs font-mono text-emerald-300">N</kbd> for Next, and{" "}
                    <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-xs font-mono text-emerald-300">P</kbd> for Previous.
                  </div>
                </li>
              </ul>
            </motion.div>

            {/* Candidate Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-5 glass-panel-glow rounded-2xl p-6 md:p-8 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block">
                  SESSION SUMMARY
                </span>
                <div className="bg-slate-900/80 border border-white/10 rounded-xl p-4 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black text-lg">
                    {userName ? userName.slice(0, 2).toUpperCase() : "IS"}
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Candidate</div>
                    <div className="text-lg font-bold text-white uppercase">{userName || "ISRAEL"}</div>
                    <div className="text-[11px] text-emerald-400 font-mono">GSP 202 CBT</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-900/60 p-3 rounded-lg border border-white/5">
                    <span className="text-slate-500 block mb-0.5">Chapters</span>
                    <strong className="text-white font-semibold">
                      {selectedChapters.length} Selected
                    </strong>
                  </div>
                  <div className="bg-slate-900/60 p-3 rounded-lg border border-white/5">
                    <span className="text-slate-500 block mb-0.5">Questions</span>
                    <strong className="text-emerald-400 font-bold">
                      {effectiveCount} Questions
                    </strong>
                  </div>
                </div>
              </div>

              <div className="pt-8 space-y-3">
                <button
                  onClick={handleConfirmStart}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black py-4 px-6 rounded-xl shadow-lg shadow-emerald-500/20 text-sm tracking-wide uppercase transition cursor-pointer flex items-center justify-center gap-2 transform active:scale-[0.98]"
                >
                  <Zap size={18} className="fill-slate-950" />
                  <span>Start Test</span>
                </button>
                <button
                  onClick={() => setShowInstructions(false)}
                  className="w-full bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white font-semibold py-2.5 px-4 rounded-xl text-xs transition cursor-pointer"
                >
                  Modify Selections
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#080c14] text-slate-100 flex flex-col justify-between p-6 md:p-10 subtle-grid">
      <div className="max-w-7xl mx-auto w-full space-y-8 flex-1 flex flex-col justify-center">
        {/* Header Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10"
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-emerald-400 font-bold">
                UNIVERSITY CBT PLATFORM
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] text-emerald-300 font-mono font-bold">
                PRO SUITE
              </span>
            </div>
            <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight">
              GSP 202: Peace & Conflict
            </h1>
            <p className="text-xs md:text-sm text-slate-400 pt-0.5 font-medium">
              Textbook & CA Workbook Questions Integrated • Fully Customizable
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={onOpenWorkbookAnswers}
              className="flex-1 sm:flex-none bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/30 hover:border-emerald-500/50 text-emerald-200 font-bold py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl transition text-xs md:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md"
              title="Verified CA Workbook Fill-in Solutions"
            >
              <FileCheck2 size={16} className="text-emerald-400" />
              <span className="hidden xs:inline">Workbook </span><span>Answers</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 font-mono font-bold">13 Ch</span>
            </button>

            <button
              onClick={onOpenSummaries}
              className="flex-1 sm:flex-none bg-slate-900/90 hover:bg-slate-800 border border-white/10 text-white font-bold py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl transition text-xs md:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <BookOpen size={16} className="text-emerald-400" />
              <span className="hidden xs:inline">Chapter </span><span>Summaries</span>
            </button>

            <button
              onClick={onOpenFlashcards}
              className="flex-1 sm:flex-none bg-slate-900/90 hover:bg-slate-800 border border-white/10 text-white font-bold py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl transition text-xs md:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <Sparkles size={16} className="text-blue-400" />
              <span>Flashcards</span>
            </button>

            <button
              onClick={() => setShowInstructions(true)}
              className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black py-3 px-6 rounded-xl shadow-xl shadow-emerald-500/25 transition text-xs md:text-sm flex items-center justify-center gap-2 cursor-pointer transform active:scale-95"
            >
              <span>Launch Test ({effectiveCount} Qs)</span>
              <ChevronRight size={18} />
            </button>
          </div>
        </motion.div>

        {/* Candidate Profile input */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-4 rounded-xl flex flex-wrap items-center gap-4"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
            <User size={20} />
          </div>
          <div className="flex-1 min-w-[240px]">
            <label className="block text-[11px] font-mono font-bold uppercase text-slate-400 mb-1">
              Candidate Name
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => onUpdateUserName(e.target.value)}
              placeholder="e.g. ISRAEL"
              className="w-full bg-slate-900/80 border border-white/10 rounded-lg px-4 py-2 text-sm font-bold text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
            />
          </div>
        </motion.div>

        {/* Mode Selector Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Exam Mode Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => handleModeChange("exam")}
            className={`p-6 rounded-2xl border-2 cursor-pointer transition select-none flex flex-col justify-between relative overflow-hidden ${
              mode === "exam"
                ? "border-emerald-500 glass-panel-glow shadow-2xl shadow-emerald-900/30"
                : "border-white/10 glass-panel hover:border-white/20 opacity-80"
            }`}
          >
            {mode === "exam" && (
              <div className="absolute top-0 right-0 bg-emerald-500 text-slate-950 font-black text-[10px] uppercase font-mono px-3 py-1 rounded-bl-xl tracking-wider">
                ACTIVE
              </div>
            )}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Flame size={18} />
                </div>
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
                  Timed Examination Simulation
                </span>
              </div>
              <h3 className="text-2xl font-black text-white mb-2">
                Full Test Mode
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Strict countdown timer with confidential answers until completion. Select any chapter combination you want!
              </p>

              {/* Time selection pills */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono uppercase text-slate-400 block font-semibold">
                  Exam Timing:
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setTimeLimitMinutes(25);
                    }}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      timeLimitMinutes === 25
                        ? "bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20"
                        : "bg-slate-900/80 border border-white/10 text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    <Clock size={13} />
                    <span>25 Mins (Actual Exam)</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setTimeLimitMinutes(20);
                    }}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      timeLimitMinutes === 20
                        ? "bg-amber-400 text-slate-950 font-black shadow-md shadow-amber-400/20"
                        : "bg-slate-900/80 border border-white/10 text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    <Zap size={13} />
                    <span>20 Mins (Speed Drill)</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Practice / Study Mode Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => handleModeChange("study")}
            className={`p-6 rounded-2xl border-2 cursor-pointer transition select-none flex flex-col justify-between relative overflow-hidden ${
              mode === "study"
                ? "border-blue-500 glass-panel shadow-2xl shadow-blue-900/30"
                : "border-white/10 glass-panel hover:border-white/20 opacity-80"
            }`}
          >
            {mode === "study" && (
              <div className="absolute top-0 right-0 bg-blue-500 text-white font-black text-[10px] uppercase font-mono px-3 py-1 rounded-bl-xl tracking-wider">
                ACTIVE
              </div>
            )}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  <Sparkles size={18} />
                </div>
                <span className="text-xs font-mono uppercase tracking-wider text-blue-400 font-bold">
                  Instant Feedback & Learning
                </span>
              </div>
              <h3 className="text-2xl font-black text-white mb-2">
                Study & Practice Mode
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Instant textbook citations and CA solutions reveal immediately upon picking each answer option.
              </p>
            </div>
            <div className="text-xs text-blue-400 font-mono font-bold">
              Self-Paced with Detailed Solution Cards
            </div>
          </motion.div>
        </div>

        {/* Question Count Customizer (Flexible for BOTH modes!) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-panel p-5 rounded-2xl space-y-3"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Sliders size={15} className="text-emerald-400" />
                <span>Total Questions to Take</span>
              </h3>
              <span className="text-xs text-slate-400">
                Choose any question count for your test. Currently available in selected chapters:{" "}
                <strong className="text-emerald-400 font-mono font-bold">{availableQuestionsCount} questions</strong>.
              </span>
            </div>

            <div className="flex items-center gap-2 bg-slate-900/90 border border-white/10 rounded-xl px-3 py-1">
              <span className="text-xs text-slate-400">Custom Count:</span>
              <input
                type="number"
                min="1"
                max={availableQuestionsCount}
                value={questionCount}
                onChange={(e) => setQuestionCount(parseInt(e.target.value) || 1)}
                className="w-16 bg-slate-800 text-white font-mono font-bold text-center px-2 py-1 rounded text-sm focus:outline-none focus:ring-1 focus:ring-emerald-400"
              />
            </div>
          </div>

          {/* Quick presets */}
          <div className="flex flex-wrap sm:flex-nowrap sm:overflow-x-auto no-scrollbar gap-2 py-1">
            {[15, 25, 35, 50, 70, 100].map((preset) => (
              <button
                key={preset}
                onClick={() => handleSetPreset(preset)}
                className={`py-2 px-3.5 sm:px-4 rounded-lg text-xs font-mono font-bold transition cursor-pointer shrink-0 ${
                  questionCount === preset
                    ? "bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20"
                    : "bg-slate-900 border border-white/10 text-slate-300 hover:bg-slate-800"
                }`}
              >
                {preset} Questions
              </button>
            ))}
            <button
              onClick={() => {
                setQuestionCount(availableQuestionsCount);
                showToast(`Loaded all ${availableQuestionsCount} available questions.`, "success");
              }}
              className={`py-2 px-3.5 sm:px-4 rounded-lg text-xs font-mono font-bold transition cursor-pointer shrink-0 ${
                questionCount === availableQuestionsCount
                  ? "bg-teal-400 text-slate-950 font-black"
                  : "bg-slate-900 border border-white/10 text-teal-300 hover:bg-slate-800"
              }`}
            >
              All Available ({availableQuestionsCount})
            </button>
          </div>

          {questionCount > availableQuestionsCount && (
            <div className="text-xs text-amber-300 bg-amber-500/10 border border-amber-500/30 px-3 py-2 rounded-lg flex items-center gap-2">
              <span>Notice: The selected chapters contain {availableQuestionsCount} total questions. All {availableQuestionsCount} questions will be served.</span>
            </div>
          )}
        </motion.div>

        {/* Chapter Selection Matrix (100% Flexible for BOTH Full Test & Practice) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-panel p-6 rounded-2xl space-y-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Filter size={15} className="text-emerald-400" />
                <span>Chapter Scope Selection (Select Any Chapters for Full Test or Practice)</span>
              </h3>
              <span className="text-xs text-slate-400">
                Click any chapter to include or exclude it. {selectedChapters.length} of 13 chapters active.
              </span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={selectAllChapters}
                className="text-xs font-mono font-bold text-emerald-400 hover:text-emerald-300 underline cursor-pointer"
              >
                Select All 13
              </button>
              <button
                onClick={clearAllChapters}
                className="text-xs font-mono font-bold text-slate-400 hover:text-slate-300 underline cursor-pointer"
              >
                Reset to Ch 1
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 max-h-60 overflow-y-auto p-1 custom-scrollbar">
            {CHAPTER_LIST.map((ch) => {
              const isSelected = selectedChapters.includes(ch.number);
              const chapterQsCount = allQuestions.filter((q) => q.chapter === ch.number).length || 16;

              return (
                <div
                  key={ch.number}
                  onClick={() => toggleChapter(ch.number)}
                  className={`p-3 rounded-xl border text-xs transition flex items-start gap-3 cursor-pointer ${
                    isSelected
                      ? "bg-emerald-500/15 border-emerald-500/50 text-white shadow-sm"
                      : "bg-slate-900/40 border-white/5 text-slate-500 hover:border-white/10"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 border transition ${
                      isSelected
                        ? "bg-emerald-500 border-emerald-500 text-slate-950"
                        : "border-slate-600 bg-slate-800"
                    }`}
                  >
                    {isSelected && <Check size={11} className="stroke-[3]" />}
                  </div>
                  <div className="flex-1 truncate">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-emerald-400 font-bold text-[11px]">
                        CH {ch.number.toString().padStart(2, "0")}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {chapterQsCount} Qs
                      </span>
                    </div>
                    <span className="text-slate-200 truncate block font-medium mt-0.5">
                      {ch.title}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Developer Feedback & Support Footer */}
      <Footer />
    </div>
  );
}
