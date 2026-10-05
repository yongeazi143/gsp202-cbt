import { createClient } from "@supabase/supabase-js";
import { UserExamResult } from "./types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseAnonKey && !supabaseUrl.includes("placeholder")
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

const STORAGE_KEY = "gsp202_exam_results_history";
const USER_KEY = "gsp202_user_profile";

export function getStoredUser(): { name: string; matricNo?: string } {
  if (typeof window === "undefined") return { name: "Student" };
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to read user", e);
  }
  return { name: "ISRAEL" };
}

export function saveStoredUser(name: string, matricNo?: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_KEY, JSON.stringify({ name, matricNo }));
}

export async function saveExamResult(result: UserExamResult): Promise<void> {
  // Always save to localStorage first for instant offline reliability
  if (typeof window !== "undefined") {
    try {
      const historyRaw = localStorage.getItem(STORAGE_KEY);
      const history: UserExamResult[] = historyRaw ? JSON.parse(historyRaw) : [];
      history.unshift(result);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, 50)));
    } catch (e) {
      console.error("Local storage error:", e);
    }
  }

  // If Supabase is available, sync to remote database table
  if (supabase) {
    try {
      await supabase.from("exam_results").insert([
        {
          user_name: result.userName,
          mode: result.mode,
          total_questions: result.totalQuestions,
          attempted_questions: result.attemptedQuestions,
          correct_answers: result.correctAnswers,
          score_percentage: result.scorePercentage,
          time_spent_seconds: result.timeSpentSeconds,
          chapter_scores: result.chapterScores,
          created_at: result.date,
        },
      ]);
    } catch (e) {
      console.warn("Supabase sync failed (offline or table not ready):", e);
    }
  }
}

export async function getExamHistory(): Promise<UserExamResult[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("exam_results")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);
      if (!error && data && data.length > 0) {
        return data.map((d: any) => ({
          id: d.id,
          userName: d.user_name,
          mode: d.mode,
          totalQuestions: d.total_questions,
          attemptedQuestions: d.attempted_questions,
          correctAnswers: d.correct_answers,
          scorePercentage: d.score_percentage,
          timeSpentSeconds: d.time_spent_seconds,
          date: d.created_at,
          chapterScores: d.chapter_scores || {},
          userAnswers: {},
          flaggedQuestionIds: [],
        }));
      }
    } catch (e) {
      console.warn("Error fetching from Supabase, falling back to local storage", e);
    }
  }

  if (typeof window !== "undefined") {
    try {
      const historyRaw = localStorage.getItem(STORAGE_KEY);
      return historyRaw ? JSON.parse(historyRaw) : [];
    } catch (e) {
      console.error("Error reading local history", e);
    }
  }

  return [];
}
