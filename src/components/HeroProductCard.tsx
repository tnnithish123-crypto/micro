"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Cpu,
  HardDrive,
  Monitor,
  Battery,
  MemoryStick,
  Eye,
  GitCompareArrows,
  Tag,
  ChevronRight,
} from "lucide-react";
import { Product } from "@/data/products";
import { useCompare } from "@/components/AppProviders";

interface HeroProductCardProps {
  product: Product;
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

const badgeColors: Record<string, string> = {
  New: "bg-hp-blue text-white",
  "Best Seller": "bg-hp-success text-white",
  Sale: "bg-hp-danger text-white",
  Popular: "bg-hp-warning text-white",
  "Limited Edition": "bg-hp-navy text-white",
};

export default function HeroProductCard({ product }: HeroProductCardProps) {
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();
  const inCompare = isInCompare(product.id);
  const stock = stockStyles[product.stock];

  return (
    <motion.div
      initial={{ opacity: 0, x: -60 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.01, transition: { duration: 0.3 } }}
      className="group relative glass-card rounded-2xl overflow-hidden transition-shadow duration-300 hover:shadow-[0_12px_60px_rgba(0,150,214,0.18)] hover:border-hp-blue/30"
    >
      <div className="flex flex-col lg:flex-row">
        {/* Left – Image area */}
        <div className="relative w-full lg:w-[45%] min-h-[280px] sm:min-h-[340px] bg-gradient-to-br from-blue-50 via-hp-blue/5 to-cyan-50 flex flex-col items-center justify-center overflow-hidden">
          <img
            src={product.images.front}
            alt={product.name}
            className="w-full h-full object-contain p-6"
            loading="lazy"
          />
          <span className="mt-3 text-xs font-medium text-hp-gray-400 tracking-wide uppercase">
            360° View
          </span>

          {/* Decorative blobs */}
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-hp-blue/5 blur-xl" />
          <div className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full bg-cyan-100/60 blur-lg" />

          {/* Featured badge top-left */}
          <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-hp-navy text-white">
            <Tag size={12} />
            Featured Product
          </span>
        </div>

        {/* Right – Content */}
        <div className="flex-1 flex flex-col gap-4 p-6 sm:p-8">
          {/* Name */}
          <h2 className="text-2xl font-bold text-hp-navy leading-snug">
            {product.name}
          </h2>

          {/* Series */}
          <span className="self-start text-sm font-medium text-hp-blue bg-hp-blue/10 px-3 py-1 rounded-full">
            {product.series}
          </span>

          {/* Key specs grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="flex items-center gap-2 text-sm text-hp-gray-700">
              <Cpu size={16} className="text-hp-blue shrink-0" />
              <span className="truncate">{product.processor}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-hp-gray-700">
              <MemoryStick size={16} className="text-hp-blue shrink-0" />
              <span>{product.ram} GB {product.ramType}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-hp-gray-700">
              <HardDrive size={16} className="text-hp-blue shrink-0" />
              <span>{product.storage}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-hp-gray-700">
              <Monitor size={16} className="text-hp-blue shrink-0" />
              <span>{product.displaySize}&quot;</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-hp-gray-700">
              <Battery size={16} className="text-hp-blue shrink-0" />
              <span>{product.batteryLife}</span>
            </div>
          </div>

          {/* Price */}
          <p className="text-3xl font-bold text-hp-navy mt-1">
            ₹{product.price.toLocaleString("en-IN")}
          </p>

          {/* Stock */}
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${stock.dot}`} />
            <span className={`text-sm font-medium ${stock.text}`}>
              {stock.label}
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3 mt-2">
            <Link
              href={`/products/${product.id}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-hp-blue text-white font-medium text-sm hover:bg-hp-blue-dark transition-colors"
            >
              <Eye size={16} />
              View Details
              <ChevronRight size={14} />
            </Link>
            <button
              onClick={() =>
                inCompare
                  ? removeFromCompare(product.id)
                  : addToCompare(product)
              }
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl border font-medium text-sm transition-all duration-200 ${
                inCompare
                  ? "bg-hp-blue/10 border-hp-blue text-hp-blue"
                  : "border-hp-gray-200 text-hp-gray-600 hover:border-hp-blue hover:text-hp-blue"
              }`}
            >
              <GitCompareArrows size={16} />
              {inCompare ? "Remove from Compare" : "Quick Compare"}
            </button>
          </div>

          {/* Badges row */}
          {product.badges && product.badges.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {product.badges.map((badge) => (
                <span
                  key={badge}
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    badgeColors[badge] || "bg-hp-gray-700 text-white"
                  }`}
                >
                  {badge}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
