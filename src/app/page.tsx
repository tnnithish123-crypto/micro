"use client";

import { useState, useEffect, useMemo } from "react";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import HeroProductCard from "@/components/HeroProductCard";
import ScrollReveal from "@/components/ScrollReveal";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Shield,
  Zap,
  Leaf,
  Globe,
  GraduationCap,
  Briefcase,
  Gamepad2,
  Palette,
  Home,
  ArrowRight,
  Star,
  Laptop,
  ChevronRight,
} from "lucide-react";

const CATEGORY_DATA = [
  {
    name: "Student",
    icon: GraduationCap,
    gradient: "from-blue-500/10 to-cyan-500/10",
    iconColor: "text-blue-600",
  },
  {
    name: "Business",
    icon: Briefcase,
    gradient: "from-hp-navy/10 to-hp-blue/10",
    iconColor: "text-hp-navy",
  },
  {
    name: "Gaming",
    icon: Gamepad2,
    gradient: "from-red-500/10 to-orange-500/10",
    iconColor: "text-red-600",
  },
  {
    name: "Creator",
    icon: Palette,
    gradient: "from-purple-500/10 to-pink-500/10",
    iconColor: "text-purple-600",
  },
  {
    name: "Everyday",
    icon: Home,
    gradient: "from-green-500/10 to-emerald-500/10",
    iconColor: "text-green-600",
  },
];

const WHY_HP = [
  {
    icon: Shield,
    title: "Premium Quality",
    description:
      "Every HP laptop undergoes rigorous testing to meet the highest standards of durability, performance, and reliability.",
    color: "text-hp-blue",
  },
  {
    icon: Zap,
    title: "Innovation",
    description:
      "From AI-powered features to cutting-edge processors, HP pushes the boundaries of what a laptop can do.",
    color: "text-amber-500",
  },
  {
    icon: Leaf,
    title: "Sustainable Design",
    description:
      "Built with recycled materials and energy-efficient components, HP is committed to a greener future.",
    color: "text-hp-success",
  },
  {
    icon: Globe,
    title: "Global Support",
    description:
      "Worldwide warranty, dedicated support channels, and a vast service network keep you covered everywhere.",
    color: "text-hp-blue",
  },
];

const STATS = [
  { value: "105+", label: "Models" },
  { value: "17", label: "Series" },
  { value: "50+", label: "Processors" },
  { value: "10+", label: "Years" },
];

function useAnimatedCounter(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  return {
    count,
    start: () => {
      if (started) return;
      setStarted(true);
      const startTime = performance.now();
      const animate = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.round(eased * target));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    },
  };
}

function StatsCounter({ value, label }: { value: string; label: string }) {
  const numericValue = parseInt(value.replace(/\D/g, ""), 10);
  const suffix = value.replace(/[0-9]/g, "");
  const counter = useAnimatedCounter(numericValue, 2200);
  const [ref, setRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) counter.start();
      },
      { threshold: 0.3 }
    );
    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, counter]);

  return (
    <div ref={setRef} className="text-center">
      <p className="text-4xl sm:text-5xl font-bold text-white mb-2">
        {counter.count}
        {suffix}
      </p>
      <p className="text-white/70 text-sm font-medium uppercase tracking-wider">
        {label}
      </p>
    </div>
  );
}

