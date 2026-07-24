export interface BenchmarkMetrics {
  cpuUsage: number;
  gpuUsage: number;
  ramUsed: number;
  fps: number;
  temperature: number;
  fanSpeed: number;
  response: number;
  clicks: number;
  openTime: number;
}

export interface LaptopBenchmark {
  tier: string;
  apps: Record<string, BenchmarkMetrics>;
}

export const BENCHMARK_DATA: Record<string, LaptopBenchmark> = {
  'omen-16-ai': {
    tier: 'A+',
    apps: {
      photoshop:  { cpuUsage: 28, gpuUsage: 22, ramUsed: 3.8, fps: 118, temperature: 56, fanSpeed: 35, response: 12, clicks: 0, openTime: 2.0 },
      premiere:   { cpuUsage: 50, gpuUsage: 65, ramUsed: 6.5, fps: 116, temperature: 59, fanSpeed: 46, response: 14, clicks: 0, openTime: 2.6 },
      vscode:     { cpuUsage: 8,  gpuUsage: 2,  ramUsed: 0.8, fps: 120, temperature: 53, fanSpeed: 30, response: 12, clicks: 0, openTime: 0.8 },
      blender:    { cpuUsage: 45, gpuUsage: 75, ramUsed: 5.2, fps: 117, temperature: 58, fanSpeed: 48, response: 14, clicks: 0, openTime: 3.2 },
      canva:      { cpuUsage: 10, gpuUsage: 5,  ramUsed: 1.2, fps: 120, temperature: 54, fanSpeed: 31, response: 12, clicks: 0, openTime: 1.0 },
      figma:      { cpuUsage: 15, gpuUsage: 8,  ramUsed: 1.6, fps: 119, temperature: 54, fanSpeed: 32, response: 12, clicks: 0, openTime: 1.2 },
      word:       { cpuUsage: 7,  gpuUsage: 1,  ramUsed: 0.5, fps: 120, temperature: 53, fanSpeed: 30, response: 12, clicks: 0, openTime: 0.7 },
      capcut:     { cpuUsage: 37, gpuUsage: 50, ramUsed: 4.3, fps: 117, temperature: 57, fanSpeed: 42, response: 13, clicks: 0, openTime: 2.3 },
      photopea:   { cpuUsage: 17, gpuUsage: 10, ramUsed: 1.5, fps: 119, temperature: 55, fanSpeed: 32, response: 12, clicks: 0, openTime: 1.3 },
      pixlr:      { cpuUsage: 15, gpuUsage: 8,  ramUsed: 1.1, fps: 119, temperature: 54, fanSpeed: 32, response: 12, clicks: 0, openTime: 1.1 },
    },
  },
  'omnibook-ultra-14': {
    tier: 'A+',
    apps: {
      photoshop:  { cpuUsage: 28, gpuUsage: 22, ramUsed: 3.8, fps: 118, temperature: 56, fanSpeed: 35, response: 12, clicks: 0, openTime: 2.0 },
      premiere:   { cpuUsage: 50, gpuUsage: 65, ramUsed: 6.5, fps: 116, temperature: 59, fanSpeed: 46, response: 14, clicks: 0, openTime: 2.6 },
      vscode:     { cpuUsage: 8,  gpuUsage: 2,  ramUsed: 0.8, fps: 120, temperature: 53, fanSpeed: 30, response: 12, clicks: 0, openTime: 0.8 },
      blender:    { cpuUsage: 45, gpuUsage: 75, ramUsed: 5.2, fps: 117, temperature: 58, fanSpeed: 48, response: 14, clicks: 0, openTime: 3.2 },
      canva:      { cpuUsage: 10, gpuUsage: 5,  ramUsed: 1.2, fps: 120, temperature: 54, fanSpeed: 31, response: 12, clicks: 0, openTime: 1.0 },
      figma:      { cpuUsage: 15, gpuUsage: 8,  ramUsed: 1.6, fps: 119, temperature: 54, fanSpeed: 32, response: 12, clicks: 0, openTime: 1.2 },
      word:       { cpuUsage: 7,  gpuUsage: 1,  ramUsed: 0.5, fps: 120, temperature: 53, fanSpeed: 30, response: 12, clicks: 0, openTime: 0.7 },
      capcut:     { cpuUsage: 37, gpuUsage: 50, ramUsed: 4.3, fps: 117, temperature: 57, fanSpeed: 42, response: 13, clicks: 0, openTime: 2.3 },
      photopea:   { cpuUsage: 17, gpuUsage: 10, ramUsed: 1.5, fps: 119, temperature: 55, fanSpeed: 32, response: 12, clicks: 0, openTime: 1.3 },
      pixlr:      { cpuUsage: 15, gpuUsage: 8,  ramUsed: 1.1, fps: 119, temperature: 54, fanSpeed: 32, response: 12, clicks: 0, openTime: 1.1 },
    },
  },
  'omnibook-x-flip-14': {
    tier: 'A',
    apps: {
      photoshop:  { cpuUsage: 35, gpuUsage: 20, ramUsed: 3.8, fps: 103, temperature: 59, fanSpeed: 42, response: 16, clicks: 0, openTime: 2.8 },
      premiere:   { cpuUsage: 57, gpuUsage: 63, ramUsed: 6.5, fps: 101, temperature: 62, fanSpeed: 53, response: 18, clicks: 0, openTime: 3.4 },
      vscode:     { cpuUsage: 15, gpuUsage: 1,  ramUsed: 0.8, fps: 104, temperature: 56, fanSpeed: 37, response: 16, clicks: 0, openTime: 1.6 },
      blender:    { cpuUsage: 52, gpuUsage: 73, ramUsed: 5.2, fps: 101, temperature: 61, fanSpeed: 55, response: 18, clicks: 0, openTime: 4.0 },
      canva:      { cpuUsage: 17, gpuUsage: 3,  ramUsed: 1.2, fps: 104, temperature: 57, fanSpeed: 38, response: 16, clicks: 0, openTime: 1.8 },
      figma:      { cpuUsage: 22, gpuUsage: 6,  ramUsed: 1.6, fps: 104, temperature: 57, fanSpeed: 39, response: 16, clicks: 0, openTime: 2.0 },
      word:       { cpuUsage: 14, gpuUsage: 1,  ramUsed: 0.5, fps: 104, temperature: 56, fanSpeed: 37, response: 16, clicks: 0, openTime: 1.5 },
      capcut:     { cpuUsage: 44, gpuUsage: 48, ramUsed: 4.3, fps: 102, temperature: 60, fanSpeed: 49, response: 17, clicks: 0, openTime: 3.1 },
      photopea:   { cpuUsage: 24, gpuUsage: 8,  ramUsed: 1.5, fps: 103, temperature: 58, fanSpeed: 39, response: 16, clicks: 0, openTime: 2.1 },
      pixlr:      { cpuUsage: 22, gpuUsage: 6,  ramUsed: 1.1, fps: 104, temperature: 57, fanSpeed: 39, response: 16, clicks: 0, openTime: 1.9 },
    },
  },
  'omnibook-7': {
    tier: 'A',
    apps: {
      photoshop:  { cpuUsage: 35, gpuUsage: 20, ramUsed: 3.8, fps: 103, temperature: 59, fanSpeed: 42, response: 16, clicks: 0, openTime: 2.8 },
      premiere:   { cpuUsage: 57, gpuUsage: 63, ramUsed: 6.5, fps: 101, temperature: 62, fanSpeed: 53, response: 18, clicks: 0, openTime: 3.4 },
      vscode:     { cpuUsage: 15, gpuUsage: 1,  ramUsed: 0.8, fps: 104, temperature: 56, fanSpeed: 37, response: 16, clicks: 0, openTime: 1.6 },
      blender:    { cpuUsage: 52, gpuUsage: 73, ramUsed: 5.2, fps: 101, temperature: 61, fanSpeed: 55, response: 18, clicks: 0, openTime: 4.0 },
      canva:      { cpuUsage: 17, gpuUsage: 3,  ramUsed: 1.2, fps: 104, temperature: 57, fanSpeed: 38, response: 16, clicks: 0, openTime: 1.8 },
      figma:      { cpuUsage: 22, gpuUsage: 6,  ramUsed: 1.6, fps: 104, temperature: 57, fanSpeed: 39, response: 16, clicks: 0, openTime: 2.0 },
      word:       { cpuUsage: 14, gpuUsage: 1,  ramUsed: 0.5, fps: 104, temperature: 56, fanSpeed: 37, response: 16, clicks: 0, openTime: 1.5 },
      capcut:     { cpuUsage: 44, gpuUsage: 48, ramUsed: 4.3, fps: 102, temperature: 60, fanSpeed: 49, response: 17, clicks: 0, openTime: 3.1 },
      photopea:   { cpuUsage: 24, gpuUsage: 8,  ramUsed: 1.5, fps: 103, temperature: 58, fanSpeed: 39, response: 16, clicks: 0, openTime: 2.1 },
      pixlr:      { cpuUsage: 22, gpuUsage: 6,  ramUsed: 1.1, fps: 104, temperature: 57, fanSpeed: 39, response: 16, clicks: 0, openTime: 1.9 },
    },
  },
  'victus-15': {
    tier: 'A',
    apps: {
      photoshop:  { cpuUsage: 35, gpuUsage: 20, ramUsed: 3.8, fps: 103, temperature: 59, fanSpeed: 42, response: 16, clicks: 0, openTime: 2.8 },
      premiere:   { cpuUsage: 57, gpuUsage: 63, ramUsed: 6.5, fps: 101, temperature: 62, fanSpeed: 53, response: 18, clicks: 0, openTime: 3.4 },
      vscode:     { cpuUsage: 15, gpuUsage: 1,  ramUsed: 0.8, fps: 104, temperature: 56, fanSpeed: 37, response: 16, clicks: 0, openTime: 1.6 },
      blender:    { cpuUsage: 52, gpuUsage: 73, ramUsed: 5.2, fps: 101, temperature: 61, fanSpeed: 55, response: 18, clicks: 0, openTime: 4.0 },
      canva:      { cpuUsage: 17, gpuUsage: 3,  ramUsed: 1.2, fps: 104, temperature: 57, fanSpeed: 38, response: 16, clicks: 0, openTime: 1.8 },
      figma:      { cpuUsage: 22, gpuUsage: 6,  ramUsed: 1.6, fps: 104, temperature: 57, fanSpeed: 39, response: 16, clicks: 0, openTime: 2.0 },
      word:       { cpuUsage: 14, gpuUsage: 1,  ramUsed: 0.5, fps: 104, temperature: 56, fanSpeed: 37, response: 16, clicks: 0, openTime: 1.5 },
      capcut:     { cpuUsage: 44, gpuUsage: 48, ramUsed: 4.3, fps: 102, temperature: 60, fanSpeed: 49, response: 17, clicks: 0, openTime: 3.1 },
      photopea:   { cpuUsage: 24, gpuUsage: 8,  ramUsed: 1.5, fps: 103, temperature: 58, fanSpeed: 39, response: 16, clicks: 0, openTime: 2.1 },
      pixlr:      { cpuUsage: 22, gpuUsage: 6,  ramUsed: 1.1, fps: 104, temperature: 57, fanSpeed: 39, response: 16, clicks: 0, openTime: 1.9 },
    },
  },
  'elitebook-x-g2': {
    tier: 'B',
    apps: {
      photoshop:  { cpuUsage: 45, gpuUsage: 16, ramUsed: 3.8, fps: 87, temperature: 62, fanSpeed: 48, response: 20, clicks: 0, openTime: 3.8 },
      premiere:   { cpuUsage: 67, gpuUsage: 59, ramUsed: 6.5, fps: 85, temperature: 65, fanSpeed: 59, response: 22, clicks: 0, openTime: 4.4 },
      vscode:     { cpuUsage: 25, gpuUsage: 1,  ramUsed: 0.8, fps: 88, temperature: 59, fanSpeed: 43, response: 20, clicks: 0, openTime: 2.6 },
      blender:    { cpuUsage: 62, gpuUsage: 69, ramUsed: 5.2, fps: 85, temperature: 64, fanSpeed: 61, response: 22, clicks: 0, openTime: 5.0 },
      canva:      { cpuUsage: 27, gpuUsage: 1,  ramUsed: 1.2, fps: 88, temperature: 60, fanSpeed: 44, response: 20, clicks: 0, openTime: 2.8 },
      figma:      { cpuUsage: 32, gpuUsage: 2,  ramUsed: 1.6, fps: 88, temperature: 60, fanSpeed: 45, response: 20, clicks: 0, openTime: 3.0 },
      word:       { cpuUsage: 24, gpuUsage: 1,  ramUsed: 0.5, fps: 88, temperature: 59, fanSpeed: 43, response: 20, clicks: 0, openTime: 2.5 },
      capcut:     { cpuUsage: 54, gpuUsage: 44, ramUsed: 4.3, fps: 86, temperature: 63, fanSpeed: 55, response: 21, clicks: 0, openTime: 4.1 },
      photopea:   { cpuUsage: 34, gpuUsage: 4,  ramUsed: 1.5, fps: 88, temperature: 61, fanSpeed: 45, response: 20, clicks: 0, openTime: 3.1 },
      pixlr:      { cpuUsage: 32, gpuUsage: 2,  ramUsed: 1.1, fps: 88, temperature: 60, fanSpeed: 45, response: 20, clicks: 0, openTime: 2.9 },
    },
  },
  'omnibook-5-14': {
    tier: 'B',
    apps: {
      photoshop:  { cpuUsage: 45, gpuUsage: 16, ramUsed: 3.8, fps: 87, temperature: 62, fanSpeed: 48, response: 20, clicks: 0, openTime: 3.8 },
      premiere:   { cpuUsage: 67, gpuUsage: 59, ramUsed: 6.5, fps: 85, temperature: 65, fanSpeed: 59, response: 22, clicks: 0, openTime: 4.4 },
      vscode:     { cpuUsage: 25, gpuUsage: 1,  ramUsed: 0.8, fps: 88, temperature: 59, fanSpeed: 43, response: 20, clicks: 0, openTime: 2.6 },
      blender:    { cpuUsage: 62, gpuUsage: 69, ramUsed: 5.2, fps: 85, temperature: 64, fanSpeed: 61, response: 22, clicks: 0, openTime: 5.0 },
      canva:      { cpuUsage: 27, gpuUsage: 1,  ramUsed: 1.2, fps: 88, temperature: 60, fanSpeed: 44, response: 20, clicks: 0, openTime: 2.8 },
      figma:      { cpuUsage: 32, gpuUsage: 2,  ramUsed: 1.6, fps: 88, temperature: 60, fanSpeed: 45, response: 20, clicks: 0, openTime: 3.0 },
      word:       { cpuUsage: 24, gpuUsage: 1,  ramUsed: 0.5, fps: 88, temperature: 59, fanSpeed: 43, response: 20, clicks: 0, openTime: 2.5 },
      capcut:     { cpuUsage: 54, gpuUsage: 44, ramUsed: 4.3, fps: 86, temperature: 63, fanSpeed: 55, response: 21, clicks: 0, openTime: 4.1 },
      photopea:   { cpuUsage: 34, gpuUsage: 4,  ramUsed: 1.5, fps: 88, temperature: 61, fanSpeed: 45, response: 20, clicks: 0, openTime: 3.1 },
      pixlr:      { cpuUsage: 32, gpuUsage: 2,  ramUsed: 1.1, fps: 88, temperature: 60, fanSpeed: 45, response: 20, clicks: 0, openTime: 2.9 },
    },
  },
  'omnibook-5-16': {
    tier: 'B',
    apps: {
      photoshop:  { cpuUsage: 45, gpuUsage: 16, ramUsed: 3.8, fps: 87, temperature: 62, fanSpeed: 48, response: 20, clicks: 0, openTime: 3.8 },
      premiere:   { cpuUsage: 67, gpuUsage: 59, ramUsed: 6.5, fps: 85, temperature: 65, fanSpeed: 59, response: 22, clicks: 0, openTime: 4.4 },
      vscode:     { cpuUsage: 25, gpuUsage: 1,  ramUsed: 0.8, fps: 88, temperature: 59, fanSpeed: 43, response: 20, clicks: 0, openTime: 2.6 },
      blender:    { cpuUsage: 62, gpuUsage: 69, ramUsed: 5.2, fps: 85, temperature: 64, fanSpeed: 61, response: 22, clicks: 0, openTime: 5.0 },
      canva:      { cpuUsage: 27, gpuUsage: 1,  ramUsed: 1.2, fps: 88, temperature: 60, fanSpeed: 44, response: 20, clicks: 0, openTime: 2.8 },
      figma:      { cpuUsage: 32, gpuUsage: 2,  ramUsed: 1.6, fps: 88, temperature: 60, fanSpeed: 45, response: 20, clicks: 0, openTime: 3.0 },
      word:       { cpuUsage: 24, gpuUsage: 1,  ramUsed: 0.5, fps: 88, temperature: 59, fanSpeed: 43, response: 20, clicks: 0, openTime: 2.5 },
      capcut:     { cpuUsage: 54, gpuUsage: 44, ramUsed: 4.3, fps: 86, temperature: 63, fanSpeed: 55, response: 21, clicks: 0, openTime: 4.1 },
      photopea:   { cpuUsage: 34, gpuUsage: 4,  ramUsed: 1.5, fps: 88, temperature: 61, fanSpeed: 45, response: 20, clicks: 0, openTime: 3.1 },
      pixlr:      { cpuUsage: 32, gpuUsage: 2,  ramUsed: 1.1, fps: 88, temperature: 60, fanSpeed: 45, response: 20, clicks: 0, openTime: 2.9 },
    },
  },
  'probook-4-g1ir': {
    tier: 'C',
    apps: {
      photoshop:  { cpuUsage: 55, gpuUsage: 12, ramUsed: 3.8, fps: 74, temperature: 65, fanSpeed: 55, response: 26, clicks: 0, openTime: 5.0 },
      premiere:   { cpuUsage: 77, gpuUsage: 55, ramUsed: 6.5, fps: 72, temperature: 68, fanSpeed: 66, response: 28, clicks: 0, openTime: 5.6 },
      vscode:     { cpuUsage: 35, gpuUsage: 1,  ramUsed: 0.8, fps: 76, temperature: 62, fanSpeed: 50, response: 26, clicks: 0, openTime: 3.8 },
      blender:    { cpuUsage: 72, gpuUsage: 65, ramUsed: 5.2, fps: 72, temperature: 67, fanSpeed: 68, response: 28, clicks: 0, openTime: 6.2 },
      canva:      { cpuUsage: 37, gpuUsage: 1,  ramUsed: 1.2, fps: 75, temperature: 63, fanSpeed: 51, response: 26, clicks: 0, openTime: 4.0 },
      figma:      { cpuUsage: 42, gpuUsage: 1,  ramUsed: 1.6, fps: 75, temperature: 63, fanSpeed: 52, response: 26, clicks: 0, openTime: 4.2 },
      word:       { cpuUsage: 34, gpuUsage: 1,  ramUsed: 0.5, fps: 76, temperature: 62, fanSpeed: 50, response: 26, clicks: 0, openTime: 3.7 },
      capcut:     { cpuUsage: 64, gpuUsage: 40, ramUsed: 4.3, fps: 73, temperature: 66, fanSpeed: 62, response: 27, clicks: 0, openTime: 5.3 },
      photopea:   { cpuUsage: 44, gpuUsage: 1,  ramUsed: 1.5, fps: 75, temperature: 64, fanSpeed: 52, response: 26, clicks: 0, openTime: 4.3 },
      pixlr:      { cpuUsage: 42, gpuUsage: 1,  ramUsed: 1.1, fps: 75, temperature: 63, fanSpeed: 52, response: 26, clicks: 0, openTime: 4.1 },
    },
  },
  'omnibook-3': {
    tier: 'C',
    apps: {
      photoshop:  { cpuUsage: 55, gpuUsage: 12, ramUsed: 3.8, fps: 74, temperature: 65, fanSpeed: 55, response: 26, clicks: 0, openTime: 5.0 },
      premiere:   { cpuUsage: 77, gpuUsage: 55, ramUsed: 6.5, fps: 72, temperature: 68, fanSpeed: 66, response: 28, clicks: 0, openTime: 5.6 },
      vscode:     { cpuUsage: 35, gpuUsage: 1,  ramUsed: 0.8, fps: 76, temperature: 62, fanSpeed: 50, response: 26, clicks: 0, openTime: 3.8 },
      blender:    { cpuUsage: 72, gpuUsage: 65, ramUsed: 5.2, fps: 72, temperature: 67, fanSpeed: 68, response: 28, clicks: 0, openTime: 6.2 },
      canva:      { cpuUsage: 37, gpuUsage: 1,  ramUsed: 1.2, fps: 75, temperature: 63, fanSpeed: 51, response: 26, clicks: 0, openTime: 4.0 },
      figma:      { cpuUsage: 42, gpuUsage: 1,  ramUsed: 1.6, fps: 75, temperature: 63, fanSpeed: 52, response: 26, clicks: 0, openTime: 4.2 },
      word:       { cpuUsage: 34, gpuUsage: 1,  ramUsed: 0.5, fps: 76, temperature: 62, fanSpeed: 50, response: 26, clicks: 0, openTime: 3.7 },
      capcut:     { cpuUsage: 64, gpuUsage: 40, ramUsed: 4.3, fps: 73, temperature: 66, fanSpeed: 62, response: 27, clicks: 0, openTime: 5.3 },
      photopea:   { cpuUsage: 44, gpuUsage: 1,  ramUsed: 1.5, fps: 75, temperature: 64, fanSpeed: 52, response: 26, clicks: 0, openTime: 4.3 },
      pixlr:      { cpuUsage: 42, gpuUsage: 1,  ramUsed: 1.1, fps: 75, temperature: 63, fanSpeed: 52, response: 26, clicks: 0, openTime: 4.1 },
    },
  },
  'chromebook-plus-14': {
    tier: 'D',
    apps: {
      photoshop:  { cpuUsage: 73, gpuUsage: 8,  ramUsed: 3.8, fps: 54, temperature: 68, fanSpeed: 65, response: 38, clicks: 0, openTime: 8.0 },
      premiere:   { cpuUsage: 95, gpuUsage: 51, ramUsed: 6.5, fps: 53, temperature: 71, fanSpeed: 76, response: 40, clicks: 0, openTime: 8.6 },
      vscode:     { cpuUsage: 53, gpuUsage: 1,  ramUsed: 0.8, fps: 56, temperature: 65, fanSpeed: 60, response: 38, clicks: 0, openTime: 6.8 },
      blender:    { cpuUsage: 90, gpuUsage: 61, ramUsed: 5.2, fps: 53, temperature: 70, fanSpeed: 78, response: 40, clicks: 0, openTime: 9.2 },
      canva:      { cpuUsage: 55, gpuUsage: 1,  ramUsed: 1.2, fps: 56, temperature: 66, fanSpeed: 61, response: 38, clicks: 0, openTime: 7.0 },
      figma:      { cpuUsage: 60, gpuUsage: 1,  ramUsed: 1.6, fps: 55, temperature: 66, fanSpeed: 62, response: 38, clicks: 0, openTime: 7.2 },
      word:       { cpuUsage: 52, gpuUsage: 1,  ramUsed: 0.5, fps: 56, temperature: 65, fanSpeed: 60, response: 38, clicks: 0, openTime: 6.7 },
      capcut:     { cpuUsage: 82, gpuUsage: 36, ramUsed: 4.3, fps: 54, temperature: 69, fanSpeed: 72, response: 39, clicks: 0, openTime: 8.3 },
      photopea:   { cpuUsage: 62, gpuUsage: 1,  ramUsed: 1.5, fps: 55, temperature: 67, fanSpeed: 62, response: 38, clicks: 0, openTime: 7.3 },
      pixlr:      { cpuUsage: 60, gpuUsage: 1,  ramUsed: 1.1, fps: 55, temperature: 66, fanSpeed: 62, response: 38, clicks: 0, openTime: 7.1 },
    },
  },
};

export function getBenchmarkData(laptopId: string, appId: string): BenchmarkMetrics | null {
  const laptop = BENCHMARK_DATA[laptopId];
  if (!laptop) return null;
  return laptop.apps[appId] || null;
}
