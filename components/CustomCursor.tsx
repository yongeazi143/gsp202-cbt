"use client";

import React, { useEffect, useState } from "react";

interface ClickRipple {
  id: number;
  x: number;
  y: number;
}

/**
 * CustomCursor
 * Replaces intrusive floating cursor followers with an ultra-clean,
 * professional tactile click ripple that complements the custom SVG cursor.
 */
export function CustomCursor() {
  const [ripples, setRipples] = useState<ClickRipple[]>([]);

  useEffect(() => {
    // Only run on non-touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const handleClick = (e: MouseEvent) => {
      const newRipple = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
      };

      setRipples((prev) => [...prev.slice(-4), newRipple]);

      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 300);
    };

    window.addEventListener("mousedown", handleClick);
    return () => {
      window.removeEventListener("mousedown", handleClick);
    };
  }, []);

  if (ripples.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {ripples.map((r) => (
        <span
          key={r.id}
          className="absolute rounded-full border border-emerald-400/70 bg-emerald-400/20 animate-ping"
          style={{
            left: r.x - 8,
            top: r.y - 8,
            width: 16,
            height: 16,
            animationDuration: "300ms",
            animationIterationCount: 1,
          }}
        />
      ))}
    </div>
  );
}
