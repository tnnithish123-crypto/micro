import { motion } from "framer-motion";
import {
  Cpu,
  Monitor,
  Layers,
  HardDrive,
  Thermometer,
  Fan,
  Battery,
  Zap,
} from "lucide-react";

export interface LiveMetrics {
  cpuUsage: number;
  gpuUsage: number;
  ramUsage: number;
  storageActivity: number;
  temperature: number;
  fanSpeed: number;
  batteryDrain: number;
  powerDraw: number;
}

interface LiveMetricsPanelProps {
  metrics: LiveMetrics;
  laptopName: string;
  isActive: boolean;
}

function getColor(value: number): string {
  if (value < 60) return "#22c55e";
  if (value < 80) return "#eab308";
  return "#ef4444";
}

function getTemperatureColor(temp: number): string {
  if (temp < 50) return "#22c55e";
  if (temp < 70) return "#eab308";
  return "#ef4444";
}

function getBatteryColor(drain: number): string {
  const remaining = 100 - drain;
  if (remaining > 40) return "#22c55e";
  if (remaining > 20) return "#eab308";
  return "#ef4444";
}

interface MetricRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  percent: number;
  color: string;
}

function MetricRow({ icon, label, value, percent, color }: MetricRowProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-gray-300">
          {icon}
          <span>{label}</span>
        </div>
        <span className="font-mono text-white font-medium">{value}</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-gray-700/60 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(percent, 100)}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

export default function LiveMetricsPanel({
  metrics,
  laptopName,
  isActive,
}: LiveMetricsPanelProps) {
  const powerPercent = (metrics.powerDraw / 150) * 100;
  const batteryRemaining = 100 - metrics.batteryDrain;

  const rows: MetricRowProps[] = [
    {
      icon: <Cpu size={12} />,
      label: "CPU Usage",
      value: `${metrics.cpuUsage}%`,
      percent: metrics.cpuUsage,
      color: getColor(metrics.cpuUsage),
    },
    {
      icon: <Monitor size={12} />,
      label: "GPU Usage",
      value: `${metrics.gpuUsage}%`,
      percent: metrics.gpuUsage,
      color: getColor(metrics.gpuUsage),
    },
    {
      icon: <Layers size={12} />,
      label: "RAM Usage",
      value: `${metrics.ramUsage}%`,
      percent: metrics.ramUsage,
      color: getColor(metrics.ramUsage),
    },
    {
      icon: <HardDrive size={12} />,
      label: "Storage",
      value: `${metrics.storageActivity}%`,
      percent: metrics.storageActivity,
      color: getColor(metrics.storageActivity),
    },
    {
      icon: <Thermometer size={12} />,
      label: "Temperature",
      value: `${metrics.temperature}°C`,
      percent: ((metrics.temperature - 35) / 60) * 100,
      color: getTemperatureColor(metrics.temperature),
    },
    {
      icon: <Fan size={12} />,
      label: "Fan Speed",
      value: `${metrics.fanSpeed}%`,
      percent: metrics.fanSpeed,
      color: getColor(metrics.fanSpeed),
    },
    {
      icon: <Battery size={12} />,
      label: "Battery",
      value: `${batteryRemaining.toFixed(1)}%`,
      percent: batteryRemaining,
      color: getBatteryColor(metrics.batteryDrain),
    },
    {
      icon: <Zap size={12} />,
      label: "Power Draw",
      value: `${metrics.powerDraw}W`,
      percent: powerPercent,
      color: getColor(powerPercent),
    },
  ];

  return (
    <motion.div
      className="bg-gray-900/90 backdrop-blur-md rounded-xl border border-gray-700/50 p-4 shadow-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="flex items-center gap-2 mb-4">
        {isActive && (
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
          </span>
        )}
        <h3 className="text-sm font-semibold text-white truncate">
          {laptopName}
        </h3>
        <span className="ml-auto text-[10px] uppercase tracking-wider text-gray-500 font-medium">
          Live Metrics
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {rows.map((row) => (
          <MetricRow key={row.label} {...row} />
        ))}
      </div>
    </motion.div>
  );
}
