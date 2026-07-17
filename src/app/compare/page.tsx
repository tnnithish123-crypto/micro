"use client";

import { useState, useMemo } from "react";
import { products, type Product } from "@/data/products";
import { useCompare } from "@/components/AppProviders";
import ProductCard from "@/components/ProductCard";
import SimulationModal from "@/components/SimulationModal";
import Link from "next/link";
import { motion } from "framer-motion";
import { X, Plus, Trash2, CheckCircle, ArrowLeft, Laptop, Zap } from "lucide-react";

interface SpecRow {
  label: string;
  getValue: (p: Product) => string;
  bestMode?: "lowest" | "highest";
  getNumeric?: (p: Product) => number;
}

interface SpecSection {
  title: string;
  rows: SpecRow[];
}

const SPEC_SECTIONS: SpecSection[] = [
  {
    title: "Pricing & Value",
    rows: [
      {
        label: "Price",
        getValue: (p) => `$${p.price.toLocaleString()}`,
        bestMode: "lowest",
        getNumeric: (p) => p.price,
      },
      {
        label: "Rating",
        getValue: (p) => `${p.rating} / 5`,
        bestMode: "highest",
        getNumeric: (p) => p.rating,
      },
      {
        label: "Reviews",
        getValue: (p) => p.reviews.toLocaleString(),
        bestMode: "highest",
        getNumeric: (p) => p.reviews,
      },
      {
        label: "Warranty",
        getValue: (p) => p.warranty,
      },
    ],
  },
  {
    title: "Performance",
    rows: [
      {
        label: "Processor",
        getValue: (p) => p.processor,
      },
      {
        label: "Processor Generation",
        getValue: (p) => p.processorGeneration,
      },
      {
        label: "GPU",
        getValue: (p) => p.gpu,
      },
      {
        label: "RAM",
        getValue: (p) => `${p.ram} GB ${p.ramType}`,
        bestMode: "highest",
        getNumeric: (p) => p.ram,
      },
      {
        label: "AI Features",
        getValue: (p) =>
          p.aiFeatures.length > 0 ? p.aiFeatures.join(", ") : "None",
      },
    ],
  },
  {
    title: "Storage",
    rows: [
      {
        label: "Storage",
        getValue: (p) => p.storage,
        bestMode: "highest",
        getNumeric: (p) => {
          const match = p.storage.match(/([\d.]+)\s*(TB|GB)/i);
          if (!match) return 0;
          const num = parseFloat(match[1]);
          return match[2].toUpperCase() === "TB" ? num * 1024 : num;
        },
      },
      {
        label: "Expandable Storage",
        getValue: (p) => p.expandableStorage || "N/A",
      },
    ],
  },
  {
    title: "Display",
    rows: [
      {
        label: "Display Size",
        getValue: (p) => p.displaySize,
      },
      {
        label: "Resolution",
        getValue: (p) => p.resolution,
      },
      {
        label: "Panel Type",
        getValue: (p) => p.panelType,
      },
      {
        label: "Refresh Rate",
        getValue: (p) => `${p.refreshRate} Hz`,
        bestMode: "highest",
        getNumeric: (p) => p.refreshRate,
      },
      {
        label: "Brightness",
        getValue: (p) => `${p.brightness} nits`,
        bestMode: "highest",
        getNumeric: (p) => p.brightness,
      },
      {
        label: "Touch Support",
        getValue: (p) => (p.touchSupport ? "Yes" : "No"),
      },
    ],
  },
  {
    title: "Battery & Portability",
    rows: [
      {
        label: "Battery Life",
        getValue: (p) => p.batteryLife,
        bestMode: "highest",
        getNumeric: (p) => {
          const match = p.batteryLife.match(/(\d+)/);
          return match ? parseInt(match[1], 10) : 0;
        },
      },
      {
        label: "Weight",
        getValue: (p) => `${p.weight} kg`,
        bestMode: "lowest",
        getNumeric: (p) => p.weight,
      },
      {
        label: "Charging Speed",
        getValue: (p) => p.chargingSpeed,
      },
    ],
  },
  {
    title: "Connectivity",
    rows: [
      {
        label: "WiFi",
        getValue: (p) => p.wifiVersion,
      },
      {
        label: "Bluetooth",
        getValue: (p) => p.bluetooth,
      },
      {
        label: "Ports",
        getValue: (p) => p.ports.join(", "),
      },
      {
        label: "Webcam",
        getValue: (p) => p.webcam,
      },
      {
        label: "Fingerprint",
        getValue: (p) => (p.fingerprint ? "Yes" : "No"),
      },
      {
        label: "Keyboard Backlight",
        getValue: (p) => (p.keyboardBacklight ? "Yes" : "No"),
      },
    ],
  },
  {
    title: "General",
    rows: [
      {
        label: "Operating System",
        getValue: (p) => p.operatingSystem,
      },
      {
        label: "Release Year",
        getValue: (p) => p.releaseYear.toString(),
        bestMode: "highest",
        getNumeric: (p) => p.releaseYear,
      },
    ],
  },
];

