"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createBlogPost } from "@/actions/blog";
import { Save, Sparkles, Wand2, Expand, Loader2, ChevronDown, ArrowLeft, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { ImageUpload } from "@/components/image-upload";
import { useToast } from "@/components/toast";
import { useSaveConfirm, SaveConfirm } from "@/components/save-confirm";

export default function NewBlogPostPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [content, setContent] = useState("");
  const [preview, setPreview] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [tone, setTone] = useState("professional");
  const [coverImage, setCoverImage] = useState("");
  const { isConfirming, confirmSave, cancelSave } = useSaveConfirm();
  const [pendingFormData, setPendingFormData] = useState<FormData | null>(null);

  function handleSubmitWrapper(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPendingFormData(new FormData(e.currentTarget));
    confirmSave();
  }

  async function handleSubmit() {
    if (!pendingFormData) return;
    try {
      pendingFormData.set("content", content);
      pendingFormData.set("coverImageUrl", coverImage);
      await createBlogPost(pendingFormData);
      toast("Blog post created successfully!");
      router.push("/admin/blog");
    } catch {
      toast("Failed to create blog post.");
    }
  }

  async function callAi(action: string) {
    setAiLoading(true);
    try {
      const topicInput = document.querySelector<HTMLInputElement>('input[name="title"]');
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          content: content || topicInput?.value || "",
          tone,
          topic: topicInput?.value || "",
        }),
      });
      const data = await res.json();
      if (data.error) toast(data.error);
      else if (data.result) setContent(data.result);
    } catch {
      toast("AI request failed — check your API key.");
    }
    setAiLoading(false);
  }

  return (
    <div>
      <Link href="/admin/blog" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100">
        <ArrowLeft className="h-4 w-4" /> Back to Blog
      </Link>
      
      <div className="mb-8">
        <h1 className="text-2xl font-bold">New Blog Post</h1>
        <p className="text-sm text-neutral-500">Create a new article for your blog</p>
      </div>

      <form onSubmit={handleSubmitWrapper} className="space-y-4">
        <ImageUpload
          onUpload={setCoverImage}
          folder="blog"
          label="Cover Image"
          aspectRatio="video"
          name="coverImageUrl"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="mb-1 block text-sm font-medium">Title</label><input name="title" required className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm dark:border-neutral-700 dark:bg-neutral-800" /></div>
          <div><label className="mb-1 block text-sm font-medium">Category</label><input name="category" defaultValue="General" className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm dark:border-neutral-700 dark:bg-neutral-800" /></div>
        </div>
        <div><label className="mb-1 block text-sm font-medium">Excerpt</label><input name="excerpt" className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm dark:border-neutral-700 dark:bg-neutral-800" /></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="mb-1 block text-sm font-medium">SEO Title</label><input name="seoTitle" className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm dark:border-neutral-700 dark:bg-neutral-800" /></div>
          <div><label className="mb-1 block text-sm font-medium">SEO Description</label><input name="seoDescription" className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm dark:border-neutral-700 dark:bg-neutral-800" /></div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="mb-1 block text-sm font-medium">Tags (comma-separated)</label><input name="tags" placeholder="nextjs,react,typescript" className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm dark:border-neutral-700 dark:bg-neutral-800" /></div>
          <div>
            <label className="mb-1 block text-sm font-medium">Status</label>
            <div className="relative">
              <select name="status" className="w-full appearance-none rounded-xl border border-neutral-200 bg-white px-4 py-3 pr-10 text-sm dark:border-neutral-700 dark:bg-neutral-800">
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
            </div>
          </div>
        </div>

        {/* AI Assistant */}
        <div className="rounded-xl border border-violet-200 bg-violet-50/50 p-4 dark:border-violet-800/30 dark:bg-violet-950/20">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-violet-600" />
            <span className="text-sm font-semibold text-violet-700 dark:text-violet-300">AI Blog Assistant</span>
          </div>
          <div className="flex flex-wrap gap-2">
          <div className="relative">
            <select value={tone} onChange={(e) => setTone(e.target.value)} className="appearance-none rounded-lg border border-violet-200 bg-white py-1.5 pl-3 pr-8 text-sm dark:border-violet-800 dark:bg-neutral-900">
              <option value="professional">Professional</option>
              <option value="technical">Technical</option>
              <option value="casual">Casual</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-500" />
          </div>
            <button type="button" onClick={() => callAi("generate")} disabled={aiLoading} className="inline-flex items-center gap-1.5 rounded-lg bg-violet-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50">
              {aiLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}Generate
            </button>
            <button type="button" onClick={() => callAi("improve")} disabled={aiLoading} className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">
              <Wand2 className="h-3.5 w-3.5" />Improve
            </button>
            <button type="button" onClick={() => callAi("expand")} disabled={aiLoading} className="inline-flex items-center gap-1.5 rounded-lg bg-purple-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50">
              <Expand className="h-3.5 w-3.5" />Expand
            </button>
          </div>
        </div>

        {/* Content Editor with Preview */}
        <div>
          <div className="mb-2 flex items-center gap-2">
            <label className="text-sm font-medium">Content (Markdown)</label>
            <button type="button" onClick={() => setPreview(!preview)} className="rounded-md border px-2.5 py-0.5 text-xs font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800">
              {preview ? "Edit" : "Preview"}
            </button>
          </div>
          {preview ? (
            <div className="min-h-[400px] rounded-xl border border-neutral-200 bg-white p-6 prose-content dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
              >
                {content}
              </ReactMarkdown>
            </div>
          ) : (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={15}
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 font-mono text-sm dark:border-neutral-700 dark:bg-neutral-800"
              placeholder="Write your blog post in Markdown..."
            />
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Link href="/admin/blog" className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 text-red-600 px-6 py-2.5 text-sm font-medium hover:bg-red-100 dark:border-red-900/30 dark:bg-red-950/20 dark:hover:bg-red-900/40">
            <X className="h-4 w-4" />Cancel
          </Link>
          <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25">
            <Save className="h-4 w-4" />Create Post
          </button>
        </div>
      </form>

      <SaveConfirm 
        isOpen={isConfirming}
        onCancel={() => { cancelSave(); setPendingFormData(null); }}
        onConfirm={async () => {
          cancelSave();
          await handleSubmit();
        }}
        title="Create Post"
        description="Are you sure you want to create and publish this post?"
        confirmText="Create Post"
      />
    </div>
  );
}
