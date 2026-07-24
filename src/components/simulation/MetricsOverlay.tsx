"use client";

import { useState, useEffect, useRef } from "react";

export interface MetricsData {
  timeElapsed: number;
  interactionCount: number;
  responsiveness: number;
  cpuUsage: number;
  gpuUsage: number;
  ramUsage: number;
  temperature: number;
  fanSpeed: number;
  fps: number;
}

interface MetricsOverlayProps {
  tier: "high" | "medium" | "low";
  isActive: boolean;
  laptopIndex: 0 | 1;
  accentColor: string;
  onMetricsUpdate?: (metrics: MetricsData) => void;
}

function useSimulatedMetrics(
  tier: "high" | "medium" | "low",
  isActive: boolean
): { metrics: MetricsData; trackInteraction: () => void } {
  const [metrics, setMetrics] = useState<MetricsData>({
    timeElapsed: 0,
    interactionCount: 0,
    responsiveness: 95,
    cpuUsage: 5,
    gpuUsage: 3,
    ramUsage: 15,
    temperature: 38,
    fanSpeed: 0,
    fps: 60,
  });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const interactionsRef = useRef(0);

  useEffect(() => {
    if (!isActive) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    interactionsRef.current = 0;

    const tierFactor =
      tier === "high" ? 1.0 : tier === "medium" ? 0.7 : 0.4;

    intervalRef.current = setInterval(() => {
      setMetrics((prev) => {
        const t = prev.timeElapsed + 0.5;
        const baseCpu = tier === "high" ? 25 : tier === "medium" ? 40 : 65;
        const baseGpu = tier === "high" ? 15 : tier === "medium" ? 30 : 55;
        const baseRam = tier === "high" ? 20 : tier === "medium" ? 35 : 55;
        const baseTemp = tier === "high" ? 42 : tier === "medium" ? 52 : 65;

        const jitter = () => (Math.random() - 0.5) * 6;
        const wave = Math.sin(t * 0.3) * 5;

        const cpuUsage = Math.min(
          98,
          Math.max(3, baseCpu + wave + jitter())
        );
        const gpuUsage = Math.min(
          98,
          Math.max(2, baseGpu + wave * 0.7 + jitter())
        );
        const ramUsage = Math.min(
          95,
          Math.max(10, baseRam + t * 0.3 + jitter() * 0.5)
        );
        const temperature = Math.min(
          92,
          Math.max(35, baseTemp + t * 0.15 + jitter() * 0.3)
        );
        const fanSpeed = Math.min(
          100,
          Math.max(0, temperature > 55 ? (temperature - 55) * 2.5 : 0)
        );
        const fps = Math.max(
          15,
          Math.min(
            120,
            (tier === "high" ? 90 : tier === "medium" ? 60 : 30) +
              jitter() * 2
          )
        );
        const responsiveness = Math.max(
          20,
          Math.min(100, 95 - (cpuUsage - 30) * 0.5 + jitter() * 0.5)
        );

        return {
          timeElapsed: Math.round(t * 10) / 10,
          interactionCount: interactionsRef.current,
          responsiveness: Math.round(responsiveness * 10) / 10,
          cpuUsage: Math.round(cpuUsage * 10) / 10,
          gpuUsage: Math.round(gpuUsage * 10) / 10,
          ramUsage: Math.round(ramUsage * 10) / 10,
          temperature: Math.round(temperature * 10) / 10,
          fanSpeed: Math.round(fanSpeed * 10) / 10,
          fps: Math.round(fps),
        };
      });
    }, 500);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, tier]);

  const trackInteraction = () => {
    interactionsRef.current += 1;
    setMetrics((prev) => ({
      ...prev,
      interactionCount: interactionsRef.current,
      responsiveness: Math.min(
        100,
        prev.responsiveness + (tier === "high" ? 2 : tier === "medium" ? 1 : -1)
      ),
    }));
  };

  return { metrics, trackInteraction };
}

