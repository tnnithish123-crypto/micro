"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Check, GitCompareArrows, Laptop, Star, Cpu, MemoryStick } from "lucide-react";
import { products, type Product } from "@/data/products";
import { useCompare } from "@/components/AppProviders";
import { useRouter } from "next/navigation";

interface CompareSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CompareSelectionModal({
  isOpen,
  onClose,
}: CompareSelectionModalProps) {
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const { addToCompare, clearCompare } = useCompare();
  const router = useRouter();

  const filteredProducts = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.series.toLowerCase().includes(q) ||
        p.processor.toLowerCase().includes(q) ||
        p.gpu.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }, [search]);

  const toggleProduct = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (next.size >= 4) return prev;
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleConfirm = useCallback(() => {
    if (selectedIds.size < 2) return;
    clearCompare();
    const selected = products.filter((p) => selectedIds.has(p.id));
    selected.forEach((p) => addToCompare(p));
    setSearch("");
    setSelectedIds(new Set());
    onClose();
    router.push("/compare");
  }, [selectedIds, addToCompare, clearCompare, onClose, router]);

  const handleClose = useCallback(() => {
    setSearch("");
    setSelectedIds(new Set());
    onClose();
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-4"
        onClick={(e) => e.target === e.currentTarget && handleClose()}
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 20 }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                <GitCompareArrows size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Select Products to Compare
                </h2>
                <p className="text-xs text-gray-500">
                  Choose 2–4 laptops for side-by-side comparison
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Search */}
          <div className="px-5 py-3 border-b border-gray-100 shrink-0">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, series, processor, GPU, category..."
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Selection count */}
          <div className="px-5 py-2 bg-blue-50/50 border-b border-blue-100/50 shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-xs text-blue-700 font-medium">
                {selectedIds.size} of 4 selected
                {selectedIds.size < 2 && (
                  <span className="text-blue-500 ml-1">
                    (minimum 2 required)
                  </span>
                )}
              </span>
              <div className="flex gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`w-2.5 h-2.5 rounded-full transition-colors ${
                      i < selectedIds.size ? "bg-blue-500" : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1 overflow-y-auto px-5 py-4">
            {filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Laptop size={40} className="text-gray-300 mb-3" />
                <p className="text-sm text-gray-500">No products found</p>
                <p className="text-xs text-gray-400 mt-1">Try a different search term</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredProducts.map((product) => {
                  const isSelected = selectedIds.has(product.id);
                  const selectionIndex = Array.from(selectedIds).indexOf(product.id);
                  return (
                    <motion.button
                      key={product.id}
                      onClick={() => toggleProduct(product.id)}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className={`
                        relative flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all
                        ${
                          isSelected
                            ? "border-blue-500 bg-blue-50 shadow-md shadow-blue-500/10"
                            : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm"
                        }
                      `}
                    >
                      {/* Selection indicator */}
                      <div
                        className={`
                          absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center transition-all
                          ${
                            isSelected
                              ? "bg-blue-500 text-white shadow-md"
                              : "bg-gray-100 text-gray-400"
                          }
                        `}
                      >
                        {isSelected ? (
                          <Check size={14} strokeWidth={3} />
                        ) : (
                          <span className="text-[10px] font-bold">{selectionIndex + 1}</span>
                        )}
                      </div>

                      {/* Product image */}
                      <div className="w-20 h-16 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                        <img
                          src={product.images.front}
                          alt={product.name}
                          className="w-full h-full object-contain p-1"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                      </div>

                      {/* Product info */}
                      <div className="flex-1 min-w-0 pr-6">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-[10px] font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                            {product.series}
                          </span>
                          {product.category && (
                            <span className="text-[10px] font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded capitalize">
                              {product.category}
                            </span>
                          )}
                        </div>
                        <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-3 mt-1 text-[11px] text-gray-500">
                          <span className="flex items-center gap-1">
                            <Cpu size={10} />
                            {product.processor.split(" ").slice(-2).join(" ")}
                          </span>
                          <span className="flex items-center gap-1">
                            <MemoryStick size={10} />
                            {product.ram}GB
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm font-bold text-gray-900">
                            ₹{product.price.toLocaleString("en-IN")}
                          </span>
                          <span className="flex items-center gap-0.5 text-[10px] text-amber-600">
                            <Star size={9} fill="currentColor" />
                            {product.rating}
                          </span>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50/50 shrink-0">
            <p className="text-xs text-gray-400">
              {selectedIds.size < 2
                ? `Select ${2 - selectedIds.size} more product${selectedIds.size === 0 ? "s" : ""} to continue`
                : "Ready to compare!"}
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={selectedIds.size < 2}
                className={`
                  inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-lg transition-all
                  ${
                    selectedIds.size >= 2
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25 hover:from-blue-600 hover:to-indigo-700"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }
                `}
              >
                <GitCompareArrows size={14} />
                Compare {selectedIds.size > 0 && `(${selectedIds.size})`}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
