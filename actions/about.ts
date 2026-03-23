"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

export async function getAbout() {
  return await prisma.aboutSection.findFirst();
}

export async function updateAbout(formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") throw new Error("Unauthorized");

  const id = formData.get("id") as string;
  await prisma.aboutSection.update({
    where: { id },
    data: {
      biography: formData.get("biography") as string,
      careerGoals: formData.get("careerGoals") as string,
      cvLink: (formData.get("cvLink") as string) || null,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/about");
}
