"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { AppDefinition } from "./SimulationModal";
import AppSplash from "./AppSplash";

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
  const done = (laptopIndex === 0 ? testState?.done1 : testState?.done2) ?? false;
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
            <AnimatePresence mode="wait">
              {!testState ? (
                /* Desktop idle state */
                <motion.div
                  key="desktop"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900"
                >
                  {/* Wallpaper pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full border border-white/20" />
                    <div className="absolute bottom-1/3 right-1/4 w-24 h-24 rounded-full border border-white/10" />
                  </div>

                  {/* Desktop icons */}
                  <div className="absolute inset-4 grid grid-cols-3 gap-2 content-start pt-6">
                    {["Chrome", "VS Code", "GTA V", "Photoshop", "Premiere"].map(
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
                /* App splash screen */
                <motion.div
                  key={`app-${testState.appId}`}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="absolute inset-0"
                >
                  <AppSplash
                    appId={testState.appId}
                    progress={progress}
                    done={done}
                    appName={appDef?.name || ""}
                    appColor={appDef?.color || "#666"}
                  />

                  {/* Timer overlay at bottom-right */}
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="absolute bottom-9 right-3"
                  >
                    <div className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-sm">
                      <span className="text-base sm:text-lg font-mono font-bold tabular-nums text-white">
                        {time.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-gray-400 ml-0.5">s</span>
                    </div>
                  </motion.div>

                  {/* Winner badge */}
                  {done && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.6, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30"
                    >
                      {(() => {
                        const isWinner =
                          testState &&
                          ((laptopIndex === 0 && testState.time1 <= testState.time2) ||
                            (laptopIndex === 1 && testState.time2 <= testState.time1));
                        const isTie = testState && testState.time1 === testState.time2;
                        if (isTie) {
                          return (
                            <div className="px-5 py-3 rounded-2xl bg-black/70 backdrop-blur-md border border-gray-500/30">
                              <span className="text-xl font-black text-gray-300 tracking-wider">
                                TIE
                              </span>
                            </div>
                          );
                        }
                        return isWinner ? (
                          <div className="px-5 py-3 rounded-2xl bg-green-500/20 backdrop-blur-md border border-green-400/40 flex items-center gap-2">
                            <span className="text-2xl">🏆</span>
                            <span className="text-lg font-black text-green-400 tracking-wider">
                              WINNER
                            </span>
                          </div>
                        ) : (
                          <div className="px-5 py-3 rounded-2xl bg-red-500/20 backdrop-blur-md border border-red-400/40">
                            <span className="text-lg font-black text-red-400 tracking-wider">
                              SLOWER
                            </span>
                          </div>
                        );
                      })()}
                    </motion.div>
                  )}

                  {/* Taskbar */}
                  <div className="absolute bottom-0 inset-x-0 h-6 bg-black/50 backdrop-blur-sm flex items-center justify-center gap-1 px-2">
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

        {/* Laptop base / keyboard */}
        <div className="absolute -bottom-2 left-[5%] right-[5%] h-2 bg-gray-700 rounded-b-xl" />
        <div className="absolute -bottom-3 left-[15%] right-[15%] h-1 bg-gray-600 rounded-b-lg" />
      </div>
    </div>
  );
}
