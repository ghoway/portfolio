"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  LayoutDashboard,
  Star,
  User,
  Briefcase,
  Zap,
  FolderOpen,
  FileText,
  MessageSquare,
  Settings,
  LogOut,
  Loader2,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  Award,
  Terminal,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { SessionProvider } from "next-auth/react";
import { ToastProvider } from "@/components/toast";

type SidebarLink = {
  href?: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: Array<{ href: string; label: string }>;
};

const sidebarLinks: SidebarLink[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/hero", label: "Hero Section", icon: Star },
  { href: "/admin/about", label: "About", icon: User },
  { href: "/admin/experience", label: "Experience", icon: Briefcase },
  { href: "/admin/skills", label: "Skills", icon: Zap },
  { href: "/admin/certifications", label: "Certifications", icon: Award },
  { href: "/admin/projects", label: "Projects", icon: FolderOpen },
  { href: "/admin/blog", label: "Blog", icon: FileText },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
  {
    label: "Settings",
    icon: Settings,
    children: [
      { href: "/admin/settings/site", label: "Site Settings" },
      { href: "/admin/settings/user", label: "User Settings" },
    ],
  },
];

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(pathname.startsWith("/admin/settings"));
  const isSettingsOpen = settingsOpen || pathname.startsWith("/admin/settings");

  // Login page gets a clean layout without sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 border-r border-neutral-200/60 bg-white dark:border-neutral-800/60 dark:bg-neutral-950 transition-transform md:sticky md:top-0 md:h-screen md:translate-x-0 md:shrink-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between border-b border-neutral-200/60 px-6 dark:border-neutral-800/60">
            <Link href="/admin" className="flex items-center gap-2 text-lg font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              <Terminal className="h-5 w-5 text-violet-600" />
              Admin
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden">
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto p-3">
            <div className="space-y-1">
              {sidebarLinks.map((link) => {
                const hasChildren = Boolean(link.children?.length);
                const isActive = hasChildren
                  ? link.children!.some((child) => pathname === child.href)
                  : pathname === link.href;

                if (hasChildren) {
                  return (
                    <div key={link.label} className="space-y-1">
                      <button
                        onClick={() => setSettingsOpen((prev) => !prev)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                          isActive
                            ? "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300"
                            : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
                        )}
                      >
                        <link.icon className="h-4 w-4" />
                        {link.label}
                        {isSettingsOpen ? (
                          <ChevronDown className="ml-auto h-4 w-4" />
                        ) : (
                          <ChevronRight className="ml-auto h-4 w-4" />
                        )}
                      </button>

                      {isSettingsOpen && (
                        <div className="ml-6 space-y-1 border-l border-neutral-200 pl-3 dark:border-neutral-800">
                          {link.children!.map((child) => {
                            const isChildActive = pathname === child.href;
                            return (
                              <Link
                                key={child.href}
                                href={child.href}
                                onClick={() => setSidebarOpen(false)}
                                className={cn(
                                  "block rounded-lg px-3 py-2 text-sm transition-all",
                                  isChildActive
                                    ? "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300"
                                    : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
                                )}
                              >
                                {child.label}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={link.href!}
                    href={link.href!}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                      isActive
                        ? "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300"
                        : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
                    )}
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                    {isActive && <ChevronRight className="ml-auto h-4 w-4" />}
                  </Link>
                );
              })}
            </div>
          </nav>

          <div className="border-t border-neutral-200/60 p-4 dark:border-neutral-800/60">
            <Link
              href="/" target="_blank"
              className="mb-3 block text-center text-xs text-neutral-400 hover:text-violet-500"
            >
              ← View Public Site
            </Link>
            <button
              onClick={() => setShowSignOutConfirm(true)}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/30"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sign Out Confirmation */}
      {showSignOutConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-sm rounded-2xl border border-neutral-200/60 bg-white p-6 shadow-2xl dark:border-neutral-800/60 dark:bg-neutral-900">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 dark:bg-red-950/30">
              <LogOut className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="mb-1 text-lg font-bold">Sign Out</h3>
            <p className="mb-6 text-sm text-neutral-500">Are you sure you want to sign out? You will need to log in again to access the admin panel.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSignOutConfirm(false)}
                disabled={isSigningOut}
                className="flex-1 rounded-xl border border-neutral-200 py-2.5 text-sm font-medium hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-70 dark:border-neutral-700 dark:hover:bg-neutral-800"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (isSigningOut) return;
                  setIsSigningOut(true);
                  await signOut({ callbackUrl: "/admin/login" });
                }}
                disabled={isSigningOut}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSigningOut ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing Out...
                  </>
                ) : (
                  "Sign Out"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-neutral-200/60 bg-white/80 px-4 backdrop-blur-xl dark:border-neutral-800/60 dark:bg-neutral-950/80 sm:px-6">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden">
            <Menu className="h-5 w-5" />
          </button>
          <div className="hidden md:block">
            <p className="text-sm text-neutral-500">
              Welcome back, <span className="font-medium text-neutral-900 dark:text-white">{session?.user?.name}</span>
            </p>
          </div>
          <ThemeToggle />
        </header>

        <main className="flex-1 overflow-y-auto bg-neutral-100/60 p-4 dark:bg-neutral-950 sm:p-6">
          <div className="min-h-full w-full rounded-2xl border border-dashed border-neutral-300/80 bg-neutral-50 p-5 dark:border-neutral-800 dark:bg-neutral-900/40 sm:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ToastProvider>
        <AdminLayoutInner>{children}</AdminLayoutInner>
      </ToastProvider>
    </SessionProvider>
  );
}
