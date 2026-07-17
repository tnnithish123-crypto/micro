import { motion } from "framer-motion";
import { Trophy, Timer, TrendingUp, Minus, Zap, Shield, Star, Award } from "lucide-react";

export interface TestResultData {
  testId: string;
  testName: string;
  category: string;
  icon: string;
  laptop1Time: number;
  laptop2Time: number;
  laptop1Metrics: {
    cpuUsage: number;
    gpuUsage: number;
    ramUsage: number;
    storageActivity: number;
    temperature: number;
    fanSpeed: number;
    batteryDrain: number;
    powerDraw: number;
  };
  laptop2Metrics: {
    cpuUsage: number;
    gpuUsage: number;
    ramUsage: number;
    storageActivity: number;
    temperature: number;
    fanSpeed: number;
    batteryDrain: number;
    powerDraw: number;
  };
  winnerIndex: 0 | 1 | -1;
  difference: number;
  efficiency1: string;
  efficiency2: string;
  isFpsTest: boolean;
}

interface TestResultSummaryProps {
  result: TestResultData;
  laptop1Name: string;
  laptop2Name: string;
}

function getEfficiencyBadgeClass(efficiency: string): string {
  switch (efficiency) {
    case "Excellent":
      return "bg-emerald-100 text-emerald-700";
    case "Good":
      return "bg-blue-100 text-blue-700";
    case "Average":
      return "bg-amber-100 text-amber-700";
    case "Poor":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

function getPerformanceBarColor(percentage: number): string {
  if (percentage >= 90) return "bg-emerald-500";
  if (percentage >= 70) return "bg-blue-500";
  if (percentage >= 50) return "bg-amber-500";
  return "bg-red-500";
}

function getEfficiencyIcon(efficiency: string) {
  switch (efficiency) {
    case "Excellent":
      return <Star className="w-3 h-3" />;
    case "Good":
      return <Award className="w-3 h-3" />;
    case "Average":
      return <Shield className="w-3 h-3" />;
    case "Poor":
      return <Zap className="w-3 h-3" />;
    default:
      return null;
  }
}

export default function TestResultSummary({
  result,
  laptop1Name,
  laptop2Name,
}: TestResultSummaryProps) {
  const {
    testName,
    category,
    icon,
    laptop1Time,
    laptop2Time,
    laptop1Metrics,
    laptop2Metrics,
    winnerIndex,
    difference,
    efficiency1,
    efficiency2,
    isFpsTest,
  } = result;

  const isTie = winnerIndex === -1;
  const maxValue = Math.max(laptop1Time, laptop2Time);
  const bar1Percent = maxValue > 0 ? (laptop1Time / maxValue) * 100 : 0;
  const bar2Percent = maxValue > 0 ? (laptop2Time / maxValue) * 100 : 0;

  const getCardClasses = (index: 0 | 1) => {
    const base =
      "relative p-4 rounded-2xl backdrop-blur-md bg-white/80 border border-white/50 transition-all duration-300";
    if (!isTie && winnerIndex === index) {
      return `${base} ring-2 ring-amber-400 shadow-lg shadow-amber-100`;
    }
    return `${base} shadow-md`;
  };

  const formatValue = (value: number) => {
    if (isFpsTest) return `${value.toFixed(0)} FPS`;
    return `${value.toFixed(2)}s`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full"
    >
      <div className="rounded-3xl backdrop-blur-md bg-white/80 border border-white/50 shadow-xl p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{icon}</span>
            <div>
              <h3 className="text-lg font-bold text-gray-800">{testName}</h3>
              <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                {category}
              </span>
            </div>
          </div>
          {!isTie && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-semibold text-amber-700">
                {winnerIndex === 0 ? laptop1Name : laptop2Name}
              </span>
            </div>
          )}
          {isTie && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 border border-gray-200">
              <Minus className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-semibold text-gray-600">TIE</span>
            </div>
          )}
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
          {/* Laptop 1 Card */}
          <div className={getCardClasses(0)}>
            {winnerIndex === 0 && !isTie && (
              <div className="absolute -top-2.5 left-4 px-2 py-0.5 rounded-full bg-amber-400 text-white text-[10px] font-bold uppercase tracking-wider">
                Winner
              </div>
            )}
            <div className="mb-3">
              <p className="text-xs font-medium text-gray-500 mb-1">{laptop1Name}</p>
              <p className="text-2xl font-bold text-gray-800">{formatValue(laptop1Time)}</p>
            </div>

            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                  Performance
                </span>
                <span className="text-xs font-bold text-gray-600">
                  {bar1Percent.toFixed(0)}%
                </span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${bar1Percent}%` }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className={`h-full rounded-full ${getPerformanceBarColor(bar1Percent)}`}
                />
              </div>
            </div>

            <div className="mb-3">
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${getEfficiencyBadgeClass(
                  efficiency1
                )}`}
              >
                {getEfficiencyIcon(efficiency1)}
                {efficiency1}
              </span>
            </div>

            <div className="flex gap-3 pt-2 border-t border-gray-100">
              <div className="flex items-center gap-1">
                <Timer className="w-3 h-3 text-gray-400" />
                <div>
                  <p className="text-[10px] text-gray-400">CPU Temp</p>
                  <p className="text-xs font-semibold text-gray-600">
                    {laptop1Metrics.temperature}°C
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-gray-400" />
                <div>
                  <p className="text-[10px] text-gray-400">Power</p>
                  <p className="text-xs font-semibold text-gray-600">
                    {laptop1Metrics.powerDraw}W
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* VS Indicator */}
          <div className="flex flex-col items-center gap-2 px-2">
            {isTie ? (
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                <Minus className="w-5 h-5 text-gray-500" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
            )}
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              vs
            </span>
            {!isTie && (
              <div className="px-2 py-1 rounded-full bg-gray-50 border border-gray-100">
                <p className="text-xs font-bold text-gray-600">
                  {difference.toFixed(1)}%
                </p>
                <p className="text-[9px] text-gray-400 text-center">diff</p>
              </div>
            )}
          </div>

          {/* Laptop 2 Card */}
          <div className={getCardClasses(1)}>
            {winnerIndex === 1 && !isTie && (
              <div className="absolute -top-2.5 left-4 px-2 py-0.5 rounded-full bg-amber-400 text-white text-[10px] font-bold uppercase tracking-wider">
                Winner
              </div>
            )}
            <div className="mb-3">
              <p className="text-xs font-medium text-gray-500 mb-1">{laptop2Name}</p>
              <p className="text-2xl font-bold text-gray-800">{formatValue(laptop2Time)}</p>
            </div>

            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                  Performance
                </span>
                <span className="text-xs font-bold text-gray-600">
                  {bar2Percent.toFixed(0)}%
                </span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${bar2Percent}%` }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className={`h-full rounded-full ${getPerformanceBarColor(bar2Percent)}`}
                />
              </div>
            </div>

            <div className="mb-3">
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${getEfficiencyBadgeClass(
                  efficiency2
                )}`}
              >
                {getEfficiencyIcon(efficiency2)}
                {efficiency2}
              </span>
            </div>

            <div className="flex gap-3 pt-2 border-t border-gray-100">
              <div className="flex items-center gap-1">
                <Timer className="w-3 h-3 text-gray-400" />
                <div>
                  <p className="text-[10px] text-gray-400">CPU Temp</p>
                  <p className="text-xs font-semibold text-gray-600">
                    {laptop2Metrics.temperature}°C
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-gray-400" />
                <div>
                  <p className="text-[10px] text-gray-400">Power</p>
                  <p className="text-xs font-semibold text-gray-600">
                    {laptop2Metrics.powerDraw}W
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
