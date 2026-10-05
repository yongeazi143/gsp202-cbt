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
    return allQuestions.slice(0, config.questionCount || 20);
  }

  const desiredCount = config.questionCount || pool.length;

  if (config.mode === "study") {
    // In study mode, shuffle the filtered pool and slice
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(desiredCount, pool.length));
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
    return finalSet.slice(0, Math.min(desiredCount, pool.length));
  }
}
