import { type Product } from "@/data/products";

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------

export interface LaptopMetrics {
  cpuUsage: number;
  gpuUsage: number;
  ramUsage: number;
  storageActivity: number;
  temperature: number;
  fanSpeed: number;
  batteryDrain: number;
  powerDraw: number;
}

export interface TestResult {
  testId: string;
  testName: string;
  category: "system" | "productivity" | "creative" | "development" | "gaming" | "ai";
  icon: string;
  laptop1Time: number;
  laptop2Time: number;
  laptop1Metrics: LaptopMetrics;
  laptop2Metrics: LaptopMetrics;
  winnerIndex: 0 | 1 | -1;
  difference: number;
  efficiency1: string;
  efficiency2: string;
  isFpsTest: boolean;
}

export interface FinalReport {
  overallWinner: 0 | 1 | -1;
  categoryScores: {
    gaming: { laptop1: number; laptop2: number; winner: 0 | 1 | -1 };
    programming: { laptop1: number; laptop2: number; winner: 0 | 1 | -1 };
    creative: { laptop1: number; laptop2: number; winner: 0 | 1 | -1 };
    productivity: { laptop1: number; laptop2: number; winner: 0 | 1 | -1 };
    battery: { laptop1: number; laptop2: number; winner: 0 | 1 | -1 };
    value: { laptop1: number; laptop2: number; winner: 0 | 1 | -1 };
  };
  explanations: Record<string, string>;
  totalTests: number;
  laptop1Wins: number;
  laptop2Wins: number;
  ties: number;
}

export interface TestDefinition {
  id: string;
  name: string;
  category: "system" | "productivity" | "creative" | "development" | "gaming" | "ai";
  icon: string;
  description: string;
  isFpsTest: boolean;
  baseTime: number;
  baseFps: number;
}

// ---------------------------------------------------------------------------
// Deterministic pseudo-random helper (simple djb2 hash)
// ---------------------------------------------------------------------------

