"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Laptop,
  Mail,
  ArrowRight,
  Globe,
  MessageCircle,
  Share2,
  Play,
  Users,
} from "lucide-react";

const footerLinks = {
  products: {
    title: "Products",
    links: [
      { label: "HP 14", href: "/collection?series=hp-14" },
      { label: "HP 15", href: "/collection?series=hp-15" },
      { label: "Pavilion", href: "/collection?series=pavilion" },
      { label: "Envy", href: "/collection?series=envy" },
      { label: "Spectre", href: "/collection?series=spectre" },
      { label: "OMEN", href: "/collection?series=omen" },
      { label: "Victus", href: "/collection?series=victus" },
      { label: "ProBook", href: "/collection?series=probook" },
      { label: "EliteBook", href: "/collection?series=elitebook" },
    ],
  },
  support: {
    title: "Support",
    links: [
      { label: "Contact Us", href: "#" },
      { label: "Drivers", href: "#" },
      { label: "Warranty", href: "#" },
      { label: "Repairs", href: "#" },
      { label: "Community", href: "#" },
    ],
  },
  company: {
    title: "Company",
    links: [
      { label: "About HP", href: "#" },
      { label: "Careers", href: "#" },
      { label: "News", href: "#" },
      { label: "Sustainability", href: "#" },
      { label: "Investors", href: "#" },
    ],
  },
  legal: {
    title: "Legal",
    links: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
      { label: "Accessibility", href: "#" },
      { label: "Cookie Settings", href: "#" },
    ],
  },
};

const socialLinks = [
  { icon: MessageCircle, label: "Twitter", href: "#" },
  { icon: Share2, label: "Instagram", href: "#" },
  { icon: Globe, label: "Facebook", href: "#" },
  { icon: Play, label: "YouTube", href: "#" },
  { icon: Users, label: "LinkedIn", href: "#" },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="relative mt-20 bg-hp-navy text-white">
      {/* Gradient Top Border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-hp-blue via-hp-blue-dark to-hp-navy" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Newsletter Section */}
        <div className="border-b border-white/10 py-12">
          <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold">Stay in the loop</h3>
              <p className="mt-1 text-sm text-hp-gray-400">
                Get the latest HP laptop news, deals, and updates delivered to
                your inbox.
              </p>
            </div>
            <form
              onSubmit={handleSubscribe}
              className="flex w-full max-w-md gap-2"
            >
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-hp-gray-400" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-lg bg-white/10 py-2.5 pl-10 pr-4 text-sm text-white placeholder-hp-gray-400 outline-none ring-1 ring-white/10 transition-all focus:ring-2 focus:ring-hp-blue"
                />
              </div>
              <button
                type="submit"
                className="flex shrink-0 items-center gap-2 rounded-lg bg-hp-blue px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-hp-blue-dark"
              >
                {subscribed ? (
                  "Subscribed!"
                ) : (
                  <>
                    Subscribe
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Link Columns */}
        <div className="grid grid-cols-2 gap-8 py-12 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-hp-blue text-white">
                <Laptop className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold">
                HP<span className="text-hp-blue">Laptops</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-hp-gray-400">
              Discover the perfect HP laptop for your lifestyle. From ultrabooks
              to gaming powerhouses, find your ideal companion.
            </p>

            {/* Social Links */}
            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-hp-gray-400 transition-all hover:bg-hp-blue hover:text-white"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
                {section.title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-hp-gray-400 transition-colors hover:text-hp-blue"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 py-6">
          <div className="flex flex-col items-center justify-between gap-4 text-xs text-hp-gray-500 sm:flex-row">
            <p>
              &copy; {new Date().getFullYear()} HP Laptop Catalog. All rights
              reserved.
            </p>
            <p>
              Built with Next.js &amp; Tailwind CSS. Not affiliated with HP Inc.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
