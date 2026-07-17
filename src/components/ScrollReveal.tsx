"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right" | "scale";
  delay?: number;
}

const getInitial = (direction: string) => {
  switch (direction) {
    case "up":
      return { opacity: 0, y: 60 };
    case "down":
      return { opacity: 0, y: -60 };
    case "left":
      return { opacity: 0, x: 60 };
    case "right":
      return { opacity: 0, x: -60 };
    case "scale":
      return { opacity: 0, scale: 0.85 };
    default:
      return { opacity: 0, y: 60 };
  }
};

const getAnimate = (direction: string) => {
  switch (direction) {
    case "up":
      return { opacity: 1, y: 0 };
    case "down":
      return { opacity: 1, y: 0 };
    case "left":
      return { opacity: 1, x: 0 };
    case "right":
      return { opacity: 1, x: 0 };
    case "scale":
      return { opacity: 1, scale: 1 };
    default:
      return { opacity: 1, y: 0 };
  }
};

export default function ScrollReveal({
  children,
  className = "",
  direction = "up",
  delay = 0,
}: ScrollRevealProps) {
  return (
    <motion.div
      initial={getInitial(direction)}
      whileInView={getAnimate(direction)}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
