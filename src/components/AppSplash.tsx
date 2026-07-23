"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface AppSplashProps {
  appId: string;
  progress: number;
  done: boolean;
  appName: string;
  appColor: string;
}

const SPLASH_CONFIGS: Record<
  string,
  {
    bg: string;
    logoType: string;
    logoText?: string;
    loadingSteps: string[];
    brandColor: string;
  }
> = {
  "system-boot": {
    bg: "from-blue-900 via-blue-800 to-blue-900",
    logoType: "hp",
    loadingSteps: [
      "POST check...",
      "Loading BIOS...",
      "Detecting drives...",
      "Loading Windows...",
      "Starting services...",
      "Welcome",
    ],
    brandColor: "#2563eb",
  },
  "open-chrome": {
    bg: "from-white via-gray-50 to-white",
    logoType: "chrome",
    loadingSteps: [
      "Loading profile...",
      "Syncing bookmarks...",
      "Loading extensions...",
      "Ready",
    ],
    brandColor: "#4285f4",
  },
  vscode: {
    bg: "from-[#1e1e2e] via-[#181825] to-[#1e1e2e]",
    logoType: "vscode",
    loadingSteps: [
      "Initializing Electron...",
      "Loading extensions...",
      "Restoring state...",
      "Starting language server...",
      "Ready",
    ],
    brandColor: "#007acc",
  },
  "android-studio": {
    bg: "from-[#1a1a2e] via-[#16213e] to-[#0f3460]",
    logoType: "androidstudio",
    loadingSteps: [
      "Loading Gradle...",
      "Syncing project...",
      "Indexing sources...",
      "Building workspace...",
      "Ready",
    ],
    brandColor: "#3ddc84",
  },
  photoshop: {
    bg: "from-[#001e36] via-[#003366] to-[#001e36]",
    logoType: "photoshop",
    loadingSteps: [
      "Reading preferences...",
      "Loading brushes...",
      "Loading actions...",
      "Loading plug-ins...",
      "Initializing GPU...",
      "Building menus...",
      "Reading fonts...",
      "Done",
    ],
    brandColor: "#31a8ff",
  },
  lightroom: {
    bg: "from-[#1a2744] via-[#1b3a5c] to-[#1a2744]",
    logoType: "lightroom",
    loadingSteps: [
      "Reading catalog...",
      "Loading presets...",
      "Building previews...",
      "Syncing edits...",
      "Ready",
    ],
    brandColor: "#31a8ff",
  },
  "premiere-export": {
    bg: "from-[#1a0a2e] via-[#2d1050] to-[#1a0a2e]",
    logoType: "premiere",
    loadingSteps: [
      "Loading workspace...",
      "Loading media encoder...",
      "Initializing Mercury GPU...",
      "Loading effects...",
      "Building timeline...",
      "Ready",
    ],
    brandColor: "#9999ff",
  },
  "blender-render": {
    bg: "from-[#262626] via-[#1a1a1a] to-[#262626]",
    logoType: "blender",
    loadingSteps: [
      "Loading Python...",
      "Initializing Cycles...",
      "Loading add-ons...",
      "Building scene...",
      "Ready",
    ],
    brandColor: "#ea7600",
  },
  office: {
    bg: "from-[#d83b01] via-[#c23800] to-[#d83b01]",
    logoType: "office",
    loadingSteps: [
      "Loading templates...",
      "Checking license...",
      "Loading add-ins...",
      "Ready",
    ],
    brandColor: "#d83b01",
  },
  excel: {
    bg: "from-[#1a5e2a] via-[#217346] to-[#1a5e2a]",
    logoType: "excel",
    loadingSteps: [
      "Loading workbook...",
      "Initializing VBA...",
      "Loading formulas...",
      "Ready",
    ],
    brandColor: "#217346",
  },
  zoom: {
    bg: "from-[#0e72ed] via-[#2d8cff] to-[#0e72ed]",
    logoType: "zoom",
    loadingSteps: [
      "Connecting to server...",
      "Initializing camera...",
      "Loading audio...",
      "Ready",
    ],
    brandColor: "#2d8cff",
  },
  minecraft: {
    bg: "from-[#2d5a27] via-[#3b7a33] to-[#2d5a27]",
    logoType: "minecraft",
    loadingSteps: [
      "Mojang Studios...",
      "Loading textures...",
      "Generating world...",
      "Loading chunks...",
      "Preparing spawn...",
      "Done",
    ],
    brandColor: "#62b847",
  },
  "gta-v": {
    bg: "from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a]",
    logoType: "gtav",
    loadingSteps: [
      "Rockstar Games...",
      "Loading GTA V...",
      "Initializing RAGE engine...",
      "Loading San Andreas...",
      "Loading textures...",
      "Loading scripts...",
      "Configuring display...",
      "Almost there...",
      "Loading Online...",
      "Welcome to Los Santos",
    ],
    brandColor: "#f5a623",
  },
  valorant: {
    bg: "from-[#0f1419] via-[#1a2332] to-[#0f1419]",
    logoType: "valorant",
    loadingSteps: [
      "Riot Games...",
      "Initializing Vanguard...",
      "Loading agents...",
      "Connecting to servers...",
      "Loading maps...",
      "Ready to deploy",
    ],
    brandColor: "#ff4655",
  },
  "cyberpunk-2077": {
    bg: "from-[#0a0a0a] via-[#1a1a00] to-[#0a0a0a]",
    logoType: "cyberpunk",
    loadingSteps: [
      "CD Projekt Red...",
      "Loading Night City...",
      "Initializing RTX...",
      "Loading character...",
      "Compiling shaders...",
      "Loading district...",
      "Warming up neural link...",
      "Ready",
    ],
    brandColor: "#fcee09",
  },
  fortnite: {
    bg: "from-[#1a0a3e] via-[#2d1060] to-[#1a0a3e]",
    logoType: "fortnite",
    loadingSteps: [
      "Epic Games...",
      "Loading Battle Pass...",
      "Connecting to servers...",
      "Loading items...",
      "Matchingmaking...",
      "Ready",
    ],
    brandColor: "#9d4dbb",
  },
  "apex-legends": {
    bg: "from-[#1a0a0a] via-[#2d1515] to-[#1a0a0a]",
    logoType: "apex",
    loadingSteps: [
      "EA / Respawn...",
      "Loading Legends...",
      "Connecting to servers...",
      "Loading King's Canyon...",
      "Initializing anti-cheat...",
      "Ready",
    ],
    brandColor: "#da292a",
  },
  "ai-image-gen": {
    bg: "from-[#1a0a3e] via-[#2d1060] to-[#1a0a3e]",
    logoType: "ai",
    loadingSteps: [
      "Loading CUDA cores...",
      "Initializing model...",
      "Loading weights...",
      "Building diffusion pipeline...",
      "Ready",
    ],
    brandColor: "#8b5cf6",
  },
  "stable-diffusion": {
    bg: "from-[#1a0a2e] via-[#2d1050] to-[#1a0a2e]",
    logoType: "stable",
    loadingSteps: [
      "Loading Python env...",
      "Importing torch...",
      "Loading SD model...",
      "Initializing VAE...",
      "Loading CLIP tokenizer...",
      "Ready",
    ],
    brandColor: "#a855f7",
  },
  "local-llm": {
    bg: "from-[#0a1a2e] via-[#0f2a40] to-[#0a1a2e]",
    logoType: "llm",
    loadingSteps: [
      "Loading llama.cpp...",
      "Loading model weights...",
      "Allocating VRAM...",
      "Initializing tokenizer...",
      "Ready",
    ],
    brandColor: "#06b6d4",
  },
};

