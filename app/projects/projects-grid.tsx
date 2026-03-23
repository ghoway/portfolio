"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import type { ProjectData } from "@/types";

interface ProjectsGridProps {
  projects: ProjectData[];
}

export function ProjectsGrid({ projects }: ProjectsGridProps) {
  const [filter, setFilter] = useState("All");

  const categories = ["All", ...new Set(projects.map((p) => p.category))];
  const filtered = filter === "All" ? projects : projects.filter((p) => p.category === filter);

  return (
    <>
      {/* Category Filter */}
      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
              filter === cat
                ? "bg-violet-600 text-white shadow-lg shadow-violet-500/25"
                : "border border-neutral-200 hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((project, i) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="group rounded-2xl border border-neutral-200/60 bg-white/80 backdrop-blur-sm transition-all hover:shadow-lg hover:shadow-violet-500/5 hover:-translate-y-1 dark:border-neutral-800/60 dark:bg-neutral-900/80"
          >
            <div className="h-2 rounded-t-2xl bg-gradient-to-r from-violet-600 to-indigo-600" />
            <div className="p-6">
              <div className="mb-3 flex items-center justify-between">
                <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
                  {project.category}
                </span>
                {project.featured && (
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                    Featured
                  </span>
                )}
              </div>
              <h3 className="mb-2 text-lg font-semibold">{project.title}</h3>
              <p className="mb-4 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                {project.description}
              </p>
              <div className="mb-4 flex flex-wrap gap-1.5">
                {project.techStack.split(",").map((tech) => (
                  <span
                    key={tech}
                    className="rounded-md bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
                  >
                    {tech.trim()}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-3">
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white">
                    <Github className="h-4 w-4" />Code
                  </a>
                )}
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white">
                    <ExternalLink className="h-4 w-4" />Demo
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
}
