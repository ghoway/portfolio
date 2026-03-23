"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ExternalLink, Github, ArrowRight } from "lucide-react";
import type { ProjectData } from "@/types";

interface ProjectsSectionProps {
  data: ProjectData[];
}

export function ProjectsSection({ data }: ProjectsSectionProps) {
  const featured = data.filter((p) => p.featured);
  const display = featured.length > 0 ? featured : data.slice(0, 3);

  return (
    <section id="projects" className="py-24 bg-neutral-50/50 dark:bg-neutral-950/50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            Featured{" "}
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Projects
            </span>
          </h2>
          <div className="mx-auto h-1 w-20 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600" />
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {display.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group rounded-2xl border border-neutral-200/60 bg-white/80 backdrop-blur-sm transition-all hover:shadow-lg hover:shadow-violet-500/5 hover:-translate-y-1 dark:border-neutral-800/60 dark:bg-neutral-900/80"
            >
              {/* Card gradient top */}
              <div className="h-2 rounded-t-2xl bg-gradient-to-r from-violet-600 to-indigo-600" />

              <div className="p-6">
                <div className="mb-3 flex items-center justify-between">
                  <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
                    {project.category}
                  </span>
                  <div className="flex items-center gap-2">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                      >
                        <Github className="h-4 w-4" />
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>

                <h3 className="mb-2 text-lg font-semibold">{project.title}</h3>
                <p className="mb-4 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {project.techStack.split(",").map((tech) => (
                    <span
                      key={tech}
                      className="rounded-md bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
                    >
                      {tech.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm font-semibold text-violet-600 hover:underline dark:text-violet-400"
          >
            View All Projects
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
