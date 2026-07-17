"use client";

import { useState, useEffect, useMemo, useCallback, useRef, Suspense } from "react";
import { products, type Product } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import ScrollReveal from "@/components/ScrollReveal";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  TrendingUp,
  Clock,
  Tag,
  Cpu,
  SearchX,
} from "lucide-react";

const POPULAR_CATEGORIES = [
  { name: "Student", href: "/collection?category=Student" },
  { name: "Business", href: "/collection?category=Business" },
  { name: "Gaming", href: "/collection?category=Gaming" },
  { name: "Creator", href: "/collection?category=Creator" },
  { name: "Everyday", href: "/collection?category=Everyday" },
];

const POPULAR_PROCESSORS = [
  "Intel Core i9-14900HX",
  "Intel Core Ultra 7 155H",
  "AMD Ryzen 9 8945HS",
  "Intel Core i7-14700HX",
  "AMD Ryzen 7 8840U",
];

const MAX_RECENT = 5;
const RECENT_KEY = "hp-recent-searches";
const DEBOUNCE_MS = 300;

type SortOption = "relevance" | "price" | "rating";

function scoreProduct(p: Product, q: string): number {
  const lower = q.toLowerCase();
  let score = 0;
  if (p.name.toLowerCase().includes(lower)) score += 10;
  if (p.series.toLowerCase() === lower) score += 8;
  if (p.series.toLowerCase().includes(lower)) score += 6;
  if (p.processor.toLowerCase().includes(lower)) score += 5;
  if (p.gpu.toLowerCase().includes(lower)) score += 4;
  if (p.category.toLowerCase().includes(lower)) score += 5;
  if (p.badges?.some((b) => b.toLowerCase().includes(lower))) score += 3;
  if (p.ramType.toLowerCase().includes(lower)) score += 2;
  if (p.storage.toLowerCase().includes(lower)) score += 2;
  return score;
}