export default function AppSplash({
  appId,
  progress,
  done,
  appName,
  appColor,
}: AppSplashProps) {
  const config = SPLASH_CONFIGS[appId] || {
    bg: "from-gray-900 via-gray-800 to-gray-900",
    logoType: "generic",
    loadingSteps: ["Loading...", "Initializing...", "Ready"],
    brandColor: appColor,
  };

  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const totalSteps = config.loadingSteps.length;
    const newIdx = Math.min(
      Math.floor(progress * totalSteps),
      totalSteps - 1
    );
    setStepIndex(newIdx);
  }, [progress, config.loadingSteps.length]);

  return (
    <div
      className={`absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b ${config.bg}`}
    >
      {/* Logo */}
      <motion.div
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.05, type: "spring", stiffness: 260, damping: 20 }}
        className="mb-5"
      >
        <AppLogo type={config.logoType} color={config.brandColor} appId={appId} />
      </motion.div>

      {/* App name */}
      <motion.h2
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="text-sm sm:text-base font-bold text-white mb-1 tracking-wide"
        style={{ textShadow: `0 0 20px ${config.brandColor}40` }}
      >
        {appName}
      </motion.h2>

      {/* Loading step text */}
      <motion.p
        key={stepIndex}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-[10px] sm:text-xs text-gray-400 mb-4 h-4 font-mono"
      >
        {config.loadingSteps[stepIndex]}
      </motion.p>

      {/* Progress bar */}
      <div className="w-2/3 max-w-[180px]">
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: config.brandColor }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.08 }}
          />
        </div>
      </div>

      {/* Subtle glow effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background: `radial-gradient(circle at 50% 40%, ${config.brandColor}30 0%, transparent 60%)`,
        }}
      />
    </div>
  );
}

function AppLogo({ type, color, appId }: { type: string; color: string; appId: string }) {
  switch (type) {
    case "photoshop":
      return (
        <div className="relative">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-[#001e36] border-2 border-[#31a8ff]/40 flex items-center justify-center shadow-2xl"
            style={{ boxShadow: `0 0 40px ${color}30` }}>
            <span className="text-3xl sm:text-4xl font-black text-[#31a8ff] tracking-tighter"
              style={{ fontFamily: "system-ui, sans-serif" }}>
              Ps
            </span>
          </div>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[8px] text-[#31a8ff]/60 font-medium tracking-widest uppercase">
            Adobe
          </div>
        </div>
      );

    case "lightroom":
      return (
        <div className="relative">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-[#1a2744] border-2 border-[#31a8ff]/40 flex items-center justify-center shadow-2xl"
            style={{ boxShadow: `0 0 40px ${color}30` }}>
            <span className="text-3xl sm:text-4xl font-black text-[#31a8ff] tracking-tighter"
              style={{ fontFamily: "system-ui, sans-serif" }}>
              Lr
            </span>
          </div>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[8px] text-[#31a8ff]/60 font-medium tracking-widest uppercase">
            Adobe
          </div>
        </div>
      );

    case "premiere":
      return (
        <div className="relative">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-[#1a0a2e] border-2 border-[#9999ff]/40 flex items-center justify-center shadow-2xl"
            style={{ boxShadow: `0 0 40px ${color}30` }}>
            <span className="text-3xl sm:text-4xl font-black text-[#9999ff] tracking-tighter"
              style={{ fontFamily: "system-ui, sans-serif" }}>
              Pr
            </span>
          </div>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[8px] text-[#9999ff]/60 font-medium tracking-widest uppercase">
            Adobe
          </div>
        </div>
      );

    case "chrome":
      return (
        <div className="relative">
          <svg width="80" height="80" viewBox="0 0 80 80" className="sm:w-[96px] sm:h-[96px] drop-shadow-2xl">
            <circle cx="40" cy="40" r="36" fill="#fff" />
            <circle cx="40" cy="40" r="16" fill="#4285f4" />
            <path d="M40 24 L64 24 A24 24 0 0 1 52 60 L40 40 Z" fill="#ea4335" />
            <path d="M52 60 L28 60 A24 24 0 0 1 16 24 L40 40 Z" fill="#34a853" />
            <path d="M16 24 L40 24 L40 40 Z" fill="#fbbc05" />
            <circle cx="40" cy="40" r="16" fill="#4285f4" />
            <circle cx="40" cy="40" r="10" fill="#fff" />
            <circle cx="40" cy="40" r="10" fill="#4285f4" opacity="0.9" />
          </svg>
        </div>
      );

    case "vscode":
      return (
        <div className="relative">
          <svg width="80" height="80" viewBox="0 0 80 80" className="sm:w-[96px] sm:h-[96px] drop-shadow-2xl">
            <rect x="2" y="2" width="76" height="76" rx="16" fill="#1e1e2e" />
            <path d="M20 20 L38 40 L20 60" stroke="#007acc" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M38 40 L60 25" stroke="#007acc" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M38 40 L60 55" stroke="#007acc" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M50 20 L60 25 L60 55 L50 60" stroke="#007acc" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      );

    case "androidstudio":
      return (
        <div className="relative">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-gradient-to-br from-[#3ddc84] to-[#0f9d58] flex items-center justify-center shadow-2xl"
            style={{ boxShadow: "0 0 40px #3ddc8430" }}>
            <svg width="48" height="48" viewBox="0 0 48 48">
              <rect x="10" y="18" width="28" height="22" rx="3" fill="#fff" opacity="0.9" />
              <circle cx="19" cy="28" r="2" fill="#3ddc84" />
              <circle cx="29" cy="28" r="2" fill="#3ddc84" />
              <line x1="16" y1="14" x2="20" y2="18" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
              <line x1="32" y1="14" x2="28" y2="18" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
              <rect x="14" y="40" width="3" height="6" rx="1.5" fill="#fff" opacity="0.7" />
              <rect x="21" y="40" width="3" height="8" rx="1.5" fill="#fff" opacity="0.7" />
              <rect x="28" y="40" width="3" height="6" rx="1.5" fill="#fff" opacity="0.7" />
            </svg>
          </div>
        </div>
      );

    case "blender":
      return (
        <div className="relative">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-[#265c9c] flex items-center justify-center shadow-2xl"
            style={{ boxShadow: "0 0 40px #ea760030" }}>
            <svg width="56" height="56" viewBox="0 0 56 56">
              <ellipse cx="28" cy="34" rx="20" ry="12" fill="#ea7600" />
              <ellipse cx="28" cy="30" rx="14" ry="8" fill="#fff" opacity="0.9" />
              <circle cx="28" cy="30" r="4" fill="#ea7600" />
            </svg>
          </div>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[8px] text-white/60 font-bold tracking-wider">
            blender.org
          </div>
        </div>
      );

    case "gtav":
      return (
        <div className="relative">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-black flex items-center justify-center shadow-2xl border border-[#f5a623]/30"
            style={{ boxShadow: "0 0 40px #f5a62320" }}>
            <div className="text-center">
              <div className="text-[10px] font-bold text-[#f5a623] tracking-widest" style={{ fontFamily: "Impact, sans-serif" }}>
                ROCKSTAR
              </div>
              <div className="text-2xl sm:text-3xl font-black text-[#f5a623] leading-none" style={{ fontFamily: "Impact, sans-serif" }}>
                GTA
              </div>
              <div className="text-lg font-black text-[#f5a623] leading-none" style={{ fontFamily: "Impact, sans-serif" }}>
                V
              </div>
            </div>
          </div>
        </div>
      );

    case "valorant":
      return (
        <div className="relative">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-[#0f1419] border border-[#ff4655]/40 flex items-center justify-center shadow-2xl"
            style={{ boxShadow: "0 0 40px #ff465520" }}>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-black text-white tracking-[0.2em] uppercase" style={{ fontFamily: "system-ui, sans-serif" }}>
                VALORANT
              </div>
            </div>
          </div>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[8px] text-[#ff4655]/60 font-medium">
            RIOT GAMES
          </div>
        </div>
      );

    case "cyberpunk":
      return (
        <div className="relative">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-black border-2 border-[#fcee09]/50 flex items-center justify-center shadow-2xl"
            style={{ boxShadow: "0 0 40px #fcee0920" }}>
            <div className="text-center">
              <div className="text-[8px] font-bold text-[#fcee09]/60 tracking-widest">
                CD PROJEKT RED
              </div>
              <div className="text-xs sm:text-sm font-black text-[#fcee09] leading-none mt-0.5 tracking-wider">
                CYBERPUNK
              </div>
              <div className="text-xl sm:text-2xl font-black text-[#fcee09] leading-none" style={{ fontFamily: "Impact, sans-serif" }}>
                2077
              </div>
            </div>
          </div>
        </div>
      );

    case "fortnite":
      return (
        <div className="relative">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-gradient-to-br from-[#1a0a3e] to-[#9d4dbb] flex items-center justify-center shadow-2xl"
            style={{ boxShadow: "0 0 40px #9d4dbb30" }}>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-black text-white tracking-wider" style={{ fontFamily: "Impact, sans-serif" }}>
                FORTNITE
              </div>
            </div>
          </div>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[8px] text-[#9d4dbb]/60 font-medium">
            EPIC GAMES
          </div>
        </div>
      );

    case "apex":
      return (
        <div className="relative">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-black border border-[#da292a]/40 flex items-center justify-center shadow-2xl"
            style={{ boxShadow: "0 0 40px #da292a20" }}>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-black text-white tracking-[0.15em]" style={{ fontFamily: "Impact, sans-serif" }}>
                APEX
              </div>
              <div className="text-[8px] sm:text-[9px] text-[#da292a] tracking-[0.3em] font-bold -mt-0.5">
                LEGENDS
              </div>
            </div>
          </div>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[8px] text-gray-500 font-medium">
            EA / RESPAWN
          </div>
        </div>
      );

    case "minecraft":
      return (
        <div className="relative">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-[#3b7a33] flex items-center justify-center shadow-2xl"
            style={{ boxShadow: "0 0 40px #62b84730" }}>
            <div className="text-center">
              <div className="text-lg sm:text-xl font-black text-white" style={{ fontFamily: "monospace" }}>
                MINECRAFT
              </div>
            </div>
          </div>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[8px] text-[#62b847]/60 font-medium">
            MOJANG STUDIOS
          </div>
        </div>
      );

    case "office":
      return (
        <div className="relative">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-gradient-to-br from-[#d83b01] to-[#c23800] flex items-center justify-center shadow-2xl"
            style={{ boxShadow: "0 0 40px #d83b0130" }}>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-black text-white" style={{ fontFamily: "system-ui, sans-serif" }}>
                O
              </div>
              <div className="text-[8px] sm:text-[9px] text-white/80 tracking-widest font-bold -mt-1">
                OFFICE
              </div>
            </div>
          </div>
        </div>
      );

    case "excel":
      return (
        <div className="relative">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-gradient-to-br from-[#1a5e2a] to-[#217346] flex items-center justify-center shadow-2xl"
            style={{ boxShadow: "0 0 40px #21734630" }}>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-black text-white" style={{ fontFamily: "system-ui, sans-serif" }}>
                X
              </div>
              <div className="text-[8px] sm:text-[9px] text-white/80 tracking-widest font-bold -mt-1">
                EXCEL
              </div>
            </div>
          </div>
        </div>
      );

    case "zoom":
      return (
        <div className="relative">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-[#2d8cff] flex items-center justify-center shadow-2xl"
            style={{ boxShadow: "0 0 40px #2d8cff30" }}>
            <div className="text-center">
              <svg width="48" height="48" viewBox="0 0 48 48">
                <polygon points="16,12 36,24 16,36" fill="white" />
              </svg>
              <div className="text-[9px] text-white/90 tracking-widest font-bold -mt-1">
                zoom
              </div>
            </div>
          </div>
        </div>
      );

    case "ai":
    case "stable":
    case "llm":
      return (
        <div className="relative">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-gradient-to-br from-purple-900 to-indigo-900 border border-purple-500/30 flex items-center justify-center shadow-2xl"
            style={{ boxShadow: `0 0 40px ${color}30` }}>
            <div className="text-center">
              <svg width="40" height="40" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="16" fill="none" stroke={color} strokeWidth="2" opacity="0.5" />
                <circle cx="20" cy="20" r="8" fill={color} opacity="0.6" />
                <circle cx="20" cy="20" r="3" fill="white" />
              </svg>
              <div className="text-[8px] text-white/60 tracking-widest font-bold -mt-0.5">
                AI
              </div>
            </div>
          </div>
        </div>
      );

    case "hp":
      return (
        <div className="relative">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-[#0096d6] flex items-center justify-center shadow-2xl"
            style={{ boxShadow: "0 0 40px #0096d630" }}>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-black text-white" style={{ fontFamily: "system-ui, sans-serif" }}>
                hp
              </div>
            </div>
          </div>
        </div>
      );

    default:
      return (
        <div className="relative">
          <div
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl flex items-center justify-center shadow-2xl"
            style={{ backgroundColor: color }}
          >
            <span className="text-3xl text-white font-bold">▶</span>
          </div>
        </div>
      );
  }
}
