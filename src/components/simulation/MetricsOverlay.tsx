"use client";

import { useState, useEffect, useRef } from "react";
import { type BenchmarkMetrics } from "@/data/benchmarkData";

export interface MetricsData {
  timeElapsed: number;
  interactionCount: number;
  responsiveness: number;
  cpuUsage: number;
  gpuUsage: number;
  ramUsed: number;
  temperature: number;
  fanSpeed: number;
  fps: number;
  responseTime: number;
}

interface MetricsOverlayProps {
  benchmark: BenchmarkMetrics | null;
  isActive: boolean;
  laptopIndex: 0 | 1;
  accentColor: string;
  totalRam: number;
  onMetricsUpdate?: (metrics: MetricsData) => void;
}

function useBenchmarkMetrics(
  benchmark: BenchmarkMetrics | null,
  isActive: boolean,
  totalRam: number
): { metrics: MetricsData; trackInteraction: () => void } {
  const [metrics, setMetrics] = useState<MetricsData>({
    timeElapsed: 0,
    interactionCount: 0,
    responsiveness: 95,
    cpuUsage: 0,
    gpuUsage: 0,
    ramUsed: 0,
    temperature: 38,
    fanSpeed: 0,
    fps: 0,
    responseTime: 12,
  });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const interactionsRef = useRef(0);

  useEffect(() => {
    if (!isActive || !benchmark) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    interactionsRef.current = 0;

    const targetCpu = benchmark.cpuUsage;
    const targetGpu = benchmark.gpuUsage;
    const targetRam = benchmark.ramUsed;
    const targetTemp = benchmark.temperature;
    const targetFan = benchmark.fanSpeed;
    const targetFps = benchmark.fps;
    const targetResponse = benchmark.response;

    let t = 0;

    intervalRef.current = setInterval(() => {
      t += 0.3;
      const rampUp = Math.min(1, t / 1.5);
      const jitter = () => (Math.random() - 0.5) * 3;

      setMetrics((prev) => ({
        timeElapsed: Math.round(t * 10) / 10,
        interactionCount: interactionsRef.current,
        responsiveness: Math.round(Math.max(20, Math.min(100, 100 - targetResponse * 0.5 + jitter())) * 10) / 10,
        cpuUsage: Math.round((targetCpu * rampUp + jitter() * rampUp) * 10) / 10,
        gpuUsage: Math.round((targetGpu * rampUp + jitter() * rampUp) * 10) / 10,
        ramUsed: Math.round((targetRam * rampUp + jitter() * 0.2 * rampUp) * 10) / 10,
        temperature: Math.round((35 + (targetTemp - 35) * rampUp + jitter() * 0.3) * 10) / 10,
        fanSpeed: Math.round((targetFan * rampUp + jitter() * rampUp) * 10) / 10,
        fps: Math.round(targetFps * rampUp + jitter() * 2 * rampUp),
        responseTime: Math.round(targetResponse + jitter() * 0.5),
      }));
    }, 300);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, benchmark]);

  const trackInteraction = () => {
    interactionsRef.current += 1;
    setMetrics((prev) => ({
      ...prev,
      interactionCount: interactionsRef.current,
    }));
  };

  return { metrics, trackInteraction };
}

export default function MetricsOverlay({
  benchmark,
  isActive,
  laptopIndex,
  accentColor,
  totalRam,
  onMetricsUpdate,
}: MetricsOverlayProps) {
  const { metrics, trackInteraction } = useBenchmarkMetrics(benchmark, isActive, totalRam);

  useEffect(() => {
    if (onMetricsUpdate) onMetricsUpdate(metrics);
  }, [metrics, onMetricsUpdate]);

  if (!isActive) return null;

  const getBarColor = (value: number, thresholds: [number, number]) => {
    if (value >= thresholds[1]) return "bg-red-400";
    if (value >= thresholds[0]) return "bg-yellow-400";
    return "bg-green-400";
  };

  const ramPercent = totalRam > 0 ? Math.min(100, (metrics.ramUsed / totalRam) * 100) : 0;

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
            value={`${metrics.ramUsed.toFixed(1)} GB`}
            bar={ramPercent}
            barColor={getBarColor(ramPercent, [55, 80])}
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
            value={`${metrics.responseTime} ms`}
            bar={Math.min(100, (1 - metrics.responseTime / 50) * 100)}
            barColor={
              metrics.responseTime > 30
                ? "bg-red-400"
                : metrics.responseTime > 18
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
