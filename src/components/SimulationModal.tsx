"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  AlertTriangle,
  Laptop,
  Trophy,
  BarChart3,
} from "lucide-react";
import { type Product } from "@/data/products";
import {
  TEST_DEFINITIONS,
  calculateTestMetrics,
  calculateTestTime,
  getEfficiencyRating,
  generateFinalReport,
  type TestResult,
  type LaptopMetrics,
  type FinalReport as FinalReportType,
} from "@/lib/simulationEngine";
import LiveMetricsPanel from "./LiveMetricsPanel";
import TestResultSummary from "./TestResultSummary";
import FinalReport from "./FinalReport";

interface SimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  laptop1: Product;
  laptop2: Product;
}

type Phase = "idle" | "running" | "paused" | "testComplete" | "report";

export default function SimulationModal({
  isOpen,
  onClose,
  laptop1,
  laptop2,
}: SimulationModalProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [metrics1, setMetrics1] = useState<LaptopMetrics | null>(null);
  const [metrics2, setMetrics2] = useState<LaptopMetrics | null>(null);
  const [results, setResults] = useState<TestResult[]>([]);
  const [currentResult, setCurrentResult] = useState<TestResult | null>(null);
  const [report, setReport] = useState<FinalReportType | null>(null);
  const [showResultDetail, setShowResultDetail] = useState(false);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const pausedProgressRef = useRef(0);

  const totalTests = TEST_DEFINITIONS.length;
  const currentTest = TEST_DEFINITIONS[currentTestIndex];

  const runTestFrame = useCallback(
    (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const delta = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      const test = TEST_DEFINITIONS[currentTestIndex];
      const testDuration = test.isFpsTest
        ? 8
        : Math.min(calculateTestTime(laptop1, test.id), calculateTestTime(laptop2, test.id)) * 0.15;
      const speed = Math.max(testDuration, 3);

      setProgress((prev) => {
        const next = Math.min(1, prev + delta / speed);
        const m1 = calculateTestMetrics(laptop1, test.id, next);
        const m2 = calculateTestMetrics(laptop2, test.id, next);
        setMetrics1(m1);
        setMetrics2(m2);

        if (next >= 1) {
          const val1 = calculateTestTime(laptop1, test.id);
          const val2 = calculateTestTime(laptop2, test.id);
          const winnerIndex: 0 | 1 | -1 =
            val1 === val2
              ? -1
              : test.isFpsTest
                ? val1 > val2
                  ? 0
                  : 1
                : val1 < val2
                  ? 0
                  : 1;
          const diff =
            Math.max(val1, val2) > 0
              ? (Math.abs(val1 - val2) / Math.max(val1, val2)) * 100
              : 0;
          const result: TestResult = {
            testId: test.id,
            testName: test.name,
            category: test.category,
            icon: test.icon,
            laptop1Time: val1,
            laptop2Time: val2,
            laptop1Metrics: m1,
            laptop2Metrics: m2,
            winnerIndex,
            difference: diff,
            efficiency1: getEfficiencyRating(val1, test.isFpsTest),
            efficiency2: getEfficiencyRating(val2, test.isFpsTest),
            isFpsTest: test.isFpsTest,
          };
          setCurrentResult(result);
          setResults((prev) => [...prev, result]);
          setPhase("testComplete");
          return 1;
        }
        return next;
      });
      rafRef.current = requestAnimationFrame(runTestFrame);
    },
    [currentTestIndex, laptop1, laptop2]
  );

  useEffect(() => {
    if (phase === "running") {
      lastTimeRef.current = 0;
      pausedProgressRef.current = 0;
      setProgress(0);
      rafRef.current = requestAnimationFrame(runTestFrame);
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [phase, runTestFrame]);

  useEffect(() => {
    if (phase === "running" && currentTestIndex > 0) {
      lastTimeRef.current = 0;
      setProgress(0);
      rafRef.current = requestAnimationFrame(runTestFrame);
    }
  }, [currentTestIndex, phase, runTestFrame]);

  const handleStart = () => {
    setPhase("running");
    setCurrentTestIndex(0);
    setResults([]);
    setReport(null);
    setCurrentResult(null);
    setShowResultDetail(false);
  };

  const handlePause = () => {
    if (phase === "running") {
      setPhase("paused");
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    }
  };

  const handleResume = () => {
    if (phase === "paused") {
      setPhase("running");
    }
  };

  const handleNextTest = () => {
    setShowResultDetail(false);
    setCurrentResult(null);
    if (currentTestIndex + 1 >= totalTests) {
      const finalReport = generateFinalReport(results, laptop1, laptop2);
      setReport(finalReport);
      setPhase("report");
    } else {
      setCurrentTestIndex((prev) => prev + 1);
      setPhase("running");
    }
  };

  const handleRetry = () => {
    setPhase("idle");
    setCurrentTestIndex(0);
    setResults([]);
    setReport(null);
    setCurrentResult(null);
    setProgress(0);
    setMetrics1(null);
    setMetrics2(null);
    setShowResultDetail(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-4"
        onClick={(e) => e.target === e.currentTarget && phase !== "running" && onClose()}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-[1400px] h-[95vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <BarChart3 size={16} className="text-white" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-gray-900">
                  Performance Simulation
                </h2>
                <p className="text-[10px] sm:text-xs text-gray-500">
                  {phase === "idle" && "Ready to start"}
                  {phase === "running" && `Test ${currentTestIndex + 1} of ${totalTests}: ${currentTest?.name}`}
                  {phase === "paused" && `Paused at test ${currentTestIndex + 1}`}
                  {phase === "testComplete" && `Test ${currentTestIndex + 1} complete`}
                  {phase === "report" && "Final Report"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {phase === "running" && (
                <button
                  onClick={handlePause}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Pause size={16} />
                </button>
              )}
              {phase === "paused" && (
                <button
                  onClick={handleResume}
                  className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                >
                  <Play size={16} />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1 bg-gray-100 shrink-0">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
              animate={{ width: `${((currentTestIndex + progress) / totalTests) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Main content */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-6">
            {/* Idle state */}
            {phase === "idle" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center h-full text-center"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-6">
                  <Play size={32} className="text-white ml-1" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Ready to Simulate
                </h3>
                <p className="text-gray-500 text-sm max-w-md mb-8">
                  Run {totalTests} performance benchmarks across system, productivity, creative,
                  development, gaming, and AI workloads.
                </p>

                <div className="flex items-center gap-8 mb-8">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 flex items-center justify-center mb-2">
                      <Laptop size={24} className="text-gray-400" />
                    </div>
                    <p className="text-xs font-semibold text-gray-700 max-w-[120px] line-clamp-2">
                      {laptop1.name}
                    </p>
                  </div>
                  <div className="text-2xl font-bold text-gray-300">VS</div>
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 flex items-center justify-center mb-2">
                      <Laptop size={24} className="text-gray-400" />
                    </div>
                    <p className="text-xs font-semibold text-gray-700 max-w-[120px] line-clamp-2">
                      {laptop2.name}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleStart}
                  className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/25"
                >
                  <Play size={18} />
                  Start Simulation
                </button>

                <div className="mt-8 flex items-start gap-2 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 max-w-md">
                  <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                  <p>
                    Simulation based on hardware specifications and benchmark estimates. Actual
                    performance may vary based on drivers, thermals, and workload conditions.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Running / Paused state */}
            {(phase === "running" || phase === "paused") && currentTest && (
              <div className="space-y-4">
                {/* Test info */}
                <div className="text-center">
                  <motion.div
                    key={currentTest.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200"
                  >
                    <span className="text-xs font-medium text-blue-600 uppercase tracking-wider">
                      Test {currentTestIndex + 1}/{totalTests}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-blue-400" />
                    <span className="text-sm font-semibold text-blue-800">{currentTest.name}</span>
                  </motion.div>
                  <p className="text-xs text-gray-500 mt-2">{currentTest.description}</p>
                </div>

                {/* Side by side laptops with metrics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 border border-gray-200">
                      <Laptop size={14} className="text-blue-500" />
                      <span className="text-xs font-semibold text-gray-700 truncate">
                        {laptop1.name}
                      </span>
                      <span className="ml-auto text-[10px] text-gray-400 uppercase">Left</span>
                    </div>
                    {metrics1 && (
                      <LiveMetricsPanel
                        metrics={metrics1}
                        laptopName={laptop1.name}
                        isActive={phase === "running"}
                      />
                    )}
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 border border-gray-200">
                      <Laptop size={14} className="text-indigo-500" />
                      <span className="text-xs font-semibold text-gray-700 truncate">
                        {laptop2.name}
                      </span>
                      <span className="ml-auto text-[10px] text-gray-400 uppercase">Right</span>
                    </div>
                    {metrics2 && (
                      <LiveMetricsPanel
                        metrics={metrics2}
                        laptopName={laptop2.name}
                        isActive={phase === "running"}
                      />
                    )}
                  </div>
                </div>

                {/* Progress */}
                <div className="text-center">
                  <div className="inline-flex items-center gap-3">
                    <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                        animate={{ width: `${progress * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono text-gray-500">
                      {(progress * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>

                {/* Disclaimer */}
                <div className="flex items-start gap-2 text-[10px] text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 max-w-2xl mx-auto">
                  <AlertTriangle size={12} className="mt-0.5 shrink-0" />
                  <p>
                    Simulation based on hardware specifications and benchmark estimates.
                  </p>
                </div>
              </div>
            )}

            {/* Test complete */}
            {phase === "testComplete" && currentResult && (
              <div className="space-y-4">
                <TestResultSummary
                  result={currentResult}
                  laptop1Name={laptop1.name}
                  laptop2Name={laptop2.name}
                />
                <div className="flex justify-center">
                  <button
                    onClick={handleNextTest}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/25"
                  >
                    {currentTestIndex + 1 >= totalTests ? (
                      <>
                        <Trophy size={16} />
                        View Final Report
                      </>
                    ) : (
                      <>
                        Next Test
                        <ChevronRight size={16} />
                      </>
                    )}
                  </button>
                </div>
                {/* Score so far */}
                <div className="text-center text-xs text-gray-500">
                  Score so far: {laptop1.name.split(" ").slice(0, 2).join(" ")}{" "}
                  <span className="font-bold text-blue-600">
                    {results.filter((r) => r.winnerIndex === 0).length}
                  </span>{" "}
                  -{" "}
                  <span className="font-bold text-indigo-600">
                    {results.filter((r) => r.winnerIndex === 1).length}
                  </span>{" "}
                  {laptop2.name.split(" ").slice(0, 2).join(" ")}
                  {" | Ties: "}
                  <span className="font-bold text-gray-500">
                    {results.filter((r) => r.winnerIndex === -1).length}
                  </span>
                </div>
              </div>
            )}

            {/* Report */}
            {phase === "report" && report && (
              <div className="space-y-6">
                <FinalReport
                  report={report}
                  laptop1Name={laptop1.name}
                  laptop2Name={laptop2.name}
                  laptop1Price={laptop1.price}
                  laptop2Price={laptop2.price}
                />
                <div className="flex justify-center">
                  <button
                    onClick={handleRetry}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                  >
                    <RotateCcw size={16} />
                    Run Again
                  </button>
                </div>
                <div className="flex items-start gap-2 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 max-w-2xl mx-auto">
                  <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                  <p>
                    Simulation based on hardware specifications and benchmark estimates. Actual
                    performance may vary based on drivers, thermals, and workload conditions.
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
