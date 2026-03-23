"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function getProjects(options?: { featured?: boolean; status?: string; category?: string }) {
  return await prisma.project.findMany({
    where: {
      ...(options?.featured !== undefined && { featured: options.featured }),
      ...(options?.status && { status: options.status }),
      ...(options?.category && { category: options.category }),
    },
    orderBy: { order: "asc" },
  });
}

export async function getProjectBySlug(slug: string) {
  return await prisma.project.findUnique({ where: { slug } });
}

export async function createProject(formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  await prisma.project.create({
    data: {
      title,
      slug: slugify(title),
      description: formData.get("description") as string,
      content: (formData.get("content") as string) || null,
      techStack: formData.get("techStack") as string,
      githubUrl: (formData.get("githubUrl") as string) || null,
      liveUrl: (formData.get("liveUrl") as string) || null,
      imageUrl: (formData.get("imageUrl") as string) || null,
      category: formData.get("category") as string || "Web",
      featured: formData.get("featured") === "true",
      status: formData.get("status") as string || "DRAFT",
      order: parseInt(formData.get("order") as string) || 0,
    },
  });

  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/admin/projects");
}

export async function updateProject(formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") throw new Error("Unauthorized");

  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  await prisma.project.update({
    where: { id },
    data: {
      title,
      slug: slugify(title),
      description: formData.get("description") as string,
      content: (formData.get("content") as string) || null,
      techStack: formData.get("techStack") as string,
      githubUrl: (formData.get("githubUrl") as string) || null,
      liveUrl: (formData.get("liveUrl") as string) || null,
      imageUrl: (formData.get("imageUrl") as string) || null,
      category: formData.get("category") as string || "Web",
      featured: formData.get("featured") === "true",
      status: formData.get("status") as string || "DRAFT",
      order: parseInt(formData.get("order") as string) || 0,
    },
  });

  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/admin/projects");
}

export async function deleteProject(id: string) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") throw new Error("Unauthorized");

  await prisma.project.delete({ where: { id } });

  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/admin/projects");
}
