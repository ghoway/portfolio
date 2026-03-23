import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus } from "lucide-react";
import { ProjectList } from "./project-list";

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-sm text-neutral-500">Manage your portfolio projects</p>
        </div>
        <Link href="/admin/projects/new" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25">
          <Plus className="h-4 w-4" />New Project
        </Link>
      </div>

      <ProjectList initialProjects={projects} />
    </div>
  );
}
