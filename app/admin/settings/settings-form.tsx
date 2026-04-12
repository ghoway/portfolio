"use client";

import { useTransition, useRef } from "react";
import { updateSiteSettings } from "@/actions/settings";
import { useToast } from "@/components/toast";
import { Save, Sparkles, ExternalLink, Loader2, Mail, Info, ChevronDown } from "lucide-react";
import type { SiteSettingsMap } from "@/types";

const POPULAR_MODELS = [
  { id: "z-ai/glm-4.5-air:free",                  label: "GLM-4.5 Air",       badge: "Free" },
  { id: "google/gemini-2.0-flash-exp:free",        label: "Gemini 2.0 Flash",  badge: "Free" },
  { id: "google/gemini-1.5-flash:free",            label: "Gemini 1.5 Flash",  badge: "Free" },
  { id: "meta-llama/llama-3.3-70b-instruct:free",  label: "Llama 3.3 70B",    badge: "Free" },
  { id: "deepseek/deepseek-r1:free",               label: "DeepSeek R1",       badge: "Free" },
  { id: "anthropic/claude-3-haiku",                label: "Claude 3 Haiku",    badge: "Paid" },
  { id: "openai/gpt-4o-mini",                      label: "GPT-4o Mini",       badge: "Paid" },
];

const inputCls = "w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm dark:border-neutral-700 dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-violet-500/30";

