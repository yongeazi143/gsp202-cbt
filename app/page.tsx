"use client";

import React, { useState, useEffect } from "react";
import { Question, ExamSessionConfig, UserExamResult, CHAPTER_LIST } from "@/lib/types";
import { fetchQuestions, prepareSessionQuestions } from "@/lib/questions";
import { getStoredUser, saveStoredUser, saveExamResult } from "@/lib/supabase";
import { Header } from "@/components/Header";
import { QuestionNavigator } from "@/components/QuestionNavigator";
import { QuestionCard } from "@/components/QuestionCard";
import { BottomControls } from "@/components/BottomControls";
import { SetupScreen } from "@/components/SetupScreen";
import { ResultsScreen } from "@/components/ResultsScreen";
import { ReviewScreen } from "@/components/ReviewScreen";
import { CalculatorModal } from "@/components/CalculatorModal";
import { IntroAnimation } from "@/components/IntroAnimation";
import { CustomCursor } from "@/components/CustomCursor";
import { FlashcardsView } from "@/components/FlashcardsView";
import { SummariesView } from "@/components/SummariesView";

type AppPhase = "intro" | "setup" | "test" | "results" | "review" | "flashcards" | "summaries";

export default function Home() {
  const [phase, setPhase] = useState<AppPhase>("intro");
  const [studyChapter, setStudyChapter] = useState<number>(1);
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [sessionQuestions, setSessionQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, "A" | "B" | "C" | "D">>({});
  const [flaggedIds, setFlaggedIds] = useState<string[]>([]);
  const [showExplanation, setShowExplanation] = useState<boolean>(true);
  const [isCalcOpen, setIsCalcOpen] = useState<boolean>(false);
  const [config, setConfig] = useState<ExamSessionConfig>({
    mode: "exam",
    selectedChapters: CHAPTER_LIST.map((c) => c.number),
    questionCount: 70,
    timeLimitMinutes: 25, // STRICT 25 MINUTES MAX
  });
  const [timeRemaining, setTimeRemaining] = useState<number>(1500); // 25 min in secs
  const [timeSpent, setTimeSpent] = useState<number>(0);
  const [userName, setUserName] = useState<string>("ISRAEL");
  const [examResult, setExamResult] = useState<UserExamResult | null>(null);

  // Load questions and user on mount
  useEffect(() => {
    fetchQuestions().then((qs) => {
      setAllQuestions(qs);
    });
    const u = getStoredUser();
    if (u?.name) setUserName(u.name);
  }, []);

  // Timer effect for exam mode (25 mins or 20 mins)
  useEffect(() => {
    if (phase !== "test") return;

    const timer = setInterval(() => {
      setTimeSpent((prev) => prev + 1);

      if (config.mode === "exam") {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmitExam();
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, config.mode, sessionQuestions, userAnswers]);

  // Keyboard shortcut listener (A, B, C, D, N, P, Flag)
  useEffect(() => {
    if (phase !== "test" || sessionQuestions.length === 0) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const key = e.key.toUpperCase();
      const currentQ = sessionQuestions[currentIndex];

      if (["A", "B", "C", "D"].includes(key) && currentQ) {
        handleSelectOption(key as "A" | "B" | "C" | "D");
      } else if (key === "N" || key === "ARROWDOWN" || key === "ARROWRIGHT") {
        if (currentIndex < sessionQuestions.length - 1) {
          setCurrentIndex((prev) => prev + 1);
        }
      } else if (key === "P" || key === "ARROWUP" || key === "ARROWLEFT") {
        if (currentIndex > 0) {
          setCurrentIndex((prev) => prev - 1);
        }
      } else if (key === "F" && currentQ) {
        toggleFlag(currentQ.id);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [phase, currentIndex, sessionQuestions, userAnswers, flaggedIds]);

  const handleStartExam = (newConfig: ExamSessionConfig) => {
    // ENFORCE MAX 25 MINUTES FOR 70 QUESTIONS
    const safeMinutes = Math.min(newConfig.timeLimitMinutes || 25, 25);
    const updatedConfig = { ...newConfig, timeLimitMinutes: safeMinutes };

    setConfig(updatedConfig);
    const selected = prepareSessionQuestions(allQuestions, updatedConfig);
    setSessionQuestions(selected);
    setCurrentIndex(0);
    setUserAnswers({});
    setFlaggedIds([]);
    setTimeSpent(0);
    setShowExplanation(true);

    setTimeRemaining(safeMinutes * 60);
    setPhase("test");
  };

  const handleSelectOption = (opt: "A" | "B" | "C" | "D") => {
    const currentQ = sessionQuestions[currentIndex];
    if (!currentQ) return;
    setUserAnswers((prev) => ({
      ...prev,
      [currentQ.id]: opt,
    }));
  };

  const toggleFlag = (id: string) => {
    setFlaggedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmitExam = async () => {
    let correctCount = 0;
    const chapterScores: Record<number, { correct: number; total: number; title: string }> = {};

    sessionQuestions.forEach((q) => {
      if (!chapterScores[q.chapter]) {
        chapterScores[q.chapter] = { correct: 0, total: 0, title: q.chapter_title };
      }
      chapterScores[q.chapter].total += 1;

      if (userAnswers[q.id] === q.answer) {
        correctCount += 1;
        chapterScores[q.chapter].correct += 1;
      }
    });

    const total = sessionQuestions.length;
    const attempted = Object.keys(userAnswers).length;
    const pct = total > 0 ? (correctCount / total) * 100 : 0;

    const resultObj: UserExamResult = {
      userName,
      mode: config.mode,
      totalQuestions: total,
      attemptedQuestions: attempted,
      correctAnswers: correctCount,
      scorePercentage: pct,
      timeSpentSeconds: timeSpent,
      date: new Date().toISOString(),
      chapterScores,
      userAnswers,
      flaggedQuestionIds: flaggedIds,
    };

    setExamResult(resultObj);
    await saveExamResult(resultObj);
    setPhase("results");
  };

  const handleExit = () => {
    if (confirm("Are you sure you want to exit the current session? Current exam attempt will be canceled.")) {
      setPhase("setup");
    }
  };

  // Render Intro Splash
  if (phase === "intro") {
    return <IntroAnimation onComplete={() => setPhase("setup")} />;
  }

  // Render Setup Screen
  if (phase === "setup") {
    return (
      <>
        <CustomCursor />
        <SetupScreen
          userName={userName}
          allQuestions={allQuestions}
          onUpdateUserName={(name) => {
            setUserName(name);
            saveStoredUser(name);
          }}
          onStartExam={handleStartExam}
          onOpenFlashcards={() => setPhase("flashcards")}
          onOpenSummaries={() => setPhase("summaries")}
        />
      </>
    );
  }

  // Render 3D Flashcards View
  if (phase === "flashcards") {
    return (
      <>
        <CustomCursor />
        <FlashcardsView
          initialChapter={studyChapter}
          onBackToDashboard={() => setPhase("setup")}
        />
      </>
    );
  }

  // Render Executive Chapter Summaries View
  if (phase === "summaries") {
    return (
      <>
        <CustomCursor />
        <SummariesView
          initialChapter={studyChapter}
          onBackToDashboard={() => setPhase("setup")}
          onLaunchChapterDrill={(chNum) => {
            handleStartExam({
              mode: "study",
              selectedChapters: [chNum],
              questionCount: 20,
              timeLimitMinutes: 25,
            });
          }}
          onOpenFlashcardsForChapter={(chNum) => {
            setStudyChapter(chNum);
            setPhase("flashcards");
          }}
        />
      </>
    );
  }

  // Render Results Screen
  if (phase === "results" && examResult) {
    return (
      <>
        <CustomCursor />
        <ResultsScreen
          result={examResult}
          onReviewAnswers={() => setPhase("review")}
          onRetake={() => setPhase("setup")}
        />
      </>
    );
  }

  // Render Answer Review Screen
  if (phase === "review" && examResult) {
    return (
      <>
        <CustomCursor />
        <ReviewScreen
          questions={sessionQuestions}
          result={examResult}
          onBackToScore={() => setPhase("results")}
          onRetake={() => setPhase("setup")}
        />
      </>
    );
  }

  const currentQ = sessionQuestions[currentIndex];

  return (
    <div className="flex flex-col h-screen w-full bg-[#080c14] text-slate-100 overflow-hidden subtle-grid">
      <CustomCursor />
      {/* Top Header */}
      <Header
        userName={userName}
        mode={config.mode}
        currentChapterTitle={currentQ?.chapter_title}
        timeRemainingSeconds={timeRemaining}
        isFlagged={currentQ ? flaggedIds.includes(currentQ.id) : false}
        onToggleFlag={() => currentQ && toggleFlag(currentQ.id)}
        onExit={handleExit}
        onOpenCalc={() => setIsCalcOpen(true)}
      />

      {/* Main Full-Screen Layout: Left Question Navigator + Central Exam View */}
      <div className="flex-1 flex overflow-hidden w-full">
        {/* Left Question Navigator */}
        <div className="hidden md:block h-full">
          <QuestionNavigator
            questions={sessionQuestions}
            currentIndex={currentIndex}
            userAnswers={userAnswers}
            flaggedIds={flaggedIds}
            onSelectQuestion={(idx) => setCurrentIndex(idx)}
          />
        </div>

        {/* Center Main Question View */}
        <div className="flex-1 flex flex-col h-full overflow-hidden w-full">
          {currentQ ? (
            <QuestionCard
              question={currentQ}
              questionNumber={currentIndex + 1}
              totalQuestions={sessionQuestions.length}
              mode={config.mode}
              selectedOption={userAnswers[currentQ.id]}
              showExplanation={showExplanation}
              onSelectOption={handleSelectOption}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-slate-500 font-mono">
              Loading Exam Package...
            </div>
          )}

          {/* Bottom Bar Navigation */}
          <BottomControls
            mode={config.mode}
            currentIndex={currentIndex}
            totalQuestions={sessionQuestions.length}
            hasAnsweredCurrent={currentQ ? Boolean(userAnswers[currentQ.id]) : false}
            showExplanation={showExplanation}
            onPrevious={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            onNext={() => setCurrentIndex((prev) => Math.min(sessionQuestions.length - 1, prev + 1))}
            onToggleExplanation={() => setShowExplanation((prev) => !prev)}
            onSubmit={handleSubmitExam}
          />
        </div>
      </div>

      {/* Calculator modal */}
      <CalculatorModal isOpen={isCalcOpen} onClose={() => setIsCalcOpen(false)} />
    </div>
  );
}
