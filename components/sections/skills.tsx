"use client";

import { motion } from "framer-motion";
import type { SkillData } from "@/types";

interface SkillsSectionProps {
  data: SkillData[];
}

export function SkillsSection({ data }: SkillsSectionProps) {
  if (!data.length) return null;

  const categories = [...new Set(data.map((s) => s.category))];

  return (
    <section id="skills" className="py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            Skills &{" "}
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Technologies
            </span>
          </h2>
          <div className="mx-auto h-1 w-20 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600" />
        </motion.div>

        <div className="space-y-10">
          {categories.map((category, catIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: catIndex * 0.1 }}
            >
              <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                {category}
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {data
                  .filter((s) => s.category === category)
                  .map((skill, i) => (
                    <motion.div
                      key={skill.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                      className="rounded-xl border border-neutral-200/60 bg-white/50 p-4 backdrop-blur-sm dark:border-neutral-800/60 dark:bg-neutral-900/50"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <span className="font-medium">{skill.name}</span>
                        <span className="text-sm font-semibold text-violet-600 dark:text-violet-400">
                          {skill.level}%
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 1,
                            delay: 0.3 + i * 0.1,
                            ease: "easeOut",
                          }}
                          className="h-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-600"
                        />
                      </div>
                    </motion.div>
                  ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
