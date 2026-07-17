"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trophy, RotateCcw, AlertTriangle, Zap } from "lucide-react";
import { type Product } from "@/data/products";
import {
  calculateTestTime,
  generateFinalReport,
  type FinalReport as FinalReportType,
} from "@/lib/simulationEngine";
import LaptopScreen from "./LaptopScreen";
import FinalReport from "./FinalReport";

interface SimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  laptop1: Product;
  laptop2: Product;
}

export interface AppDefinition {
  id: string;
  name: string;
  category: "browser" | "dev" | "creative" | "gaming" | "productivity" | "ai" | "system";
  color: string;
  bgColor: string;
  icon: string;
}

const APPS: AppDefinition[] = [
  { id: "system-boot", name: "System Boot", category: "system", color: "#6366f1", bgColor: "#eef2ff", icon: "power" },
  { id: "open-chrome", name: "Chrome", category: "browser", color: "#4285f4", bgColor: "#e8f0fe", icon: "globe" },
  { id: "vscode", name: "VS Code", category: "dev", color: "#007acc", bgColor: "#e6f3ff", icon: "code" },
  { id: "android-studio", name: "Android Studio", category: "dev", color: "#3ddc84", bgColor: "#e8f8ee", icon: "smartphone" },
  { id: "photoshop", name: "Photoshop", category: "creative", color: "#31a8ff", bgColor: "#e6f4ff", icon: "image" },
  { id: "lightroom", name: "Lightroom", category: "creative", color: "#31a8ff", bgColor: "#e6f4ff", icon: "aperture" },
  { id: "premiere-export", name: "Premiere Pro", category: "creative", color: "#9999ff", bgColor: "#eeeeff", icon: "film" },
  { id: "blender-render", name: "Blender", category: "creative", color: "#ea7600", bgColor: "#fef3e2", icon: "box" },
  { id: "office", name: "Office", category: "productivity", color: "#d83b01", bgColor: "#fde8e0", icon: "file-text" },
  { id: "excel", name: "Excel", category: "productivity", color: "#217346", bgColor: "#e0f2e9", icon: "table" },
  { id: "zoom", name: "Zoom", category: "productivity", color: "#2d8cff", bgColor: "#e6f3ff", icon: "video" },
  { id: "minecraft", name: "Minecraft", category: "gaming", color: "#62b847", bgColor: "#eaf7e4", icon: "blocks" },
  { id: "gta-v", name: "GTA V", category: "gaming", color: "#f5a623", bgColor: "#fef5e2", icon: "car" },
  { id: "valorant", name: "Valorant", category: "gaming", color: "#ff4655", bgColor: "#ffe6e8", icon: "target" },
  { id: "cyberpunk-2077", name: "Cyberpunk 2077", category: "gaming", color: "#fcee09", bgColor: "#fefde6", icon: "cpu" },
  { id: "fortnite", name: "Fortnite", category: "gaming", color: "#9d4dbb", bgColor: "#f3e6fc", icon: "crosshair" },
  { id: "apex-legends", name: "Apex Legends", category: "gaming", color: "#da292a", bgColor: "#fde6e6", icon: "swords" },
  { id: "ai-image-gen", name: "AI Image Gen", category: "ai", color: "#8b5cf6", bgColor: "#f0ebff", icon: "paintbrush" },
  { id: "stable-diffusion", name: "Stable Diffusion", category: "ai", color: "#a855f7", bgColor: "#f3e8ff", icon: "sparkles" },
  { id: "local-llm", name: "Local LLM", category: "ai", color: "#06b6d4", bgColor: "#e0f7fa", icon: "message-square" },
];

interface TestState {
  appId: string;
  progress1: number;
  progress2: number;
  time1: number;
  time2: number;
  done1: boolean;
  done2: boolean;
}