function djb2Hash(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function seededRandom(seed: string, min: number, max: number): number {
  const h = djb2Hash(seed);
  const frac = (h % 10000) / 10000;
  return min + frac * (max - min);
}

// ---------------------------------------------------------------------------
// Parsing helpers
// ---------------------------------------------------------------------------

function parseCpuScore(processor: string): number {
  const p = processor.toLowerCase();
  if (p.includes("i9")) return 20;
  if (p.includes("i7")) return 16;
  if (p.includes("i5")) return 12;
  if (p.includes("i3")) return 7;
  if (p.includes("r9")) return 20;
  if (p.includes("r7")) return 16;
  if (p.includes("r5")) return 12;
  if (p.includes("r3")) return 7;
  if (p.includes("qualcomm")) return 10;
  return 5;
}

function parseGpuScore(gpu: string): number {
  const g = gpu.toUpperCase();
  if (g.includes("RTX 4090")) return 20;
  if (g.includes("RTX 4080")) return 18;
  if (g.includes("RTX 4070")) return 16;
  if (g.includes("RTX 4060")) return 14;
  if (g.includes("RTX 4050")) return 12;
  if (g.includes("RTX 3060")) return 11;
  if (g.includes("RTX 3050")) return 9;
  if (g.includes("GTX 1650")) return 6;
  if (g.includes("AMD RADEON")) return 5;
  if (g.includes("INTEL IRIS XE")) return 4;
  if (g.includes("QUALCOMM ADRENO")) return 4;
  if (g.includes("INTEL UHD")) return 2;
  return 3;
}

function parseRamScore(ram: number): number {
  if (ram >= 64) return 20;
  if (ram >= 32) return 17;
  if (ram >= 16) return 12;
  if (ram >= 8) return 6;
  return 3;
}

function parseStorageScore(storage: string): number {
  const s = storage.toUpperCase();
  let tb = 0;
  const tbMatch = s.match(/(\d+(?:\.\d+)?)\s*TB/);
  if (tbMatch) tb = parseFloat(tbMatch[1]);
  let gb = 0;
  const gbMatch = s.match(/(\d+(?:\.\d+)?)\s*GB/);
  if (gbMatch) gb = parseFloat(gbMatch[1]);
  const totalGb = tb > 0 ? tb * 1024 : gb;
  let score = 0;
  if (totalGb >= 2048) score = 15;
  else if (totalGb >= 1024) score = 12;
  else if (totalGb >= 512) score = 9;
  else if (totalGb >= 256) score = 6;
  else score = 3;
  if (s.includes("NVME")) score = Math.min(15, score + 2);
  return score;
}

function parseBatteryScore(batteryLife: string): number {
  const match = batteryLife.match(/(\d+(?:\.\d+)?)/);
  if (!match) return 5;
  const hours = parseFloat(match[1]);
  if (hours >= 14) return 15;
  if (hours >= 11) return 13;
  if (hours >= 9) return 11;
  if (hours >= 7) return 9;
  if (hours >= 5) return 7;
  return 4;
}

function parseRefreshRate(product: Product): number {
  const refresh = (product as unknown as Record<string, unknown>).refreshRate;
  if (typeof refresh === "number") {
    if (refresh >= 165) return 10;
    if (refresh >= 144) return 9;
    if (refresh >= 120) return 8;
    return 5;
  }
  return 5;
}

function parseWeightBonus(weight: number): number {
  if (weight <= 1.2) return 2;
  if (weight <= 1.5) return 1.5;
  if (weight <= 1.8) return 1;
  return 0;
}

function parseWeightPenalty(weight: number): number {
  if (weight >= 2.5) return -1.5;
  if (weight >= 2.0) return -0.5;
  return 0;
}

// ---------------------------------------------------------------------------
// getPerformanceScore
// ---------------------------------------------------------------------------

export function getPerformanceScore(product: Product): number {
  const cpu = parseCpuScore(product.processor);
  const gpu = parseGpuScore(product.gpu);
  const ram = parseRamScore(product.ram);
  const storage = parseStorageScore(product.storage);
  const battery = parseBatteryScore(product.batteryLife);
  const display = parseRefreshRate(product);
  return Math.min(100, Math.max(0, cpu + gpu + ram + storage + battery + display));
}

// ---------------------------------------------------------------------------
// Category helpers
// ---------------------------------------------------------------------------

function getTestCategoryWeight(
  testId: string,
  product: Product,
): { cpu: number; gpu: number; ram: number; storage: number } {
  switch (testId) {
    case "photoshop":
      return { cpu: 0.25, gpu: 0.35, ram: 0.3, storage: 0.1 };
    case "premiere":
      return { cpu: 0.3, gpu: 0.45, ram: 0.15, storage: 0.1 };
    case "vscode":
      return { cpu: 0.35, gpu: 0.05, ram: 0.4, storage: 0.2 };
    case "blender":
      return { cpu: 0.25, gpu: 0.5, ram: 0.15, storage: 0.1 };
    case "canva":
      return { cpu: 0.2, gpu: 0.25, ram: 0.35, storage: 0.2 };
    case "figma":
      return { cpu: 0.2, gpu: 0.3, ram: 0.35, storage: 0.15 };
    case "word":
      return { cpu: 0.25, gpu: 0.05, ram: 0.4, storage: 0.3 };
    case "capcut":
      return { cpu: 0.3, gpu: 0.35, ram: 0.2, storage: 0.15 };
    case "photopea":
      return { cpu: 0.25, gpu: 0.35, ram: 0.3, storage: 0.1 };
    case "pixlr":
      return { cpu: 0.2, gpu: 0.3, ram: 0.35, storage: 0.15 };
    default:
      return { cpu: 0.3, gpu: 0.2, ram: 0.3, storage: 0.2 };
  }
}

// ---------------------------------------------------------------------------
// calculateTestMetrics
// ---------------------------------------------------------------------------

export function calculateTestMetrics(
  product: Product,
  testType: string,
  progress: number,
): LaptopMetrics {
  const weights = getTestCategoryWeight(testType, product);
  const score = getPerformanceScore(product);

  const rampUp = Math.min(1, progress * 3);
  const rampDown = progress > 0.85 ? 1 - (progress - 0.85) / 0.15 : 1;

  const cpuBase = 30 + weights.cpu * 60;
  const gpuBase = 15 + weights.gpu * 65;
  const ramBase = 20 + weights.ram * 60;
  const storageBase = 10 + weights.storage * 75;

  const seed = `${product.id}-${testType}`;
  const jitter = (p: number) => {
    const s = `${seed}-${Math.floor(p * 100)}`;
    return seededRandom(s, -5, 5);
  };

  const usageFactor = 0.6 + score * 0.004;

  const cpuUsage = Math.min(
    100,
    Math.max(0, cpuBase * rampUp * rampDown * usageFactor + jitter(progress * 0.3 + 0.1)),
  );
  const gpuUsage = Math.min(
    100,
    Math.max(0, gpuBase * rampUp * rampDown * usageFactor + jitter(progress * 0.3 + 0.2)),
  );
  const ramUsage = Math.min(
    100,
    Math.max(0, ramBase * rampUp * usageFactor + jitter(progress * 0.3 + 0.3)),
  );
  const storageActivity = Math.min(
    100,
    Math.max(0, storageBase * rampUp * rampDown + jitter(progress * 0.3 + 0.4)),
  );

  const heatBase = cpuUsage * 0.35 + gpuUsage * 0.35 + ramUsage * 0.15;
  const thermalPressure = progress > 0.5 ? (progress - 0.5) * 2 : 0;
  const temperature = Math.min(
    95,
    Math.max(35, 35 + heatBase * 0.55 + thermalPressure * 15 + jitter(progress * 0.3 + 0.5)),
  );

  const fanThreshold = temperature > 55 ? (temperature - 55) / 40 : 0;
  const fanSpeed = Math.min(
    100,
    Math.max(0, fanThreshold * 100 + jitter(progress * 0.3 + 0.6)),
  );

  let batteryDrain = 100;
  const batMatch = product.batteryLife.match(/(\d+(?:\.\d+)?)/);
  const batHours = batMatch ? parseFloat(batMatch[1]) : 8;
  const drainPerProgress = progress * 100;
  const drainScale = 8 / batHours;
  batteryDrain = Math.max(0, 100 - drainPerProgress * drainScale + jitter(progress * 0.3 + 0.7) * 2);

  let powerDraw = 15 + weights.cpu * 45 + weights.gpu * 60;
  if (testType === "battery-drain") powerDraw = 25 + weights.cpu * 20 + weights.gpu * 15;
  powerDraw = Math.max(8, Math.min(180, powerDraw + jitter(progress * 0.3 + 0.8)));

  return {
    cpuUsage: Math.round(cpuUsage * 10) / 10,
    gpuUsage: Math.round(gpuUsage * 10) / 10,
    ramUsage: Math.round(ramUsage * 10) / 10,
    storageActivity: Math.round(storageActivity * 10) / 10,
    temperature: Math.round(temperature * 10) / 10,
    fanSpeed: Math.round(fanSpeed * 10) / 10,
    batteryDrain: Math.round(batteryDrain * 10) / 10,
    powerDraw: Math.round(powerDraw * 10) / 10,
  };
}

// ---------------------------------------------------------------------------
// calculateTestTime
// ---------------------------------------------------------------------------

export function calculateTestTime(product: Product, testId: string): number {
  const test = TEST_DEFINITIONS.find((t) => t.id === testId);
  if (!test) return 10;

  const score = getPerformanceScore(product);
  const multiplier = 1.2 - score * 0.012;

  if (test.isFpsTest) {
    const baseFps = test.baseFps;
    const fpsMultiplier = 0.5 + score * 0.006;
    const raw = baseFps * fpsMultiplier;
    return Math.round(Math.max(1, raw) * 10) / 10;
  }

  const raw = test.baseTime * multiplier;
  return Math.round(Math.max(0.5, raw) * 10) / 10;
}

// ---------------------------------------------------------------------------
// getEfficiencyRating
// ---------------------------------------------------------------------------

export function getEfficiencyRating(value: number, isFps: boolean): string {
  if (isFps) {
    if (value >= 120) return "Excellent";
    if (value >= 80) return "Good";
    if (value >= 50) return "Average";
    return "Poor";
  }
  if (value <= 5) return "Excellent";
  if (value <= 15) return "Good";
  if (value <= 40) return "Average";
  return "Poor";
}

// ---------------------------------------------------------------------------
// TEST_DEFINITIONS
// ---------------------------------------------------------------------------

export const TEST_DEFINITIONS: TestDefinition[] = [
  // Simulation apps (the 10 apps users can test interactively)
  { id: "photoshop", name: "Photoshop", category: "creative", icon: "Image", description: "Adobe Photoshop image editing", isFpsTest: false, baseTime: 3.5, baseFps: 0 },
  { id: "premiere", name: "Premiere Pro", category: "creative", icon: "Film", description: "Adobe Premiere Pro video editing", isFpsTest: false, baseTime: 5.0, baseFps: 0 },
  { id: "vscode", name: "VS Code", category: "development", icon: "Code", description: "Visual Studio Code IDE", isFpsTest: false, baseTime: 1.8, baseFps: 0 },
  { id: "blender", name: "Blender", category: "creative", icon: "Box", description: "Blender 3D modeling & rendering", isFpsTest: false, baseTime: 6.0, baseFps: 0 },
  { id: "canva", name: "Canva", category: "productivity", icon: "Palette", description: "Canva graphic design", isFpsTest: false, baseTime: 2.0, baseFps: 0 },
  { id: "figma", name: "Figma", category: "development", icon: "Pen", description: "Figma UI/UX design tool", isFpsTest: false, baseTime: 2.5, baseFps: 0 },
  { id: "word", name: "Word", category: "productivity", icon: "FileText", description: "Microsoft Word document editing", isFpsTest: false, baseTime: 1.5, baseFps: 0 },
  { id: "capcut", name: "CapCut", category: "creative", icon: "Video", description: "CapCut video editing", isFpsTest: false, baseTime: 2.8, baseFps: 0 },
  { id: "photopea", name: "Photopea", category: "creative", icon: "Image", description: "Photopea online photo editor", isFpsTest: false, baseTime: 3.0, baseFps: 0 },
  { id: "pixlr", name: "Pixlr", category: "creative", icon: "Image", description: "Pixlr photo editor", isFpsTest: false, baseTime: 2.2, baseFps: 0 },
  { id: "gta", name: "GTA V", category: "gaming", icon: "Gamepad2", description: "Grand Theft Auto V gaming performance", isFpsTest: true, baseTime: 0, baseFps: 75 },
  { id: "tekken", name: "Tekken 8", category: "gaming", icon: "Swords", description: "Tekken 8 fighting game performance", isFpsTest: true, baseTime: 0, baseFps: 58 },
];

// ---------------------------------------------------------------------------
// generateFinalReport
// ---------------------------------------------------------------------------

export function generateFinalReport(
  results: TestResult[],
  laptop1: Product,
  laptop2: Product,
): FinalReport {
  const catMap: Record<string, string[]> = {
    gaming: ["gaming"],
    programming: ["development"],
    creative: ["creative"],
    productivity: ["productivity", "system"],
    battery: [],
    value: [],
  };

  const l1Score = getPerformanceScore(laptop1);
  const l2Score = getPerformanceScore(laptop2);

  function catWinner(cats: string[]): {
    laptop1: number;
    laptop2: number;
    winner: 0 | 1 | -1;
  } {
    let w1 = 0;
    let w2 = 0;
    const relevant = results.filter((r) => cats.includes(r.category));
    for (const r of relevant) {
      if (r.winnerIndex === 0) w1++;
      else if (r.winnerIndex === 1) w2++;
    }
    const total = w1 + w2;
    const score1 = total > 0 ? (w1 / total) * 100 : 50;
    const score2 = total > 0 ? (w2 / total) * 100 : 50;
    const winner: 0 | 1 | -1 =
      score1 > score2 + 2 ? 0 : score2 > score1 + 2 ? 1 : -1;
    return { laptop1: Math.round(score1), laptop2: Math.round(score2), winner };
  }

  const batteryResult1 = l1Score;
  const batteryResult2 = l2Score;

  const parsePrice = (p: Product): number => {
    const priceStr = (p as unknown as Record<string, unknown>).price;
    if (typeof priceStr === "number") return priceStr;
    if (typeof priceStr === "string") {
      const m = priceStr.match(/[\d,]+/);
      if (m) return parseInt(m[0].replace(/,/g, ""), 10);
    }
    return 50000;
  };

  const price1 = parsePrice(laptop1);
  const price2 = parsePrice(laptop2);

  const perfPerRupee1 = l1Score / price1;
  const perfPerRupee2 = l2Score / price2;

  const gamingScores = catWinner(["gaming"]);
  const programmingScores = catWinner(["development"]);
  const creativeScores = catWinner(["creative"]);
  const productivityScores = catWinner(["productivity", "system"]);

  const batteryCat = {
    laptop1: batteryResult1,
    laptop2: batteryResult2,
    winner: batteryResult1 > batteryResult2 + 2 ? 0 : batteryResult2 > batteryResult1 + 2 ? 1 : (-1 as 0 | 1 | -1),
  };

  const valueL1 = Math.round((perfPerRupee1 / Math.max(perfPerRupee1, perfPerRupee2)) * 100);
  const valueL2 = Math.round((perfPerRupee2 / Math.max(perfPerRupee1, perfPerRupee2)) * 100);
  const valueCat = {
    laptop1: valueL1,
    laptop2: valueL2,
    winner: perfPerRupee1 > perfPerRupee2 * 1.05 ? 0 : perfPerRupee2 > perfPerRupee1 * 1.05 ? 1 : (-1 as 0 | 1 | -1),
  };

  const totalWins1 =
    (gamingScores.winner === 0 ? 1 : 0) +
    (programmingScores.winner === 0 ? 1 : 0) +
    (creativeScores.winner === 0 ? 1 : 0) +
    (productivityScores.winner === 0 ? 1 : 0) +
    (batteryCat.winner === 0 ? 1 : 0) +
    (valueCat.winner === 0 ? 1 : 0);
  const totalWins2 =
    (gamingScores.winner === 1 ? 1 : 0) +
    (programmingScores.winner === 1 ? 1 : 0) +
    (creativeScores.winner === 1 ? 1 : 0) +
    (productivityScores.winner === 1 ? 1 : 0) +
    (batteryCat.winner === 1 ? 1 : 0) +
    (valueCat.winner === 1 ? 1 : 0);

  const overallWinner: 0 | 1 | -1 =
    totalWins1 > totalWins2 ? 0 : totalWins2 > totalWins1 ? 1 : -1;

  const explanations: Record<string, string> = {};

  if (gamingScores.winner === 0) {
    explanations.gaming = `${laptop1.name} wins gaming with its ${laptop1.gpu}, delivering better frame rates across all tested titles.`;
  } else if (gamingScores.winner === 1) {
    explanations.gaming = `${laptop2.name} wins gaming with its ${laptop2.gpu}, delivering better frame rates across all tested titles.`;
  } else {
    explanations.gaming = `Both laptops offer comparable gaming performance with ${laptop1.gpu} vs ${laptop2.gpu}.`;
  }

  if (programmingScores.winner === 0) {
    explanations.programming = `${laptop1.name} excels at development tasks thanks to its ${laptop1.processor} and ${laptop1.ram}GB RAM.`;
  } else if (programmingScores.winner === 1) {
    explanations.programming = `${laptop2.name} excels at development tasks thanks to its ${laptop2.processor} and ${laptop2.ram}GB RAM.`;
  } else {
    explanations.programming = `Both laptops handle development workflows well with comparable compile and IDE performance.`;
  }

  if (creativeScores.winner === 0) {
    explanations.creative = `${laptop1.name} leads in creative workloads with superior GPU acceleration for rendering and video editing.`;
  } else if (creativeScores.winner === 1) {
    explanations.creative = `${laptop2.name} leads in creative workloads with superior GPU acceleration for rendering and video editing.`;
  } else {
    explanations.creative = `Both laptops perform similarly in creative tasks like video editing and 3D rendering.`;
  }

  if (productivityScores.winner === 0) {
    explanations.productivity = `${laptop1.name} handles daily productivity tasks faster, including system boot, file operations, and office applications.`;
  } else if (productivityScores.winner === 1) {
    explanations.productivity = `${laptop2.name} handles daily productivity tasks faster, including system boot, file operations, and office applications.`;
  } else {
    explanations.productivity = `Both laptops provide snappy everyday productivity performance.`;
  }

  const bat1 = laptop1.batteryLife;
  const bat2 = laptop2.batteryLife;
  if (batteryCat.winner === 0) {
    explanations.battery = `${laptop1.name} offers better battery endurance at ${bat1} vs ${bat2}.`;
  } else if (batteryCat.winner === 1) {
    explanations.battery = `${laptop2.name} offers better battery endurance at ${bat2} vs ${bat1}.`;
  } else {
    explanations.battery = `Both laptops offer comparable battery life (${bat1} vs ${bat2}).`;
  }

  const p1 = price1.toLocaleString("en-IN");
  const p2 = price2.toLocaleString("en-IN");
  if (valueCat.winner === 0) {
    explanations.value = `${laptop1.name} at ₹${p1} offers better value per rupee spent given its performance score of ${l1Score}.`;
  } else if (valueCat.winner === 1) {
    explanations.value = `${laptop2.name} at ₹${p2} offers better value per rupee spent given its performance score of ${l2Score}.`;
  } else {
    explanations.value = `Both laptops offer similar value propositions at their respective price points.`;
  }

  return {
    overallWinner,
    categoryScores: {
      gaming: gamingScores,
      programming: programmingScores,
      creative: creativeScores,
      productivity: productivityScores,
      battery: batteryCat,
      value: valueCat,
    },
    explanations,
    totalTests: results.length,
    laptop1Wins: totalWins1,
    laptop2Wins: totalWins2,
    ties: results.length - totalWins1 - totalWins2,
  };
}
