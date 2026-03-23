import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function PUT(request: Request) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await request.formData();
  const id = form.get("id") as string;
  const title = form.get("title") as string;

  await prisma.project.update({
    where: { id },
    data: {
      title,
      slug: slugify(title),
      description: form.get("description") as string,
      techStack: form.get("techStack") as string,
      githubUrl: (form.get("githubUrl") as string) || null,
      liveUrl: (form.get("liveUrl") as string) || null,
      imageUrl: (form.get("imageUrl") as string) || null,
      category: (form.get("category") as string) || "Web",
      featured: form.get("featured") === "true",
      status: (form.get("status") as string) || "DRAFT",
      order: parseInt(form.get("order") as string) || 0,
    },
  });

  return NextResponse.json({ success: true });
}
