"use client";

import { motion } from "framer-motion";
import { User, Target } from "lucide-react";
import type { AboutData } from "@/types";

interface AboutSectionProps {
  data: AboutData | null;
}

export function AboutSection({ data }: AboutSectionProps) {
  if (!data) return null;

  return (
    <section id="about" className="py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            About{" "}
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Me
            </span>
          </h2>
          <div className="mx-auto h-1 w-20 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600" />
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl border border-neutral-200/60 bg-white/50 p-8 backdrop-blur-sm dark:border-neutral-800/60 dark:bg-neutral-900/50"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-xl bg-violet-100 p-2.5 dark:bg-violet-900/30">
                <User className="h-5 w-5 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="text-lg font-semibold">Biography</h3>
            </div>
            <p className="leading-relaxed text-neutral-600 dark:text-neutral-400">
              {data.biography}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-2xl border border-neutral-200/60 bg-white/50 p-8 backdrop-blur-sm dark:border-neutral-800/60 dark:bg-neutral-900/50"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-xl bg-indigo-100 p-2.5 dark:bg-indigo-900/30">
                <Target className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-lg font-semibold">Career Goals</h3>
            </div>
            <p className="leading-relaxed text-neutral-600 dark:text-neutral-400">
              {data.careerGoals}
            </p>
            {data.cvLink && (
              <a
                href={data.cvLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-violet-600 hover:underline dark:text-violet-400"
              >
                Download CV →
              </a>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
