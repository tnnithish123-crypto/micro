"use client";

import { useState, useCallback, useRef, useEffect } from "react";

export type PerformanceTier = "high" | "medium" | "low";

interface AppSimProps {
  appId: string;
  onInteract: (type: string) => void;
  tier: PerformanceTier;
  laptopIndex: 0 | 1;
}

function MenuBar({ items }: { items: string[] }) {
  return (
    <div className="flex items-center h-7 bg-[#2d2d2d] text-[11px] text-gray-300 border-b border-[#1a1a1a] px-1 shrink-0">
      {items.map((item) => (
        <button
          key={item}
          className="px-2 py-0.5 hover:bg-[#094771] rounded-sm transition-colors"
        >
          {item}
        </button>
      ))}
    </div>
  );
}

function StatusBar({ items }: { items: string[] }) {
  return (
    <div className="flex items-center justify-between h-6 bg-[#007acc] text-[10px] text-white px-2 shrink-0">
      {items.map((item, i) => (
        <span key={i}>{item}</span>
      ))}
    </div>
  );
}

function ToolButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: string;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`w-7 h-7 flex items-center justify-center rounded text-[10px] font-bold transition-all ${
        active
          ? "bg-[#0078d4] text-white"
          : "text-gray-300 hover:bg-[#3c3c3c]"
      }`}
    >
      {icon}
    </button>
  );
}

