"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trophy, RotateCcw, AlertTriangle, Zap } from "lucide-react";
import { type Product } from "@/data/products";
import {
  calculateTestTime,
  generateFinalReport,
} from "@/lib/simulationEngine";
import AppSimulator, { type PerformanceTier } from "./simulation/AppSimulator";
import MetricsOverlay, { type MetricsData } from "./simulation/MetricsOverlay";
import FinalReport from "./FinalReport";

interface SimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  laptop1: Product;
  laptop2: Product;
}

export interface AppDefinition {
  id: string;
  simulatorId: string;
  name: string;
  category: "browser" | "dev" | "creative" | "gaming" | "productivity" | "ai" | "system";
  color: string;
  icon: string;
  logo: string;
}

const HP_DESKTOP_LOGO = "https://upload.wikimedia.org/wikipedia/commons/a/ad/HP_logo_2012.svg";
const WIFI_ICON = "https://fonts.gstatic.com/s/i/materialicons/wifi/v15/24px.svg";
const BATTERY_ICON = "https://fonts.gstatic.com/s/i/materialicons/battery_full/v14/24px.svg";

const APPS: AppDefinition[] = [
  { id: "photoshop", simulatorId: "photoshop", name: "Photoshop", category: "creative", color: "#001e36", icon: "Ps", logo: "https://upload.wikimedia.org/wikipedia/commons/a/af/Adobe_Photoshop_CC_icon.svg" },
  { id: "premiere", simulatorId: "premiere", name: "Premiere Pro", category: "creative", color: "#1a0a2e", icon: "Pr", logo: "https://upload.wikimedia.org/wikipedia/commons/4/40/Adobe_Premiere_Pro_CC_icon.svg" },
  { id: "vscode", simulatorId: "vscode", name: "VS Code", category: "dev", color: "#1e1e2e", icon: "VS", logo: "https://upload.wikimedia.org/wikipedia/commons/9/9a/Visual_Studio_Code_1.35_icon.svg" },
  { id: "blender", simulatorId: "blender", name: "Blender", category: "creative", color: "#265c9c", icon: "Bl", logo: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Blender_logo_no_text.svg" },
  { id: "canva", simulatorId: "canva", name: "Canva", category: "productivity", color: "#00c4cc", icon: "Ca", logo: "https://cdn.simpleicons.org/canva" },
  { id: "figma", simulatorId: "figma", name: "Figma", category: "dev", color: "#1e1e1e", icon: "Fi", logo: "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg" },
  { id: "word", simulatorId: "word", name: "Word", category: "productivity", color: "#2b5797", icon: "Wo", logo: "https://cdn.simpleicons.org/microsoftword" },
  { id: "capcut", simulatorId: "capcut", name: "CapCut", category: "creative", color: "#1a1a1a", icon: "CC", logo: "https://seeklogo.com/images/C/capcut-logo-947A7C40D9-seeklogo.com.png" },
  { id: "photopea", simulatorId: "photopea", name: "Photopea", category: "creative", color: "#18a4f4", icon: "PP", logo: "https://www.photopea.com/promo/icon512.png" },
  { id: "pixlr", simulatorId: "pixlr", name: "Pixlr", category: "creative", color: "#00c853", icon: "Px", logo: "https://pixlr.com/favicon.ico" },
];

type Phase = "selecting" | "splash" | "running" | "winner" | "complete";

interface CompletedTest {
  appId: string;
  time1: number;
  time2: number;
  winner: 0 | 1 | -1;
  metrics1: MetricsData | null;
  metrics2: MetricsData | null;
}

function getPerformanceTier(product: Product): PerformanceTier {
  const score = (product.ram || 8) + (product.price || 50000) / 15000;
  if (score >= 20) return "high";
  if (score >= 14) return "medium";
  return "low";
}

function getSplashDuration(tier: PerformanceTier): number {
  return tier === "high" ? 1200 : tier === "medium" ? 2200 : 3500;
}

export default function SimulationModal({
  isOpen,
  onClose,
  laptop1,
  laptop2,
}: SimulationModalProps) {
  const [phase, setPhase] = useState<Phase>("selecting");
  const [activeApp, setActiveApp] = useState<string | null>(null);
  const [completedTests, setCompletedTests] = useState<CompletedTest[]>([]);
  const [showReport, setShowReport] = useState(false);

  const metricsRef1 = useRef<MetricsData | null>(null);
  const metricsRef2 = useRef<MetricsData | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  const tier1 = getPerformanceTier(laptop1);
  const tier2 = getPerformanceTier(laptop2);

  const isTestRunning = phase === "running" && activeApp !== null;
  const isBusy = isTestRunning || phase === "winner";
  const isSplash = phase === "splash" && activeApp !== null;

  const handleAppClick = useCallback(
    (appId: string) => {
      if (phase === "running" || phase === "splash") return;
      setActiveApp(appId);
      setPhase("splash");

      const splashTime = Math.max(getSplashDuration(tier1), getSplashDuration(tier2));
      setTimeout(() => {
        setPhase("running");
        setElapsedTime(0);
        startTimeRef.current = Date.now();
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
          setElapsedTime(
            Math.round(((Date.now() - startTimeRef.current) / 1000) * 10) / 10
          );
        }, 100);
      }, splashTime);
    },
    [phase, tier1, tier2]
  );

  const handleCompleteTest = useCallback(() => {
    if (!activeApp) return;
    if (timerRef.current) clearInterval(timerRef.current);

    const t1 = calculateTestTime(laptop1, activeApp);
    const t2 = calculateTestTime(laptop2, activeApp);
    const winner = t1 < t2 ? 0 : t2 < t1 ? 1 : -1;

    setCompletedTests((prev) => [
      ...prev,
      {
        appId: activeApp,
        time1: t1,
        time2: t2,
        winner,
        metrics1: metricsRef1.current,
        metrics2: metricsRef2.current,
      },
    ]);

    setPhase("winner");
    setElapsedTime(0);
    metricsRef1.current = null;
    metricsRef2.current = null;

    setTimeout(() => {
      setActiveApp(null);
      setPhase("selecting");
    }, 2500);
  }, [activeApp, laptop1, laptop2]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleRetry = useCallback(() => {
    setActiveApp(null);
    setPhase("selecting");
    setCompletedTests([]);
    setShowReport(false);
    setElapsedTime(0);
  }, []);

  const l1Wins = completedTests.filter((t) => t.winner === 0).length;
  const l2Wins = completedTests.filter((t) => t.winner === 1).length;
  const lastTest = completedTests.length > 0 ? completedTests[completedTests.length - 1] : null;

  if (!isOpen) return null;

  const activeAppDef = activeApp ? APPS.find((a) => a.id === activeApp) : null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-1 sm:p-3"
        onClick={(e) => e.target === e.currentTarget && !isBusy && onClose()}
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.92, opacity: 0 }}
          className="relative w-full max-w-[1600px] h-[96vh] bg-gray-950 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 bg-gray-900 border-b border-gray-800 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Zap size={14} className="text-white" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">
                  {phase === "winner"
                    ? `${activeAppDef?.name} — Test Complete`
                    : isTestRunning
                      ? `Testing: ${activeAppDef?.name}`
                      : isSplash
                        ? `Opening: ${activeAppDef?.name}...`
                        : "Performance Simulation"}
                </h2>
                <p className="text-[10px] text-gray-400">
                  {phase === "winner"
                    ? lastTest?.winner === 0
                      ? `${laptop1.name.split(" ").slice(-1)[0]} wins this test`
                      : lastTest?.winner === 1
                        ? `${laptop2.name.split(" ").slice(-1)[0]} wins this test`
                        : "It's a tie!"
                    : isTestRunning
                      ? "Interact with both apps, then click Complete"
                      : isSplash
                        ? "Launching application on both laptops"
                        : "Select an app to open on both laptops"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {isTestRunning && (
                <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-800 border border-gray-700">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-sm font-mono text-white font-bold">
                    {elapsedTime.toFixed(1)}s
                  </span>
                </div>
              )}

              <div className="hidden sm:flex items-center gap-2 text-sm">
                <span className="text-blue-400 font-bold text-xs">
                  {laptop1.name.split(" ").slice(-1)[0]}
                </span>
                <span className="text-white font-bold text-lg">{l1Wins}</span>
                <span className="text-gray-600">-</span>
                <span className="text-white font-bold text-lg">{l2Wins}</span>
                <span className="text-purple-400 font-bold text-xs">
                  {laptop2.name.split(" ").slice(-1)[0]}
                </span>
              </div>

              {completedTests.length > 0 && !isTestRunning && (
                <button
                  onClick={() => setShowReport(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-lg hover:bg-amber-400/20 transition-colors"
                >
                  <Trophy size={12} />
                  Report ({completedTests.length})
                </button>
              )}

              {isTestRunning && (
                <button
                  onClick={handleCompleteTest}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-green-600 rounded-lg hover:bg-green-500 transition-colors shadow-lg shadow-green-600/20"
                >
                  Complete Test
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
            <div className="flex-1 flex items-stretch gap-2 p-2 sm:p-3 min-h-0">
              <LaptopFrame
                name={laptop1.name}
                tier={tier1}
                accentColor="#3b82f6"
                isActive={isTestRunning}
                phase={phase}
                activeApp={activeApp}
                apps={APPS}
                onAppClick={handleAppClick}
                onMetricsUpdate={(m) => { metricsRef1.current = m; }}
                laptopIndex={0}
                lastTestWinner={lastTest?.winner}
              />

              <div className="hidden sm:flex flex-col items-center justify-center gap-1 text-gray-600 shrink-0 w-6">
                <div className="w-px flex-1 bg-gray-800" />
                <span className="text-[10px] font-black uppercase tracking-widest">VS</span>
                <div className="w-px flex-1 bg-gray-800" />
              </div>

              <LaptopFrame
                name={laptop2.name}
                tier={tier2}
                accentColor="#a855f7"
                isActive={isTestRunning}
                phase={phase}
                activeApp={activeApp}
                apps={APPS}
                onAppClick={handleAppClick}
                onMetricsUpdate={(m) => { metricsRef2.current = m; }}
                laptopIndex={1}
                lastTestWinner={lastTest?.winner}
              />
            </div>

            {/* Bottom dock */}
            <div className="shrink-0 bg-gray-900 border-t border-gray-800 px-3 sm:px-5 py-2.5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                  {isTestRunning ? "Apps Tested" : phase === "winner" ? "Result" : "Available Apps"}
                </span>
                {isTestRunning && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[9px] text-green-400 font-bold">
                    ● LIVE
                  </motion.span>
                )}
                {phase === "winner" && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[9px] text-amber-400 font-bold">
                    ● RESULT
                  </motion.span>
                )}
              </div>
              <div className="flex gap-1.5 overflow-x-auto pb-1">
                {APPS.map((app) => {
                  const isDone = completedTests.some((t) => t.appId === app.id);
                  const isActive = activeApp === app.id;
                  return (
                    <button
                      key={app.id}
                      onClick={() => handleAppClick(app.id)}
                      disabled={!!activeApp}
                      className={`
                        relative flex flex-col items-center gap-1 px-2.5 py-1.5 rounded-xl transition-all shrink-0
                        ${isActive ? "bg-blue-500/20 ring-2 ring-blue-500" : ""}
                        ${isDone && !isActive ? "opacity-40" : ""}
                        ${!activeApp ? "hover:bg-gray-800 cursor-pointer" : "cursor-not-allowed"}
                      `}
                    >
                      <div className="w-9 h-9 rounded-lg overflow-hidden bg-white/5 flex items-center justify-center shadow-md">
                        <img src={app.logo} alt={app.name} className="w-6 h-6 object-contain" loading="eager" />
                      </div>
                      <span className="text-[9px] text-gray-400 font-medium text-center leading-tight w-12 truncate">
                        {app.name}
                      </span>
                      {isDone && (
                        <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-500 flex items-center justify-center">
                          <span className="text-[7px] text-white font-bold">✓</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
              <div className="mt-1.5 flex items-start gap-1.5 text-[9px] text-amber-500/60">
                <AlertTriangle size={9} className="mt-0.5 shrink-0" />
                <span>Simulation based on hardware specifications and benchmark estimates.</span>
              </div>
            </div>
          </div>

          {/* Completed tests bar */}
          {completedTests.length > 0 && (
            <div className="shrink-0 bg-gray-900/80 border-t border-gray-800 px-3 py-1.5 overflow-x-auto">
              <div className="flex gap-1.5 min-w-max">
                {completedTests.map((t, i) => {
                  const app = APPS.find((a) => a.id === t.appId);
                  return (
                    <div key={i} className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-gray-800/50 text-[9px]">
                      <img src={app?.logo} alt="" className="w-3 h-3 object-contain" />
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

/* ------------------------------------------------------------------ */
/* LaptopFrame                                                        */
/* ------------------------------------------------------------------ */

function LaptopFrame({
  name,
  tier,
  accentColor,
  isActive,
  phase,
  activeApp,
  apps,
  onAppClick,
  onMetricsUpdate,
  laptopIndex,
  lastTestWinner,
}: {
  name: string;
  tier: PerformanceTier;
  accentColor: string;
  isActive: boolean;
  phase: Phase;
  activeApp: string | null;
  apps: AppDefinition[];
  onAppClick: (appId: string) => void;
  onMetricsUpdate: (m: MetricsData) => void;
  laptopIndex: 0 | 1;
  lastTestWinner?: number | null;
}) {
  const activeAppDef = activeApp ? apps.find((a) => a.id === activeApp) : null;
  const splashDuration = tier === "high" ? 1200 : tier === "medium" ? 2200 : 3500;

  return (
    <div className="flex-1 flex flex-col min-w-0 min-h-0">
      {/* Laptop name bar */}
      <div
        className="flex items-center justify-between px-3 py-1.5 rounded-t-xl shrink-0"
        style={{ backgroundColor: accentColor + "15", borderBottom: `2px solid ${accentColor}40` }}
      >
        <div className="flex items-center gap-2">
          <img src={HP_DESKTOP_LOGO} alt="HP" className="w-4 h-4 object-contain brightness-200" />
          <span className="text-xs font-bold text-white truncate">{name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded"
            style={{ backgroundColor: accentColor + "20", color: accentColor }}
          >
            {tier}
          </span>
          {isActive && (
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[9px] text-green-400 font-bold">ON</span>
            </div>
          )}
        </div>
      </div>

      {/* Screen area */}
      <div
        className="flex-1 relative rounded-b-xl overflow-hidden border-2 min-h-0"
        style={{ borderColor: accentColor + "30" }}
      >
        {/* Desktop */}
        {phase === "selecting" && !activeApp && (
          <DesktopScreen apps={apps} onAppClick={onAppClick} laptopIndex={laptopIndex} />
        )}

        {/* Splash Screen */}
        <AnimatePresence>
          {phase === "splash" && activeAppDef && (
            <SplashScreen app={activeAppDef} duration={splashDuration} />
          )}
        </AnimatePresence>

        {/* Running App */}
        {phase === "running" && activeApp && (
          <div className="absolute inset-0">
            <AppSimulator
              appId={activeApp}
              onInteract={() => onMetricsUpdate({} as MetricsData)}
              tier={tier}
              laptopIndex={laptopIndex}
            />
            <MetricsOverlay
              tier={tier}
              isActive={isActive}
              laptopIndex={laptopIndex}
              accentColor={accentColor}
              onMetricsUpdate={onMetricsUpdate}
            />
          </div>
        )}

        {/* Winner Overlay */}
        <AnimatePresence>
          {phase === "winner" && activeAppDef && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm"
            >
              {lastTestWinner === laptopIndex ? (
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/30 mb-3">
                    <Trophy size={28} className="text-white" />
                  </div>
                  <span className="text-lg font-bold text-green-400">WINNER</span>
                  <span className="text-xs text-gray-400 mt-1">Faster performance on this test</span>
                </motion.div>
              ) : lastTestWinner !== undefined && lastTestWinner !== null ? (
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center shadow-lg mb-3">
                    <span className="text-2xl text-gray-300">2nd</span>
                  </div>
                  <span className="text-sm font-bold text-gray-400">Slower on this test</span>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg mb-3">
                    <span className="text-2xl text-white">=</span>
                  </div>
                  <span className="text-sm font-bold text-amber-400">TIE</span>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Splash Screen – logo pop animation                                 */
/* ------------------------------------------------------------------ */

function SplashScreen({ app, duration }: { app: AppDefinition; duration: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, transition: { duration: 0.3 } }}
      className="absolute inset-0 z-30 flex flex-col items-center justify-center"
      style={{ backgroundColor: app.color }}
    >
      {/* Radial glow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="w-64 h-64 rounded-full opacity-30 blur-3xl"
          style={{ background: `radial-gradient(circle, ${app.color}88 0%, transparent 70%)` }}
        />
      </div>

      {/* Logo pop */}
      <motion.div
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5, type: "spring", stiffness: 200, damping: 15 }}
        className="relative z-10"
      >
        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden shadow-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center p-4">
          <img src={app.logo} alt={app.name} className="w-full h-full object-contain drop-shadow-2xl" />
        </div>
      </motion.div>

      {/* App name */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="relative z-10 mt-5 text-center"
      >
        <div className="text-white text-lg sm:text-xl font-bold drop-shadow-lg">{app.name}</div>
        <div className="text-white/60 text-xs mt-1">Loading...</div>
      </motion.div>

      {/* Loading bar */}
      <motion.div className="relative z-10 mt-6 w-40 sm:w-56">
        <div className="h-1 bg-white/20 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: duration / 1000, ease: "easeInOut" }}
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${app.color}, white)` }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* DesktopScreen                                                      */
/* ------------------------------------------------------------------ */

function DesktopScreen({
  apps,
  onAppClick,
  laptopIndex,
}: {
  apps: AppDefinition[];
  onAppClick: (appId: string) => void;
  laptopIndex: 0 | 1;
}) {
  return (
    <div className="absolute inset-0 flex flex-col bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]">
      {/* Top bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-black/40 shrink-0">
        <div className="flex items-center gap-2">
          <img src={HP_DESKTOP_LOGO} alt="HP" className="w-3.5 h-3.5 object-contain brightness-200" />
          <span className="text-[10px] text-white/80 font-semibold">HP Desktop</span>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-white/60">
          <div className="flex items-center gap-1">
            <img src={WIFI_ICON} alt="WiFi" className="w-3 h-3 object-contain brightness-0 invert opacity-60" />
            <span>Connected</span>
          </div>
          <div className="flex items-center gap-1">
            <img src={BATTERY_ICON} alt="Battery" className="w-3 h-3 object-contain brightness-0 invert opacity-60" />
            <span>85%</span>
          </div>
          <span className="tabular-nums">12:30</span>
        </div>
      </div>

      {/* Desktop area with 3x3+1 app grid (scrollable) */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-6">
        <div className="grid grid-cols-3 gap-3 sm:gap-5 justify-items-center content-center min-h-full">
          {apps.map((app) => (
            <button
              key={app.id}
              onClick={() => onAppClick(app.id)}
              className="flex flex-col items-center gap-2 p-3 sm:p-4 rounded-2xl hover:bg-white/8 active:bg-white/12 transition-all group cursor-pointer w-24 sm:w-32"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden bg-white shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all flex items-center justify-center">
                <img
                  src={app.logo}
                  alt={app.name}
                  className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                  loading="eager"
                />
              </div>
              <span className="text-[10px] sm:text-[11px] text-white/70 font-medium text-center leading-tight group-hover:text-white transition-colors">
                {app.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom taskbar */}
      <div className="flex items-center justify-center gap-2 px-4 py-2 bg-black/50 shrink-0">
        <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-white/8 border border-white/10 hover:bg-white/12 transition-colors cursor-pointer">
          <img src={HP_DESKTOP_LOGO} alt="Start" className="w-3.5 h-3.5 object-contain brightness-200" />
          <span className="text-[10px] text-white/70 font-medium">Start</span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* FinalReportOverlay                                                 */
/* ------------------------------------------------------------------ */

function FinalReportOverlay({
  tests,
  laptop1,
  laptop2,
  onClose,
  onRetry,
}: {
  tests: CompletedTest[];
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
      laptop1Metrics: t.metrics1
        ? { cpuUsage: t.metrics1.cpuUsage, gpuUsage: t.metrics1.gpuUsage, ramUsage: t.metrics1.ramUsage, storageActivity: 0, temperature: t.metrics1.temperature, fanSpeed: t.metrics1.fanSpeed, batteryDrain: 0, powerDraw: 0 }
        : { cpuUsage: 0, gpuUsage: 0, ramUsage: 0, storageActivity: 0, temperature: 0, fanSpeed: 0, batteryDrain: 0, powerDraw: 0 },
      laptop2Metrics: t.metrics2
        ? { cpuUsage: t.metrics2.cpuUsage, gpuUsage: t.metrics2.gpuUsage, ramUsage: t.metrics2.ramUsage, storageActivity: 0, temperature: t.metrics2.temperature, fanSpeed: t.metrics2.fanSpeed, batteryDrain: 0, powerDraw: 0 }
        : { cpuUsage: 0, gpuUsage: 0, ramUsage: 0, storageActivity: 0, temperature: 0, fanSpeed: 0, batteryDrain: 0, powerDraw: 0 },
      winnerIndex: t.winner as 0 | 1 | -1,
      difference: Math.max(t.time1, t.time2) > 0 ? (Math.abs(t.time1 - t.time2) / Math.max(t.time1, t.time2)) * 100 : 0,
      efficiency1: "Good",
      efficiency2: "Good",
      isFpsTest: false,
    };
  });

  const report = generateFinalReport(results as any, laptop1, laptop2);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-50 bg-white overflow-y-auto">
      <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900">Final Comparison Report</h2>
        <div className="flex gap-2">
          <button onClick={onRetry} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
            <RotateCcw size={12} />
            Run Again
          </button>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={14} />
          </button>
        </div>
      </div>
      <div className="max-w-5xl mx-auto p-4">
        <FinalReport report={report} laptop1Name={laptop1.name} laptop2Name={laptop2.name} laptop1Price={laptop1.price} laptop2Price={laptop2.price} />
      </div>
    </motion.div>
  );
}