function getBestIndices(
  items: Product[],
  rows: SpecRow[]
): Map<string, number> {
  const bests = new Map<string, number>();
  for (const row of rows) {
    if (!row.bestMode || !row.getNumeric) continue;
    let bestIdx = -1;
    let bestVal = row.bestMode === "lowest" ? Infinity : -Infinity;
    items.forEach((item, idx) => {
      const val = row.getNumeric!(item);
      if (row.bestMode === "lowest" && val < bestVal) {
        bestVal = val;
        bestIdx = idx;
      } else if (row.bestMode === "highest" && val > bestVal) {
        bestVal = val;
        bestIdx = idx;
      }
    });
    if (bestIdx >= 0) {
      bests.set(row.label, bestIdx);
    }
  }
  return bests;
}

export default function ComparePage() {
  const { items, removeFromCompare, clearCompare } = useCompare();
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [showSimulation, setShowSimulation] = useState(false);

  const comparedProducts = useMemo(() => {
    return items
      .map((item) => products.find((p) => p.id === item.id))
      .filter((p): p is Product => p !== undefined);
  }, [items]);

  const suggestions = useMemo(() => {
    const inCompare = new Set(comparedProducts.map((p) => p.id));
    return products
      .filter((p) => !inCompare.has(p.id))
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);
  }, [comparedProducts]);

  const bestValues = useMemo(() => {
    if (comparedProducts.length < 2) return new Map<string, number>();
    const allBests = new Map<string, number>();
    for (const section of SPEC_SECTIONS) {
      const sectionBests = getBestIndices(comparedProducts, section.rows);
      for (const [key, val] of sectionBests) {
        allBests.set(key, val);
      }
    }
    return allBests;
  }, [comparedProducts]);

  if (comparedProducts.length === 0) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
          <nav className="flex items-center gap-1.5 text-sm text-hp-gray-500 mb-8">
            <Link href="/" className="hover:text-hp-blue transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-hp-navy font-medium">Compare</span>
          </nav>

          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 rounded-full bg-hp-blue-light flex items-center justify-center mb-6">
              <Laptop size={48} className="text-hp-blue" />
            </div>
            <h1 className="text-3xl font-bold text-hp-navy mb-3">
              No Products to Compare
            </h1>
            <p className="text-hp-gray-500 text-sm max-w-md mb-8">
              Add up to 4 laptops to see a detailed side-by-side comparison of
              specifications, features, and pricing.
            </p>
            <Link
              href="/collection"
              className="inline-flex items-center gap-2 px-6 py-3 bg-hp-blue text-white rounded-xl font-medium hover:bg-hp-blue-dark transition-colors"
            >
              <ArrowLeft size={16} />
              Browse Collection
            </Link>
          </div>

          {suggestions.length > 0 && (
            <section className="mt-8">
              <h2 className="text-xl font-semibold text-hp-navy mb-6">
                Suggested Products
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {suggestions.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative"
                  >
                    <ProductCard product={product} index={index} />
                  </motion.div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
        <nav className="flex items-center gap-1.5 text-sm text-hp-gray-500 mb-8">
          <Link href="/" className="hover:text-hp-blue transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-hp-navy font-medium">Compare</span>
        </nav>

        <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-hp-navy mb-1">
              Compare Laptops
            </h1>
            <p className="text-hp-gray-500 text-sm">
              Comparing {comparedProducts.length} of 4 products. Best values are
              highlighted in green.
            </p>
          </div>
          <div className="flex gap-3">
            {comparedProducts.length < 4 && (
              <Link
                href="/collection"
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-hp-blue border border-hp-blue/30 rounded-xl hover:bg-hp-blue/5 transition-colors"
              >
                <Plus size={16} />
                Add More
              </Link>
            )}
            <button
              onClick={clearCompare}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-hp-danger border border-hp-danger/30 rounded-xl hover:bg-hp-danger/5 transition-colors"
            >
              <Trash2 size={16} />
              Clear All
            </button>
          </div>
        </div>

        <div className="overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr>
                <th className="sticky left-0 z-10 bg-white w-44 sm:w-52 p-3 text-left" />
                {comparedProducts.map((product) => (
                  <th key={product.id} className="p-3 text-center w-[200px]">
                    <div className="relative flex flex-col items-center gap-3">
                      <button
                        onClick={() => removeFromCompare(product.id)}
                        className="absolute -top-1 -right-1 p-1.5 text-hp-gray-400 hover:text-hp-danger hover:bg-hp-danger/10 rounded-lg transition-colors"
                        title="Remove from Compare"
                      >
                        <X size={14} />
                      </button>
                      <div className="w-full aspect-[4/3] rounded-xl bg-gradient-to-br from-hp-blue-light via-hp-blue/10 to-hp-navy/5 flex items-center justify-center">
                        <Laptop
                          size={48}
                          className="text-hp-blue/30"
                          strokeWidth={1}
                        />
                      </div>
                      <div className="text-center">
                        <span className="text-[11px] font-medium text-hp-blue bg-hp-blue/10 px-2 py-0.5 rounded-full">
                          {product.series}
                        </span>
                        <h3 className="text-sm font-semibold text-hp-navy mt-1.5 line-clamp-2">
                          {product.name}
                        </h3>
                      </div>
                    </div>
                  </th>
                ))}
                {comparedProducts.length < 4 && (
                  <th className="p-3 text-center w-[200px]">
                    <Link
                      href="/collection"
                      className="flex flex-col items-center justify-center gap-3 h-full min-h-[180px] rounded-xl border-2 border-dashed border-hp-gray-200 text-hp-gray-400 hover:border-hp-blue hover:text-hp-blue transition-colors"
                    >
                      <Plus size={32} />
                      <span className="text-xs font-medium">
                        Add Product
                      </span>
                    </Link>
                  </th>
                )}
              </tr>
            </thead>

            <tbody>
              {SPEC_SECTIONS.map((section) => (
                <SectionBody
                  key={section.title}
                  section={section}
                  items={comparedProducts}
                  bestValues={bestValues}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Performance Simulation Button */}
        {comparedProducts.length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8"
          >
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border border-blue-100 p-6 sm:p-8">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-indigo-500/10 to-transparent rounded-full translate-y-1/2 -translate-x-1/2" />
              <div className="relative flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/25">
                  <Zap size={24} className="text-white" />
                </div>
                <div className="text-center sm:text-left flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    Interactive Performance Simulation
                  </h3>
                  <p className="text-sm text-gray-500">
                    Run {33} real-world benchmarks side by side — system boot, creative apps,
                    gaming FPS, AI workloads, and more. See live CPU, GPU, RAM, and temperature
                    metrics in real time.
                  </p>
                </div>
                <button
                  onClick={() => setShowSimulation(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/25 shrink-0"
                >
                  <Zap size={16} />
                  Start Simulation
                </button>
              </div>
              <p className="relative mt-4 text-[10px] text-amber-600 flex items-start gap-1.5">
                <span className="shrink-0 mt-0.5">⚠</span>
                Simulation based on hardware specifications and benchmark estimates.
              </p>
            </div>
          </motion.div>
        )}

        <SimulationModal
          isOpen={showSimulation}
          onClose={() => setShowSimulation(false)}
          laptop1={comparedProducts[0]}
          laptop2={comparedProducts[1]}
        />
      </div>
    </div>
  );
}

function SectionBody({
  section,
  items,
  bestValues,
}: {
  section: SpecSection;
  items: Product[];
  bestValues: Map<string, number>;
}) {
  return (
    <>
      <tr>
        <td
          colSpan={items.length + 1}
          className="pt-6 pb-2 px-3"
        >
          <h3 className="text-sm font-bold text-hp-navy uppercase tracking-wider">
            {section.title}
          </h3>
        </td>
      </tr>
      {section.rows.map((row, rowIdx) => (
        <tr
          key={row.label}
          className={
            rowIdx % 2 === 0
              ? "bg-hp-gray-50/60"
              : "bg-white"
          }
        >
          <td className="sticky left-0 z-10 bg-inherit px-4 py-3 text-sm font-medium text-hp-gray-600 whitespace-nowrap">
            {row.label}
          </td>
          {items.map((product, idx) => {
            const isBest = bestValues.get(row.label) === idx;
            return (
              <td
                key={product.id}
                className={`px-4 py-3 text-center text-sm ${
                  isBest
                    ? "bg-hp-success/10 text-hp-success font-semibold"
                    : "text-hp-gray-700"
                }`}
              >
                <span className="inline-flex items-center gap-1.5">
                  {isBest && (
                    <CheckCircle size={14} className="text-hp-success shrink-0" />
                  )}
                  <span className="line-clamp-2">{row.getValue(product)}</span>
                </span>
              </td>
            );
          })}
        </tr>
      ))}
    </>
  );
}
