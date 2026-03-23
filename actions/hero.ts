"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

export async function getHero() {
  const hero = await prisma.heroSection.findFirst();
  return hero;
}

export async function updateHero(formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") throw new Error("Unauthorized");

  const id = formData.get("id") as string;
  await prisma.heroSection.update({
    where: { id },
    data: {
      name: formData.get("name") as string,
      subtitle: formData.get("subtitle") as string,
      description: formData.get("description") as string,
      showHireMe: formData.get("showHireMe") === "true",
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/hero");
}
