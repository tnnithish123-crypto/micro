import { motion } from "framer-motion";
import { Trophy, Gamepad2, Code, Palette, Briefcase, Battery, DollarSign, Star, BarChart3, Medal, Crown, TrendingUp, ArrowRight } from "lucide-react";

interface CategoryScore {
  laptop1: number;
  laptop2: number;
  winner: 0 | 1 | -1;
}

interface FinalReportData {
  overallWinner: 0 | 1 | -1;
  categoryScores: {
    gaming: CategoryScore;
    programming: CategoryScore;
    creative: CategoryScore;
    productivity: CategoryScore;
    battery: CategoryScore;
    value: CategoryScore;
  };
  explanations: Record<string, string>;
  totalTests: number;
  laptop1Wins: number;
  laptop2Wins: number;
  ties: number;
}

interface FinalReportProps {
  report: FinalReportData;
  laptop1Name: string;
  laptop2Name: string;
  laptop1Price: number;
  laptop2Price: number;
}

const categoryConfig = [
  { key: "gaming", label: "Gaming", icon: Gamepad2, gradient: "from-purple-500 to-pink-500" },
  { key: "programming", label: "Programming", icon: Code, gradient: "from-blue-500 to-cyan-500" },
  { key: "creative", label: "Creative", icon: Palette, gradient: "from-orange-500 to-red-500" },
  { key: "productivity", label: "Productivity", icon: Briefcase, gradient: "from-green-500 to-teal-500" },
  { key: "battery", label: "Battery", icon: Battery, gradient: "from-yellow-500 to-amber-500" },
  { key: "value", label: "Value", icon: DollarSign, gradient: "from-indigo-500 to-purple-500" },
] as const;

