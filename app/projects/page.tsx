import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { prisma } from "@/lib/prisma";
import { ProjectsGrid } from "./projects-grid";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects - Wahyu Hidayatullah",
  description: "A collection of my work across different domains",
};

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { order: "asc" },
  });

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-8">
            <h1 className="mb-4 text-4xl font-bold">
              <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                Projects
              </span>
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400">
              A collection of my work across different domains
            </p>
          </div>
          <ProjectsGrid projects={projects} />
        </div>
      </main>
      <Footer />
    </>
  );
}