function LayerItem({
  name,
  visible,
  active,
  onClick,
}: {
  name: string;
  visible?: boolean;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 w-full px-2 py-1 text-[10px] text-left transition-colors ${
        active ? "bg-[#264f78] text-white" : "text-gray-300 hover:bg-[#2a2d2e]"
      }`}
    >
      <span className="text-gray-500 text-[9px]">{visible !== false ? "👁" : "  "}</span>
      <span className="truncate">{name}</span>
    </button>
  );
}

function PanelHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between px-2 py-1 bg-[#252526] border-b border-[#1a1a1a]">
      <span className="text-[10px] font-semibold text-gray-300 uppercase tracking-wider">
        {title}
      </span>
    </div>
  );
}

function ColorSwatch({ color, size = 16 }: { color: string; size?: number }) {
  return (
    <div
      className="rounded border border-gray-600 shrink-0"
      style={{ width: size, height: size, background: color }}
    />
  );
}

function GridCell({ color }: { color: string }) {
  return (
    <div
      className="w-full aspect-square"
      style={{ background: color }}
    />
  );
}

function CanvasCheckerboard() {
  const cells = [];
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 24; x++) {
      cells.push(
        <div
          key={`${x}-${y}`}
          className="w-full h-full"
          style={{
            background: (x + y) % 2 === 0 ? "#ffffff" : "#e0e0e0",
          }}
        />
      );
    }
  }
  return (
    <div
      className="absolute inset-0"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(24, 1fr)",
        gridTemplateRows: "repeat(16, 1fr)",
      }}
    >
      {cells}
    </div>
  );
}

function TimelineTrack({
  clips,
  label,
  color,
}: {
  clips: { start: number; width: number; color: string; label: string }[];
  label: string;
  color: string;
}) {
  return (
    <div className="flex items-center h-7 border-b border-[#1a1a1a]">
      <div className="w-16 h-full flex items-center px-1 text-[9px] text-gray-400 bg-[#1e1e1e] border-r border-[#1a1a1a] shrink-0">
        {label}
      </div>
      <div className="flex-1 h-full relative bg-[#252526]">
        {clips.map((clip, i) => (
          <div
            key={i}
            className="absolute top-1 bottom-1 rounded-sm flex items-center px-1 text-[8px] text-white font-medium truncate"
            style={{
              left: `${clip.start}%`,
              width: `${clip.width}%`,
              background: clip.color,
            }}
          >
            {clip.label}
          </div>
        ))}
      </div>
    </div>
  );
}

function TimelineRuler() {
  const marks = [];
  for (let i = 0; i < 40; i++) {
    marks.push(
      <div key={i} className="flex flex-col items-center" style={{ width: 25 }}>
        <span className="text-[7px] text-gray-500">
          {String(Math.floor(i * 2.5)).padStart(2, "0")}
        </span>
        <div
          className={`w-px ${i % 4 === 0 ? "h-2 bg-gray-500" : "h-1 bg-gray-600"}`}
        />
      </div>
    );
  }
  return (
    <div className="flex items-end h-5 bg-[#1e1e1e] border-b border-[#1a1a1a] overflow-hidden">
      {marks}
    </div>
  );
}

export default function AppSimulator({
  appId,
  onInteract,
  tier,
  laptopIndex,
}: AppSimProps) {
  const [selectedTool, setSelectedTool] = useState("move");
  const [selectedLayer, setSelectedLayer] = useState(0);
  const [showDialog, setShowDialog] = useState<string | null>(null);
  const [codeTab, setCodeTab] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [timelinePos, setTimelinePos] = useState(25);
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [canvasObjects, setCanvasObjects] = useState<
    { x: number; y: number; type: string; color: string }[]
  >([
    { x: 30, y: 30, type: "rect", color: "#3b82f6" },
    { x: 60, y: 50, type: "circle", color: "#ef4444" },
    { x: 45, y: 70, type: "rect", color: "#22c55e" },
  ]);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const delay = tier === "high" ? 50 : tier === "medium" ? 150 : 400;

  const handleToolClick = useCallback(
    (tool: string) => {
      setSelectedTool(tool);
      onInteract("tool_select");
    },
    [onInteract]
  );

  const handleCanvasClick = useCallback(() => {
    onInteract("canvas_interact");
  }, [onInteract]);

  const handleLayerClick = useCallback(
    (idx: number) => {
      setSelectedLayer(idx);
      onInteract("layer_select");
    },
    [onInteract]
  );

  if (appId === "photoshop") return (
    <div className="flex flex-col h-full bg-[#1e1e1e] text-gray-200">
      <MenuBar items={["File", "Edit", "Image", "Layer", "Type", "Select", "Filter", "3D", "View", "Window", "Help"]} />
      <div className="flex flex-1 min-h-0">
        <div className="w-8 bg-[#333333] border-r border-[#1a1a1a] flex flex-col items-center py-1 gap-0.5 shrink-0">
          {["V", "M", "L", "W", "C", "I", "B", "E", "T", "P", "H", "Z"].map(
            (icon, i) => (
              <ToolButton
                key={icon}
                icon={icon}
                label={`Tool ${i}`}
                active={selectedTool === icon.toLowerCase()}
                onClick={() => handleToolClick(icon.toLowerCase())}
              />
            )
          )}
        </div>
        <div className="flex-1 relative overflow-hidden bg-[#535353]" onClick={handleCanvasClick}>
          <CanvasCheckerboard />
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            <rect x="15" y="10" width="30" height="25" fill="#3b82f6" opacity="0.8" rx="1" />
            <circle cx="65" cy="30" r="15" fill="#ef4444" opacity="0.8" />
            <rect x="25" y="55" width="50" height="30" fill="#22c55e" opacity="0.6" rx="2" />
            <text x="30" y="38" fill="white" fontSize="4" fontFamily="Arial">Layer 1</text>
            <text x="55" y="55" fill="white" fontSize="3" fontFamily="Arial">Circle</text>
          </svg>
          {activeFilter && (
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <div className="bg-[#3c3c3c] rounded-lg p-3 text-[10px] text-center shadow-xl">
                Applying: {activeFilter}
              </div>
            </div>
          )}
          <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[9px] px-2 py-0.5 rounded">
            {selectedTool.toUpperCase()} Tool
          </div>
        </div>
        <div className="w-48 bg-[#252526] border-l border-[#1a1a1a] flex flex-col shrink-0">
          <div className="border-b border-[#1a1a1a]">
            <PanelHeader title="Layers" />
            {["Background", "Shape 1", "Layer 2", "Text Layer"].map(
              (name, i) => (
                <LayerItem
                  key={name}
                  name={name}
                  active={selectedLayer === 3 - i}
                  onClick={() => handleLayerClick(3 - i)}
                />
              )
            )}
          </div>
          <div className="flex-1">
            <PanelHeader title="Properties" />
            <div className="p-2 space-y-1.5 text-[9px] text-gray-400">
              <div className="flex justify-between"><span>Width:</span><span className="text-gray-200">1920 px</span></div>
              <div className="flex justify-between"><span>Height:</span><span className="text-gray-200">1080 px</span></div>
              <div className="flex justify-between"><span>Resolution:</span><span className="text-gray-200">300 ppi</span></div>
              <div className="flex justify-between"><span>Color Mode:</span><span className="text-gray-200">RGB</span></div>
              <div className="mt-2"><span>Foreground:</span>
                <div className="flex gap-1 mt-1"><ColorSwatch color="#000000" /><ColorSwatch color="#ffffff" /></div>
              </div>
            </div>
          </div>
          <div className="border-t border-[#1a1a1a]">
            <PanelHeader title="Color" />
            <div className="p-2 flex gap-1">
              {["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#8b5cf6", "#ec4899", "#000000"].map(
                (c) => (
                  <button key={c} onClick={() => onInteract("color_pick")} className="w-4 h-4 rounded-sm border border-gray-600 hover:scale-125 transition-transform" style={{ background: c }} />
                )
              )}
            </div>
          </div>
        </div>
      </div>
      <StatusBar items={["🔍 100%", "RGB/8", "1920 × 1080", "Doc: 12.4M/38.2M"]} />
    </div>
  );

  if (appId === "premiere") return (
    <div className="flex flex-col h-full bg-[#1e1e1e] text-gray-200">
      <MenuBar items={["File", "Edit", "Clip", "Sequence", "Graphics", "Effects", "View", "Window", "Help"]} />
      <div className="flex flex-1 min-h-0">
        <div className="w-44 bg-[#252526] border-r border-[#1a1a1a] flex flex-col shrink-0">
          <PanelHeader title="Project" />
          <div className="flex-1 p-1 space-y-0.5">
            {["🎬 Sequence 01.mp4", "🎵 Background.mp3", "📸 Intro.png", "📹 Clip_A.mp4", "🎤 Voiceover.wav"].map(
              (f, i) => (
                <button key={i} onClick={() => onInteract("media_select")} className="flex items-center gap-1 w-full px-1.5 py-1 text-[9px] text-gray-300 hover:bg-[#2a2d2e] rounded transition-colors">
                  {f}
                </button>
              )
            )}
          </div>
          <div className="border-t border-[#1a1a1a]">
            <PanelHeader title="Effects" />
            <div className="p-1 space-y-0.5">
              {["Cross Dissolve", "Dip to Black", "Gaussian Blur", "Color Balance", "Lumetri Color"].map(
                (e, i) => (
                  <button key={i} onClick={() => onInteract("effect_apply")} className="flex items-center gap-1 w-full px-1.5 py-1 text-[9px] text-gray-400 hover:bg-[#2a2d2e] rounded transition-colors">
                    ✦ {e}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex h-[45%] border-b border-[#1a1a1a]">
            <div className="w-1/2 border-r border-[#1a1a1a] flex flex-col">
              <div className="flex items-center h-6 px-2 bg-[#252526] text-[9px] text-gray-400 border-b border-[#1a1a1a]">
                Source: Clip_A.mp4
              </div>
              <div className="flex-1 bg-black flex items-center justify-center">
                <div className="text-[10px] text-gray-600 space-y-1 text-center">
                  <div className="text-2xl">▶</div>
                  <div>Source Monitor</div>
                  <div className="text-[8px]">1920×1080 | 29.97fps</div>
                </div>
              </div>
            </div>
            <div className="w-1/2 flex flex-col">
              <div className="flex items-center h-6 px-2 bg-[#252526] text-[9px] text-gray-400 border-b border-[#1a1a1a]">
                Program: Sequence 01
              </div>
              <div className="flex-1 bg-black flex items-center justify-center relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-20 border border-gray-700 rounded flex items-center justify-center">
                    <span className="text-3xl text-gray-600">▶</span>
                  </div>
                </div>
                <div className="absolute bottom-1 right-2 text-[8px] text-gray-500">1920×1080 | 29.97fps</div>
              </div>
            </div>
          </div>
          <div className="flex-1 flex flex-col min-h-0">
            <TimelineRuler />
            <div className="flex-1 overflow-y-auto">
              <TimelineTrack label="V2" clips={[{ start: 5, width: 20, color: "#8b5cf6", label: "Title" }]} color="#6366f1" />
              <TimelineTrack label="V1" clips={[{ start: 0, width: 45, color: "#3b82f6", label: "Clip_A.mp4" }, { start: 48, width: 35, color: "#06b6d4", label: "Clip_B.mp4" }]} color="#3b82f6" />
              <TimelineTrack label="A1" clips={[{ start: 0, width: 85, color: "#22c55e", label: "Background.mp3" }]} color="#22c55e" />
              <TimelineTrack label="A2" clips={[{ start: 10, width: 40, color: "#f59e0b", label: "Voiceover.wav" }]} color="#f59e0b" />
            </div>
            <div className="h-5 bg-[#1e1e1e] flex items-center px-2 gap-2 border-t border-[#1a1a1a]">
              <button onClick={() => onInteract("click")} className="text-[10px] text-gray-400 hover:text-white">◀◀</button>
              <button onClick={() => onInteract("click")} className="text-[10px] text-gray-400 hover:text-white">▶</button>
              <button onClick={() => onInteract("click")} className="text-[10px] text-gray-400 hover:text-white">▶▶</button>
              <div className="flex-1 h-1.5 bg-[#3c3c3c] rounded-full mx-2 relative cursor-pointer" onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); setTimelinePos(((e.clientX - r.left) / r.width) * 100); onInteract("timeline_scrub"); }}>
                <div className="absolute top-0 left-0 h-full bg-[#0078d4] rounded-full" style={{ width: `${timelinePos}%` }} />
                <div className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full shadow" style={{ left: `calc(${timelinePos}% - 5px)` }} />
              </div>
              <span className="text-[8px] text-gray-500">00:01:23:15</span>
            </div>
          </div>
        </div>
        <div className="w-40 bg-[#252526] border-l border-[#1a1a1a] flex flex-col shrink-0">
          <PanelHeader title="Audio Meters" />
          <div className="flex-1 p-2 flex items-end justify-center gap-1">
            {[0.4, 0.6, 0.8, 0.9, 0.7, 0.5, 0.3].map((h, i) => (
              <div key={i} className="w-3 rounded-t" style={{ height: `${h * 100}%`, background: h > 0.8 ? "#ef4444" : h > 0.6 ? "#f59e0b" : "#22c55e" }} />
            ))}
          </div>
          <div className="border-t border-[#1a1a1a]">
            <PanelHeader title="Lumetri Color" />
            <div className="p-2 space-y-1.5 text-[8px] text-gray-400">
              {["Temperature", "Tint", "Exposure", "Contrast", "Highlights"].map((p) => (
                <div key={p} className="flex items-center gap-1">
                  <span className="w-12">{p}</span>
                  <div className="flex-1 h-1 bg-[#3c3c3c] rounded"><div className="h-full bg-[#0078d4] rounded" style={{ width: `${40 + Math.random() * 40}%` }} /></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <StatusBar items={["00:01:23:15", "29.97fps", "1920×1080", "Render: 0 dropped"]} />
    </div>
  );

  if (appId === "vscode") return (
    <div className="flex flex-col h-full bg-[#1e1e1e] text-gray-200">
      <div className="flex items-center h-8 bg-[#323233] border-b border-[#1a1a1a] px-0 shrink-0">
        <div className="w-10 flex items-center justify-center">
          <div className="w-4 h-4 rounded bg-[#007acc] flex items-center justify-center text-[7px] font-bold text-white">VS</div>
        </div>
        <MenuBar items={["File", "Edit", "Selection", "View", "Go", "Run", "Terminal", "Help"]} />
        <div className="flex-1" />
        <div className="flex items-center gap-0 h-full">
          {["index.tsx", "App.tsx", "styles.css"].map((tab, i) => (
            <button
              key={tab}
              onClick={() => { setCodeTab(i); onInteract("tab_switch"); }}
              className={`flex items-center gap-1 h-full px-3 text-[10px] border-r border-[#1a1a1a] ${
                codeTab === i ? "bg-[#1e1e1e] text-white" : "bg-[#2d2d2d] text-gray-400 hover:bg-[#2a2d2e]"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${i === 0 ? "bg-[#61dafb]" : i === 1 ? "bg-[#61dafb]" : "bg-[#264f78]"}`} />
              {tab}
              <span className="text-gray-600 ml-1">×</span>
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-1 min-h-0">
        <div className="w-10 bg-[#333333] border-r border-[#1a1a1a] flex flex-col items-center py-1 gap-1 shrink-0">
          {["📄", "🔍", "⑂", "▶", "🧩"].map((icon, i) => (
            <button key={i} onClick={() => onInteract("sidebar_click")} className={`w-8 h-8 flex items-center justify-center rounded text-sm ${i === 0 ? "border-l-2 border-white bg-[#37373d]" : "text-gray-500 hover:text-gray-300"}`}>
              {icon}
            </button>
          ))}
        </div>
        <div className="w-44 bg-[#252526] border-r border-[#1a1a1a] flex flex-col shrink-0">
          <div className="flex items-center h-7 px-2 bg-[#252526] text-[10px] font-semibold text-gray-300 border-b border-[#1a1a1a]">
            EXPLORER
          </div>
          <div className="flex-1 overflow-y-auto text-[10px] py-1">
            <div className="px-2 py-0.5 text-gray-400 font-semibold">📂 src</div>
            {["components", "hooks", "utils"].map((d) => (
              <div key={d} className="pl-4 py-0.5 text-gray-400">📂 {d}</div>
            ))}
            {["App.tsx", "index.tsx", "styles.css"].map((f, i) => (
              <button
                key={f}
                onClick={() => { setCodeTab(i); onInteract("file_open"); }}
                className={`pl-4 py-0.5 w-full text-left ${codeTab === i ? "bg-[#264f78] text-white" : "text-gray-400 hover:bg-[#2a2d2e]"}`}
              >
                📄 {f}
              </button>
            ))}
            <div className="px-2 py-0.5 text-gray-400 font-semibold mt-1">📂 public</div>
            <div className="pl-4 py-0.5 text-gray-400">📄 index.html</div>
          </div>
        </div>
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 overflow-auto font-mono text-[11px] leading-5 p-3">
            {[
              { num: 1, text: "import React from 'react';", color: "#c586c0" },
              { num: 2, text: "import './styles.css';", color: "#ce9178" },
              { num: 3, text: "", color: "" },
              { num: 4, text: "interface AppProps {", color: "#4ec9b0" },
              { num: 5, text: "  title: string;", color: "#9cdcfe" },
              { num: 6, text: "  count: number;", color: "#9cdcfe" },
              { num: 7, text: "}", color: "#4ec9b0" },
              { num: 8, text: "", color: "" },
              { num: 9, text: "function App({ title, count }: AppProps) {", color: "#dcdcaa" },
              { num: 10, text: "  const [state, setState] = useState(0);", color: "#4fc1ff" },
              { num: 11, text: "", color: "" },
              { num: 12, text: "  return (", color: "#569cd6" },
              { num: 13, text: '    <div className="app">', color: "#ce9178" },
              { num: 14, text: "      <h1>{title}</h1>", color: "#808080" },
              { num: 15, text: "      <p>Count: {count}</p>", color: "#808080" },
              { num: 16, text: "    </div>", color: "#808080" },
              { num: 17, text: "  );", color: "#569cd6" },
              { num: 18, text: "}", color: "#dcdcaa" },
            ].map((line) => (
              <div key={line.num} className="flex">
                <span className="w-8 text-right pr-3 text-gray-600 select-none shrink-0">{line.num}</span>
                <span style={{ color: line.color || "#d4d4d4" }}>{line.text}</span>
              </div>
            ))}
          </div>
          <div className="h-28 bg-[#1e1e1e] border-t border-[#1a1a1a] flex flex-col shrink-0">
            <div className="flex items-center h-6 px-2 bg-[#252526] text-[9px] text-gray-400 border-b border-[#1a1a1a]">
              <button onClick={() => onInteract("click")} className="px-2 hover:text-white">PROBLEMS</button>
              <button onClick={() => onInteract("click")} className="px-2 hover:text-white">OUTPUT</button>
              <button className="px-2 text-white border-b border-white">TERMINAL</button>
            </div>
            <div className="flex-1 p-2 font-mono text-[10px] text-gray-300 overflow-y-auto">
              <div><span className="text-[#6a9955]">$</span> npm run dev</div>
              <div className="text-gray-500">Starting development server...</div>
              <div className="text-[#4ec9b0">✓ Ready in 1.2s</div>
              <div className="text-gray-500">  → Local: http://localhost:3000</div>
              <div><span className="text-[#6a9955]">$</span> <span className="animate-pulse">_</span></div>
            </div>
          </div>
        </div>
      </div>
      <StatusBar items={["Ln 9, Col 1", "Spaces: 2", "UTF-8", "TypeScript React", "Prettier", "✓ 0 errors"]} />
    </div>
  );

  if (appId === "blender") return (
    <div className="flex flex-col h-full bg-[#303030] text-gray-200">
      <MenuBar items={["File", "Edit", "Render", "Window", "Help"]} />
      <div className="flex flex-1 min-h-0">
        <div className="w-8 bg-[#303030] border-r border-[#1a1a1a] flex flex-col items-center py-1 gap-0.5 shrink-0">
          {["↗", "⊕", "⊡", "◎", "↔", "⊟", "⚙"].map((icon, i) => (
            <ToolButton key={i} icon={icon} label={`Tool ${i}`} active={selectedTool === `blender-${i}`} onClick={() => handleToolClick(`blender-${i}`)} />
          ))}
        </div>
        <div className="flex-1 relative bg-[#404040] overflow-hidden" onClick={handleCanvasClick}>
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 150">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#555" strokeWidth="0.3" />
              </pattern>
            </defs>
            <rect width="200" height="150" fill="#404040" />
            <rect x="0" y="75" width="200" height="75" fill="url(#grid)" opacity="0.5" />
            <polygon points="80,25 120,25 130,65 70,65" fill="#c4a46c" stroke="#8b7355" strokeWidth="0.5" />
            <polygon points="70,65 130,65 120,85 80,85" fill="#a08050" stroke="#8b7355" strokeWidth="0.5" />
            <polygon points="80,25 120,25 130,35 90,35" fill="#d4b87c" stroke="#8b7355" strokeWidth="0.5" />
            <circle cx="145" cy="30" r="8" fill="#fff8dc" opacity="0.3" />
            <line x1="145" y1="30" x2="100" y2="55" stroke="#888" strokeWidth="0.3" strokeDasharray="2,2" />
            <polygon points="95,90 105,90 100,100" fill="#ccc" opacity="0.3" />
            <text x="10" y="145" fill="#888" fontSize="5" fontFamily="monospace">User Perspective</text>
            <text x="10" y="12" fill="#888" fontSize="4" fontFamily="monospace">Object Mode</text>
            <g transform="translate(170,10)">
              <text fill="#888" fontSize="4" fontFamily="monospace">X</text>
              <line x1="5" y1="3" x2="20" y2="3" stroke="#ef4444" strokeWidth="0.8" />
              <text fill="#888" fontSize="4" fontFamily="monospace" y="10">Y</text>
              <line x1="5" y1="13" x2="20" y2="13" stroke="#22c55e" strokeWidth="0.8" />
              <text fill="#888" fontSize="4" fontFamily="monospace" y="20">Z</text>
              <line x1="5" y1="23" x2="20" y2="23" stroke="#3b82f6" strokeWidth="0.8" />
            </g>
          </svg>
          <div className="absolute top-2 left-2 bg-black/40 text-[8px] text-gray-400 px-1.5 py-0.5 rounded font-mono">
            Verts: 8 | Faces: 6 | Tris: 12
          </div>
        </div>
        <div className="w-52 bg-[#303030] border-l border-[#1a1a1a] flex flex-col shrink-0">
          <PanelHeader title="Scene" />
          <div className="p-1 text-[9px] space-y-0.5">
            {["🎥 Camera", "💡 Light", "📦 Cube"].map((obj) => (
              <button key={obj} onClick={() => onInteract("click")} className="flex items-center gap-1 w-full px-1.5 py-0.5 text-gray-300 hover:bg-[#404040] rounded">
                {obj}
              </button>
            ))}
          </div>
          <div className="border-t border-[#1a1a1a]">
            <PanelHeader title="Properties" />
            <div className="p-2 space-y-1.5 text-[8px] text-gray-400">
              <div className="font-semibold text-gray-300 mb-1">Transform</div>
              {["Location: 0.00, 0.00, 0.00", "Rotation: 0°, 0°, 0°", "Scale: 1.00, 1.00, 1.00"].map((p) => (
                <div key={p} className="flex justify-between"><span>{p.split(":")[0]}:</span><span className="text-gray-200">{p.split(":")[1]}</span></div>
              ))}
              <div className="font-semibold text-gray-300 mt-2 mb-1">Dimensions</div>
              <div className="flex justify-between"><span>X:</span><span className="text-gray-200">2.000 m</span></div>
              <div className="flex justify-between"><span>Y:</span><span className="text-gray-200">2.000 m</span></div>
              <div className="flex justify-between"><span>Z:</span><span className="text-gray-200">2.000 m</span></div>
            </div>
          </div>
          <div className="border-t border-[#1a1a1a] flex-1">
            <PanelHeader title="Material" />
            <div className="p-2 space-y-1.5 text-[8px]">
              <div className="w-full h-5 rounded bg-gradient-to-r from-[#c4a46c] to-[#a08050] border border-gray-600" />
              <div className="text-gray-400">Principled BSDF</div>
              <div className="flex justify-between text-gray-400"><span>Base Color</span><div className="w-3 h-3 rounded bg-[#c4a46c] border border-gray-600" /></div>
              <div className="flex justify-between text-gray-400"><span>Metallic</span><span>0.000</span></div>
              <div className="flex justify-between text-gray-400"><span>Roughness</span><span>0.500</span></div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-20 bg-[#252526] border-t border-[#1a1a1a] flex flex-col shrink-0">
        <div className="flex items-center h-5 px-2 bg-[#252526] text-[8px] text-gray-400 border-b border-[#1a1a1a] gap-2">
          <button onClick={() => onInteract("click")}>▶</button>
          <span>1 / 250</span>
          <span>24 fps</span>
          <div className="flex-1 h-1 bg-[#3c3c3c] rounded mx-2 relative">
            <div className="absolute top-0 left-0 h-full bg-[#e87d0d] rounded" style={{ width: `${timelinePos * 0.4}%` }} />
          </div>
        </div>
        <div className="flex-1 flex">
          {["Dope Sheet", "Graph Editor", "Timeline"].map((tab, i) => (
            <button key={tab} onClick={() => onInteract("click")} className={`px-3 text-[9px] border-r border-[#1a1a1a] ${i === 2 ? "text-white bg-[#37373d]" : "text-gray-500 hover:text-gray-300"}`}>
              {tab}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  if (appId === "canva") return (
    <div className="flex flex-col h-full bg-[#f5f5f5] text-gray-800">
      <div className="flex items-center h-10 bg-white border-b border-gray-200 px-3 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#7b2ff7] to-[#00c4cc] flex items-center justify-center text-white text-[10px] font-bold">C</div>
          <span className="text-sm font-semibold text-[#1a1a2e]">Canva</span>
        </div>
        <div className="flex items-center gap-3 ml-6 text-[11px]">
          <button className="text-[#1a1a2e] font-medium">Home</button>
          <button className="text-gray-500 hover:text-[#1a1a2e]">Templates</button>
          <button className="text-gray-500 hover:text-[#1a1a2e]">Projects</button>
        </div>
        <div className="flex-1" />
        <button className="px-4 py-1.5 bg-[#7b2ff7] text-white text-[11px] font-medium rounded-full">Share</button>
      </div>
      <div className="flex flex-1 min-h-0">
        <div className="w-48 bg-white border-r border-gray-200 flex flex-col shrink-0">
          {[
            { icon: "🎨", label: "Design" },
            { icon: " Elements", label: "Elements" },
            { icon: "📝", label: "Text" },
            { icon: "📤", label: "Uploads" },
            { icon: "🖼", label: "Photos" },
            { icon: "🎬", label: "Videos" },
            { icon: "✨", label: "Magic" },
          ].map((item, i) => (
            <button
              key={item.label}
              onClick={() => onInteract("panel_open")}
              className={`flex items-center gap-2 px-3 py-2 text-[11px] transition-colors ${
                i === 0 ? "bg-[#f0ebff] text-[#7b2ff7] font-medium" : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
          <div className="border-t border-gray-200 mt-2 pt-2 px-3">
            <div className="text-[9px] text-gray-400 uppercase tracking-wider mb-2">Templates</div>
            {["Instagram Post", "Poster", "Logo", "Presentation", "Resume"].map((t, i) => (
              <button key={t} onClick={() => { setSelectedTemplate(i); onInteract("template_select"); }} className={`w-full text-left px-2 py-1.5 text-[10px] rounded mb-0.5 transition-colors ${selectedTemplate === i ? "bg-[#7b2ff7]/10 text-[#7b2ff7]" : "text-gray-600 hover:bg-gray-50"}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 bg-gray-100 flex items-center justify-center p-6 relative overflow-hidden">
          <div className="bg-white shadow-lg rounded-lg w-64 h-80 flex flex-col relative" onClick={handleCanvasClick}>
            <div className="flex-1 bg-gradient-to-br from-[#7b2ff7] to-[#00c4cc] rounded-t-lg flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-2xl font-bold mb-1">Your Design</div>
                <div className="text-xs opacity-80">Start creating</div>
              </div>
            </div>
            <div className="p-3 text-center">
              <div className="text-[11px] font-semibold text-gray-800">Add a headline</div>
              <div className="text-[9px] text-gray-500 mt-1">Add a subheadline</div>
            </div>
          </div>
          <div className="absolute right-4 top-4 space-y-1">
            {["📐 Resize", "🔄 Rotate", "✨ Animate"].map((a) => (
              <button key={a} onClick={() => onInteract("click")} className="block w-full text-left px-2 py-1 bg-white rounded-lg shadow-sm text-[9px] text-gray-600 hover:shadow-md transition-shadow">
                {a}
              </button>
            ))}
          </div>
        </div>
        <div className="w-48 bg-white border-l border-gray-200 flex flex-col shrink-0">
          <div className="p-2 text-[10px] font-semibold text-gray-700 border-b border-gray-200">Design</div>
          <div className="p-2 space-y-2 text-[9px]">
            <div>
              <div className="text-gray-500 mb-1">Background</div>
              <div className="flex gap-1">
                {["#ffffff", "#7b2ff7", "#00c4cc", "#ff6b6b", "#ffd93d"].map((c) => (
                  <button key={c} onClick={() => onInteract("click")} className="w-5 h-5 rounded border border-gray-200 hover:scale-110 transition-transform" style={{ background: c }} />
                ))}
              </div>
            </div>
            <div>
              <div className="text-gray-500 mb-1">Font</div>
              <div className="px-2 py-1 border border-gray-200 rounded text-gray-700">Inter</div>
            </div>
            <div>
              <div className="text-gray-500 mb-1">Size</div>
              <div className="px-2 py-1 border border-gray-200 rounded text-gray-700">24px</div>
            </div>
            <div>
              <div className="text-gray-500 mb-1">Transparency</div>
              <div className="h-1.5 bg-gray-200 rounded"><div className="h-full w-3/4 bg-[#7b2ff7] rounded" /></div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-7 bg-white border-t border-gray-200 flex items-center px-3 text-[9px] text-gray-500 shrink-0">
        <span>Design</span>
        <span className="mx-2">|</span>
        <span>Edit</span>
        <span className="mx-2">|</span>
        <span>Animate</span>
        <div className="flex-1" />
        <span>Zoom: 100%</span>
      </div>
    </div>
  );

  if (appId === "figma") return (
    <div className="flex flex-col h-full bg-[#2c2c2c] text-gray-200">
      <div className="flex items-center h-8 bg-[#2c2c2c] border-b border-[#1a1a1a] px-2 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-gradient-to-br from-[#a259ff] via-[#f24e1e] to-[#ff7262] flex items-center justify-center">
            <div className="w-2.5 h-2.5 bg-white rounded-sm" />
          </div>
          <span className="text-[11px] font-medium">Untitled — Figma</span>
        </div>
        <div className="flex-1 flex items-center justify-center gap-2">
          <button className="px-2 py-0.5 text-[10px] text-gray-400 hover:text-white rounded hover:bg-[#3c3c3c]">File</button>
          <button className="px-2 py-0.5 text-[10px] text-gray-400 hover:text-white rounded hover:bg-[#3c3c3c]">Edit</button>
          <button className="px-2 py-0.5 text-[10px] text-gray-400 hover:text-white rounded hover:bg-[#3c3c3c]">Object</button>
          <button className="px-2 py-0.5 text-[10px] text-gray-400 hover:text-white rounded hover:bg-[#3c3c3c]">View</button>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 bg-[#0d99ff] text-white text-[10px] font-medium rounded">Share</button>
        </div>
      </div>
      <div className="flex flex-1 min-h-0">
        <div className="w-52 bg-[#2c2c2c] border-r border-[#1a1a1a] flex flex-col shrink-0">
          <div className="flex border-b border-[#1a1a1a]">
            <button className="flex-1 py-1.5 text-[10px] text-white border-b-2 border-[#0d99ff]">Layers</button>
            <button className="flex-1 py-1.5 text-[10px] text-gray-500">Assets</button>
          </div>
          <div className="flex-1 p-1 space-y-0.5 text-[9px]">
            {["📱 Frame 1", "  ◇ Header", "  ▭ Button", "  T Title Text", "📱 Frame 2", "  ◇ Card", "  T Description"].map((item, i) => (
              <button key={i} onClick={() => onInteract("click")} className={`flex items-center w-full px-2 py-1 rounded transition-colors ${i === 3 ? "bg-[#0d99ff]/20 text-[#0d99ff]" : "text-gray-400 hover:bg-[#3c3c3c]"}`}>
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 relative bg-[#1e1e1e] overflow-hidden" onClick={handleCanvasClick}>
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 200">
            <defs>
              <pattern id="figma-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <circle cx="5" cy="5" r="0.5" fill="#444" />
              </pattern>
            </defs>
            <rect width="300" height="200" fill="url(#figma-grid)" />
            <rect x="30" y="20" width="110" height="160" rx="4" fill="#1a1a2e" stroke="#555" strokeWidth="0.5" />
            <rect x="40" y="30" width="90" height="25" rx="2" fill="#0d99ff" />
            <text x="55" y="46" fill="white" fontSize="5" fontFamily="Inter">Header</text>
            <rect x="40" y="65" width="90" height="60" rx="2" fill="#333" />
            <rect x="40" y="135" width="90" height="12" rx="2" fill="#0d99ff" />
            <text x="55" y="144" fill="white" fontSize="4" fontFamily="Inter">Button</text>
            <rect x="160" y="20" width="110" height="160" rx="4" fill="#1a1a2e" stroke="#555" strokeWidth="0.5" />
            <rect x="170" y="30" width="90" height="50" rx="2" fill="#333" />
            <rect x="170" y="90" width="90" height="10" rx="1" fill="#555" />
            <rect x="170" y="105" width="70" height="6" rx="1" fill="#444" />
            <text x="35" y="15" fill="#888" fontSize="4" fontFamily="Inter">Frame 1</text>
            <text x="165" y="15" fill="#888" fontSize="4" fontFamily="Inter">Frame 2</text>
          </svg>
          <div className="absolute bottom-2 left-2 flex items-center gap-1">
            <button onClick={() => onInteract("click")} className="w-6 h-6 bg-[#2c2c2c] rounded flex items-center justify-center text-[10px] text-gray-400">−</button>
            <span className="text-[9px] text-gray-400">100%</span>
            <button onClick={() => onInteract("click")} className="w-6 h-6 bg-[#2c2c2c] rounded flex items-center justify-center text-[10px] text-gray-400">+</button>
          </div>
        </div>
        <div className="w-52 bg-[#2c2c2c] border-l border-[#1a1a1a] flex flex-col shrink-0">
          <div className="flex border-b border-[#1a1a1a]">
            <button className="flex-1 py-1.5 text-[10px] text-white border-b-2 border-[#0d99ff]">Design</button>
            <button className="flex-1 py-1.5 text-[10px] text-gray-500">Prototype</button>
          </div>
          <div className="flex-1 p-2 space-y-3 text-[9px]">
            <div>
              <div className="text-gray-500 mb-1">Frame</div>
              <div className="grid grid-cols-2 gap-1">
                <div className="px-1.5 py-0.5 bg-[#3c3c3c] rounded text-gray-300">W: 375</div>
                <div className="px-1.5 py-0.5 bg-[#3c3c3c] rounded text-gray-300">H: 812</div>
              </div>
            </div>
            <div>
              <div className="text-gray-500 mb-1">Fill</div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded bg-[#1a1a2e] border border-gray-600" />
                <span className="text-gray-300">#1A1A2E</span>
              </div>
            </div>
            <div>
              <div className="text-gray-500 mb-1">Stroke</div>
              <div className="text-gray-400">None</div>
            </div>
            <div>
              <div className="text-gray-500 mb-1">Effects</div>
              <div className="text-gray-400">Drop Shadow</div>
            </div>
            <div>
              <div className="text-gray-500 mb-1">Corner Radius</div>
              <div className="px-1.5 py-0.5 bg-[#3c3c3c] rounded text-gray-300 w-12">4</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (appId === "word") return (
    <div className="flex flex-col h-full bg-[#f3f3f3] text-gray-800">
      <div className="flex items-center h-8 bg-[#2b5797] px-2 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-white/20 rounded flex items-center justify-center text-[10px] font-bold text-white">W</div>
          <span className="text-[11px] text-white/90">Document1 - Word</span>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-1">
          <button className="w-6 h-6 flex items-center justify-center text-white/70 hover:bg-white/10 rounded text-[10px]">─</button>
          <button className="w-6 h-6 flex items-center justify-center text-white/70 hover:bg-white/10 rounded text-[10px]">□</button>
          <button className="w-6 h-6 flex items-center justify-center text-white/70 hover:bg-red-500 rounded text-[10px]">✕</button>
        </div>
      </div>
      <div className="bg-[#f3f3f3] border-b border-gray-300 shrink-0">
        <div className="flex items-center h-7 px-1 text-[10px]">
          {["File", "Home", "Insert", "Draw", "Design", "Layout", "References", "Mailings", "Review", "View"].map((tab, i) => (
            <button key={tab} className={`px-2 py-1 rounded ${i === 1 ? "bg-[#2b5797]/10 text-[#2b5797] font-medium" : "text-gray-600 hover:bg-gray-200"}`}>
              {tab}
            </button>
          ))}
        </div>
        <div className="flex items-center h-14 px-2 gap-3 bg-[#f8f8f8] border-t border-gray-200">
          <div className="flex gap-0.5">
            {["B", "I", "U", "S"].map((f) => (
              <button key={f} onClick={() => onInteract("click")} className={`w-6 h-6 flex items-center justify-center text-[10px] rounded hover:bg-gray-200 ${f === "B" ? "font-bold" : f === "I" ? "italic" : f === "U" ? "underline" : "line-through"}`}>
                {f}
              </button>
            ))}
          </div>
          <div className="w-px h-8 bg-gray-300" />
          <div className="flex gap-0.5">
            {["≡", "≡≡", "≡≡≡"].map((a, i) => (
              <button key={i} onClick={() => onInteract("click")} className="w-6 h-6 flex items-center justify-center text-[10px] rounded hover:bg-gray-200">
                {a}
              </button>
            ))}
          </div>
          <div className="w-px h-8 bg-gray-300" />
          <button onClick={() => onInteract("click")} className="px-2 py-1 text-[10px] rounded hover:bg-gray-200">🎨</button>
          <button onClick={() => onInteract("click")} className="px-2 py-1 text-[10px] rounded hover:bg-gray-200">📎</button>
          <button onClick={() => onInteract("click")} className="px-2 py-1 text-[10px] rounded hover:bg-gray-200">📷</button>
        </div>
      </div>
      <div className="flex-1 overflow-auto bg-[#e8e8e8] flex justify-center py-4">
        <div className="bg-white w-[540px] min-h-[700px] shadow-lg p-16 relative" onClick={handleCanvasClick}>
          <div className="text-2xl font-bold text-gray-900 mb-2">Document Title</div>
          <div className="text-sm text-gray-600 mb-4">Author Name | July 2026</div>
          <p className="text-sm leading-relaxed text-gray-700 mb-3">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
          </p>
          <p className="text-sm leading-relaxed text-gray-700 mb-3">
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.
          </p>
          <p className="text-sm leading-relaxed text-gray-700">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.
          </p>
          <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none border border-gray-100" />
        </div>
      </div>
      <div className="h-6 bg-[#2b5797] flex items-center px-3 text-[9px] text-white/80 shrink-0">
        <span>Page 1 of 1</span>
        <span className="mx-2">|</span>
        <span>125 words</span>
        <span className="mx-2">|</span>
        <span>English (India)</span>
        <div className="flex-1" />
        <span>100%</span>
      </div>
    </div>
  );

  if (appId === "capcut") return (
    <div className="flex flex-col h-full bg-[#1a1a1a] text-gray-200">
      <MenuBar items={["File", "Edit", "View", "Help"]} />
      <div className="flex flex-1 min-h-0">
        <div className="w-40 bg-[#222222] border-r border-[#333] flex flex-col shrink-0">
          {["Media", "Audio", "Text", "Stickers", "Effects", "Transitions", "Filters"].map((tab, i) => (
            <button key={tab} onClick={() => onInteract("tab_switch")} className={`px-3 py-2 text-[10px] text-left transition-colors ${i === 0 ? "bg-[#333] text-white font-medium" : "text-gray-400 hover:bg-[#2a2a2a]"}`}>
              {tab}
            </button>
          ))}
          <div className="flex-1 p-2 space-y-1">
            {["🎬 Clip A.mp4", "🎬 Clip B.mp4", "🎵 Music.mp3", "📸 Photo.jpg"].map((m, i) => (
              <button key={i} onClick={() => onInteract("click")} className="flex items-center gap-1 w-full px-2 py-1.5 bg-[#2a2a2a] rounded text-[9px] text-gray-300 hover:bg-[#333]">
                {m}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 flex flex-col min-w-0">
          <div className="h-[45%] bg-black flex items-center justify-center border-b border-[#333] relative">
            <div className="w-40 h-24 border border-gray-700 rounded flex items-center justify-center">
              <span className="text-4xl text-gray-600">▶</span>
            </div>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-3">
              <button onClick={() => onInteract("click")} className="text-gray-500 hover:text-white text-sm">◀◀</button>
              <button onClick={() => onInteract("click")} className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-black text-sm">▶</button>
              <button onClick={() => onInteract("click")} className="text-gray-500 hover:text-white text-sm">▶▶</button>
            </div>
            <div className="absolute top-2 right-2 flex gap-1">
              <button onClick={() => onInteract("click")} className="px-2 py-0.5 bg-[#333] rounded text-[9px] text-gray-400">16:9</button>
              <button onClick={() => onInteract("click")} className="px-2 py-0.5 bg-[#333] rounded text-[9px] text-gray-400">HD</button>
            </div>
          </div>
          <div className="flex-1 flex flex-col min-h-0">
            <TimelineRuler />
            <div className="flex-1 overflow-y-auto bg-[#1a1a1a]">
              <TimelineTrack label="PIP" clips={[]} color="#8b5cf6" />
              <TimelineTrack label="Text" clips={[{ start: 10, width: 25, color: "#f59e0b", label: "Auto Caption" }]} color="#f59e0b" />
              <TimelineTrack label="V1" clips={[{ start: 0, width: 40, color: "#3b82f6", label: "Clip A" }, { start: 42, width: 30, color: "#06b6d4", label: "Clip B" }]} color="#3b82f6" />
              <TimelineTrack label="A1" clips={[{ start: 0, width: 72, color: "#22c55e", label: "Music" }]} color="#22c55e" />
            </div>
          </div>
        </div>
        <div className="w-44 bg-[#222222] border-l border-[#333] flex flex-col shrink-0">
          <PanelHeader title="Edit" />
          <div className="p-2 space-y-2 text-[9px]">
            <div>
              <div className="text-gray-500 mb-1">Speed</div>
              <div className="h-1.5 bg-[#333] rounded"><div className="h-full w-1/3 bg-[#00c4cc] rounded" /></div>
            </div>
            <div>
              <div className="text-gray-500 mb-1">Volume</div>
              <div className="h-1.5 bg-[#333] rounded"><div className="h-full w-2/3 bg-[#22c55e] rounded" /></div>
            </div>
            <div>
              <div className="text-gray-500 mb-1">Opacity</div>
              <div className="h-1.5 bg-[#333] rounded"><div className="h-full w-full bg-[#8b5cf6] rounded" /></div>
            </div>
          </div>
          <div className="border-t border-[#333]">
            <PanelHeader title="Auto Captions" />
            <div className="p-2 text-[9px] text-gray-400">
              <button onClick={() => onInteract("click")} className="w-full py-1.5 bg-[#00c4cc] text-white rounded text-[10px] font-medium">Generate Captions</button>
              <div className="mt-2 space-y-1">
                <div className="text-gray-300">00:01 - Hello everyone</div>
                <div className="text-gray-300">00:03 - Welcome to</div>
                <div className="text-gray-300">00:05 - our video</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <StatusBar items={["00:01:23", "1920×1080", "30fps"]} />
    </div>
  );

  if (appId === "photopea") return (
    <div className="flex flex-col h-full bg-[#535353] text-gray-200">
      <MenuBar items={["File", "Edit", "Image", "Layer", "Select", "Filter", "View", "Window"]} />
      <div className="flex flex-1 min-h-0">
        <div className="w-8 bg-[#333333] border-r border-[#1a1a1a] flex flex-col items-center py-1 gap-0.5 shrink-0">
          {["V", "M", "W", "L", "I", "B", "E", "T", "P", "Z"].map((icon) => (
            <ToolButton key={icon} icon={icon} label={icon} active={selectedTool === icon.toLowerCase()} onClick={() => handleToolClick(icon.toLowerCase())} />
          ))}
        </div>
        <div className="flex-1 relative overflow-hidden bg-[#535353]" onClick={handleCanvasClick}>
          <CanvasCheckerboard />
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            <rect x="20" y="15" width="60" height="40" fill="#f59e0b" opacity="0.7" rx="2" />
            <circle cx="50" cy="70" r="18" fill="#06b6d4" opacity="0.7" />
            <text x="25" y="38" fill="white" fontSize="4" fontFamily="Arial">Photopea Canvas</text>
          </svg>
          <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[9px] px-2 py-0.5 rounded">
            Photopea — Free Online Photo Editor
          </div>
        </div>
        <div className="w-48 bg-[#252526] border-l border-[#1a1a1a] flex flex-col shrink-0">
          <div className="border-b border-[#1a1a1a]">
            <PanelHeader title="Layers" />
            {["Background", "Shape 1", "Text Layer"].map((name, i) => (
              <LayerItem key={name} name={name} active={selectedLayer === i} onClick={() => handleLayerClick(i)} />
            ))}
          </div>
          <div className="flex-1">
            <PanelHeader title="Adjustments" />
            <div className="p-1 space-y-0.5">
              {["Brightness/Contrast", "Levels", "Curves", "Hue/Saturation", "Color Balance"].map((adj) => (
                <button key={adj} onClick={() => { setActiveFilter(adj); onInteract("adjustment"); }} className="w-full text-left px-2 py-1 text-[9px] text-gray-400 hover:bg-[#2a2d2e] rounded transition-colors">
                  {adj}
                </button>
              ))}
            </div>
          </div>
          <div className="border-t border-[#1a1a1a]">
            <PanelHeader title="Properties" />
            <div className="p-2 space-y-1 text-[8px] text-gray-400">
              <div className="flex justify-between"><span>Width:</span><span className="text-gray-200">1920px</span></div>
              <div className="flex justify-between"><span>Height:</span><span className="text-gray-200">1080px</span></div>
            </div>
          </div>
        </div>
      </div>
      <StatusBar items={["🔍 100%", "RGB", "1920 × 1080"]} />
    </div>
  );

  if (appId === "pixlr") return (
    <div className="flex flex-col h-full bg-[#1b1b1b] text-gray-200">
      <div className="flex items-center h-9 bg-[#212121] border-b border-[#333] px-2 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-[#00c853] flex items-center justify-center text-[9px] font-bold text-white">P</div>
          <span className="text-[11px] font-medium text-white">Pixlr</span>
        </div>
        <div className="flex items-center gap-2 ml-4 text-[10px]">
          {["File", "Edit", "Image", "Adjustment", "Filter", "View"].map((m) => (
            <button key={m} className="text-gray-400 hover:text-white px-1.5 py-0.5 rounded hover:bg-[#333]">{m}</button>
          ))}
        </div>
        <div className="flex-1" />
        <button className="px-3 py-1 bg-[#00c853] text-white text-[10px] font-medium rounded">Save</button>
      </div>
      <div className="flex flex-1 min-h-0">
        <div className="w-8 bg-[#262626] border-r border-[#333] flex flex-col items-center py-1 gap-0.5 shrink-0">
          {["V", "M", "C", "B", "T", "E", "G", "Z"].map((icon) => (
            <ToolButton key={icon} icon={icon} label={icon} active={selectedTool === `pixlr-${icon.toLowerCase()}`} onClick={() => handleToolClick(`pixlr-${icon.toLowerCase()}`)} />
          ))}
        </div>
        <div className="flex-1 relative overflow-hidden bg-[#1b1b1b] flex items-center justify-center" onClick={handleCanvasClick}>
          <div className="bg-[#2a2a2a] w-[80%] h-[80%] rounded shadow-xl relative">
            <div className="absolute inset-4 bg-gradient-to-br from-[#ff6b6b] via-[#ffd93d] to-[#6bcb77] rounded opacity-80" />
            <div className="absolute inset-4 flex items-center justify-center">
              <span className="text-white text-lg font-bold drop-shadow-lg">Photo</span>
            </div>
          </div>
          <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[9px] px-2 py-0.5 rounded">
            Pixlr Express
          </div>
        </div>
        <div className="w-48 bg-[#212121] border-l border-[#333] flex flex-col shrink-0">
          <PanelHeader title="Adjustments" />
          <div className="p-1 space-y-0.5">
            {["Auto Fix", "Brightness", "Contrast", "Saturation", "Temperature", "Sharpen", "Blur", "Vignette"].map((adj) => (
              <button key={adj} onClick={() => { setActiveFilter(adj); onInteract("adjustment"); }} className="w-full text-left px-2 py-1 text-[9px] text-gray-400 hover:bg-[#333] rounded transition-colors">
                {adj}
              </button>
            ))}
          </div>
          <div className="border-t border-[#333] mt-1">
            <PanelHeader title="Layers" />
            {["Background", "Overlay"].map((name, i) => (
              <LayerItem key={name} name={name} active={selectedLayer === i} onClick={() => handleLayerClick(i)} />
            ))}
          </div>
          <div className="border-t border-[#333]">
            <PanelHeader title="Effects" />
            <div className="grid grid-cols-3 gap-1 p-1">
              {["🌅", "📷", "🎨", "✨", "🌈", "⬛"].map((fx, i) => (
                <button key={i} onClick={() => onInteract("click")} className="aspect-square bg-[#333] rounded flex items-center justify-center text-sm hover:bg-[#444] transition-colors">
                  {fx}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <StatusBar items={["🔍 100%", "RGB", "1920 × 1080"]} />
    </div>
  );

  return (
    <div className="flex items-center justify-center h-full bg-[#1e1e1e] text-gray-400 text-sm">
      App not available
    </div>
  );
}
