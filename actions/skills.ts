"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

export async function getSkills() {
  return await prisma.skill.findMany({ orderBy: { order: "asc" } });
}

export async function createSkill(formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") throw new Error("Unauthorized");

  await prisma.skill.create({
    data: {
      name: formData.get("name") as string,
      category: formData.get("category") as string,
      level: parseInt(formData.get("level") as string) || 50,
      icon: formData.get("icon") as string || "code",
      order: parseInt(formData.get("order") as string) || 0,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/skills");
}

export async function updateSkill(formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") throw new Error("Unauthorized");

  const id = formData.get("id") as string;
  await prisma.skill.update({
    where: { id },
    data: {
      name: formData.get("name") as string,
      category: formData.get("category") as string,
      level: parseInt(formData.get("level") as string) || 50,
      icon: formData.get("icon") as string || "code",
      order: parseInt(formData.get("order") as string) || 0,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/skills");
}

export async function deleteSkill(id: string) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") throw new Error("Unauthorized");

  await prisma.skill.delete({ where: { id } });

  revalidatePath("/");
  revalidatePath("/admin/skills");
}
