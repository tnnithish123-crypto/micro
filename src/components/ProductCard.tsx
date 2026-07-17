"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Laptop,
  Star,
  GitCompareArrows,
  Heart,
  Eye,
  Cpu,
  HardDrive,
  MemoryStick,
} from "lucide-react";
import { Product } from "@/data/products";
import { useWishlist, useCompare } from "@/components/AppProviders";
import StarRating from "@/components/StarRating";

interface ProductCardProps {
  product: Product;
  index?: number;
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
  "New": "bg-hp-blue text-white",
  "Best Seller": "bg-hp-success text-white",
  "Sale": "bg-hp-danger text-white",
  "Popular": "bg-hp-warning text-white",
  "Limited Edition": "bg-hp-navy text-white",
};

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();

  const inWishlist = isInWishlist(product.id);
  const inCompare = isInCompare(product.id);
  const stock = stockStyles[product.stock];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="group relative glass-card rounded-2xl overflow-hidden flex flex-col transition-shadow duration-300 hover:shadow-[0_8px_40px_rgba(0,150,214,0.15)] hover:border-hp-blue/30"
    >
      {/* Badges */}
      {product.badges && product.badges.length > 0 && (
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          {product.badges.map((badge) => (
            <span
              key={badge}
              className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                badgeColors[badge] || "bg-hp-gray-700 text-white"
              }`}
            >
              {badge}
            </span>
          ))}
        </div>
      )}

      {/* New / Featured tag */}
      {product.newArrival && (
        <div className="absolute top-3 right-3 z-10">
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-hp-blue text-white animate-pulse-glow">
            NEW
          </span>
        </div>
      )}

      {/* Image area */}
      <div className="relative h-48 bg-gradient-to-br from-hp-blue-light via-hp-blue/10 to-hp-navy/5 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-500">
        <Laptop
          size={72}
          className="text-hp-blue/40 group-hover:text-hp-blue/60 transition-colors duration-300"
          strokeWidth={1}
        />
        {/* Decorative circles */}
        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-hp-blue/5" />
        <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-hp-navy/5" />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        {/* Series pill */}
        <span className="self-start text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-hp-blue-light text-hp-blue-dark">
          {product.series}
        </span>

        {/* Name */}
        <h3 className="text-hp-navy font-semibold text-sm leading-snug line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>

        {/* Quick specs */}
        <div className="flex flex-wrap gap-1.5">
          <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-hp-gray-100 text-hp-gray-700">
            <Cpu size={11} className="text-hp-blue" />
            {product.processor.split(" ").slice(-2).join(" ")}
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-hp-gray-100 text-hp-gray-700">
            <MemoryStick size={11} className="text-hp-blue" />
            {product.ram}GB
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-hp-gray-100 text-hp-gray-700">
            <HardDrive size={11} className="text-hp-blue" />
            {product.storage}
          </span>
        </div>

        {/* Rating */}
        <StarRating rating={product.rating} reviews={product.reviews} size="sm" />

        {/* Price + Stock */}
        <div className="flex items-end justify-between mt-auto">
          <p className="text-xl font-bold text-hp-navy">
            ₹{product.price.toLocaleString("en-IN")}
          </p>
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${stock.dot}`} />
            <span className={`text-[11px] font-medium ${stock.text}`}>
              {stock.label}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2 border-t border-hp-gray-200/60">
          <Link
            href={`/products/${product.id}`}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-2 rounded-xl bg-hp-blue text-white hover:bg-hp-blue-dark transition-colors"
          >
            <Eye size={14} />
            View Details
          </Link>
          <button
            onClick={() =>
              inCompare
                ? removeFromCompare(product.id)
                : addToCompare(product)
            }
            className={`flex items-center justify-center w-9 h-9 rounded-xl border transition-all duration-200 ${
              inCompare
                ? "bg-hp-blue/10 border-hp-blue text-hp-blue"
                : "border-hp-gray-200 text-hp-gray-500 hover:border-hp-blue hover:text-hp-blue"
            }`}
            title={inCompare ? "Remove from Compare" : "Add to Compare"}
          >
            <GitCompareArrows size={16} />
          </button>
          <button
            onClick={() => toggleWishlist(product.id)}
            className={`flex items-center justify-center w-9 h-9 rounded-xl border transition-all duration-200 ${
              inWishlist
                ? "bg-hp-danger/10 border-hp-danger text-hp-danger"
                : "border-hp-gray-200 text-hp-gray-500 hover:border-hp-danger hover:text-hp-danger"
            }`}
            title={inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
          >
            <Heart
              size={16}
              className={inWishlist ? "fill-hp-danger" : ""}
            />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
