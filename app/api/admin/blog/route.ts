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

  await prisma.blogPost.update({
    where: { id },
    data: {
      title,
      slug: slugify(title),
      content: form.get("content") as string,
      excerpt: (form.get("excerpt") as string) || null,
      seoTitle: (form.get("seoTitle") as string) || null,
      seoDescription: (form.get("seoDescription") as string) || null,
      status: (form.get("status") as string) || "DRAFT",
      tags: (form.get("tags") as string) || "",
      category: (form.get("category") as string) || "General",
      coverImageUrl: (form.get("coverImageUrl") as string) || null,
    },
  });

  return NextResponse.json({ success: true });
}
