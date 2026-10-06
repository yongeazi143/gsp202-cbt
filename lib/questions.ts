import { Question, ExamSessionConfig } from "./types";

export async function fetchQuestions(): Promise<Question[]> {
  try {
    const res = await fetch("/data/questions.json", { cache: "no-store" });
    if (!res.ok) {
      throw new Error(`Failed to load questions.json: ${res.statusText}`);
    }
    const data = await res.json();
    return data.questions || [];
  } catch (error) {
    console.error("Error loading questions:", error);
    return [];
  }
}

/**
 * Randomizes option ordering (A, B, C, D) for a question while strictly maintaining
 * 100% synchronization with the correct answer key. Prevents any positional predictability.
 */
function randomizeQuestionOptions(q: Question): Question {
  const letters = ["A", "B", "C", "D"] as const;
  const correctText = q.options[q.answer as keyof typeof q.options];
  if (!correctText) return q;

  const optionTexts = [q.options.A, q.options.B, q.options.C, q.options.D];

  // Fisher-Yates shuffle
  for (let i = optionTexts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [optionTexts[i], optionTexts[j]] = [optionTexts[j], optionTexts[i]];
  }

  const newOptions = {
    A: optionTexts[0],
    B: optionTexts[1],
    C: optionTexts[2],
    D: optionTexts[3],
  };

  const newAnswer = letters.find((l) => newOptions[l] === correctText) || "A";

  return {
    ...q,
    options: newOptions,
    answer: newAnswer,
  };
}

export function prepareSessionQuestions(
  allQuestions: Question[],
  config: ExamSessionConfig
): Question[] {
  // Filter questions by selected chapters
  const validChapters =
    config.selectedChapters.length > 0
      ? config.selectedChapters
      : Array.from({ length: 13 }, (_, i) => i + 1);

  const pool = allQuestions.filter((q) => validChapters.includes(q.chapter));

  if (pool.length === 0) {
    return allQuestions
      .slice(0, config.questionCount || 20)
      .map(randomizeQuestionOptions);
  }

  const desiredCount = config.questionCount || pool.length;

  if (config.mode === "study") {
    // In study mode, shuffle the filtered pool and slice
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    return shuffled
      .slice(0, Math.min(desiredCount, pool.length))
      .map(randomizeQuestionOptions);
  } else {
    // In exam mode, distribute questions fairly across the selected chapters
    const chaptersMap: Record<number, Question[]> = {};
    for (const ch of validChapters) {
      chaptersMap[ch] = [];
    }

    for (const q of pool) {
      if (chaptersMap[q.chapter]) {
        chaptersMap[q.chapter].push(q);
      }
    }

    const perChapter = Math.ceil(desiredCount / validChapters.length);
    const selected: Question[] = [];

    for (const ch of validChapters) {
      const chapterPool = [...(chaptersMap[ch] || [])].sort(() => Math.random() - 0.5);
      selected.push(...chapterPool.slice(0, perChapter));
    }

    // Shuffle combined and clamp to desiredCount
    const finalSet = [...selected].sort(() => Math.random() - 0.5);
    return finalSet
      .slice(0, Math.min(desiredCount, pool.length))
      .map(randomizeQuestionOptions);
  }
}
