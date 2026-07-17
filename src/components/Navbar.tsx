"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Heart,
  Menu,
  X,
  Laptop,
  ChevronDown,
} from "lucide-react";
import { useWishlist } from "@/components/AppProviders";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/collection", label: "Collection" },
  { href: "/compare", label: "Compare" },
  { href: "/search", label: "Search" },
];

export function Navbar() {
  const pathname = usePathname();
  const { getWishlistCount } = useWishlist();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const wishlistCount = getWishlistCount();

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "glass shadow-lg shadow-hp-blue/5"
            : "bg-white/50 backdrop-blur-sm"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-hp-blue text-white transition-transform duration-300 group-hover:scale-110">
                <Laptop className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-hp-navy">
                HP
                <span className="text-hp-blue">Laptops</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden items-center gap-1 md:flex">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? "text-hp-blue"
                        : "text-hp-gray-600 hover:text-hp-navy hover:bg-hp-gray-50"
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-x-1 -bottom-[1px] h-0.5 rounded-full bg-hp-blue"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Desktop Actions */}
            <div className="flex items-center gap-2">
              <Link
                href="/search"
                className="hidden rounded-lg p-2 text-hp-gray-500 transition-colors hover:bg-hp-gray-100 hover:text-hp-blue md:flex"
              >
                <Search className="h-5 w-5" />
              </Link>

              <Link
                href="/wishlist"
                className="relative rounded-lg p-2 text-hp-gray-500 transition-colors hover:bg-hp-gray-100 hover:text-hp-blue"
              >
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-hp-danger text-[10px] font-bold text-white">
                    {wishlistCount > 9 ? "9+" : wishlistCount}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileOpen(true)}
                className="rounded-lg p-2 text-hp-gray-500 transition-colors hover:bg-hp-gray-100 hover:text-hp-blue md:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer */}
      <div className="h-16" />

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed bottom-0 right-0 top-0 z-[70] w-72 bg-white shadow-2xl"
            >
              <div className="flex h-full flex-col">
                {/* Mobile Header */}
                <div className="flex items-center justify-between border-b border-hp-gray-100 px-5 py-4">
                  <Link href="/" className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-hp-blue text-white">
                      <Laptop className="h-4 w-4" />
                    </div>
                    <span className="text-lg font-bold text-hp-navy">
                      HP<span className="text-hp-blue">Laptops</span>
                    </span>
                  </Link>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg p-2 text-hp-gray-400 hover:bg-hp-gray-100 hover:text-hp-gray-700"
                    aria-label="Close menu"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Mobile Links */}
                <div className="flex-1 overflow-y-auto px-3 py-4">
                  <div className="space-y-1">
                    {navLinks.map((link, index) => {
                      const isActive = pathname === link.href;
                      return (
                        <motion.div
                          key={link.href}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Link
                            href={link.href}
                            className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                              isActive
                                ? "bg-hp-blue-light text-hp-blue"
                                : "text-hp-gray-600 hover:bg-hp-gray-50 hover:text-hp-navy"
                            }`}
                          >
                            {link.label}
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>

                  <div className="mt-6 border-t border-hp-gray-100 pt-4">
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Link
                        href="/wishlist"
                        className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-hp-gray-600 hover:bg-hp-gray-50 hover:text-hp-navy"
                      >
                        <Heart className="h-4 w-4" />
                        Wishlist
                        {wishlistCount > 0 && (
                          <span className="ml-auto rounded-full bg-hp-danger px-2 py-0.5 text-[10px] font-bold text-white">
                            {wishlistCount}
                          </span>
                        )}
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
