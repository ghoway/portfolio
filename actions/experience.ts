"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

export async function getExperiences() {
  return await prisma.experience.findMany({ orderBy: { order: "asc" } });
}

export async function createExperience(formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") throw new Error("Unauthorized");

  await prisma.experience.create({
    data: {
      title: formData.get("title") as string,
      company: formData.get("company") as string,
      startDate: formData.get("startDate") as string,
      endDate: (formData.get("endDate") as string) || null,
      description: formData.get("description") as string,
      order: parseInt(formData.get("order") as string) || 0,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/experience");
}

export async function updateExperience(formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") throw new Error("Unauthorized");

  const id = formData.get("id") as string;
  await prisma.experience.update({
    where: { id },
    data: {
      title: formData.get("title") as string,
      company: formData.get("company") as string,
      startDate: formData.get("startDate") as string,
      endDate: (formData.get("endDate") as string) || null,
      description: formData.get("description") as string,
      order: parseInt(formData.get("order") as string) || 0,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/experience");
}

export async function deleteExperience(id: string) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") throw new Error("Unauthorized");

  await prisma.experience.delete({ where: { id } });

  revalidatePath("/");
  revalidatePath("/admin/experience");
}