function loadRecent(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveRecent(query: string) {
  if (typeof window === "undefined" || !query.trim()) return;
  try {
    const list = loadRecent().filter(
      (s) => s.toLowerCase() !== query.toLowerCase()
    );
    list.unshift(query.trim());
    localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, MAX_RECENT)));
  } catch {}
}

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const initialQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [sort, setSort] = useState<SortOption>("relevance");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    inputRef.current?.focus();
    setRecentSearches(loadRecent());
  }, []);

  useEffect(() => {
    const id = setTimeout(() => setDebouncedQuery(query), DEBOUNCE_MS);
    return () => clearTimeout(id);
  }, [query]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedQuery.trim()) params.set("q", debouncedQuery.trim());
    router.replace(`/search${params.toString() ? "?" + params.toString() : ""}`, { scroll: false });
  }, [debouncedQuery, router]);

  const trendingProducts = useMemo(
    () => [...products].sort((a, b) => b.rating - a.rating).slice(0, 4),
    []
  );

  const results = useMemo(() => {
    const q = debouncedQuery.trim();
    if (!q) return [];
    const scored = products.map((p) => ({ product: p, score: scoreProduct(p, q) }));
    const matched = scored.filter((s) => s.score > 0);
    switch (sort) {
      case "price":
        return matched.sort((a, b) => a.product.price - b.product.price).map((s) => s.product);
      case "rating":
        return matched.sort((a, b) => b.product.rating - a.product.rating).map((s) => s.product);
      default:
        return matched.sort((a, b) => b.score - a.score).map((s) => s.product);
    }
  }, [debouncedQuery, sort]);

  const isSearching = debouncedQuery.trim().length > 0;

  const handleRecentClick = useCallback((term: string) => {
    setQuery(term);
  }, []);

  const clearRecent = useCallback(() => {
    localStorage.removeItem(RECENT_KEY);
    setRecentSearches([]);
  }, []);

  const handleSearchBlur = useCallback(() => {
    if (debouncedQuery.trim()) {
      saveRecent(debouncedQuery.trim());
      setRecentSearches(loadRecent());
    }
  }, [debouncedQuery]);

  return (
    <div className="min-h-screen bg-hp-gray-50">
      {/* Search Header */}
      <section className="bg-white border-b border-hp-gray-200 pt-8 pb-10 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-hp-navy mb-6 text-center">
            Search HP Laptops
          </h1>

          {/* Search Input */}
          <div className="relative">
            <Search
              size={22}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-hp-gray-400 pointer-events-none"
            />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onBlur={handleSearchBlur}
              placeholder="Search by name, series, processor, category..."
              className="w-full pl-12 pr-12 py-4 text-lg rounded-2xl border-2 border-hp-gray-200 bg-white text-hp-navy placeholder:text-hp-gray-400 focus:outline-none focus:border-hp-blue focus:ring-4 focus:ring-hp-blue/10 transition-all duration-200"
            />
            {query && (
              <button
                onClick={() => {
                  setQuery("");
                  inputRef.current?.focus();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-hp-gray-400 hover:text-hp-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <AnimatePresence mode="wait">
          {!isSearching ? (
            /* ───── Empty State: Suggestions ───── */
            <motion.div
              key="suggestions"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <ScrollReveal>
                  <div className="mb-10">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="flex items-center gap-2 text-lg font-semibold text-hp-navy">
                        <Clock size={18} className="text-hp-gray-400" />
                        Recent Searches
                      </h2>
                      <button
                        onClick={clearRecent}
                        className="text-sm text-hp-gray-400 hover:text-hp-danger transition-colors"
                      >
                        Clear all
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((term) => (
                        <button
                          key={term}
                          onClick={() => handleRecentClick(term)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-hp-gray-100 text-hp-gray-700 text-sm font-medium hover:bg-hp-gray-200 transition-colors"
                        >
                          <Clock size={13} />
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              )}

              {/* Popular Categories */}
              <ScrollReveal delay={0.05}>
                <div className="mb-10">
                  <h2 className="flex items-center gap-2 text-lg font-semibold text-hp-navy mb-4">
                    <Tag size={18} className="text-hp-blue" />
                    Popular Categories
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR_CATEGORIES.map((cat) => (
                      <Link
                        key={cat.name}
                        href={cat.href}
                        className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-hp-blue/10 text-hp-blue font-medium text-sm hover:bg-hp-blue hover:text-white transition-all duration-200"
                      >
                        <Tag size={13} />
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              {/* Popular Processors */}
              <ScrollReveal delay={0.1}>
                <div className="mb-10">
                  <h2 className="flex items-center gap-2 text-lg font-semibold text-hp-navy mb-4">
                    <Cpu size={18} className="text-hp-blue" />
                    Popular Processors
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR_PROCESSORS.map((proc) => (
                      <button
                        key={proc}
                        onClick={() => setQuery(proc)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-hp-gray-100 text-hp-gray-700 text-sm font-medium hover:bg-hp-navy hover:text-white transition-all duration-200"
                      >
                        <Cpu size={13} />
                        {proc}
                      </button>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              {/* Trending Products */}
              <ScrollReveal delay={0.15}>
                <div>
                  <h2 className="flex items-center gap-2 text-lg font-semibold text-hp-navy mb-5">
                    <TrendingUp size={18} className="text-hp-success" />
                    Trending Products
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {trendingProducts.map((product, i) => (
                      <ProductCard key={product.id} product={product} index={i} />
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            </motion.div>
          ) : (
            /* ───── Search Results ───── */
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              {/* Results header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <p className="text-hp-gray-600">
                  <span className="font-semibold text-hp-navy">{results.length}</span>{" "}
                  result{results.length !== 1 ? "s" : ""} for{" "}
                  <span className="font-semibold text-hp-blue">
                    &ldquo;{debouncedQuery.trim()}&rdquo;
                  </span>
                </p>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-hp-gray-500">Sort by:</span>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as SortOption)}
                    className="text-sm border border-hp-gray-200 rounded-lg px-3 py-1.5 bg-white text-hp-navy focus:outline-none focus:ring-2 focus:ring-hp-blue/20 focus:border-hp-blue transition-all"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="price">Price</option>
                    <option value="rating">Rating</option>
                  </select>
                </div>
              </div>

              {results.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {results.map((product, i) => (
                    <ProductCard key={product.id} product={product} index={i} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <SearchX
                      size={72}
                      className="text-hp-gray-300 mb-6 mx-auto"
                      strokeWidth={1}
                    />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-hp-navy mb-2">
                    No results found
                  </h3>
                  <p className="text-hp-gray-500 mb-8 max-w-md">
                    We couldn&apos;t find any laptops matching &ldquo;
                    {debouncedQuery.trim()}
                    &rdquo;. Try a different search term or browse all products.
                  </p>
                  <Link
                    href="/collection"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-hp-blue text-white rounded-xl font-medium hover:bg-hp-blue-dark transition-colors"
                  >
                    Browse All Products
                  </Link>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hp-blue" /></div>}>
      <SearchContent />
    </Suspense>
  );
}
