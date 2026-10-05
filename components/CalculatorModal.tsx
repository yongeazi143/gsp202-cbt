"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

interface CalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CalculatorModal({ isOpen, onClose }: CalculatorModalProps) {
  const [display, setDisplay] = useState("0");
  const [prev, setPrev] = useState<number | null>(null);
  const [op, setOp] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDigit = (d: string) => {
    setDisplay((prev) => (prev === "0" ? d : prev + d));
  };

  const handleOp = (nextOp: string) => {
    setPrev(parseFloat(display));
    setOp(nextOp);
    setDisplay("0");
  };

  const handleEquals = () => {
    if (prev === null || op === null) return;
    const current = parseFloat(display);
    let result = 0;
    if (op === "+") result = prev + current;
    if (op === "-") result = prev - current;
    if (op === "*") result = prev * current;
    if (op === "/") result = current !== 0 ? prev / current : 0;
    setDisplay(String(result));
    setPrev(null);
    setOp(null);
  };

  const handleClear = () => {
    setDisplay("0");
    setPrev(null);
    setOp(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-72 overflow-hidden animate-scaleIn">
        {/* Title bar */}
        <div className="bg-[#1a4731] text-white p-3 flex items-center justify-between">
          <span className="font-bold text-xs uppercase tracking-wider">CBT Calculator</span>
          <button onClick={onClose} className="hover:text-red-300 cursor-pointer">
            <X size={16} />
          </button>
        </div>

        {/* Display */}
        <div className="bg-gray-100 p-4 text-right">
          <div className="text-2xl font-mono font-bold text-gray-800 truncate">{display}</div>
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-4 gap-1 p-2 bg-gray-200">
          <button onClick={handleClear} className="col-span-2 p-3 bg-red-100 text-red-700 font-bold rounded hover:bg-red-200">C</button>
          <button onClick={() => handleOp("/")} className="p-3 bg-white text-gray-700 font-bold rounded hover:bg-gray-50">/</button>
          <button onClick={() => handleOp("*")} className="p-3 bg-white text-gray-700 font-bold rounded hover:bg-gray-50">×</button>

          {["7", "8", "9"].map((n) => (
            <button key={n} onClick={() => handleDigit(n)} className="p-3 bg-white font-bold rounded hover:bg-gray-50">{n}</button>
          ))}
          <button onClick={() => handleOp("-")} className="p-3 bg-white text-gray-700 font-bold rounded hover:bg-gray-50">-</button>

          {["4", "5", "6"].map((n) => (
            <button key={n} onClick={() => handleDigit(n)} className="p-3 bg-white font-bold rounded hover:bg-gray-50">{n}</button>
          ))}
          <button onClick={() => handleOp("+")} className="p-3 bg-white text-gray-700 font-bold rounded hover:bg-gray-50">+</button>

          {["1", "2", "3"].map((n) => (
            <button key={n} onClick={() => handleDigit(n)} className="p-3 bg-white font-bold rounded hover:bg-gray-50">{n}</button>
          ))}
          <button onClick={handleEquals} className="row-span-2 p-3 bg-[#1a4731] text-white font-bold rounded hover:bg-[#14381f] flex items-center justify-center">=</button>

          <button onClick={() => handleDigit("0")} className="col-span-2 p-3 bg-white font-bold rounded hover:bg-gray-50">0</button>
          <button onClick={() => !display.includes(".") && handleDigit(".")} className="p-3 bg-white font-bold rounded hover:bg-gray-50">.</button>
        </div>
      </div>
    </div>
  );
}
