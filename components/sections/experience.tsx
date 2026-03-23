"use client";

import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";
import type { ExperienceData } from "@/types";

interface ExperienceSectionProps {
  data: ExperienceData[];
}

export function ExperienceSection({ data }: ExperienceSectionProps) {
  if (!data.length) return null;

  return (
    <section id="experience" className="py-24 bg-neutral-50/50 dark:bg-neutral-950/50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            Work{" "}
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Experience
            </span>
          </h2>
          <div className="mx-auto h-1 w-20 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600" />
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-violet-600 to-indigo-600 md:left-1/2 md:-translate-x-1/2" />

          <div className="space-y-12">
            {data.map((exp, i) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative flex flex-col md:flex-row ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
              >
                {/* Timeline dot */}
                <div className="absolute left-4 top-8 z-10 h-3 w-3 -translate-x-1/2 rounded-full bg-violet-600 ring-4 ring-white dark:ring-neutral-950 md:left-1/2" />

                <div className={`ml-10 md:ml-0 md:w-1/2 ${i % 2 === 0 ? "md:pr-12" : "md:pl-12"}`}>
                  <div className="rounded-2xl border border-neutral-200/60 bg-white/80 p-6 backdrop-blur-sm dark:border-neutral-800/60 dark:bg-neutral-900/80">
                    <div className="mb-3 flex items-center gap-3">
                      <div className="rounded-xl bg-violet-100 p-2 dark:bg-violet-900/30">
                        <Briefcase className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{exp.title}</h3>
                        <p className="text-sm text-neutral-500">{exp.company}</p>
                      </div>
                    </div>
                    <p className="mb-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                      {exp.description}
                    </p>
                    <span className="inline-block rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
                      {exp.startDate} — {exp.endDate || "Present"}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
