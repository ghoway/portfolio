"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function getBlogPosts(options?: { status?: string; category?: string; tag?: string }) {
  const posts = await prisma.blogPost.findMany({
    where: {
      ...(options?.status && { status: options.status }),
      ...(options?.category && { category: options.category }),
    },
    orderBy: { createdAt: "desc" },
  });

  if (options?.tag) {
    return posts.filter((post) => post.tags.split(",").map(t => t.trim()).includes(options.tag!));
  }

  return posts;
}

export async function getBlogPostBySlug(slug: string) {
  return await prisma.blogPost.findUnique({ where: { slug } });
}

export async function createBlogPost(formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  await prisma.blogPost.create({
    data: {
      title,
      slug: slugify(title),
      content: formData.get("content") as string,
      excerpt: (formData.get("excerpt") as string) || null,
      seoTitle: (formData.get("seoTitle") as string) || null,
      seoDescription: (formData.get("seoDescription") as string) || null,
      coverImageUrl: (formData.get("coverImageUrl") as string) || null,
      status: formData.get("status") as string || "DRAFT",
      tags: formData.get("tags") as string || "",
      category: formData.get("category") as string || "General",
    },
  });

  revalidatePath("/blog");
  revalidatePath("/admin/blog");
}

export async function updateBlogPost(formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") throw new Error("Unauthorized");

  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  await prisma.blogPost.update({
    where: { id },
    data: {
      title,
      slug: slugify(title),
      content: formData.get("content") as string,
      excerpt: (formData.get("excerpt") as string) || null,
      seoTitle: (formData.get("seoTitle") as string) || null,
      seoDescription: (formData.get("seoDescription") as string) || null,
      coverImageUrl: (formData.get("coverImageUrl") as string) || null,
      status: formData.get("status") as string || "DRAFT",
      tags: formData.get("tags") as string || "",
      category: formData.get("category") as string || "General",
    },
  });

  revalidatePath("/blog");
  revalidatePath("/admin/blog");
}

export async function deleteBlogPost(id: string) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") throw new Error("Unauthorized");

  await prisma.blogPost.delete({ where: { id } });

  revalidatePath("/blog");
  revalidatePath("/admin/blog");
}
