import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { getBlogPosts } from "@/actions/blog";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog - Wahyu Hidayatullah",
  description: "Articles about AI, Web Development, and Technology",
};

export default async function BlogPage() {
  const posts = await getBlogPosts({ status: "PUBLISHED" });

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-12">
            <h1 className="mb-4 text-4xl font-bold">
              <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                Blog
              </span>
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400">
              Thoughts on AI, web development, and technology
            </p>
          </div>

          {posts.length === 0 ? (
            <p className="text-neutral-500">No posts yet. Check back later!</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group rounded-2xl border border-neutral-200/60 bg-white/80 p-6 backdrop-blur-sm transition-all hover:shadow-lg hover:shadow-violet-500/5 hover:-translate-y-1 dark:border-neutral-800/60 dark:bg-neutral-900/80"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-medium text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
                      {post.category}
                    </span>
                    <span className="text-xs text-neutral-400">
                      {formatDate(post.createdAt)}
                    </span>
                  </div>
                  <h2 className="mb-2 text-lg font-semibold group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="mb-3 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
                      {post.excerpt}
                    </p>
                  )}
                  {post.tags && (
                    <div className="flex flex-wrap gap-1">
                      {post.tags.split(",").map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md bg-neutral-100 px-2 py-0.5 text-xs text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
                        >
                          #{tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
