"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { sendContactEmail } from "@/lib/email";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export async function submitContactForm(formData: FormData) {
  const data = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    subject: formData.get("subject") as string,
    message: formData.get("message") as string,
  };

  const parsed = contactSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  // Save to DB
  await prisma.contactMessage.create({ data: parsed.data });

  // Forward via email (non-blocking — don't fail submission if email fails)
  try {
    await sendContactEmail({
      senderName: parsed.data.name,
      senderEmail: parsed.data.email,
      subject: parsed.data.subject,
      message: parsed.data.message,
    });
  } catch (err) {
    console.warn("Email forwarding failed (SMTP may not be configured):", err);
  }

  revalidatePath("/admin/messages");
  return { success: true };
}

export async function getContactMessages() {
  return await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function markMessageAsRead(id: string) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") throw new Error("Unauthorized");

  await prisma.contactMessage.update({
    where: { id },
    data: { isRead: true },
  });

  revalidatePath("/admin/messages");
}

export async function deleteMessage(id: string) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") throw new Error("Unauthorized");

  await prisma.contactMessage.delete({ where: { id } });

  revalidatePath("/admin/messages");
}
