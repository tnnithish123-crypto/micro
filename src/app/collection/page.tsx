"use client";

import { useState, useEffect, useMemo, useCallback, Suspense } from "react";
import { products, series as allSeries, type Product } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import QuickViewModal from "@/components/QuickViewModal";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  Grid,
  List,
  Filter,
  Package,
} from "lucide-react";

const PRICE_RANGES = [
  { label: "Under $500", min: 0, max: 499 },
  { label: "$500 - $1000", min: 500, max: 1000 },
  { label: "$1000 - $1500", min: 1000, max: 1500 },
  { label: "$1500 - $2000", min: 1500, max: 2000 },
  { label: "$2000+", min: 2000, max: Infinity },
];

const RAM_OPTIONS = [8, 16, 32, 64];
const STORAGE_OPTIONS = ["256GB", "512GB", "1TB", "2TB+"];
const DISPLAY_SIZE_OPTIONS = ['13-14"', '15-16"', '17"+'];
const CATEGORY_OPTIONS = ["Student", "Business", "Gaming", "Creator", "Everyday"];
const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "popular", label: "Most Popular" },
];

function parseStorageBytes(storage: string): number {
  const match = storage.match(/([\d.]+)\s*(TB|GB)/i);
  if (!match) return 0;
  const num = parseFloat(match[1]);
  const unit = match[2].toUpperCase();
  return unit === "TB" ? num * 1024 : num;
}

