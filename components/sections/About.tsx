"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { Card } from "@/components/ui/Card";
import { siteConfig } from "@/lib/config/site";
import { fadeUp, staggerContainer } from "@/components/animations/variants";

interface AboutProps {
  bio?: string;
  profileImage?: string;
  name?: string;
  title?: string;
}

export function About({ bio, profileImage, name, title }: AboutProps) {
  const displayName = name || siteConfig.name;
  const displayTitle = title || siteConfig.title;
  const defaultBio = `I'm a passionate full-stack developer with expertise in building scalable web applications. I enjoy turning complex problems into simple, beautiful, and intuitive solutions.

When I'm not coding, you can find me exploring new technologies, contributing to open source, or sharing knowledge with the developer community.`;

  return (
    <div className="grid gap-12 lg:grid-cols-5">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="lg:col-span-2"
      >
        <Card hover={false} className="p-6 text-center">
          <div className="mx-auto mb-4 h-48 w-48 overflow-hidden rounded-2xl bg-gradient-primary p-[2px]">
            <div className="h-full w-full overflow-hidden rounded-2xl bg-card">
              {profileImage ? (
                <Image
                  src={profileImage}
                  alt={displayName}
                  width={192}
                  height={192}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent-purple/20 to-accent-pink/20 text-4xl font-bold text-white">
                  {displayName.charAt(0)}
                </div>
              )}
            </div>
          </div>
          <h3 className="text-xl font-bold text-white">{displayName}</h3>
          <p className="text-sm text-text-secondary">{displayTitle}</p>
          <div className="mt-4 flex justify-center gap-3">
            <a
              href={siteConfig.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.08] text-text-secondary transition-colors hover:border-white/20 hover:text-white"
            >
              <FaGithub className="h-4 w-4" />
            </a>
            <a
              href={siteConfig.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.08] text-text-secondary transition-colors hover:border-white/20 hover:text-white"
            >
              <FaLinkedin className="h-4 w-4" />
            </a>
            <a
              href={siteConfig.links.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.08] text-text-secondary transition-colors hover:border-white/20 hover:text-white"
            >
              <FaTwitter className="h-4 w-4" />
            </a>
          </div>
        </Card>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="space-y-8 lg:col-span-3"
      >
        <motion.div variants={fadeUp}>
          <h2 className="mb-4 text-3xl font-bold text-white">
            I build things for the web.
          </h2>
          <div className="space-y-4 text-text-secondary leading-relaxed">
            {(bio ?? defaultBio).split("\n\n").map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          className="grid gap-4 sm:grid-cols-3"
        >
          {(
            Object.entries(siteConfig.skills) as [string, string[]][]
          ).map(([category, skills]) => (
            <motion.div key={category} variants={fadeUp}>
              <Card className="p-4">
                <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-accent-purple">
                  {category}
                </h4>
                <ul className="space-y-2">
                  {skills.map((skill) => (
                    <li
                      key={skill}
                      className="flex items-center gap-2 text-sm text-text-secondary"
                    >
                      <span className="h-1 w-1 rounded-full bg-accent-purple" />
                      {skill}
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
