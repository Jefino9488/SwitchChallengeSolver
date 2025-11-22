"use client"

import { useState } from "react"
import { RotateCcw, GitBranch, Coffee, Grid3X3, Box, LayoutGrid } from "lucide-react"
import { cn } from "@/lib/utils"

// Define presets for different puzzle sizes
const SHAPE_SETS: Record<number, string[]> = {
  3: ["●", "■", "▲"],
  4: ["+", "▲", "●", "■"], // Matches your screenshot (Cyan, Yellow, Green, Red)
  5: ["+", "▲", "●", "■", "★"],
  6: ["%", "●", "■", "▲", "+", "X"], // Original default
}

export default function Tier2Solver() {
  const [puzzleSize, setPuzzleSize] = useState(6)
  const [shapeSet, setShapeSet] = useState(SHAPE_SETS[6])
  
  const [inputSeq, setInputSeq] = useState<string[]>([])
  const [outputSeq, setOutputSeq] = useState<string[]>([])
  const [middleOp, setMiddleOp] = useState("")
  const [optionsText, setOptionsText] = useState("")

  const n = shapeSet.length

  // Handle switching puzzle sizes
  function changeSize(size: number) {
    setPuzzleSize(size)
    setShapeSet(SHAPE_SETS[size])
    // Reset all data when size changes to prevent index errors
    setInputSeq([])
    setOutputSeq([])
    setMiddleOp("")
    setOptionsText("")
  }

  function clickInput(s: string) {
    if (inputSeq.length < n) setInputSeq([...inputSeq, s])
  }

  function clickOutput(s: string) {
    if (outputSeq.length < n) setOutputSeq([...outputSeq, s])
  }

  function removeLastInput() {
    setInputSeq(inputSeq.slice(0, -1))
  }

  function removeLastOutput() {
    setOutputSeq(outputSeq.slice(0, -1))
  }

  // FIXED: Corrected function name from functionLxResetAll to resetAll
  function resetAll() {
    setInputSeq([])
    setOutputSeq([])
    setMiddleOp("")
    setOptionsText("")
  }

  function reorderTopByA(T: string[], A: number[]) {
    if (!T || !A || T.length !== A.length) return null
    return A.map((idx) => T[idx - 1])
  }

  function buildRenumberMap(Tprime: string[]) {
    const map: Record<string, number> = {}
    for (let i = 0; i < Tprime.length; i++) map[Tprime[i]] = i + 1
    return map
  }

  function computeFinalCode() {
    if (inputSeq.length !== n || outputSeq.length !== n) return null
    if (middleOp.length !== n) return null
    
    const A = middleOp.split("").map((x) => Number.parseInt(x, 10))
    
    // Validate that the middle operator contains valid numbers for this size
    if (A.length !== n || A.some((x) => isNaN(x) || x < 1 || x > n)) return null

    const QX = reorderTopByA(inputSeq, A)
    if (!QX) return null

    const renum = buildRenumberMap(QX)
    const codeArr = outputSeq.map((s) => renum[s])
    
    if (codeArr.some((x) => x === undefined)) return null
    return codeArr.join("")
  }

  function matchOptions(code: string | null) {
    if (!code) return null
    const opts = optionsText
      .split(/[\s\n,]+/) // Split by space, newline, or comma
      .map((x) => x.trim())
      .filter((x) => x.length)
    return opts.find((o) => o === code) || null
  }

  const finalCode = computeFinalCode()
  const matched = matchOptions(finalCode)

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">SwitchChallengeSolver</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">Shape Reordering & Renumbering Algorithm</p>
          </div>
          
          {/* Puzzle Size Selector */}
          <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-lg flex gap-1">
            {[4, 5, 6].map((size) => (
              <button
                key={size}
                onClick={() => changeSize(size)}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2",
                  puzzleSize === size
                    ? "bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-300 shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                )}
              >
               {size === 4 ? <Grid3X3 size={16} /> : size === 5 ? <Box size={16} /> : <LayoutGrid size={16} />}
                {size} Shapes
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          
          {/* Dynamic Introduction */}
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-8">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              <strong>Current Mode: {puzzleSize} Shapes.</strong> Select shapes in order, then enter the {puzzleSize}-digit operator code (e.g., for 4 shapes: 1324).
            </p>
          </div>

          <div className="grid gap-8">
            {/* Section 1: Top Row Selection */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 border border-slate-200 dark:border-slate-700">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  Step 1: Select Top Row Shapes
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Click each shape in the order they appear in the puzzle's top row.
                </p>
              </div>

              <div className="flex gap-3 flex-wrap mb-4">
                {shapeSet.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => clickInput(s)}
                    disabled={inputSeq.length >= n}
                    className="w-16 h-16 md:w-20 md:h-20 text-3xl border-2 border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {s}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1 p-3 bg-slate-50 dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 font-mono min-h-[50px] flex items-center">
                  <span className="text-slate-600 dark:text-slate-400 mr-2">Top row: </span>
                  <span className="font-bold text-xl text-slate-900 dark:text-white tracking-widest">{inputSeq.join(" ") || "—"}</span>
                </div>
                {inputSeq.length > 0 && (
                  <button
                    onClick={removeLastInput}
                    className="px-4 py-2 text-sm bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-200 rounded hover:bg-orange-200 dark:hover:bg-orange-800 transition-colors"
                  >
                    Undo
                  </button>
                )}
              </div>
            </div>

            {/* Section 2: Bottom Row Selection */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 border border-slate-200 dark:border-slate-700">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  Step 2: Select Bottom Row Shapes
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Click each shape in the order they appear in the puzzle's bottom row.
                </p>
              </div>

              <div className="flex gap-3 flex-wrap mb-4">
                {shapeSet.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => clickOutput(s)}
                    disabled={outputSeq.length >= n}
                    className="w-16 h-16 md:w-20 md:h-20 text-3xl border-2 border-slate-400 dark:border-slate-500 rounded-lg bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {s}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1 p-3 bg-slate-100 dark:bg-slate-900 rounded border border-slate-300 dark:border-slate-700 font-mono min-h-[50px] flex items-center">
                  <span className="text-slate-600 dark:text-slate-400 mr-2">Bottom: </span>
                  <span className="font-bold text-xl text-slate-900 dark:text-white tracking-widest">{outputSeq.join(" ") || "—"}</span>
                </div>
                {outputSeq.length > 0 && (
                  <button
                    onClick={removeLastOutput}
                    className="px-4 py-2 text-sm bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-200 rounded hover:bg-orange-200 dark:hover:bg-orange-800 transition-colors"
                  >
                    Undo
                  </button>
                )}
              </div>
            </div>

            {/* Section 3: Middle Operator */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 border border-slate-200 dark:border-slate-700">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  Step 3: Enter Middle Operator
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Enter the white box numbers. For {n} shapes, enter {n} digits (e.g., 
                  <code className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-xs font-mono mx-1">
                    {n === 4 ? "1324" : n === 6 ? "241356" : "12345"}
                  </code>).
                </p>
              </div>

              <input
                value={middleOp}
                onChange={(e) => setMiddleOp(e.target.value.replace(/[^0-9]/g, ""))}
                placeholder={n === 4 ? "1324" : n === 6 ? "241356" : "12345"}
                maxLength={n}
                className="w-full max-w-xs px-4 py-3 text-lg tracking-widest border-2 border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                {middleOp.length}/{n} digits entered
              </p>
            </div>

            {/* Result Section */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-lg shadow-md p-6 border border-green-200 dark:border-green-800">
              <h2 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-4">Computed Result</h2>

              <div className="mb-6">
                <p className="text-sm text-green-700 dark:text-green-300 mb-2">Final Code:</p>
                <div className="font-mono text-4xl font-bold p-4 bg-white dark:bg-slate-800 rounded-lg border-2 border-green-300 dark:border-green-700 text-center text-green-600 dark:text-green-400 min-h-24 flex items-center justify-center tracking-[0.2em]">
                  {finalCode || "—"}
                </div>
              </div>

              {/* MCQ Options */}
              <div className="mt-6 pt-6 border-t border-green-200 dark:border-green-800">
                <label className="block text-sm font-medium text-green-900 dark:text-green-100 mb-3">
                  Paste MCQ Options (space or line separated)
                </label>
                <textarea
                  value={optionsText}
                  onChange={(e) => setOptionsText(e.target.value)}
                  placeholder={n === 4 ? "1243 3412 4231 1234" : "345126 215436 534126"}
                  className="w-full px-4 py-3 border-2 border-green-300 dark:border-green-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-green-500 dark:focus:border-green-400 focus:outline-none transition-colors resize-none font-mono text-sm"
                  rows={3}
                />
              </div>

              {matched && (
                <div className="mt-4 p-4 bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
                  <div className="bg-green-500 text-white rounded-full p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <p className="text-sm font-bold text-green-800 dark:text-green-100">
                    Match Found: <span className="text-lg ml-1">{matched}</span>
                  </p>
                </div>
              )}
              {!matched && finalCode && optionsText.length > 0 && (
                <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900 border border-amber-300 dark:border-amber-700 rounded-lg">
                  <p className="text-sm text-amber-800 dark:text-amber-200">⚠ No option matches the computed code</p>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-8">
            <button
              onClick={resetAll}
              className="flex items-center gap-2 px-4 py-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 font-medium transition-colors"
            >
              <RotateCcw size={18} />
              Reset All
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 mt-12">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                <strong>Created by Jefino</strong>
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-500">
                A powerful solver for shape reordering and renumbering puzzles
              </p>
            </div>

            <div className="flex gap-4">
              <a
                href="https://github.com/Jefino9488"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 dark:bg-slate-700 text-white rounded-lg hover:bg-slate-700 dark:hover:bg-slate-600 transition-colors text-sm font-medium"
              >
                <GitBranch size={16} />
                GitHub
              </a>
              <a
                href="https://buymeacoffee.com/jefino"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
              >
                <Coffee size={16} />
                Buy Me a Coffee
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