function parseBatteryHours(batteryLife: string): number {
  const match = batteryLife.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

function parseDisplaySizeInches(displaySize: string): number {
  const match = displaySize.match(/([\d.]+)/);
  return match ? parseFloat(match[1]) : 0;
}

function CollectionContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("q") || ""
  );
  const [selectedSeries, setSelectedSeries] = useState<string[]>(
    searchParams.get("series")
      ? searchParams.get("series")!.split(",")
      : []
  );
  const [processorBrand, setProcessorBrand] = useState<
    "Intel" | "AMD" | "all"
  >(
    (searchParams.get("processor") as "Intel" | "AMD" | "all") || "all"
  );
  const [selectedRam, setSelectedRam] = useState<number[]>(
    searchParams.get("ram")
      ? searchParams.get("ram")!.split(",").map(Number)
      : []
  );
  const [selectedStorage, setSelectedStorage] = useState<string[]>(
    searchParams.get("storage")
      ? searchParams.get("storage")!.split(",")
      : []
  );
  const [selectedDisplaySize, setSelectedDisplaySize] = useState<string[]>(
    searchParams.get("display")
      ? searchParams.get("display")!.split(",")
      : []
  );
  const [selectedCategory, setSelectedCategory] = useState<string[]>(
    searchParams.get("category")
      ? searchParams.get("category")!.split(",")
      : []
  );
  const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(
    searchParams.get("price") || null
  );
  const [inStockOnly, setInStockOnly] = useState(
    searchParams.get("inStock") === "true"
  );
  const [touchOnly, setTouchOnly] = useState(
    searchParams.get("touch") === "true"
  );
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "newest");
  const [showCount, setShowCount] = useState(12);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(
    null
  );

  const updateURL = useCallback(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (selectedSeries.length > 0)
      params.set("series", selectedSeries.join(","));
    if (processorBrand !== "all")
      params.set("processor", processorBrand);
    if (selectedRam.length > 0) params.set("ram", selectedRam.join(","));
    if (selectedStorage.length > 0)
      params.set("storage", selectedStorage.join(","));
    if (selectedDisplaySize.length > 0)
      params.set("display", selectedDisplaySize.join(","));
    if (selectedCategory.length > 0)
      params.set("category", selectedCategory.join(","));
    if (selectedPriceRange) params.set("price", selectedPriceRange);
    if (inStockOnly) params.set("inStock", "true");
    if (touchOnly) params.set("touch", "true");
    if (sortBy !== "newest") params.set("sort", sortBy);

    const queryString = params.toString();
    const newURL = queryString ? `/collection?${queryString}` : "/collection";
    router.replace(newURL, { scroll: false });
  }, [
    searchQuery,
    selectedSeries,
    processorBrand,
    selectedRam,
    selectedStorage,
    selectedDisplaySize,
    selectedCategory,
    selectedPriceRange,
    inStockOnly,
    touchOnly,
    sortBy,
    router,
  ]);

  useEffect(() => {
    updateURL();
  }, [updateURL]);

  const toggleArrayFilter = useCallback(
    <T extends string | number>(arr: T[], value: T): T[] => {
      return arr.includes(value)
        ? arr.filter((v) => v !== value)
        : [...arr, value];
    },
    []
  );

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.series.toLowerCase().includes(q) ||
          p.processor.toLowerCase().includes(q) ||
          p.gpu.toLowerCase().includes(q)
      );
    }

    if (selectedSeries.length > 0) {
      result = result.filter((p) => selectedSeries.includes(p.series));
    }

    if (processorBrand !== "all") {
      result = result.filter(
        (p) => p.processorBrand === processorBrand
      );
    }

    if (selectedRam.length > 0) {
      result = result.filter((p) => selectedRam.includes(p.ram));
    }

    if (selectedStorage.length > 0) {
      result = result.filter((p) => {
        const storageGB = parseStorageBytes(p.storage);
        return selectedStorage.some((opt) => {
          if (opt === "2TB+") return storageGB >= 2048;
          const optGB = parseInt(opt);
          return storageGB >= optGB && storageGB < optGB + 1;
        });
      });
    }

    if (selectedDisplaySize.length > 0) {
      result = result.filter((p) => {
        const inches = parseDisplaySizeInches(p.displaySize);
        return selectedDisplaySize.some((opt) => {
          if (opt === '13-14"') return inches >= 13 && inches <= 14;
          if (opt === '15-16"') return inches >= 15 && inches <= 16.5;
          if (opt === '17"+') return inches >= 17;
          return false;
        });
      });
    }

    if (selectedCategory.length > 0) {
      result = result.filter((p) => selectedCategory.includes(p.category));
    }

    if (selectedPriceRange) {
      const range = PRICE_RANGES.find((r) => r.label === selectedPriceRange);
      if (range) {
        result = result.filter(
          (p) => p.price >= range.min && p.price <= range.max
        );
      }
    }

    if (inStockOnly) {
      result = result.filter((p) => p.stock === "in-stock");
    }

    if (touchOnly) {
      result = result.filter((p) => p.touchSupport);
    }

    switch (sortBy) {
      case "newest":
        result.sort((a, b) => b.releaseYear - a.releaseYear);
        break;
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "popular":
        result.sort((a, b) => b.reviews - a.reviews);
        break;
    }

    return result;
  }, [
    searchQuery,
    selectedSeries,
    processorBrand,
    selectedRam,
    selectedStorage,
    selectedDisplaySize,
    selectedCategory,
    selectedPriceRange,
    inStockOnly,
    touchOnly,
    sortBy,
  ]);

  const visibleProducts = useMemo(
    () => filteredProducts.slice(0, showCount),
    [filteredProducts, showCount]
  );

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedSeries.length > 0) count++;
    if (processorBrand !== "all") count++;
    if (selectedRam.length > 0) count++;
    if (selectedStorage.length > 0) count++;
    if (selectedDisplaySize.length > 0) count++;
    if (selectedCategory.length > 0) count++;
    if (selectedPriceRange) count++;
    if (inStockOnly) count++;
    if (touchOnly) count++;
    return count;
  }, [
    selectedSeries,
    processorBrand,
    selectedRam,
    selectedStorage,
    selectedDisplaySize,
    selectedCategory,
    selectedPriceRange,
    inStockOnly,
    touchOnly,
  ]);

  const activeChips = useMemo(() => {
    const chips: { key: string; label: string; clear: () => void }[] = [];
    selectedSeries.forEach((s) =>
      chips.push({
        key: `series-${s}`,
        label: s,
        clear: () => setSelectedSeries((prev) => prev.filter((v) => v !== s)),
      })
    );
    if (processorBrand !== "all") {
      chips.push({
        key: "processor",
        label: processorBrand,
        clear: () => setProcessorBrand("all"),
      });
    }
    selectedRam.forEach((r) =>
      chips.push({
        key: `ram-${r}`,
        label: `${r} GB RAM`,
        clear: () => setSelectedRam((prev) => prev.filter((v) => v !== r)),
      })
    );
    selectedStorage.forEach((s) =>
      chips.push({
        key: `storage-${s}`,
        label: s,
        clear: () =>
          setSelectedStorage((prev) => prev.filter((v) => v !== s)),
      })
    );
    selectedDisplaySize.forEach((d) =>
      chips.push({
        key: `display-${d}`,
        label: d,
        clear: () =>
          setSelectedDisplaySize((prev) => prev.filter((v) => v !== d)),
      })
    );
    selectedCategory.forEach((c) =>
      chips.push({
        key: `category-${c}`,
        label: c,
        clear: () =>
          setSelectedCategory((prev) => prev.filter((v) => v !== c)),
      })
    );
    if (selectedPriceRange) {
      chips.push({
        key: "price",
        label: selectedPriceRange,
        clear: () => setSelectedPriceRange(null),
      });
    }
    if (inStockOnly) {
      chips.push({
        key: "inStock",
        label: "In Stock Only",
        clear: () => setInStockOnly(false),
      });
    }
    if (touchOnly) {
      chips.push({
        key: "touch",
        label: "Touch Support",
        clear: () => setTouchOnly(false),
      });
    }
    return chips;
  }, [
    selectedSeries,
    processorBrand,
    selectedRam,
    selectedStorage,
    selectedDisplaySize,
    selectedCategory,
    selectedPriceRange,
    inStockOnly,
    touchOnly,
  ]);

  const clearAllFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedSeries([]);
    setProcessorBrand("all");
    setSelectedRam([]);
    setSelectedStorage([]);
    setSelectedDisplaySize([]);
    setSelectedCategory([]);
    setSelectedPriceRange(null);
    setInStockOnly(false);
    setTouchOnly(false);
    setSortBy("newest");
    setShowCount(12);
  }, []);

  const getSeriesCount = useCallback(
    (seriesName: string) =>
      products.filter((p) => p.series === seriesName).length,
    []
  );

  const sidebarContent = (
    <div className="flex flex-col gap-6">
      <div>
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-hp-gray-400"
          />
          <input
            type="text"
            placeholder="Search laptops..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-hp-gray-200 bg-white focus:border-hp-blue focus:ring-2 focus:ring-hp-blue/20 outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-hp-gray-400 hover:text-hp-gray-600"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-hp-navy mb-3">Series</h3>
        <div className="flex flex-col gap-2">
          {allSeries.map((s) => (
            <label
              key={s}
              className="flex items-center gap-2.5 text-sm text-hp-gray-600 hover:text-hp-navy cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedSeries.includes(s)}
                onChange={() =>
                  setSelectedSeries((prev) => toggleArrayFilter(prev, s))
                }
                className="w-4 h-4 rounded border-hp-gray-300 text-hp-blue focus:ring-hp-blue/20"
              />
              <span className="flex-1">{s}</span>
              <span className="text-xs text-hp-gray-400">
                ({getSeriesCount(s)})
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-hp-navy mb-3">
          Processor Brand
        </h3>
        <div className="flex gap-2">
          {(["all", "Intel", "AMD"] as const).map((brand) => (
            <button
              key={brand}
              onClick={() => setProcessorBrand(brand)}
              className={`flex-1 px-3 py-2 text-xs font-medium rounded-lg border transition-all ${
                processorBrand === brand
                  ? "bg-hp-blue text-white border-hp-blue"
                  : "border-hp-gray-200 text-hp-gray-600 hover:border-hp-blue hover:text-hp-blue"
              }`}
            >
              {brand === "all" ? "All" : brand}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-hp-navy mb-3">RAM</h3>
        <div className="flex flex-col gap-2">
          {RAM_OPTIONS.map((ram) => (
            <label
              key={ram}
              className="flex items-center gap-2.5 text-sm text-hp-gray-600 hover:text-hp-navy cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedRam.includes(ram)}
                onChange={() =>
                  setSelectedRam((prev) => toggleArrayFilter(prev, ram))
                }
                className="w-4 h-4 rounded border-hp-gray-300 text-hp-blue focus:ring-hp-blue/20"
              />
              <span>{ram} GB</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-hp-navy mb-3">Storage</h3>
        <div className="flex flex-col gap-2">
          {STORAGE_OPTIONS.map((storage) => (
            <label
              key={storage}
              className="flex items-center gap-2.5 text-sm text-hp-gray-600 hover:text-hp-navy cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedStorage.includes(storage)}
                onChange={() =>
                  setSelectedStorage((prev) => toggleArrayFilter(prev, storage))
                }
                className="w-4 h-4 rounded border-hp-gray-300 text-hp-blue focus:ring-hp-blue/20"
              />
              <span>{storage}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-hp-navy mb-3">
          Display Size
        </h3>
        <div className="flex flex-col gap-2">
          {DISPLAY_SIZE_OPTIONS.map((size) => (
            <label
              key={size}
              className="flex items-center gap-2.5 text-sm text-hp-gray-600 hover:text-hp-navy cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedDisplaySize.includes(size)}
                onChange={() =>
                  setSelectedDisplaySize((prev) =>
                    toggleArrayFilter(prev, size)
                  )
                }
                className="w-4 h-4 rounded border-hp-gray-300 text-hp-blue focus:ring-hp-blue/20"
              />
              <span>{size}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-hp-navy mb-3">Category</h3>
        <div className="flex flex-col gap-2">
          {CATEGORY_OPTIONS.map((cat) => (
            <label
              key={cat}
              className="flex items-center gap-2.5 text-sm text-hp-gray-600 hover:text-hp-navy cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedCategory.includes(cat)}
                onChange={() =>
                  setSelectedCategory((prev) => toggleArrayFilter(prev, cat))
                }
                className="w-4 h-4 rounded border-hp-gray-300 text-hp-blue focus:ring-hp-blue/20"
              />
              <span>{cat}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-hp-navy mb-3">Price Range</h3>
        <div className="flex flex-col gap-2">
          {PRICE_RANGES.map((range) => (
            <label
              key={range.label}
              className="flex items-center gap-2.5 text-sm text-hp-gray-600 hover:text-hp-navy cursor-pointer transition-colors"
            >
              <input
                type="radio"
                name="priceRange"
                checked={selectedPriceRange === range.label}
                onChange={() =>
                  setSelectedPriceRange((prev) =>
                    prev === range.label ? null : range.label
                  )
                }
                className="w-4 h-4 border-hp-gray-300 text-hp-blue focus:ring-hp-blue/20"
              />
              <span>{range.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-sm font-medium text-hp-gray-700">
            In Stock Only
          </span>
          <button
            onClick={() => setInStockOnly(!inStockOnly)}
            className={`relative w-11 h-6 rounded-full transition-colors ${
              inStockOnly ? "bg-hp-blue" : "bg-hp-gray-300"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                inStockOnly ? "translate-x-5" : ""
              }`}
            />
          </button>
        </label>
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-sm font-medium text-hp-gray-700">
            Touch Support
          </span>
          <button
            onClick={() => setTouchOnly(!touchOnly)}
            className={`relative w-11 h-6 rounded-full transition-colors ${
              touchOnly ? "bg-hp-blue" : "bg-hp-gray-300"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                touchOnly ? "translate-x-5" : ""
              }`}
            />
          </button>
        </label>
      </div>

      {activeFilterCount > 0 && (
        <button
          onClick={clearAllFilters}
          className="w-full py-2.5 text-sm font-medium text-hp-danger border border-hp-danger/30 rounded-xl hover:bg-hp-danger/5 transition-colors"
        >
          Clear All Filters ({activeFilterCount})
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
        <nav className="flex items-center gap-1.5 text-sm text-hp-gray-500 mb-8">
          <Link href="/" className="hover:text-hp-blue transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-hp-navy font-medium">Collection</span>
        </nav>

        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-hp-navy mb-2">
            HP Collection
          </h1>
          <p className="text-hp-gray-500 text-sm sm:text-base">
            Browse the complete range of HP laptops. Find the perfect device
            for work, play, or creativity.
          </p>
          <p className="text-hp-gray-400 text-sm mt-1">
            {filteredProducts.length} product
            {filteredProducts.length !== 1 ? "s" : ""} found
          </p>
        </div>

        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="lg:hidden flex items-center gap-2 px-4 py-2.5 mb-6 text-sm font-medium text-hp-gray-700 border border-hp-gray-200 rounded-xl hover:border-hp-blue hover:text-hp-blue transition-colors"
        >
          <SlidersHorizontal size={16} />
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-1 px-2 py-0.5 text-[10px] font-bold text-white bg-hp-blue rounded-full">
              {activeFilterCount}
            </span>
          )}
        </button>

        <div className="flex gap-8">
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2 pb-4">
              {sidebarContent}
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4 gap-3">
              <span className="text-sm text-hp-gray-500 shrink-0">
                Showing {visibleProducts.length} of {filteredProducts.length}
              </span>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none pl-3 pr-8 py-2 text-sm rounded-lg border border-hp-gray-200 bg-white text-hp-gray-700 focus:border-hp-blue focus:ring-2 focus:ring-hp-blue/20 outline-none cursor-pointer"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-hp-gray-400 pointer-events-none"
                  />
                </div>
              </div>
            </div>

            {activeChips.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {activeChips.map((chip) => (
                  <span
                    key={chip.key}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-hp-blue bg-hp-blue-light rounded-full"
                  >
                    {chip.label}
                    <button
                      onClick={chip.clear}
                      className="hover:text-hp-blue-dark transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
                <button
                  onClick={clearAllFilters}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-hp-danger hover:text-hp-danger/80 transition-colors"
                >
                  Clear All
                </button>
              </div>
            )}

            {visibleProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {visibleProducts.map((product, index) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      index={index}
                    />
                  ))}
                </div>

                {showCount < filteredProducts.length && (
                  <div className="flex justify-center mt-10">
                    <button
                      onClick={() => setShowCount((prev) => prev + 12)}
                      className="px-8 py-3 text-sm font-medium text-hp-blue border-2 border-hp-blue rounded-xl hover:bg-hp-blue hover:text-white transition-all duration-200"
                    >
                      Load More (
                      {Math.min(
                        12,
                        filteredProducts.length - showCount
                      )}{" "}
                      more)
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Package size={64} className="text-hp-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-hp-navy mb-2">
                  No Products Found
                </h3>
                <p className="text-hp-gray-500 text-sm max-w-md mb-6">
                  We could not find any laptops matching your current filters.
                  Try adjusting your search criteria or clearing all filters.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-2.5 text-sm font-medium text-white bg-hp-blue rounded-xl hover:bg-hp-blue-dark transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
              onClick={() => setMobileFiltersOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-[60] w-80 max-w-[85vw] bg-white shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-hp-gray-100">
                <div className="flex items-center gap-2">
                  <Filter size={18} className="text-hp-blue" />
                  <h2 className="text-lg font-semibold text-hp-navy">
                    Filters
                  </h2>
                  {activeFilterCount > 0 && (
                    <span className="px-2 py-0.5 text-[10px] font-bold text-white bg-hp-blue rounded-full">
                      {activeFilterCount}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-2 text-hp-gray-400 hover:text-hp-gray-700 hover:bg-hp-gray-100 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-5">
                {sidebarContent}
              </div>

              <div className="px-5 py-4 border-t border-hp-gray-100 flex gap-3">
                <button
                  onClick={clearAllFilters}
                  className="flex-1 py-2.5 text-sm font-medium text-hp-gray-600 border border-hp-gray-200 rounded-xl hover:bg-hp-gray-50 transition-colors"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="flex-1 py-2.5 text-sm font-medium text-white bg-hp-blue rounded-xl hover:bg-hp-blue-dark transition-colors"
                >
                  Apply ({filteredProducts.length} results)
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          isOpen={!!quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
}

export default function CollectionPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hp-blue" /></div>}>
      <CollectionContent />
    </Suspense>
  );
}
