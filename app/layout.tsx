import type { Metadata } from "next";
import { Suspense } from "react";
import Script from "next/script";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { TopLoader } from "@/components/top-loader";
import { getSiteSettings } from "@/actions/settings";
import "highlight.js/styles/github-dark.css";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const title = settings.site_title || "Wahyu Hidayatullah - Portfolio";
  const description = settings.meta_description || "Personal portfolio of Wahyu Hidayatullah";
  const keywords = settings.meta_keywords || "AI, Web Development, Backend, Full Stack Developer";
  const author = settings.site_author || "Wahyu Hidayatullah";
  const ogImage = settings.og_image_url || "";

  const metadata: Metadata = {
    metadataBase: new URL("https://www.wahidayatullah.my.id"),
    title,
    description,
    keywords,
    authors: [{ name: author }],
    icons: {
      icon: [
        { url: "/favicon.svg", type: "image/svg+xml" },
      ],
      apple: [
        { url: "/favicon.svg" },
      ],
    },
    openGraph: {
      title,
      description,
      url: "https://www.wahidayatullah.my.id",
      siteName: title,
      locale: "id_ID",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };

  if (ogImage) {
    metadata.openGraph = {
      ...metadata.openGraph,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    };
  }

  return metadata;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          id="theme-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
        <ThemeProvider>
          <Suspense fallback={null}>
            <TopLoader />
          </Suspense>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