export default function HomePage() {
  const featuredProducts = useMemo(
    () => products.filter((p) => p.featured).slice(0, 8),
    []
  );

  const heroProduct = useMemo(
    () => products.find((p) => p.featured && p.badges?.includes("New")) ?? products[0],
    []
  );

  const seriesCounts = useMemo(() => {
    const map = new Map<string, number>();
    products.forEach((p) => map.set(p.series, (map.get(p.series) ?? 0) + 1));
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, []);

  const SERIES_GRADIENTS: Record<string, string> = {
    Spectre: "from-purple-500 to-indigo-600",
    OMEN: "from-red-500 to-red-700",
    Victus: "from-orange-500 to-red-500",
    Envy: "from-cyan-500 to-blue-600",
    Pavilion: "from-blue-500 to-hp-blue",
    ProBook: "from-hp-navy to-hp-blue-dark",
    EliteBook: "from-slate-700 to-slate-900",
    Chromebook: "from-green-500 to-teal-600",
    "HP 15": "from-gray-500 to-gray-700",
    "HP 14": "from-gray-400 to-gray-600",
  };

  return (
    <div className="min-h-screen">
      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-hp-blue/5 via-white to-hp-navy/5">
        {/* Floating decorative circles */}
        <motion.div
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-[10%] w-72 h-72 rounded-full bg-hp-blue/5 blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{ y: [10, -10, 10] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-20 right-[10%] w-96 h-96 rounded-full bg-hp-navy/5 blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{ y: [5, -15, 5] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-[40%] right-[30%] w-48 h-48 rounded-full bg-hp-blue-light/40 blur-2xl pointer-events-none"
        />

        {/* Background dots / particles */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-hp-blue/20"
              style={{
                top: `${10 + (i * 4.2) % 80}%`,
                left: `${5 + (i * 5.7) % 90}%`,
              }}
              animate={{
                opacity: [0.15, 0.4, 0.15],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3 + (i % 3),
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 flex flex-col items-center text-center">
          <ScrollReveal direction="up">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              <span className="gradient-text">Discover the Perfect</span>
              <br />
              <span className="gradient-text">HP Laptop</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <p className="text-lg sm:text-xl text-hp-gray-600 max-w-2xl mb-10 leading-relaxed">
              Explore the complete HP laptop ecosystem with immersive experiences,
              detailed specifications, comparisons, and intelligent product discovery.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-14">
              <Link
                href="/collection"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-hp-blue text-white font-semibold text-lg hover:bg-hp-blue-dark transition-colors shadow-lg shadow-hp-blue/20"
              >
                Explore Collection
                <ArrowRight size={20} />
              </Link>
              <Link
                href="/compare"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full border-2 border-hp-gray-300 text-hp-navy font-semibold text-lg hover:border-hp-blue hover:text-hp-blue transition-colors"
              >
                Compare Models
              </Link>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.3} direction="scale">
            <div className="w-full max-w-2xl">
              <HeroProductCard product={heroProduct} />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════ COLLECTIONS GRID ═══════════════ */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-4xl font-bold text-hp-navy text-center mb-4">
              Explore HP Collections
            </h2>
            <p className="text-hp-gray-500 text-center mb-12 max-w-lg mx-auto">
              Find the perfect laptop series that matches your needs and lifestyle.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {seriesCounts.map(([series, count], i) => (
              <ScrollReveal key={series} delay={i * 0.05}>
                <Link href={`/collection?series=${encodeURIComponent(series)}`}>
                  <motion.div
                    whileHover={{ scale: 1.04, y: -4 }}
                    transition={{ duration: 0.25 }}
                    className={`group relative rounded-2xl p-6 sm:p-8 bg-gradient-to-br ${
                      SERIES_GRADIENTS[series] ?? "from-hp-blue to-hp-navy"
                    } text-white overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300`}
                  >
                    {/* Decorative circle */}
                    <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-white/10 group-hover:scale-150 transition-transform duration-500" />

                    <Laptop
                      size={36}
                      className="mb-4 opacity-70 group-hover:opacity-100 transition-opacity"
                    />
                    <h3 className="text-lg sm:text-xl font-bold mb-1">{series}</h3>
                    <p className="text-white/70 text-sm">
                      {count} {count === 1 ? "product" : "products"}
                    </p>
                    <ChevronRight
                      size={18}
                      className="absolute bottom-6 right-6 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300"
                    />
                  </motion.div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ FEATURED PRODUCTS ═══════════════ */}
      <section className="py-24 px-6 bg-hp-gray-50">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-4xl font-bold text-hp-navy text-center mb-4">
              Featured Products
            </h2>
            <p className="text-hp-gray-500 text-center mb-12 max-w-lg mx-auto">
              Hand-picked selections showcasing the best of HP innovation and performance.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>

          <ScrollReveal delay={0.2}>
            <div className="text-center mt-12">
              <Link
                href="/collection"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border-2 border-hp-blue text-hp-blue font-semibold hover:bg-hp-blue hover:text-white transition-all duration-300"
              >
                View All Products
                <ArrowRight size={18} />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════ WHY HP ═══════════════ */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-4xl font-bold text-hp-navy text-center mb-4">
              Why HP
            </h2>
            <p className="text-hp-gray-500 text-center mb-12 max-w-lg mx-auto">
              Decades of engineering excellence, designed for the way you work and play.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_HP.map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 0.08}>
                <motion.div
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ duration: 0.25 }}
                  className="glass-card rounded-2xl p-6 sm:p-8 text-center h-full"
                >
                  <div className="w-14 h-14 rounded-2xl bg-hp-blue/10 flex items-center justify-center mx-auto mb-5">
                    <item.icon size={28} className={item.color} />
                  </div>
                  <h3 className="text-lg font-bold text-hp-navy mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm text-hp-gray-500 leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ CATEGORIES ═══════════════ */}
      <section className="py-24 px-6 bg-hp-gray-50">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-4xl font-bold text-hp-navy text-center mb-4">
              Shop by Category
            </h2>
            <p className="text-hp-gray-500 text-center mb-12 max-w-lg mx-auto">
              Browse laptops tailored for your specific needs and workflow.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORY_DATA.map((cat, i) => (
              <ScrollReveal key={cat.name} delay={i * 0.07}>
                <Link href={`/collection?category=${encodeURIComponent(cat.name)}`}>
                  <motion.div
                    whileHover={{ scale: 1.03, y: -4 }}
                    transition={{ duration: 0.25 }}
                    className={`group relative rounded-2xl p-8 bg-gradient-to-br ${cat.gradient} border border-hp-gray-200/60 hover:border-hp-blue/30 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden`}
                  >
                    <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-hp-blue/5 group-hover:scale-150 transition-transform duration-500" />
                    <cat.icon
                      size={40}
                      className={`${cat.iconColor} mb-4 group-hover:scale-110 transition-transform duration-300`}
                    />
                    <h3 className="text-xl font-bold text-hp-navy mb-2">
                      {cat.name}
                    </h3>
                    <span className="inline-flex items-center gap-1 text-sm text-hp-blue font-medium group-hover:gap-2 transition-all duration-300">
                      Browse {cat.name}
                      <ArrowRight size={16} />
                    </span>
                  </motion.div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ STATS ═══════════════ */}
      <section className="py-24 px-6 bg-hp-navy">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12">
            {STATS.map((stat) => (
              <StatsCounter key={stat.label} value={stat.value} label={stat.label} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ CTA BANNER ═══════════════ */}
      <section className="py-24 px-6 bg-gradient-to-r from-hp-blue to-hp-navy">
        <div className="max-w-3xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Ready to Find Your Perfect HP Laptop?
            </h2>
            <p className="text-white/70 text-lg mb-10 max-w-xl mx-auto">
              Browse our complete collection, compare specifications, and discover
              the laptop that fits your life.
            </p>
            <Link
              href="/collection"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-white text-hp-navy font-bold text-lg hover:bg-hp-gray-100 transition-colors shadow-xl"
            >
              Explore Collection
              <ArrowRight size={20} />
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
