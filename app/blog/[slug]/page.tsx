import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { getBlogPostBySlug, getBlogPosts } from "@/actions/blog";
import { formatDate } from "@/lib/utils";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt || "",
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post || post.status !== "PUBLISHED") notFound();

  // Get related posts
  const allPosts = await getBlogPosts({ status: "PUBLISHED" });
  const related = allPosts
    .filter((p) => p.id !== post.id && p.category === post.category)
    .slice(0, 2);

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <article className="mx-auto max-w-3xl px-4 sm:px-6">
          <Link
            href="/blog"
            className="mb-8 inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>

          <header className="mb-10">
            <div className="mb-4 flex items-center gap-3">
              <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
                {post.category}
              </span>
              <span className="text-sm text-neutral-400">
                {formatDate(post.createdAt)}
              </span>
            </div>
            <h1 className="mb-4 text-3xl font-bold sm:text-4xl">{post.title}</h1>
            {post.tags && (
              <div className="flex flex-wrap gap-1.5">
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
          </header>

          <div className="prose-content text-neutral-700 dark:text-neutral-300">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
            >
              {post.content}
            </ReactMarkdown>
          </div>

          {/* Related Posts */}
          {related.length > 0 && (
            <div className="mt-16 border-t border-neutral-200 pt-10 dark:border-neutral-800">
              <h2 className="mb-6 text-xl font-semibold">Related Posts</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {related.map((r) => (
                  <Link
                    key={r.id}
                    href={`/blog/${r.slug}`}
                    className="rounded-xl border border-neutral-200/60 p-4 transition-all hover:shadow-md dark:border-neutral-800/60"
                  >
                    <h3 className="mb-1 font-medium hover:text-violet-600 dark:hover:text-violet-400">
                      {r.title}
                    </h3>
                    <p className="text-sm text-neutral-500">
                      {formatDate(r.createdAt)}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </main>
      <Footer />
    </>
  );
}