export function SiteSettingsForm({ settings }: { settings: SiteSettingsMap }) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const currentModel = settings.ai_model || "z-ai/glm-4.5-air:free";

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await updateSiteSettings(formData);
        toast("Settings saved successfully!");
      } catch {
        toast("Failed to save settings.");
      }
    });
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      {/* General */}
      <div className="rounded-xl border border-neutral-200/60 bg-white p-6 dark:border-neutral-800/60 dark:bg-neutral-900">
        <h2 className="mb-4 text-lg font-semibold">General</h2>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Site Title</label>
            <input name="site_title" defaultValue={settings.site_title} className={inputCls} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Meta Description</label>
            <textarea name="meta_description" rows={2} defaultValue={settings.meta_description} className={`${inputCls} resize-none`} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Meta Keywords</label>
            <textarea name="meta_keywords" rows={2} defaultValue={settings.meta_keywords} placeholder="AI, Web Development, Networking" className={`${inputCls} resize-none`} />
            <p className="mt-1 text-xs text-neutral-400">Comma-separated keywords for SEO</p>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Site Author</label>
            <input name="site_author" defaultValue={settings.site_author} placeholder="Your Name" className={inputCls} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">OG Image URL</label>
            <input name="og_image_url" type="url" defaultValue={settings.og_image_url} placeholder="https://example.com/og-image.png" className={inputCls} />
            <p className="mt-1 text-xs text-neutral-400">Image for social media sharing (1200x630px recommended)</p>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Footer Text</label>
            <input name="footer_text" defaultValue={settings.footer_text} className={inputCls} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Default Theme</label>
            <div className="relative">
              <select name="default_theme" defaultValue={settings.default_theme} className={`${inputCls} appearance-none pr-10`}>
                <option value="system">System</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="rounded-xl border border-neutral-200/60 bg-white p-6 dark:border-neutral-800/60 dark:bg-neutral-900">
        <h2 className="mb-4 text-lg font-semibold">Social Links</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { name: "github_url", label: "GitHub URL" },
            { name: "linkedin_url", label: "LinkedIn URL" },
            { name: "twitter_url", label: "Twitter URL" },
            { name: "instagram_url", label: "Instagram URL" },
          ].map((f) => (
            <div key={f.name}>
              <label className="mb-1 block text-sm font-medium">{f.label}</label>
              <input name={f.name} defaultValue={settings[f.name]} className={inputCls} />
            </div>
          ))}
        </div>
      </div>

      {/* Contact Info */}
      <div className="rounded-xl border border-neutral-200/60 bg-white p-6 dark:border-neutral-800/60 dark:bg-neutral-900">
        <div className="mb-4 flex items-center gap-2">
          <Mail className="h-4 w-4 text-violet-600" />
          <h2 className="text-lg font-semibold">Contact Info</h2>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Public Email</label>
          <input
            name="contact_email"
            type="email"
            defaultValue={settings.contact_email}
            placeholder="hi@yourname.com"
            className={inputCls}
          />
          <p className="mt-1.5 text-xs text-neutral-400">Shown publicly on your contact section and footer.</p>
        </div>
      </div>

      {/* Email Forwarding */}
      <div className="rounded-xl border border-violet-200/60 bg-white p-6 dark:border-violet-900/30 dark:bg-neutral-900">
        <div className="mb-1 flex items-center gap-2">
          <Mail className="h-4 w-4 text-violet-600" />
          <h2 className="text-lg font-semibold">Email Forwarding</h2>
        </div>
        <p className="mb-4 text-xs text-neutral-500">
          Messages are always saved in your admin panel. Configure SMTP below to also receive them in your inbox.
        </p>

        <div className="mb-5 flex gap-2 rounded-lg border border-blue-200/60 bg-blue-50 p-3 text-xs text-blue-700 dark:border-blue-900/30 dark:bg-blue-950/20 dark:text-blue-300">
          <Info className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
          <span>
            Since you use <strong>Cloudflare</strong>, the easiest option is{" "}
            <a href="https://resend.com" target="_blank" rel="noopener noreferrer" className="underline font-medium">Resend.com</a>
            {" "}(free tier: 3,000 emails/month). Add your domain in Resend, then paste the SMTP credentials below.
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium">SMTP Host</label>
            <input name="smtp_host" defaultValue={settings.smtp_host} placeholder="smtp.resend.com" className={`${inputCls} font-mono`} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">SMTP Port</label>
            <input name="smtp_port" defaultValue={settings.smtp_port || "587"} placeholder="587" className={`${inputCls} font-mono`} />
            <p className="mt-1 text-xs text-neutral-400">587 (TLS) or 465 (SSL)</p>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">SMTP Username</label>
            <input name="smtp_user" defaultValue={settings.smtp_user} placeholder="resend" className={inputCls} />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium">SMTP Password / API Key</label>
            <input name="smtp_pass" type="password" defaultValue={settings.smtp_pass} placeholder="••••••••••••" className={inputCls} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">From Address</label>
            <input name="smtp_from" type="email" defaultValue={settings.smtp_from} placeholder="hi@wahidayatullah.my.id" className={inputCls} />
            <p className="mt-1 text-xs text-neutral-400">Must be verified in your SMTP provider</p>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Forward To (Your Inbox)</label>
            <input name="smtp_to" type="email" defaultValue={settings.smtp_to || "wahidayatullah17@gmail.com"} placeholder="wahidayatullah17@gmail.com" className={inputCls} />
            <p className="mt-1 text-xs text-neutral-400">Where forwarded messages are delivered</p>
          </div>
        </div>
      </div>

      {/* AI Settings */}
      <div className="rounded-xl border border-violet-200/60 bg-white p-6 dark:border-violet-900/30 dark:bg-neutral-900">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-violet-600" />
            <h2 className="text-lg font-semibold">AI Model</h2>
          </div>
          <a href="https://openrouter.ai/models" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-violet-600 hover:underline">
            Browse all models <ExternalLink className="h-3 w-3" />
          </a>
        </div>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Model ID</label>
            <input name="ai_model" defaultValue={currentModel} placeholder="e.g. z-ai/glm-4.5-air:free" className={`${inputCls} font-mono`} />
            <p className="mt-1.5 text-xs text-neutral-400">
              Any model from OpenRouter. Models ending in{" "}
              <code className="rounded bg-neutral-100 px-1 dark:bg-neutral-800">:free</code> cost nothing.
            </p>
          </div>
          <div>
            <p className="mb-2 text-xs font-medium text-neutral-500">Quick pick:</p>
            <div className="flex flex-wrap gap-2">
              {POPULAR_MODELS.map((m) => (
                <label key={m.id}
                  className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1.5 text-xs hover:border-violet-300 hover:bg-violet-50 dark:border-neutral-700 dark:hover:border-violet-800 dark:hover:bg-violet-950/20">
                  <input type="radio" name="ai_model" value={m.id}
                    defaultChecked={currentModel === m.id}
                    className="h-3 w-3 accent-violet-600" />
                  <span className="font-medium">{m.label}</span>
                  <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                    m.badge === "Free"
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                      : "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
                  }`}>{m.badge}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        {isPending ? "Saving..." : "Save Settings"}
      </button>
    </form>
  );
}
