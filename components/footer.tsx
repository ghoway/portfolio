import { getSiteSettings } from "@/actions/settings";
import { getHero } from "@/actions/hero";
import { Github, Linkedin, Twitter, Instagram, Terminal, Mail } from "lucide-react";
import Link from "next/link";

const footerLinks = [
  { href: "/#about",          label: "About" },
  { href: "/#experience",     label: "Experience" },
  { href: "/#skills",         label: "Skills" },
  { href: "/#certifications", label: "Certifications" },
  { href: "/projects",        label: "Projects" },
  { href: "/blog",            label: "Blog" },
  { href: "/#contact",        label: "Contact" },
];

export async function Footer() {
  const [settings, hero] = await Promise.all([getSiteSettings(), getHero()]);

  const socialLinks = [
    { url: settings.github_url,    icon: Github,    label: "GitHub" },
    { url: settings.linkedin_url,  icon: Linkedin,  label: "LinkedIn" },
    { url: settings.twitter_url,   icon: Twitter,   label: "Twitter" },
    { url: settings.instagram_url, icon: Instagram, label: "Instagram" },
  ].filter((l) => l.url);

  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-neutral-200/50 bg-white dark:border-neutral-800/50 dark:bg-neutral-950">
      {/* Subtle gradient accent at top */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Main footer body */}
        <div className="grid gap-10 py-14 md:grid-cols-3">

          {/* Brand column */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2 w-fit">
              <Terminal className="h-5 w-5 text-violet-600" />
              <span className="text-base font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                {hero?.name ?? settings.site_title ?? "Portfolio"}
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-neutral-500 dark:text-neutral-400 max-w-xs">
              {hero?.subtitle ?? "Building things for the web."}
            </p>
            {/* Social links */}
            {socialLinks.length > 0 && (
              <div className="flex items-center gap-2 mt-1">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200/80 text-neutral-500 transition-all hover:border-violet-200 hover:bg-violet-50 hover:text-violet-600 dark:border-neutral-800 dark:hover:border-violet-900 dark:hover:bg-violet-950/30 dark:hover:text-violet-400"
                  >
                    <link.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            )}
            {/* Contact email */}
            {settings.contact_email && (
              <a
                href={`mailto:${settings.contact_email}`}
                className="flex items-center gap-1.5 text-sm text-neutral-500 transition-colors hover:text-violet-600 dark:text-neutral-400 dark:hover:text-violet-400"
              >
                <Mail className="h-3.5 w-3.5" />
                {settings.contact_email}
              </a>
            )}
          </div>

          {/* Nav links — split into two columns */}
          <div className="col-span-2 grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Navigation
              </p>
              <ul className="space-y-2">
                {footerLinks.slice(0, 4).map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-neutral-500 transition-colors hover:text-violet-600 dark:text-neutral-400 dark:hover:text-violet-400"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                More
              </p>
              <ul className="space-y-2">
                {footerLinks.slice(4).map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-neutral-500 transition-colors hover:text-violet-600 dark:text-neutral-400 dark:hover:text-violet-400"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Built with
              </p>
              <ul className="space-y-2">
                {["Next.js 16", "Prisma ORM", "Tailwind CSS"].map((tech) => (
                  <li key={tech} className="text-sm text-neutral-500 dark:text-neutral-400">
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-neutral-100 py-6 text-xs text-neutral-400 dark:border-neutral-800/60 sm:flex-row">
          <p>
            {settings.footer_text || `© ${year} ${hero?.name ?? ""}. All rights reserved.`}
          </p>
          <p className="flex items-center gap-1">
            Crafted with
            <span className="mx-0.5 text-red-500">♥</span>
            by{" "}
            <span className="font-medium text-neutral-600 dark:text-neutral-300 ml-1">
              {hero?.name ?? "the author"}
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