export default function FinalReport({
  report,
  laptop1Name,
  laptop2Name,
  laptop1Price,
  laptop2Price,
}: FinalReportProps) {
  const winnerName = report.overallWinner === 0 ? laptop1Name : report.overallWinner === 1 ? laptop2Name : laptop1Name;
  const loserName = report.overallWinner === 0 ? laptop2Name : laptop1Name;
  const winCount = report.overallWinner === 0 ? report.laptop1Wins : report.laptop2Wins;

  const getConfidence = () => {
    const diff = Math.abs(report.laptop1Wins - report.laptop2Wins);
    const ratio = diff / report.totalTests;
    if (ratio > 0.3) return { label: "Overwhelming", color: "text-emerald-400" };
    if (ratio > 0.15) return { label: "Strong", color: "text-green-400" };
    if (ratio > 0.05) return { label: "Moderate", color: "text-yellow-400" };
    return { label: "Narrow", color: "text-orange-400" };
  };

  const confidence = getConfidence();

  const getWinnerNameForCategory = (winner: 0 | 1 | -1) => {
    if (winner === 0) return laptop1Name;
    if (winner === 1) return laptop2Name;
    return "Tie";
  };

  const overallPerformance = [
    { label: "Gaming", score: report.categoryScores.gaming.winner === 0 ? report.categoryScores.gaming.laptop1 : report.categoryScores.gaming.laptop2 },
    { label: "Programming", score: report.categoryScores.programming.winner === 0 ? report.categoryScores.programming.laptop1 : report.categoryScores.programming.laptop2 },
    { label: "Creative", score: report.categoryScores.creative.winner === 0 ? report.categoryScores.creative.laptop1 : report.categoryScores.creative.laptop2 },
    { label: "Productivity", score: report.categoryScores.productivity.winner === 0 ? report.categoryScores.productivity.laptop1 : report.categoryScores.productivity.laptop2 },
    { label: "Battery", score: report.categoryScores.battery.winner === 0 ? report.categoryScores.battery.laptop1 : report.categoryScores.battery.laptop2 },
    { label: "Value", score: report.categoryScores.value.winner === 0 ? report.categoryScores.value.laptop1 : report.categoryScores.value.laptop2 },
  ];

  const barColors = [
    "bg-purple-500",
    "bg-blue-500",
    "bg-orange-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-indigo-500",
  ];

  return (
    <div className="space-y-8">
      {/* Overall Winner Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative overflow-hidden rounded-2xl"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shine_3s_ease-in-out_infinite]" />
        <div className="relative bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 p-8 text-center">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <Crown className="w-8 h-8 text-white" />
            <span className="text-white/90 text-lg font-semibold tracking-wide uppercase">
              Overall Winner
            </span>
            <Crown className="w-8 h-8 text-white" />
          </motion.div>

          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg"
          >
            {winnerName}
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 text-white/90"
          >
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              <span className="font-semibold">
                Won {winCount} of {report.totalTests} tests
              </span>
            </div>
            <div className="hidden sm:block w-px h-5 bg-white/40" />
            <div className="flex items-center gap-2">
              <Medal className="w-5 h-5" />
              <span className={`font-semibold ${confidence.color}`}>
                {confidence.label} Confidence
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="mt-4 flex items-center justify-center gap-6 text-sm text-white/70"
          >
            <span>
              {laptop1Name}: <strong className="text-white">{report.laptop1Wins}</strong> wins
            </span>
            <span>
              Ties: <strong className="text-white">{report.ties}</strong>
            </span>
            <span>
              {laptop2Name}: <strong className="text-white">{report.laptop2Wins}</strong> wins
            </span>
          </motion.div>
        </div>
      </motion.div>

      {/* Category Winners Grid */}
      <div>
        <motion.h3
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2"
        >
          <BarChart3 className="w-6 h-6 text-indigo-500" />
          Category Winners
        </motion.h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryConfig.map((cat, index) => {
            const score = report.categoryScores[cat.key as keyof typeof report.categoryScores];
            const Icon = cat.icon;
            const catWinner = getWinnerNameForCategory(score.winner);
            const maxScore = Math.max(score.laptop1, score.laptop2, 1);

            return (
              <motion.div
                key={cat.key}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/60 overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className={`bg-gradient-to-r ${cat.gradient} p-4 flex items-center justify-between`}>
                  <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5 text-white" />
                    <span className="text-white font-semibold">{cat.label}</span>
                  </div>
                  {score.winner !== -1 && score.winner !== undefined && (
                    <div className="flex items-center gap-1 bg-white/20 rounded-full px-3 py-1">
                      <Trophy className="w-3.5 h-3.5 text-white" />
                      <span className="text-white text-xs font-medium">
                        {catWinner.length > 12 ? catWinner.slice(0, 12) + "…" : catWinner}
                      </span>
                    </div>
                  )}
                  {score.winner === -1 && (
                    <div className="flex items-center gap-1 bg-white/20 rounded-full px-3 py-1">
                      <Star className="w-3.5 h-3.5 text-white" />
                      <span className="text-white text-xs font-medium">Tie</span>
                    </div>
                  )}
                </div>

                <div className="p-4 space-y-3">
                  {/* Laptop 1 Score */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 font-medium truncate">{laptop1Name}</span>
                      <span className="text-gray-800 font-bold">{score.laptop1.toFixed(1)}</span>
                    </div>
                    <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(score.laptop1 / maxScore) * 100}%` }}
                        transition={{ delay: 0.7 + index * 0.1, duration: 0.6 }}
                        className={`h-full rounded-full ${
                          score.winner === 0
                            ? `bg-gradient-to-r ${cat.gradient}`
                            : "bg-gray-400"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Laptop 2 Score */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 font-medium truncate">{laptop2Name}</span>
                      <span className="text-gray-800 font-bold">{score.laptop2.toFixed(1)}</span>
                    </div>
                    <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(score.laptop2 / maxScore) * 100}%` }}
                        transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
                        className={`h-full rounded-full ${
                          score.winner === 1
                            ? `bg-gradient-to-r ${cat.gradient}`
                            : "bg-gray-400"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Explanations Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-indigo-500" />
          Detailed Analysis
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categoryConfig.map((cat) => {
            const explanation = report.explanations[cat.key];
            if (!explanation) return null;
            const Icon = cat.icon;

            return (
              <motion.div
                key={cat.key}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.3, duration: 0.3 }}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-md border border-white/60"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Icon className="w-5 h-5 text-indigo-500" />
                  <h4 className="font-semibold text-gray-800">{cat.label}</h4>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{explanation}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Performance Radar Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md border border-white/60"
      >
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-indigo-500" />
          Performance Breakdown
        </h3>
        <div className="space-y-4">
          {overallPerformance.map((perf, i) => (
            <div key={perf.label} className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 font-medium">{perf.label}</span>
                <span className="text-gray-800 font-bold">{perf.score.toFixed(1)} / 100</span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${perf.score}%` }}
                  transition={{ delay: 1.7 + i * 0.08, duration: 0.7 }}
                  className={`h-full rounded-full ${barColors[i]}`}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Verdict Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.5 }}
        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 text-white"
      >
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Trophy className="w-6 h-6 text-amber-400" />
          Final Verdict
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Why it won */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5">
            <h4 className="text-amber-400 font-semibold mb-3 flex items-center gap-2">
              <Crown className="w-4 h-4" />
              Why {winnerName} Won
            </h4>
            <p className="text-white/80 text-sm leading-relaxed">
              {winnerName} secured the victory by winning{" "}
              <strong className="text-amber-400">{winCount}</strong> out of{" "}
              <strong className="text-amber-400">{report.totalTests}</strong> tests across{" "}
              {Object.keys(report.categoryScores).filter(
                (k) =>
                  report.categoryScores[k as keyof typeof report.categoryScores].winner ===
                  report.overallWinner
              ).length}{" "}
              categories, demonstrating superior overall performance.
            </p>
          </div>

          {/* Price Comparison */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5">
            <h4 className="text-amber-400 font-semibold mb-3 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Price Comparison
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-white/70 text-sm">{laptop1Name}</span>
                <span className="text-white font-bold">₹{laptop1Price.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70 text-sm">{laptop2Name}</span>
                <span className="text-white font-bold">₹{laptop2Price.toLocaleString("en-IN")}</span>
              </div>
              <div className="border-t border-white/20 pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-white/70 text-sm">Difference</span>
                  <span className={`font-bold ${laptop1Price < laptop2Price ? "text-emerald-400" : "text-red-400"}`}>
                    ₹{Math.abs(laptop1Price - laptop2Price).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Best For Whom */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5">
            <h4 className="text-amber-400 font-semibold mb-3 flex items-center gap-2">
              <ArrowRight className="w-4 h-4" />
              Best For
            </h4>
            <div className="space-y-3">
              <div>
                <span className="text-emerald-400 text-sm font-medium">{winnerName}</span>
                <p className="text-white/70 text-xs mt-1">
                  Best for users who need maximum performance and are willing to invest in a premium experience.
                </p>
              </div>
              <div>
                <span className="text-blue-400 text-sm font-medium">{loserName}</span>
                <p className="text-white/70 text-xs mt-1">
                  A solid alternative that may offer better value depending on specific use-case priorities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
