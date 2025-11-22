"use client"

import { useState } from "react"
import { RotateCcw, GitBranch, Coffee } from "lucide-react"
import { cn } from "@/lib/utils"

// Define presets for different puzzle sizes
const SHAPE_SETS: Record<number, string[]> = {
  3: ["●", "■", "▲"],
  4: ["+", "▲", "●", "■"],
  5: ["+", "▲", "●", "■", "★"],
  6: ["%", "●", "■", "▲", "+", "X"],
}

export default function Tier2Solver() {
  const [puzzleSize, setPuzzleSize] = useState(6)
  const [shapeSet, setShapeSet] = useState(SHAPE_SETS[6])

  const [inputSeq, setInputSeq] = useState<string[]>([])
  const [outputSeq, setOutputSeq] = useState<string[]>([])
  const [middleOp, setMiddleOp] = useState("")
  const [optionsText, setOptionsText] = useState("")

  const n = shapeSet.length

  function changeSize(size: number) {
    setPuzzleSize(size)
    setShapeSet(SHAPE_SETS[size])
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

    if (A.length !== n || A.some((x) => isNaN(x) || x < 1 || x > n)) return null

    const QX = reorderTopByA(inputSeq, A)
    if (!QX) return null

    const renum = buildRenumberMap(QX)
    const codeArr = outputSeq.map((s) => renum[s])

    if (codeArr.some((x) => x === undefined)) return null
    return codeArr.join("")
  }

  function computeBottomToTopCode() {
    if (inputSeq.length !== n || outputSeq.length !== n) return null
    if (middleOp.length !== n) return null

    const A = middleOp.split("").map(Number)
    if (A.some((x) => x < 1 || x > n || isNaN(x))) return null

    const topRank: Record<string, number> = {}
    for (let i = 0; i < n; i++) topRank[inputSeq[i]] = i + 1

    const bottomRanks = outputSeq.map((s) => topRank[s])

    const paired = bottomRanks.map((v, i) => ({ v, pos: i + 1 }))
    paired.sort((a, b) => a.v - b.v)
    const rankPos: Record<number, number> = {}
    paired.forEach((p, i) => (rankPos[p.pos] = i + 1))

    const A_inv = new Array(n + 1)
    for (let i = 0; i < n; i++) A_inv[A[i]] = i + 1

    const final = []
    for (let i = 1; i <= n; i++) {
      final.push(rankPos[A_inv[i]])
    }

    return final.join("")
  }

  const finalCode = computeFinalCode()
  const bottomToTopCode = computeBottomToTopCode()
  const matched = matchOptions(finalCode || bottomToTopCode, optionsText)

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      {/* Compact Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 py-2 md:py-3 px-3 md:px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-lg md:text-2xl font-bold text-slate-900 dark:text-white">SwitchChallengeSolver</h1>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">Shape Reordering & Renumbering</p>
          </div>

          <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-lg flex gap-1 flex-shrink-0">
            {[4, 5, 6].map((size) => (
              <button
                key={size}
                onClick={() => changeSize(size)}
                className={cn(
                  "px-2.5 md:px-3 py-1 rounded text-xs md:text-sm font-medium transition-all",
                  puzzleSize === size
                    ? "bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-300 shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200",
                )}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 py-2 md:py-4 px-3 md:px-4">
        <div className="max-w-5xl mx-auto space-y-2 md:space-y-3">
          {/* Step 1: Top Row */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-2 md:p-3">
            <h2 className="text-sm md:text-base font-semibold text-blue-900 dark:text-blue-100 mb-2">Top Row</h2>

            <div className="flex gap-1.5 md:gap-2 flex-wrap mb-2">
              {shapeSet.map((s, i) => (
                <button
                  key={i}
                  onClick={() => clickInput(s)}
                  disabled={inputSeq.length >= n}
                  className="w-10 h-10 md:w-12 md:h-12 text-xl md:text-2xl border-2 border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all"
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="flex gap-1.5 items-center">
              <div className="flex-1 p-2 bg-blue-50 dark:bg-slate-900 rounded border border-blue-200 dark:border-blue-700 font-mono text-sm md:text-base font-bold text-blue-600 dark:text-blue-400 tracking-widest min-h-9 flex items-center">
                {inputSeq.join(" ") || "—"}
              </div>
              {inputSeq.length > 0 && (
                <button
                  onClick={removeLastInput}
                  className="px-2 py-1.5 text-xs bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-200 rounded hover:bg-orange-200 dark:hover:bg-orange-800 transition-colors flex-shrink-0"
                >
                  Undo
                </button>
              )}
            </div>
          </div>

          {/* Step 2: Bottom Row */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-2 md:p-3">
            <h2 className="text-sm md:text-base font-semibold text-slate-900 dark:text-slate-100 mb-2">Bottom Row</h2>

            <div className="flex gap-1.5 md:gap-2 flex-wrap mb-2">
              {shapeSet.map((s, i) => (
                <button
                  key={i}
                  onClick={() => clickOutput(s)}
                  disabled={outputSeq.length >= n}
                  className="w-10 h-10 md:w-12 md:h-12 text-xl md:text-2xl border-2 border-slate-400 dark:border-slate-500 rounded bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all"
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="flex gap-1.5 items-center">
              <div className="flex-1 p-2 bg-slate-100 dark:bg-slate-900 rounded border border-slate-300 dark:border-slate-700 font-mono text-sm md:text-base font-bold text-slate-900 dark:text-slate-100 tracking-widest min-h-9 flex items-center">
                {outputSeq.join(" ") || "—"}
              </div>
              {outputSeq.length > 0 && (
                <button
                  onClick={removeLastOutput}
                  className="px-2 py-1.5 text-xs bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-200 rounded hover:bg-orange-200 dark:hover:bg-orange-800 transition-colors flex-shrink-0"
                >
                  Undo
                </button>
              )}
            </div>
          </div>

          {/* Step 3: Operator */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-2 md:p-3">
            <h2 className="text-sm md:text-base font-semibold text-purple-900 dark:text-purple-100 mb-2">Operator</h2>

            <input
              value={middleOp}
              onChange={(e) => setMiddleOp(e.target.value.replace(/[^0-9]/g, ""))}
              placeholder={n === 4 ? "1324" : n === 6 ? "241356" : "12345"}
              maxLength={n}
              className="w-full px-2 md:px-3 py-2 text-base md:text-lg tracking-widest border-2 border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {middleOp.length}/{n}
            </p>
          </div>

          {/* Results Section */}
          {(finalCode || bottomToTopCode) && (
            <div className="bg-green-50 dark:bg-green-950 rounded-lg border-2 border-green-200 dark:border-green-800">
              <div className="px-2 md:px-3 py-2 bg-green-100 dark:bg-green-900 border-b border-green-200 dark:border-green-800">
                <h2 className="text-sm md:text-base font-semibold text-green-900 dark:text-green-100">Results</h2>
              </div>

              <div className="px-2 md:px-3 py-2 space-y-1.5">
                <div className="grid grid-cols-2 gap-1.5">
                  <div className="bg-white dark:bg-slate-800 p-2 rounded border border-blue-300 dark:border-blue-700">
                    <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1">Top→Bottom</p>
                    <div className="font-mono text-lg md:text-xl font-bold text-blue-600 dark:text-blue-400 text-center tracking-widest">
                      {finalCode || "—"}
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-800 p-2 rounded border border-purple-300 dark:border-purple-700">
                    <p className="text-xs font-semibold text-purple-700 dark:text-purple-300 mb-1">Bottom→Top</p>
                    <div className="font-mono text-lg md:text-xl font-bold text-purple-600 dark:text-purple-400 text-center tracking-widest">
                      {bottomToTopCode || "—"}
                    </div>
                  </div>
                </div>

                {/* MCQ Options */}
                <div className="pt-1.5 border-t border-green-200 dark:border-green-800">
                  <label className="block text-xs font-medium text-green-900 dark:text-green-100 mb-1">
                    MCQ Options
                  </label>
                  <textarea
                    value={optionsText}
                    onChange={(e) => setOptionsText(e.target.value)}
                    placeholder="Enter options"
                    className="w-full px-2 py-1.5 text-xs border-2 border-green-300 dark:border-green-700 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-green-500 dark:focus:border-green-400 focus:outline-none resize-none font-mono"
                    rows={2}
                  />
                </div>

                {/* Match Result */}
                {matched && (
                  <div className="p-2 bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 rounded flex items-center gap-2 text-xs">
                    <span className="bg-green-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs flex-shrink-0 font-bold">
                      ✓
                    </span>
                    <p className="font-bold text-green-800 dark:text-green-100">
                      Match: <span>{matched}</span>
                    </p>
                  </div>
                )}
                {!matched && optionsText.length > 0 && (
                  <div className="p-2 bg-amber-50 dark:bg-amber-900 border border-amber-300 dark:border-amber-700 rounded text-xs text-amber-800 dark:text-amber-200">
                    ⚠ No match found
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Reset Button */}
          <button
            onClick={resetAll}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 font-medium transition-colors text-sm"
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-2">
        <div className="max-w-5xl mx-auto px-3 md:px-6 py-2 md:py-3">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          

            <div className="flex gap-1.5 flex-wrap">
              <a
                href="https://github.com/Jefino9488"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-2 py-1.5 text-xs bg-slate-800 dark:bg-slate-700 text-white rounded hover:bg-slate-700 dark:hover:bg-slate-600 transition-colors font-medium"
              >
                <GitBranch size={14} />
                GitHub
              </a>
              <a
                href="https://buymeacoffee.com/jefino"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-2 py-1.5 text-xs bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors font-medium"
              >
                <Coffee size={14} />
                Coffee
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function matchOptions(code: string | null, optionsText: string) {
  if (!code || !optionsText) return null
  const opts = optionsText
    .split(/[\s\n,]+/)
    .map((x) => x.trim())
    .filter((x) => x.length)
  return opts.find((o) => o === code) || null
}
