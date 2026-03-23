"use client";

import { motion } from "framer-motion";
import { ArrowDown, Send } from "lucide-react";
import Image from "next/image";
import type { HeroData } from "@/types";

interface HeroSectionProps {
  data: (HeroData & { profileImageUrl?: string | null }) | null;
}

export function HeroSection({ data }: HeroSectionProps) {
  if (!data) return null;

  const profileSrc = data.profileImageUrl || "/uploads/profile.svg";

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-1/4 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl animate-pulse" />
        <div className="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl animate-pulse delay-1000" />
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/5 blur-3xl animate-pulse delay-500" />
      </div>

      <div className="mx-auto max-w-6xl px-4 py-32 sm:px-6">
        <div className="flex flex-col items-center gap-10 md:flex-row md:gap-16">
          {/* Profile Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative flex-shrink-0"
          >
            <div className="relative h-48 w-48 overflow-hidden rounded-full border-4 border-violet-200/50 shadow-2xl shadow-violet-500/20 dark:border-violet-800/50 sm:h-56 sm:w-56 md:h-64 md:w-64">
              <Image
              src={profileSrc}
                alt="Profile photo"
                fill
                className="object-cover"
                priority
                unoptimized
              />
            </div>
            {/* Decorative ring */}
            <div className="absolute -inset-3 rounded-full border-2 border-dashed border-violet-300/30 animate-[spin_20s_linear_infinite] dark:border-violet-700/30" />
            <div className="absolute -inset-6 rounded-full border border-violet-200/10 dark:border-violet-800/10" />
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center md:text-left"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-6 inline-block rounded-full border border-violet-200 bg-violet-50 px-4 py-1.5 text-sm font-medium text-violet-700 dark:border-violet-800 dark:bg-violet-950 dark:text-violet-300"
            >
              👋 Welcome to my portfolio
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
            >
              Hi, I&apos;m{" "}
              <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                {data.name}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mb-3 text-xl font-medium text-neutral-600 dark:text-neutral-400 sm:text-2xl"
            >
              {data.subtitle}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mb-10 max-w-2xl text-base text-neutral-500 dark:text-neutral-500 sm:text-lg"
            >
              {data.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-col items-center gap-4 sm:flex-row md:justify-start"
            >
              {data.showHireMe && (
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:shadow-xl hover:shadow-violet-500/30 hover:-translate-y-0.5"
                >
                  <Send className="h-4 w-4" />
                  Hire Me
                </a>
              )}
              <a
                href="#about"
                className="inline-flex items-center gap-2 rounded-full border border-neutral-300 px-8 py-3.5 text-sm font-semibold transition-all hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
              >
                Learn More
                <ArrowDown className="h-4 w-4" />
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ArrowDown className="h-5 w-5 text-neutral-400" />
        </motion.div>
      </motion.div>
    </section>
  );
}
