import { prisma } from "@/lib/prisma";
import { FileText, FolderOpen, MessageSquare, Mail } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [blogCount, projectCount, messageCount, unreadCount] = await Promise.all([
    prisma.blogPost.count(),
    prisma.project.count(),
    prisma.contactMessage.count(),
    prisma.contactMessage.count({ where: { isRead: false } }),
  ]);

  const stats = [
    { label: "Blog Posts", value: blogCount, icon: FileText, href: "/admin/blog", color: "violet" },
    { label: "Projects", value: projectCount, icon: FolderOpen, href: "/admin/projects", color: "indigo" },
    { label: "Messages", value: messageCount, icon: MessageSquare, href: "/admin/messages", color: "emerald" },
    { label: "Unread", value: unreadCount, icon: Mail, href: "/admin/messages", color: "amber" },
  ];

  const colorMap: Record<string, string> = {
    violet: "bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400",
    indigo: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400",
    emerald: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
    amber: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-neutral-500">Overview of your portfolio content</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-2xl border border-neutral-200/60 bg-white p-6 transition-all hover:shadow-md hover:-translate-y-0.5 dark:border-neutral-800/60 dark:bg-neutral-900"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-500">{stat.label}</p>
                <p className="mt-1 text-3xl font-bold">{stat.value}</p>
              </div>
              <div className={`rounded-xl p-3 ${colorMap[stat.color]}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { label: "New Blog Post", href: "/admin/blog/new", desc: "Write a new article" },
          { label: "New Project", href: "/admin/projects/new", desc: "Add a portfolio project" },
          { label: "View Messages", href: "/admin/messages", desc: "Check contact submissions" },
          { label: "Edit Hero", href: "/admin/hero", desc: "Update landing section" },
          { label: "Edit About", href: "/admin/about", desc: "Update your biography" },
          { label: "Site Settings", href: "/admin/settings", desc: "Configure site metadata" },
        ].map((a) => (
          <Link
            key={a.label}
            href={a.href}
            className="rounded-xl border border-neutral-200/60 bg-white p-5 transition-all hover:border-violet-300 hover:shadow-sm dark:border-neutral-800/60 dark:bg-neutral-900 dark:hover:border-violet-700"
          >
            <h3 className="font-medium">{a.label}</h3>
            <p className="mt-1 text-sm text-neutral-500">{a.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
