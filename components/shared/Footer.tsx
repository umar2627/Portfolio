"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowUp, FiGithub } from "react-icons/fi";
import { fadeUp } from "@/components/animations/variants";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/config/site";

export function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative border-t border-white/[0.05]">
      <section className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-8"
        >
          <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
            Let&apos;s build something{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              remarkable together.
            </span>
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              onClick={() =>
                document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Say Hello
            </Button>
            <a href={siteConfig.links.github} target="_blank" rel="noopener noreferrer">
              <Button variant="secondary" className="gap-2">
                <FiGithub className="h-4 w-4" />
                Github
              </Button>
            </a>
          </div>
        </motion.div>
      </section>

      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-white/[0.05] px-4 py-6 sm:flex-row sm:px-6 lg:px-8">
        <Link href="/" className="font-mono text-sm text-text-secondary hover:text-white">
          ← Back to home
        </Link>
        <Link href="/" className="font-mono text-sm font-bold text-white">
          <span className="text-accent-purple">&lt;</span>
          Umar Khan Portfolio
          <span className="text-accent-purple"> /&gt;</span>
        </Link>
        <div className="flex items-center gap-4">
          <a
            href={siteConfig.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-text-secondary hover:text-white"
          >
            <FiGithub className="h-4 w-4" />
            View all on GitHub
          </a>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1 text-sm text-text-secondary hover:text-white"
          >
            <FiArrowUp className="h-4 w-4" />
            Top
          </button>
        </div>
      </div>
      <p className="pb-6 text-center text-xs text-text-muted">
        © {new Date().getFullYear()} Umar Khan - All rights reserved.
      </p>
    </footer>
  );
}
