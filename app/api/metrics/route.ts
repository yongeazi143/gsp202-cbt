import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

interface TelemetryData {
  totalVisitors: number;
  totalPageViews: number;
  totalExamsStarted: number;
  totalExamsCompleted: number;
  totalQuestionsAnswered: number;
  totalFlashcardsReviewed: number;
  totalSummariesRead: number;
  visitorIds: string[];
  recentEvents: Array<{
    type: string;
    timestamp: string;
    details?: Record<string, unknown>;
  }>;
}

const METRICS_FILE = path.join(process.cwd(), "public", "data", "telemetry.json");

// Default initial state
const defaultMetrics: TelemetryData = {
  totalVisitors: 1,
  totalPageViews: 1,
  totalExamsStarted: 0,
  totalExamsCompleted: 0,
  totalQuestionsAnswered: 0,
  totalFlashcardsReviewed: 0,
  totalSummariesRead: 0,
  visitorIds: [],
  recentEvents: [],
};

function readMetrics(): TelemetryData {
  try {
    if (fs.existsSync(METRICS_FILE)) {
      const data = fs.readFileSync(METRICS_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Error reading metrics file:", err);
  }
  return defaultMetrics;
}

function writeMetrics(metrics: TelemetryData) {
  try {
    const dir = path.dirname(METRICS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(METRICS_FILE, JSON.stringify(metrics, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing metrics file:", err);
  }
}

export async function GET() {
  const metrics = readMetrics();
  return NextResponse.json({
    totalVisitors: Math.max(metrics.visitorIds.length, metrics.totalVisitors),
    totalPageViews: metrics.totalPageViews,
    totalExamsStarted: metrics.totalExamsStarted,
    totalExamsCompleted: metrics.totalExamsCompleted,
    totalQuestionsAnswered: metrics.totalQuestionsAnswered,
    totalFlashcardsReviewed: metrics.totalFlashcardsReviewed,
    totalSummariesRead: metrics.totalSummariesRead,
    recentEvents: metrics.recentEvents.slice(-15).reverse(),
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, visitorId, details } = body;
    const metrics = readMetrics();

    metrics.totalPageViews = (metrics.totalPageViews || 0) + 1;

    if (visitorId && !metrics.visitorIds.includes(visitorId)) {
      metrics.visitorIds.push(visitorId);
      metrics.totalVisitors = metrics.visitorIds.length;
    }

    if (type === "exam_started") {
      metrics.totalExamsStarted = (metrics.totalExamsStarted || 0) + 1;
    } else if (type === "exam_completed") {
      metrics.totalExamsCompleted = (metrics.totalExamsCompleted || 0) + 1;
      if (details?.questionsCount) {
        metrics.totalQuestionsAnswered =
          (metrics.totalQuestionsAnswered || 0) + Number(details.questionsCount);
      }
    } else if (type === "flashcard_reviewed") {
      metrics.totalFlashcardsReviewed = (metrics.totalFlashcardsReviewed || 0) + 1;
    } else if (type === "summary_read") {
      metrics.totalSummariesRead = (metrics.totalSummariesRead || 0) + 1;
    }

    // Keep log of last 50 events
    metrics.recentEvents = metrics.recentEvents || [];
    metrics.recentEvents.push({
      type: type || "page_view",
      timestamp: new Date().toISOString(),
      details,
    });
    if (metrics.recentEvents.length > 50) {
      metrics.recentEvents = metrics.recentEvents.slice(-50);
    }

    writeMetrics(metrics);

    return NextResponse.json({ success: true, totalVisitors: metrics.totalVisitors });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
