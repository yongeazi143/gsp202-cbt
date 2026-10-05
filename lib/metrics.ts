"use client";

export interface PlatformMetrics {
  totalVisitors: number;
  totalPageViews: number;
  totalExamsStarted: number;
  totalExamsCompleted: number;
  totalQuestionsAnswered: number;
  totalFlashcardsReviewed: number;
  totalSummariesRead: number;
  recentEvents?: Array<{
    type: string;
    timestamp: string;
    details?: Record<string, unknown>;
  }>;
}

// Generate or retrieve persistent anonymous visitor ID
export function getOrCreateVisitorId(): string {
  if (typeof window === "undefined") return "server-side";
  let id = localStorage.getItem("gsp202_visitor_id");
  if (!id) {
    id = "vis_" + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
    localStorage.setItem("gsp202_visitor_id", id);
  }
  return id;
}

// Track telemetry event silently
export async function trackPlatformEvent(
  type: "page_view" | "exam_started" | "exam_completed" | "flashcard_reviewed" | "summary_read",
  details?: Record<string, unknown>
): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    const visitorId = getOrCreateVisitorId();
    await fetch("/api/metrics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, visitorId, details }),
    });
  } catch {
    // Fail silently so user experience is never blocked
  }
}

// Fetch live platform metrics
export async function fetchPlatformMetrics(): Promise<PlatformMetrics> {
  try {
    const res = await fetch("/api/metrics", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch metrics");
    return await res.json();
  } catch {
    return {
      totalVisitors: 1,
      totalPageViews: 1,
      totalExamsStarted: 0,
      totalExamsCompleted: 0,
      totalQuestionsAnswered: 0,
      totalFlashcardsReviewed: 0,
      totalSummariesRead: 0,
    };
  }
}
