"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { AppDefinition } from "./SimulationModal";

interface LaptopScreenProps {
  laptopName: string;
  laptopIndex: 0 | 1;
  testState: {
    appId: string;
    progress1: number;
    progress2: number;
    time1: number;
    time2: number;
    done1: boolean;
    done2: boolean;
  } | null;
  appDef: AppDefinition | undefined;
  accentColor: string;
}

export default function LaptopScreen({
  laptopName,
  laptopIndex,
  testState,
  appDef,
  accentColor,
}: LaptopScreenProps) {
  const progress = laptopIndex === 0 ? testState?.progress1 ?? 0 : testState?.progress2 ?? 0;
  const time = laptopIndex === 0 ? testState?.time1 ?? 0 : testState?.time2 ?? 0;
  const done = laptopIndex === 0 ? testState?.done1 : testState?.done2;
  const isRunning = !!testState && !done;

  const shortName = laptopName.split(" ").slice(-2).join(" ");

  return (
    <div className="h-full flex flex-col">
      {/* Laptop label */}
      <div className="flex items-center gap-2 mb-2 px-1">
        <div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: accentColor }}
        />
        <span className="text-xs font-semibold text-gray-300 truncate">
          {shortName}
        </span>
        <span className="text-[10px] text-gray-500 ml-auto">
          {laptopIndex === 0 ? "Laptop A" : "Laptop B"}
        </span>
      </div>

      {/* Laptop frame */}
      <div className="flex-1 relative">
        {/* Screen bezel */}
        <div className="absolute inset-0 bg-gray-800 rounded-t-xl rounded-b-sm border border-gray-700 overflow-hidden shadow-2xl">
          {/* Webcam dot */}
          <div className="absolute top-1 left-1/2 -translate-x-1/2 z-20">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-600" />
          </div>

          {/* Screen */}
          <div className="absolute inset-[3px] bg-gray-950 rounded-t-lg overflow-hidden">
            {/* Desktop */}
            <AnimatePresence mode="wait">
              {!testState ? (
                <motion.div
                  key="desktop"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900"
                >
                  {/* Desktop wallpaper pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full border border-white/20" />
                    <div className="absolute bottom-1/3 right-1/4 w-24 h-24 rounded-full border border-white/10" />
                  </div>

                  {/* Desktop icon grid */}
                  <div className="absolute inset-4 grid grid-cols-3 gap-2 content-start pt-6">
                    {["Chrome", "VS Code", "GTA V", "Photoshop", "Premiere Pro"].map(
                      (name) => (
                        <div
                          key={name}
                          className="flex flex-col items-center gap-1 p-1.5 rounded-lg hover:bg-white/5"
                        >
                          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-[10px] text-white/40">
                            ▶
                          </div>
                          <span className="text-[8px] text-white/30 text-center leading-tight">
                            {name}
                          </span>
                        </div>
                      )
                    )}
                  </div>

                  {/* Taskbar */}
                  <div className="absolute bottom-0 inset-x-0 h-6 bg-black/50 backdrop-blur-sm flex items-center justify-center gap-1 px-2">
                    <div className="w-3 h-3 rounded bg-white/10" />
                    <div className="w-3 h-3 rounded bg-white/10" />
                    <div className="w-3 h-3 rounded bg-white/10" />
                    <div className="ml-auto text-[8px] text-white/30">
                      {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={`app-${testState.appId}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 flex flex-col"
                  style={{ backgroundColor: appDef?.color ? `${appDef.color}15` : "#111" }}
                >
                  {/* App splash / loading screen */}
                  <div className="flex-1 flex flex-col items-center justify-center gap-4">
                    {/* App logo */}
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center shadow-2xl"
                      style={{ backgroundColor: appDef?.color || "#666" }}
                    >
                      <span className="text-3xl sm:text-4xl text-white font-bold">
                        {getAppLogo(appDef?.icon || "box")}
                      </span>
                    </motion.div>

                    {/* App name */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-center"
                    >
                      <h3 className="text-sm sm:text-base font-bold text-white">
                        {appDef?.name}
                      </h3>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {done ? "Loaded" : "Loading..."}
                      </p>
                    </motion.div>

                    {/* Progress bar */}
                    <div className="w-3/4 max-w-[200px]">
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: appDef?.color || "#666" }}
                          animate={{ width: `${progress * 100}%` }}
                          transition={{ duration: 0.1 }}
                        />
                      </div>
                    </div>

                    {/* Timer */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-center"
                    >
                      <span
                        className="text-2xl sm:text-3xl font-mono font-bold tabular-nums"
                        style={{ color: appDef?.color || "#fff" }}
                      >
                        {time.toFixed(2)}
                      </span>
                      <span className="text-xs text-gray-500 ml-1">sec</span>
                    </motion.div>

                    {/* Winner indicator when done */}
                    {done && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-2"
                      >
                        {(() => {
                          const isWinner =
                            testState &&
                            ((laptopIndex === 0 && testState.time1 <= testState.time2) ||
                              (laptopIndex === 1 && testState.time2 <= testState.time1));
                          const isTie = testState && testState.time1 === testState.time2;
                          if (isTie) {
                            return (
                              <span className="px-3 py-1 rounded-full bg-gray-500/20 text-gray-300 text-xs font-bold">
                                TIE
                              </span>
                            );
                          }
                          return isWinner ? (
                            <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold flex items-center gap-1">
                              <span>🏆</span> WINNER
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-bold">
                              SLOWER
                            </span>
                          );
                        })()}
                      </motion.div>
                    )}
                  </div>

                  {/* Taskbar */}
                  <div className="h-6 bg-black/50 backdrop-blur-sm flex items-center justify-center gap-1 px-2">
                    <div className="flex items-center gap-1">
                      <div
                        className="w-1.5 h-1.5 rounded-full animate-pulse"
                        style={{
                          backgroundColor: isRunning
                            ? appDef?.color || "#666"
                            : done
                            ? "#22c55e"
                            : "#666",
                        }}
                      />
                      <span className="text-[8px] text-white/40">
                        {appDef?.name}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Laptop base / keyboard area */}
        <div className="absolute -bottom-2 left-[5%] right-[5%] h-2 bg-gray-700 rounded-b-xl" />
        <div className="absolute -bottom-3 left-[15%] right-[15%] h-1 bg-gray-600 rounded-b-lg" />
      </div>
    </div>
  );
}

function getAppLogo(icon: string): string {
  const logos: Record<string, string> = {
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
  return logos[icon] || "▶";
}
