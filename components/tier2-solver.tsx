"use client"

import { useState } from "react"
import { RotateCcw, GitBranch, Coffee } from "lucide-react"

const DEFAULT_SHAPES = ["%", "●", "■", "▲", "+", "X"]

export default function Tier2Solver() {
  const [shapeSet] = useState(DEFAULT_SHAPES)
  const [inputSeq, setInputSeq] = useState([])
  const [outputSeq, setOutputSeq] = useState([])
  const [middleOp, setMiddleOp] = useState("")
  const [optionsText, setOptionsText] = useState("")

  const n = shapeSet.length

  function clickInput(s) {
    if (inputSeq.length < n) setInputSeq([...inputSeq, s])
  }

  function clickOutput(s) {
    if (outputSeq.length < n) setOutputSeq([...outputSeq, s])
  }

  function removeLastInput() {
    setInputSeq(inputSeq.slice(0, -1))
  }

  function removeLastOutput() {
    setOutputSeq(outputSeq.slice(0, -1))
  }

  function resetAll() {
    setInputSeq([])
    setOutputSeq([])
    setMiddleOp("")
    setOptionsText("")
  }

  function reorderTopByA(T, A) {
    if (!T || !A || T.length !== A.length) return null
    return A.map((idx) => T[idx - 1])
  }

  function buildRenumberMap(Tprime) {
    const map = {}
    for (let i = 0; i < Tprime.length; i++) map[Tprime[i]] = i + 1
    return map
  }

  function computeFinalCode() {
    if (inputSeq.length !== n || outputSeq.length !== n) return null
    if (middleOp.length !== n) return null
    const A = middleOp.split("").map((x) => Number.parseInt(x, 10))
    if (A.length !== n || A.some((x) => isNaN(x) || x < 1 || x > n)) return null

    const Tprime = reorderTopByA(inputSeq, A)
    const renum = buildRenumberMap(Tprime)
    const codeArr = outputSeq.map((s) => renum[s])
    if (codeArr.some((x) => x === undefined)) return null
    return codeArr.join("")
  }

  function matchOptions(code) {
    if (!code) return null
    const opts = optionsText
      .split(/\s+/)
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
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Tier-2 Solver</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">CTS Reordering & Renumbering Algorithm</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Introduction */}
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-8">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              <strong>How it works:</strong> Select shapes from the top row in the exact order shown in your puzzle.
              Then select shapes from the bottom row. Enter the middle operator (white box), and the solver will compute
              the final code using the reordering and renumbering algorithm.
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
                    className="px-5 py-4 border-2 border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="text-3xl">{s}</span>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1 p-3 bg-slate-50 dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 font-mono">
                  <span className="text-slate-600 dark:text-slate-400">Top row: </span>
                  <span className="font-semibold text-slate-900 dark:text-white">{inputSeq.join(" ") || "—"}</span>
                </div>
                {inputSeq.length > 0 && (
                  <button
                    onClick={removeLastInput}
                    className="px-3 py-2 text-sm bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-200 rounded hover:bg-orange-200 dark:hover:bg-orange-800 transition-colors"
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
                    className="px-5 py-4 border-2 border-slate-400 dark:border-slate-500 rounded-lg bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="text-3xl">{s}</span>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1 p-3 bg-slate-100 dark:bg-slate-900 rounded border border-slate-300 dark:border-slate-700 font-mono">
                  <span className="text-slate-600 dark:text-slate-400">Bottom row: </span>
                  <span className="font-semibold text-slate-900 dark:text-white">{outputSeq.join(" ") || "—"}</span>
                </div>
                {outputSeq.length > 0 && (
                  <button
                    onClick={removeLastOutput}
                    className="px-3 py-2 text-sm bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-200 rounded hover:bg-orange-200 dark:hover:bg-orange-800 transition-colors"
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
                  Paste the white box operator (e.g.,{" "}
                  <code className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-xs font-mono">241356</code>).
                </p>
              </div>

              <input
                value={middleOp}
                onChange={(e) => setMiddleOp(e.target.value.replace(/[^0-9]/g, ""))}
                placeholder="241356"
                maxLength={n}
                className="w-full max-w-xs px-4 py-2 border-2 border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                Must be {n} digits between 1-{n}
              </p>
            </div>

            {/* Result Section */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-lg shadow-md p-6 border border-green-200 dark:border-green-800">
              <h2 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-4">Computed Result</h2>

              <div className="mb-6">
                <p className="text-sm text-green-700 dark:text-green-300 mb-2">Final Code:</p>
                <div className="font-mono text-4xl font-bold p-4 bg-white dark:bg-slate-800 rounded-lg border-2 border-green-300 dark:border-green-700 text-center text-green-600 dark:text-green-400 min-h-20 flex items-center justify-center">
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
                  placeholder="345126 215436 534126 326451"
                  className="w-full px-4 py-3 border-2 border-green-300 dark:border-green-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-green-500 dark:focus:border-green-400 focus:outline-none transition-colors resize-none"
                  rows={4}
                />
              </div>

              {matched && (
                <div className="mt-4 p-4 bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 rounded-lg">
                  <p className="text-sm font-semibold text-green-800 dark:text-green-200">
                    ✓ Match Found: <span className="font-mono text-lg">{matched}</span>
                  </p>
                </div>
              )}
              {!matched && finalCode && (
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
                A powerful solver for CTS reordering and renumbering puzzles
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

          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-600">
              Algorithm: Reorder top row using operator A → Renumber positions 1..{n} → Map bottom row shapes to new
              numbers
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
