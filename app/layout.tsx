import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";
import "./(public)/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Umar Khan | Full Stack Developer",
    template: "%s | Umar Khan",
  },
  description:
    "Building scalable systems and beautiful interfaces. Full-stack developer portfolio.",
  keywords: [
    "full stack developer",
    "portfolio",
    "react",
    "next.js",
    "typescript",
  ],
  authors: [{ name: "Umar Khan" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Portfolio",
    title: "Umar Khan | Full Stack Developer",
    description:
      "Building scalable systems and beautiful interfaces.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Umar Khan | Full Stack Developer",
    description:
      "Building scalable systems and beautiful interfaces.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrains.variable} font-sans bg-blobs`}
      >
        <ThemeProvider>
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
