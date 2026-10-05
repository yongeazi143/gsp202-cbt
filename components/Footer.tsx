"use client";

import React, { useState } from "react";
import { MessageSquare, Heart, X, Send, Copy, Check, Coffee } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/context/ToastContext";

export function Footer() {
  const { showToast } = useToast();
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [copiedBank, setCopiedBank] = useState(false);

  // Feedback form state
  const [feedbackType, setFeedbackType] = useState<"correction" | "suggestion" | "appreciation">("correction");
  const [feedbackName, setFeedbackName] = useState("");
  const [feedbackText, setFeedbackText] = useState("");

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) {
      showToast("Please enter your message before sending.", "warning");
      return;
    }

    // Try mailto fallback or simulated submit
    const subject = encodeURIComponent(`[GSP 202 Feedback - ${feedbackType.toUpperCase()}] from ${feedbackName || "Student"}`);
    const body = encodeURIComponent(`${feedbackText}\n\n- Sent from GSP 202 CBT Terminal`);
    window.open(`mailto:support@israelethan.dev?subject=${subject}&body=${body}`, "_blank");

    showToast("Thank you for your feedback! Opening email client...", "success");
    setIsFeedbackOpen(false);
    setFeedbackText("");
  };

  const copyAccountNumber = (acc: string) => {
    navigator.clipboard.writeText(acc);
    setCopiedBank(true);
    showToast("Account number copied!", "success", 1800);
    setTimeout(() => setCopiedBank(false), 2000);
  };

  return (
    <>
      <footer className="w-full bg-[#070b12]/95 border-t border-white/10 py-6 px-4 md:px-8 mt-12 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          {/* Left copyright / author */}
          <div>
            <p className="text-slate-300 font-medium">
              GSP 202 CBT Simulator • Built for UNN Students
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Strict 25-minute exam pacing • Verified CA workbook & textbook solutions
            </p>
          </div>

          {/* Action links */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setIsFeedbackOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition cursor-pointer text-xs"
            >
              <MessageSquare size={13} className="text-blue-400" />
              <span>Feedback to Developer</span>
            </button>

            <button
              onClick={() => setIsSupportOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 hover:text-white transition cursor-pointer text-xs font-semibold"
            >
              <Heart size={13} className="text-rose-400 fill-rose-400/40" />
              <span>Support the Developer</span>
            </button>
          </div>
        </div>
      </footer>

      {/* ─── FEEDBACK MODAL ─── */}
      <AnimatePresence>
        {isFeedbackOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg bg-[#0d1424] border border-white/10 rounded-2xl p-6 shadow-2xl text-slate-100"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400">
                    <MessageSquare size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">Developer Feedback</h3>
                    <p className="text-[11px] text-slate-400">Report a typo, suggest an improvement, or share thoughts</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsFeedbackOpen(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                {/* Type pills */}
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1.5">Feedback Category</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { key: "correction", label: "Question Typo / Errata" },
                      { key: "suggestion", label: "Feature Idea" },
                      { key: "appreciation", label: "Praise / Review" },
                    ].map((item) => (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => setFeedbackType(item.key as any)}
                        className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition cursor-pointer text-center ${feedbackType === item.key
                            ? "bg-emerald-500/20 border-emerald-500/60 text-emerald-300"
                            : "bg-slate-900 border-white/5 text-slate-400 hover:text-white"
                          }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">Your Name / Department (Optional)</label>
                  <input
                    type="text"
                    value={feedbackName}
                    onChange={(e) => setFeedbackName(e.target.value)}
                    placeholder="e.g. Chinedu - Computer Science"
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">Message Details</label>
                  <textarea
                    rows={4}
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Explain the correction (mention Chapter & Question number) or your suggestion..."
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition resize-none"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsFeedbackOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-300 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition shadow-lg shadow-emerald-500/20 cursor-pointer"
                  >
                    <Send size={13} />
                    <span>Send Feedback</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── SUPPORT DEVELOPER MODAL ─── */}
      <AnimatePresence>
        {isSupportOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md bg-[#0d1424] border border-white/10 rounded-2xl p-6 shadow-2xl text-slate-100"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400">
                    <Coffee size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">Support the Developer</h3>
                    <p className="text-[11px] text-slate-400">Fuel the servers and future academic CBT platforms</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsSupportOpen(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
                <p>
                  This CBT platform, along with the full 252+ questions bank, chapter cram summaries, and verified workbook solutions, was built with dedication to help students pass GSP 202 with distinction.
                </p>

                <p className="text-slate-400">
                  If this app saved your study time or helped you prepare, you can support with any token for server maintenance and continuous updates:
                </p>

                {/* Bank Account Card */}
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase text-slate-400">Bank Name</span>
                    <span className="font-bold text-white text-xs">Palmpay</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase text-slate-400">Account Name</span>
                    <span className="font-bold text-emerald-400 text-xs">ISRAEL YAKASON JAMES</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-emerald-500/20">
                    <span className="text-[11px] font-mono uppercase text-slate-400">Account Number</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-sm text-white">9033831547</span>
                      <button
                        onClick={() => copyAccountNumber("9033831547")}
                        className="p-1 rounded bg-white/10 hover:bg-white/20 text-slate-200 transition cursor-pointer"
                        title="Copy Account Number"
                      >
                        {copiedBank ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-2 text-center text-[11px] text-slate-500">
                  Every support is deeply appreciated! Thank you, and success in your examination! 🎓
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => setIsSupportOpen(false)}
                    className="px-5 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-white transition cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
