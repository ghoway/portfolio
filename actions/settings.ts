"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { compareSync, hashSync } from "bcryptjs";
import type { SiteSettingsMap } from "@/types";

export async function getSiteSettings(): Promise<SiteSettingsMap> {
  const settings = await prisma.siteSetting.findMany();
  const map: Record<string, string> = {};
  for (const s of settings) {
    map[s.key] = s.value;
  }
  return map as SiteSettingsMap;
}

export async function updateSiteSettings(formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") throw new Error("Unauthorized");

  const keys = [
    "site_title", "meta_description", "footer_text",
    "github_url", "linkedin_url", "twitter_url", "instagram_url",
    "default_theme", "ai_model",
    "contact_email",
    "smtp_host", "smtp_port", "smtp_user", "smtp_pass", "smtp_from", "smtp_to",
  ];

  for (const key of keys) {
    const value = formData.get(key) as string;
    if (value !== null && value !== undefined) {
      await prisma.siteSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value: value || "" },
      });
    }
  }

  revalidatePath("/");
  revalidatePath("/admin/settings");
}

export async function changeAdminPassword(formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") throw new Error("Unauthorized");

  const currentPassword = String(formData.get("currentPassword") || "");
  const newPassword = String(formData.get("newPassword") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");

  if (!currentPassword || !newPassword || !confirmPassword) {
    throw new Error("All password fields are required.");
  }

  if (newPassword.length < 8) {
    throw new Error("New password must be at least 8 characters.");
  }

  if (newPassword !== confirmPassword) {
    throw new Error("New password and confirmation do not match.");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    throw new Error("User not found.");
  }

  const isCurrentPasswordValid = compareSync(currentPassword, user.hashedPassword);
  if (!isCurrentPasswordValid) {
    throw new Error("Current password is incorrect.");
  }

  const isSameAsCurrent = compareSync(newPassword, user.hashedPassword);
  if (isSameAsCurrent) {
    throw new Error("New password must be different from your current password.");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { hashedPassword: hashSync(newPassword, 10) },
  });

  revalidatePath("/admin/settings");
}