export default function MetricsOverlay({
  tier,
  isActive,
  laptopIndex,
  accentColor,
  onMetricsUpdate,
}: MetricsOverlayProps) {
  const { metrics, trackInteraction } = useSimulatedMetrics(tier, isActive);

  useEffect(() => {
    if (onMetricsUpdate) onMetricsUpdate(metrics);
  }, [metrics, onMetricsUpdate]);

  if (!isActive) return null;

  const getBarColor = (value: number, thresholds: [number, number]) => {
    if (value >= thresholds[1]) return "bg-red-400";
    if (value >= thresholds[0]) return "bg-yellow-400";
    return "bg-green-400";
  };

  return (
    <div
      className="absolute bottom-0 left-0 right-0 z-20"
      data-metrics-track={trackInteraction}
    >
      <div
        className="mx-2 mb-2 rounded-lg overflow-hidden backdrop-blur-md border"
        style={{
          background: "rgba(0,0,0,0.85)",
          borderColor: accentColor + "40",
        }}
      >
        <div
          className="flex items-center justify-between px-2 py-1"
          style={{ borderBottom: `1px solid ${accentColor}30` }}
        >
          <span className="text-[9px] font-bold" style={{ color: accentColor }}>
            LIVE METRICS
          </span>
          <span className="text-[9px] text-gray-400">
            {metrics.timeElapsed.toFixed(1)}s
          </span>
        </div>
        <div className="grid grid-cols-4 gap-x-2 gap-y-1 px-2 py-1.5">
          <MetricItem
            label="CPU"
            value={`${metrics.cpuUsage.toFixed(0)}%`}
            bar={metrics.cpuUsage}
            barColor={getBarColor(metrics.cpuUsage, [60, 85])}
          />
          <MetricItem
            label="GPU"
            value={`${metrics.gpuUsage.toFixed(0)}%`}
            bar={metrics.gpuUsage}
            barColor={getBarColor(metrics.gpuUsage, [50, 80])}
          />
          <MetricItem
            label="RAM"
            value={`${metrics.ramUsage.toFixed(0)}%`}
            bar={metrics.ramUsage}
            barColor={getBarColor(metrics.ramUsage, [55, 80])}
          />
          <MetricItem
            label="FPS"
            value={`${metrics.fps}`}
            bar={Math.min(100, (metrics.fps / 120) * 100)}
            barColor={metrics.fps < 30 ? "bg-red-400" : metrics.fps < 60 ? "bg-yellow-400" : "bg-green-400"}
          />
          <MetricItem
            label="Temp"
            value={`${metrics.temperature.toFixed(0)}°C`}
            bar={Math.min(100, (metrics.temperature / 95) * 100)}
            barColor={getBarColor(metrics.temperature, [60, 80])}
          />
          <MetricItem
            label="Fan"
            value={`${metrics.fanSpeed.toFixed(0)}%`}
            bar={metrics.fanSpeed}
            barColor={getBarColor(metrics.fanSpeed, [40, 75])}
          />
          <MetricItem
            label="Resp"
            value={`${metrics.responsiveness.toFixed(0)}%`}
            bar={metrics.responsiveness}
            barColor={
              metrics.responsiveness < 40
                ? "bg-red-400"
                : metrics.responsiveness < 70
                  ? "bg-yellow-400"
                  : "bg-green-400"
            }
          />
          <MetricItem
            label="Clicks"
            value={`${metrics.interactionCount}`}
            bar={Math.min(100, metrics.interactionCount * 5)}
            barColor="bg-blue-400"
          />
        </div>
      </div>
    </div>
  );
}

function MetricItem({
  label,
  value,
  bar,
  barColor,
}: {
  label: string;
  value: string;
  bar: number;
  barColor: string;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center justify-between">
        <span className="text-[8px] text-gray-500 font-medium">{label}</span>
        <span className="text-[8px] text-gray-300 font-bold">{value}</span>
      </div>
      <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${Math.min(100, bar)}%` }}
        />
      </div>
    </div>
  );
}
