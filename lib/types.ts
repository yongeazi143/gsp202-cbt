export interface Question {
  id: string;
  chapter: number;
  chapter_title: string;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  answer: "A" | "B" | "C" | "D";
  explanation: string;
  source_pages?: string;
  difficulty?: "easy" | "medium" | "hard";
  type?: string;
  prediction_weight?: "high" | "medium" | "low";
}

export type TestMode = "study" | "exam";

export interface ExamSessionConfig {
  mode: TestMode;
  selectedChapters: number[];
  questionCount: number;
  timeLimitMinutes: number; // 0 for unlimited in study mode, 90 for full exam, or custom
}

export interface UserExamResult {
  id?: string;
  userName: string;
  mode: TestMode;
  totalQuestions: number;
  attemptedQuestions: number;
  correctAnswers: number;
  scorePercentage: number;
  timeSpentSeconds: number;
  date: string;
  chapterScores: Record<number, { correct: number; total: number; title: string }>;
  userAnswers: Record<string, "A" | "B" | "C" | "D">;
  flaggedQuestionIds: string[];
}

export interface ChapterMeta {
  number: number;
  title: string;
  pages: string;
  questionCount?: number;
}

export const CHAPTER_LIST: ChapterMeta[] = [
  { number: 1, title: "The State, Conflict Resolution, and Development in Africa", pages: "1-15" },
  { number: 2, title: "Ethnic and Communal Conflicts in Africa", pages: "16-33" },
  { number: 3, title: "Climate Change, Resource Conflict and Environmental Security", pages: "34-50" },
  { number: 4, title: "Technology and Digital Threats to Peace and Security", pages: "51-69" },
  { number: 5, title: "Gender, Peace and Conflict Resolution", pages: "70-87" },
  { number: 6, title: "Health and Conflict", pages: "88-98" },
  { number: 7, title: "Conflict Analysis and Framework Assessment", pages: "99-115" },
  { number: 8, title: "Peace Education and Peace Practice", pages: "116-134" },
  { number: 9, title: "Conflict Handling Style and Non-Violent Resistance", pages: "135-150" },
  { number: 10, title: "Peace Psychology", pages: "151-161" },
  { number: 11, title: "Legal Framework for Social Justice and Conflict Resolution", pages: "162-179" },
  { number: 12, title: "Community Policing", pages: "180-185" },
  { number: 13, title: "Conflict Early Warning and Early Response Systems", pages: "186-209" },
];
