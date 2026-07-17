"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  X,
  Laptop,
  Cpu,
  HardDrive,
  Monitor,
  Battery,
  MemoryStick,
  GitCompareArrows,
  Heart,
  ExternalLink,
} from "lucide-react";
import { Product } from "@/data/products";
import { useWishlist, useCompare } from "@/components/AppProviders";
import StarRating from "@/components/StarRating";

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const stockStyles: Record<string, { dot: string; text: string; label: string }> = {
  "in-stock": {
    dot: "bg-hp-success",
    text: "text-hp-success",
    label: "In Stock",
  },
  "low-stock": {
    dot: "bg-hp-warning",
    text: "text-hp-warning",
    label: "Low Stock",
  },
  "out-of-stock": {
    dot: "bg-hp-danger",
    text: "text-hp-danger",
    label: "Out of Stock",
  },
};

export default function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();

  const inWishlist = product ? isInWishlist(product.id) : false;
  const inCompare = product ? isInCompare(product.id) : false;
  const stock = product ? stockStyles[product.stock] : null;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  if (!product) return null;

  const specs = [
    { icon: Cpu, label: "Processor", value: product.processor },
    { icon: MemoryStick, label: "RAM", value: `${product.ram} GB ${product.ramType}` },
    { icon: HardDrive, label: "Storage", value: product.storage },
    { icon: Monitor, label: "Display", value: `${product.displaySize}" ${product.resolution}` },
    { icon: Battery, label: "Battery", value: product.batteryLife },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-card rounded-2xl bg-white/95 backdrop-blur-xl shadow-2xl"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 flex items-center justify-center w-9 h-9 rounded-full bg-hp-gray-100 text-hp-gray-500 hover:bg-hp-gray-200 hover:text-hp-navy transition-colors"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div className="flex flex-col md:flex-row">
              {/* Left – Image */}
              <div className="relative w-full md:w-[42%] min-h-[240px] md:min-h-full bg-gradient-to-br from-blue-50 via-hp-blue/5 to-cyan-50 flex items-center justify-center overflow-hidden rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none">
                <Laptop
                  size={100}
                  className="text-hp-blue/30"
                  strokeWidth={1}
                />
                <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-hp-blue/5 blur-xl" />
                <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-cyan-100/60 blur-lg" />
              </div>

              {/* Right – Content */}
              <div className="flex-1 flex flex-col gap-3 p-6">
                {/* Series */}
                <span className="self-start text-sm font-medium text-hp-blue bg-hp-blue/10 px-3 py-1 rounded-full">
                  {product.series}
                </span>

                {/* Name */}
                <h2 className="text-xl font-bold text-hp-navy leading-snug">
                  {product.name}
                </h2>

                {/* Rating */}
                <StarRating
                  rating={product.rating}
                  reviews={product.reviews}
                  size="sm"
                />

                {/* Price */}
                <p className="text-2xl font-bold text-hp-blue">
                  ₹{product.price.toLocaleString("en-IN")}
                </p>

                {/* Specs list */}
                <div className="flex flex-col gap-2 mt-1">
                  {specs.map(({ icon: Icon, label, value }) => (
                    <div
                      key={label}
                      className="flex items-center gap-3 text-sm text-hp-gray-700"
                    >
                      <Icon size={15} className="text-hp-blue shrink-0" />
                      <span className="w-20 shrink-0 text-hp-gray-400">
                        {label}
                      </span>
                      <span className="font-medium truncate">{value}</span>
                    </div>
                  ))}
                </div>

                {/* Stock */}
                {stock && (
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className={`w-2 h-2 rounded-full ${stock.dot}`} />
                    <span className={`text-sm font-medium ${stock.text}`}>
                      {stock.label}
                    </span>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex flex-col gap-2 mt-3 pt-4 border-t border-hp-gray-200/60">
                  {/* Primary */}
                  <Link
                    href={`/products/${product.id}`}
                    className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl bg-hp-blue text-white font-medium text-sm hover:bg-hp-blue-dark transition-colors"
                  >
                    <ExternalLink size={15} />
                    View Full Details
                  </Link>

                  <div className="flex gap-2">
                    {/* Compare */}
                    <button
                      onClick={() =>
                        inCompare
                          ? removeFromCompare(product.id)
                          : addToCompare(product)
                      }
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border font-medium text-sm transition-all duration-200 ${
                        inCompare
                          ? "bg-hp-blue/10 border-hp-blue text-hp-blue"
                          : "border-hp-gray-200 text-hp-gray-600 hover:border-hp-blue hover:text-hp-blue"
                      }`}
                    >
                      <GitCompareArrows size={15} />
                      {inCompare ? "Remove from Compare" : "Add to Compare"}
                    </button>

                    {/* Wishlist */}
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border font-medium text-sm transition-all duration-200 ${
                        inWishlist
                          ? "bg-hp-danger/10 border-hp-danger text-hp-danger"
                          : "border-hp-gray-200 text-hp-gray-600 hover:border-hp-danger hover:text-hp-danger"
                      }`}
                    >
                      <Heart
                        size={15}
                        className={inWishlist ? "fill-hp-danger" : ""}
                      />
                      {inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
