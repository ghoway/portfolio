"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Menu, X, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

// Anchor-based links map section IDs to nav labels
const anchorLinks = [
  { id: "hero",           label: "Home" },
  { id: "about",          label: "About" },
  { id: "experience",     label: "Experience" },
  { id: "skills",         label: "Skills" },
  { id: "certifications", label: "Certifications" },
  { id: "projects",       label: "Projects" },
  { id: "contact",        label: "Contact" },
];

const navLinks = [
  { href: "/",                label: "Home",           sectionId: "hero" },
  { href: "/#about",          label: "About",          sectionId: "about" },
  { href: "/#experience",     label: "Experience",     sectionId: "experience" },
  { href: "/#skills",         label: "Skills",         sectionId: "skills" },
  { href: "/#certifications", label: "Certifications", sectionId: "certifications" },
  { href: "/projects",        label: "Projects",       sectionId: null },
  { href: "/blog",            label: "Blog",           sectionId: null },
  { href: "/#contact",        label: "Contact",        sectionId: "contact" },
];

export function Navbar({ name: nameProp }: { name?: string }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [name, setName] = useState(nameProp ?? "");

  // Fetch hero name on pages where it isn't passed as a prop
  useEffect(() => {
    if (!nameProp) {
      fetch("/api/admin/hero")
        .then((r) => r.json())
        .then((data) => { if (data?.name) setName(data.name); })
        .catch(() => {});
    }
  }, [nameProp]);

  // Scroll-based active section detection (only on home page)
  useEffect(() => {
    if (pathname !== "/") return;

    const sectionIds = anchorLinks.map((l) => l.id);
    const observers: IntersectionObserver[] = [];

    const handleIntersect = (id: string) => (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(id);
        }
      });
    };

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(handleIntersect(id), {
        rootMargin: "-40% 0px -55% 0px",
        threshold: 0,
      });
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [pathname]);

  function isActive(link: (typeof navLinks)[0]): boolean {
    // For non-home pages (/projects, /blog)
    if (link.sectionId === null) return pathname === link.href;
    // For home-page anchors, use scroll detection
    if (pathname === "/") return activeSection === link.sectionId;
    return false;
  }

  const linkClass = (link: (typeof navLinks)[0]) =>
    cn(
      "rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800",
      isActive(link)
        ? "text-violet-600 dark:text-violet-400"
        : "text-neutral-600 dark:text-neutral-400"
    );

  return (
    <header className="fixed top-0 z-50 w-full border-b border-neutral-200/50 bg-white/80 backdrop-blur-xl dark:border-neutral-800/50 dark:bg-neutral-950/80">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Terminal className="h-6 w-6 text-violet-600 flex-shrink-0" />
          {name && (
            <span className="text-lg font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              {name}
            </span>
          )}
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className={linkClass(link)}>
              {link.label}
            </Link>
          ))}
          <div className="ml-2">
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Controls */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 dark:border-neutral-700"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-neutral-200/50 bg-white/95 backdrop-blur-xl dark:border-neutral-800/50 dark:bg-neutral-950/95 md:hidden">
          <div className="flex flex-col gap-1 p-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={linkClass(link)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
