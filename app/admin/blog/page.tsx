import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Pencil, Eye } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { DeleteBlogButton } from "./delete-button";

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Blog</h1>
          <p className="text-sm text-neutral-500">Manage your blog posts</p>
        </div>
        <Link href="/admin/blog/new" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25">
          <Plus className="h-4 w-4" />New Post
        </Link>
      </div>

      <div className="space-y-3">
        {posts.map((post) => (
          <div key={post.id} className="flex items-center justify-between rounded-xl border border-neutral-200/60 bg-white p-4 dark:border-neutral-800/60 dark:bg-neutral-900">
            <div>
              <h3 className="font-medium">{post.title}</h3>
              <div className="mt-1 flex items-center gap-2 text-sm text-neutral-500">
                <span className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs dark:bg-neutral-800">{post.category}</span>
                <span className={`rounded px-1.5 py-0.5 text-xs ${post.status === "PUBLISHED" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"}`}>{post.status}</span>
                <span>{formatDate(post.createdAt)}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {post.status === "PUBLISHED" && (
                <Link href={`/blog/${post.slug}`} className="rounded-lg p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"><Eye className="h-4 w-4 text-neutral-500" /></Link>
              )}
              <Link href={`/admin/blog/${post.id}/edit`} className="rounded-lg p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"><Pencil className="h-4 w-4 text-neutral-500" /></Link>
              <DeleteBlogButton id={post.id} />
            </div>
          </div>
        ))}
        {posts.length === 0 && <p className="text-center text-neutral-500 py-8">No posts yet. Create your first blog post!</p>}
      </div>
    </div>
  );
}
