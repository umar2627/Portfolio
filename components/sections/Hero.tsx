"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import TypeIt from "typeit";
import { FiGithub, FiDownload } from "react-icons/fi";
import { FaLinkedin, FaTwitter } from "react-icons/fa";
import { Button } from "@/components/ui/Button";
import { useResume } from "@/hooks/useResume";
import { Badge } from "@/components/ui/Badge";
import { siteConfig } from "@/lib/config/site";
import { fadeUp, staggerContainer } from "@/components/animations/variants";

const techStack = [ "SFCC B2C", "React", "TypeScript", "Next.js", "Node.js", "Tailwind CSS", "PostgreSQL", "Supabase"];

const stats = [
  { value: "3+", label: "Years Exp." },
  { value: "20+", label: "Projects" },
];

function FloatingShapes() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-1/4 top-20 h-16 w-16 rounded-full border border-accent-purple/20 bg-accent-purple/5"
      />
      <motion.div
        animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-1/4 top-40 h-12 w-12 rotate-45 border border-accent-blue/20 bg-accent-blue/5"
      />
      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-1/3 bottom-32 h-0 w-0 border-l-[20px] border-r-[20px] border-b-[35px] border-l-transparent border-r-transparent border-b-accent-pink/20"
      />
    </div>
  );
}

function CodeWindow() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-card/80 shadow-2xl backdrop-blur-sm">
      <div className="flex items-center gap-2 border-b border-white/[0.05] px-4 py-3">
        <div className="h-3 w-3 rounded-full bg-red-500/80" />
        <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
        <div className="h-3 w-3 rounded-full bg-green-500/80" />
        <span className="ml-2 font-mono text-xs text-text-muted">portfolio.tsx</span>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed">
        <code>
          <span className="text-purple-400">const</span>{" "}
          <span className="text-blue-400">developer</span> = {"{"}
          {"\n"}  <span className="text-green-400">name</span>:{" "}
          <span className="text-yellow-300">&apos;Your Name&apos;</span>,{"\n"}{" "}
          <span className="text-green-400">role</span>:{" "}
          <span className="text-yellow-300">&apos;Full Stack Developer&apos;</span>,{"\n"}{" "}
          <span className="text-green-400">skills</span>: [
          {"\n"}    <span className="text-yellow-300">&apos;React&apos;</span>,{" "}
          <span className="text-yellow-300">&apos;TypeScript&apos;</span>,{"\n"}    <span className="text-yellow-300">&apos;Node.js&apos;</span>,{" "}
          <span className="text-yellow-300">&apos;PostgreSQL&apos;</span>
          {"\n"}  ],{"\n"}  <span className="text-green-400">available</span>:{" "}
          <span className="text-cyan-400">true</span>
          {"\n"}{"}"};
        </code>
      </pre>
    </div>
  );
}

export function Hero() {
  const typingRef = useRef<HTMLSpanElement>(null);
  const { isLoading: isResumeLoading, openResume } = useResume();

  useEffect(() => {
    if (!typingRef.current) return;
    const instance = new TypeIt(typingRef.current, {
      strings: techStack,
      speed: 40,
      deleteSpeed: 40,
      loop: true,
      breakLines: false,
    }).go();
    return () => instance.destroy();
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden pt-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-0 h-[500px] w-[500px] bg-gradient-radial-purple blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] bg-gradient-radial-blue blur-3xl" />
      </div>
      <FloatingShapes />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid items-center gap-12 lg:grid-cols-2"
        >
          <motion.div variants={fadeUp} className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent-green/30 bg-accent-green/10 px-4 py-1.5">
              <span className="h-2 w-2 animate-pulse-glow rounded-full bg-accent-green" />
              <span className="text-sm font-medium text-accent-green">
                Open to opportunities
              </span>
            </div>

            <h1 className="text-5xl font-bold leading-tight tracking-tight text-white md:text-6xl lg:text-7xl">
              Building{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Scalable Systems
              </span>{" "}
              & Interfaces.
            </h1>

            <p className="max-w-lg text-lg leading-relaxed text-text-secondary">
              {siteConfig.description}
            </p>

            <div className="flex flex-wrap gap-2">
              {techStack.slice(0, 8).map((tech) => (
                <Badge key={tech}>{tech}</Badge>
              ))}
            </div>

            <p className="font-mono text-sm text-text-muted">
              Currently working with{" "}
              <span ref={typingRef} className="text-accent-purple" />
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Button
                onClick={() =>
                  document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth" })
                }
              >
                View Work
              </Button>
              <Button
                variant="secondary"
                onClick={() =>
                  document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Get in touch
              </Button>
              <Button
                variant="ghost"
                className="gap-2"
                isLoading={isResumeLoading}
                onClick={() => openResume()}
              >
                <FiDownload className="h-4 w-4" />
                Resume
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <a
                href={siteConfig.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary transition-colors hover:text-white"
              >
                <FiGithub className="h-5 w-5" />
              </a>
              <a
                href={siteConfig.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary transition-colors hover:text-white"
              >
                <FaLinkedin className="h-5 w-5" />
              </a>
              <a
                href={siteConfig.links.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary transition-colors hover:text-white"
              >
                <FaTwitter className="h-5 w-5" />
              </a>
            </div>

            <div className="flex items-center gap-6 border-t border-white/[0.05] pt-6">
              {stats.map((stat, i) => (
                <div key={stat.label} className="flex items-center gap-6">
                  <div>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-xs text-text-muted">{stat.label}</p>
                  </div>
                  {i < stats.length - 1 && (
                    <div className="h-8 w-px bg-white/10" />
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="space-y-4">
            <CodeWindow />
            <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-card/50 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-green/10">
                <span className="h-2 w-2 rounded-full bg-accent-green" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Current Status</p>
                <p className="text-xs text-text-muted">Available for new projects</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