export default function SimulationModal({
  isOpen,
  onClose,
  laptop1,
  laptop2,
}: SimulationModalProps) {
  const [activeApp, setActiveApp] = useState<string | null>(null);
  const [testState, setTestState] = useState<TestState | null>(null);
  const [completedTests, setCompletedTests] = useState<
    Array<{ appId: string; time1: number; time2: number; winner: 0 | 1 | -1 }>
  >([]);
  const [showReport, setShowReport] = useState(false);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const testDuration1Ref = useRef<number>(0);
  const testDuration2Ref = useRef<number>(0);

  const appDef = activeApp ? APPS.find((a) => a.id === activeApp) : null;

  const runTest = useCallback(
    (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = (timestamp - startTimeRef.current) / 1000;

      const d1 = testDuration1Ref.current;
      const d2 = testDuration2Ref.current;

      const p1 = Math.min(1, elapsed / d1);
      const p2 = Math.min(1, elapsed / d2);
      const done1 = p1 >= 1;
      const done2 = p2 >= 1;

      setTestState((prev) =>
        prev
          ? {
              ...prev,
              progress1: p1,
              progress2: p2,
              time1: Math.min(elapsed, d1),
              time2: Math.min(elapsed, d2),
              done1,
              done2,
            }
          : prev
      );

      if (done1 && done2) {
        return;
      }
      rafRef.current = requestAnimationFrame(runTest);
    },
    []
  );

  const handleAppClick = useCallback(
    (appId: string) => {
      if (activeApp) return;
      const test = APPS.find((a) => a.id === appId);
      if (!test) return;

      const d1 = calculateTestTime(laptop1, appId);
      const d2 = calculateTestTime(laptop2, appId);

      testDuration1Ref.current = d1;
      testDuration2Ref.current = d2;
      startTimeRef.current = 0;

      setActiveApp(appId);
      setTestState({
        appId,
        progress1: 0,
        progress2: 0,
        time1: 0,
        time2: 0,
        done1: false,
        done2: false,
      });

      rafRef.current = requestAnimationFrame(runTest);
    },
    [activeApp, laptop1, laptop2, runTest]
  );

  useEffect(() => {
    if (testState?.done1 && testState?.done2) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      const d1 = testDuration1Ref.current;
      const d2 = testDuration2Ref.current;
      const winner: 0 | 1 | -1 = d1 < d2 ? 0 : d2 < d1 ? 1 : -1;

      setCompletedTests((prev) => [
        ...prev,
        { appId: testState.appId, time1: d1, time2: d2, winner },
      ]);

      setTimeout(() => {
        setActiveApp(null);
        setTestState(null);
      }, 1800);
    }
  }, [testState?.done1, testState?.done2, testState?.appId]);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleRetry = useCallback(() => {
    setActiveApp(null);
    setTestState(null);
    setCompletedTests([]);
    setShowReport(false);
  }, []);

  const l1Wins = completedTests.filter((t) => t.winner === 0).length;
  const l2Wins = completedTests.filter((t) => t.winner === 1).length;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-2 sm:p-4"
        onClick={(e) => e.target === e.currentTarget && !activeApp && onClose()}
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.92, opacity: 0 }}
          className="relative w-full max-w-[1600px] h-[96vh] bg-gray-950 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-gray-900 border-b border-gray-800 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Zap size={16} className="text-white" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-white">
                  Performance Simulation
                </h2>
                <p className="text-[10px] sm:text-xs text-gray-400">
                  Click any app below to open it on both laptops simultaneously
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Score */}
              <div className="hidden sm:flex items-center gap-3 text-sm">
                <span className="text-blue-400 font-bold">{laptop1.name.split(" ").slice(-1)[0]}</span>
                <span className="text-white font-bold text-lg">{l1Wins}</span>
                <span className="text-gray-500">-</span>
                <span className="text-white font-bold text-lg">{l2Wins}</span>
                <span className="text-purple-400 font-bold">{laptop2.name.split(" ").slice(-1)[0]}</span>
              </div>
              {completedTests.length > 0 && (
                <button
                  onClick={() => setShowReport(true)}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-lg hover:bg-amber-400/20 transition-colors"
                >
                  <Trophy size={12} />
                  Report
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 overflow-hidden flex flex-col">
            {/* Two laptop screens */}
            <div className="flex-1 flex items-center justify-center gap-4 p-3 sm:p-6">
              <div className="flex-1 max-w-[600px] h-full">
                <LaptopScreen
                  laptopName={laptop1.name}
                  laptopIndex={0}
                  testState={testState}
                  appDef={appDef ?? undefined}
                  accentColor="#3b82f6"
                />
              </div>
              <div className="hidden sm:flex flex-col items-center gap-2 text-gray-500">
                <span className="text-xs font-bold uppercase tracking-widest">VS</span>
              </div>
              <div className="flex-1 max-w-[600px] h-full">
                <LaptopScreen
                  laptopName={laptop2.name}
                  laptopIndex={1}
                  testState={testState}
                  appDef={appDef ?? undefined}
                  accentColor="#a855f7"
                />
              </div>
            </div>

            {/* App icons grid */}
            <div className="shrink-0 bg-gray-900 border-t border-gray-800 px-4 sm:px-6 py-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  Select an app to test
                </span>
                {activeApp && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[10px] text-blue-400 animate-pulse"
                  >
                    Running...
                  </motion.span>
                )}
              </div>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                {APPS.map((app) => {
                  const isDone = completedTests.some((t) => t.appId === app.id);
                  const isActive = activeApp === app.id;
                  return (
                    <button
                      key={app.id}
                      onClick={() => handleAppClick(app.id)}
                      disabled={!!activeApp}
                      className={`
                        relative flex flex-col items-center gap-1 p-2 rounded-xl transition-all
                        ${isActive ? "bg-blue-500/20 ring-2 ring-blue-500" : ""}
                        ${isDone && !isActive ? "opacity-50" : ""}
                        ${!activeApp ? "hover:bg-gray-800 cursor-pointer" : "cursor-not-allowed"}
                      `}
                    >
                      <div
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg"
                        style={{ backgroundColor: app.color }}
                      >
                        {getAppIcon(app.icon)}
                      </div>
                      <span className="text-[9px] sm:text-[10px] text-gray-400 font-medium text-center leading-tight truncate w-full">
                        {app.name}
                      </span>
                      {isDone && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                          <span className="text-[8px] text-white font-bold">✓</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
              <div className="mt-3 flex items-start gap-2 text-[10px] text-amber-500/70">
                <AlertTriangle size={10} className="mt-0.5 shrink-0" />
                <span>Simulation based on hardware specifications and benchmark estimates.</span>
              </div>
            </div>
          </div>

          {/* Completed tests history bar */}
          {completedTests.length > 0 && (
            <div className="shrink-0 bg-gray-900/80 border-t border-gray-800 px-4 py-2 overflow-x-auto">
              <div className="flex gap-2 min-w-max">
                {completedTests.map((t, i) => {
                  const app = APPS.find((a) => a.id === t.appId);
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-2 px-2 py-1 rounded-lg bg-gray-800/50 text-[10px]"
                    >
                      <span className="text-gray-400">{app?.name}</span>
                      <span className={t.winner === 0 ? "text-blue-400 font-bold" : "text-gray-500"}>
                        {t.time1.toFixed(1)}s
                      </span>
                      <span className="text-gray-600">vs</span>
                      <span className={t.winner === 1 ? "text-purple-400 font-bold" : "text-gray-500"}>
                        {t.time2.toFixed(1)}s
                      </span>
                      {t.winner === 0 && <span className="text-blue-400">◀</span>}
                      {t.winner === 1 && <span className="text-purple-400">▶</span>}
                      {t.winner === -1 && <span className="text-gray-500">=</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Report Modal */}
          {showReport && (
            <FinalReportOverlay
              tests={completedTests}
              laptop1={laptop1}
              laptop2={laptop2}
              onClose={() => setShowReport(false)}
              onRetry={handleRetry}
            />
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function FinalReportOverlay({
  tests,
  laptop1,
  laptop2,
  onClose,
  onRetry,
}: {
  tests: Array<{ appId: string; time1: number; time2: number; winner: 0 | 1 | -1 }>;
  laptop1: Product;
  laptop2: Product;
  onClose: () => void;
  onRetry: () => void;
}) {
  const results = tests.map((t) => {
    const test = APPS.find((a) => a.id === t.appId);
    return {
      testId: t.appId,
      testName: test?.name || t.appId,
      category: (test?.category || "system") as string,
      icon: test?.icon || "box",
      laptop1Time: t.time1,
      laptop2Time: t.time2,
      laptop1Metrics: { cpuUsage: 0, gpuUsage: 0, ramUsage: 0, storageActivity: 0, temperature: 0, fanSpeed: 0, batteryDrain: 0, powerDraw: 0 },
      laptop2Metrics: { cpuUsage: 0, gpuUsage: 0, ramUsage: 0, storageActivity: 0, temperature: 0, fanSpeed: 0, batteryDrain: 0, powerDraw: 0 },
      winnerIndex: t.winner as 0 | 1 | -1,
      difference: Math.max(t.time1, t.time2) > 0 ? (Math.abs(t.time1 - t.time2) / Math.max(t.time1, t.time2)) * 100 : 0,
      efficiency1: "Good",
      efficiency2: "Good",
      isFpsTest: false,
    };
  });

  const report = generateFinalReport(results as any, laptop1, laptop2);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-50 bg-white overflow-y-auto"
    >
      <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900">Final Comparison Report</h2>
        <div className="flex gap-3">
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <RotateCcw size={14} />
            Run Again
          </button>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>
      <div className="max-w-5xl mx-auto p-6">
        <FinalReport
          report={report}
          laptop1Name={laptop1.name}
          laptop2Name={laptop2.name}
          laptop1Price={laptop1.price}
          laptop2Price={laptop2.price}
        />
      </div>
    </motion.div>
  );
}

function getAppIcon(icon: string) {
  const icons: Record<string, string> = {
    power: "⏻",
    globe: "🌐",
    code: "</>",
    smartphone: "📱",
    image: "🖼",
    aperture: "◎",
    film: "🎬",
    box: "📦",
    "file-text": "📄",
    table: "📊",
    video: "📹",
    blocks: "🧱",
    car: "🚗",
    target: "◎",
    cpu: "⚡",
    crosshair: "⊕",
    swords: "⚔",
    paintbrush: "🎨",
    sparkles: "✨",
    "message-square": "💬",
  };
  return <span className="text-base">{icons[icon] || "▶"}</span>;
}
