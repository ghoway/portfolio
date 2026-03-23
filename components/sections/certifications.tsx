import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { Award, ExternalLink, Calendar } from "lucide-react";

export async function CertificationsSection() {
  const certifications = await prisma.certification.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });

  if (certifications.length === 0) return null;

  return (
    <section id="certifications" className="bg-neutral-50/50 py-24 dark:bg-neutral-900/20 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-16 max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Licenses & <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">Certifications</span>
          </h2>
          <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
            Professional accomplishments and verified credentials.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {certifications.map((cert) => (
            <div
              key={cert.id}
              className="group overflow-hidden rounded-3xl border border-neutral-200/60 bg-white transition-all hover:border-violet-200 hover:shadow-2xl hover:shadow-violet-500/10 dark:border-neutral-800/60 dark:bg-neutral-900/50 dark:hover:border-violet-800/60"
            >
              {cert.imageUrl ? (
                <div className="relative aspect-video w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                  <Image
                    src={cert.imageUrl}
                    alt={cert.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="flex aspect-video w-full items-center justify-center bg-gradient-to-br from-violet-100 to-indigo-50 dark:from-violet-900/20 dark:to-indigo-900/20">
                  <Award className="h-16 w-16 text-violet-300 dark:text-violet-700/50" />
                </div>
              )}
              
              <div className="p-6 sm:p-8">
                <h3 className="mb-2 text-xl font-bold">{cert.title}</h3>
                <p className="mb-4 text-sm font-medium text-violet-600 dark:text-violet-400">
                  {cert.issuer}
                </p>
                <div className="mb-6 flex flex-col gap-2 text-sm text-neutral-500">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Issued {cert.issueDate}</span>
                  </div>
                  {cert.expiryDate && (
                    <div className="flex items-center gap-2 text-neutral-400">
                      <Calendar className="h-4 w-4 opacity-50" />
                      <span>Expires {cert.expiryDate}</span>
                    </div>
                  )}
                  {cert.credentialId && (
                    <span className="font-mono text-xs text-neutral-400">ID: {cert.credentialId}</span>
                  )}
                </div>
                
                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-50 px-4 py-2.5 text-sm font-semibold text-violet-600 transition-colors hover:bg-violet-100 dark:bg-violet-900/30 dark:text-violet-300 dark:hover:bg-violet-900/50"
                  >
                    Verify Credential <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
