"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FiGithub, FiExternalLink } from "react-icons/fi";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { fadeUp, staggerContainer } from "@/components/animations/variants";
import type { Project } from "@/types";

interface ProjectsShowcaseProps {
  projects: Project[];
}

function ProjectImage({ project, className }: { project: Project; className?: string }) {
  if (project.image_url) {
    return (
      <Image
        src={project.image_url}
        alt={project.title}
        fill
        className={`object-cover ${className ?? ""}`}
      />
    );
  }
  return (
    <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br from-accent-purple/20 via-accent-pink/10 to-accent-blue/20 ${className ?? ""}`}>
      <span className="font-mono text-4xl font-bold text-white/20">
        {project.title.charAt(0)}
      </span>
    </div>
  );
}

export function ProjectsShowcase({ projects }: ProjectsShowcaseProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const featured = projects.filter((p) => p.featured);
  const other = projects.filter((p) => !p.featured);

  return (
    <div className="space-y-12">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeader
          label="PROJECTS"
          title="Things I've shipped."
          gradientWord="shipped."
          breadcrumb="~/ projects"
          description="A collection of projects I've built — from open-source tools to production systems serving millions of users."
        />
      </div>

      {featured.length > 0 && (
        <div className="space-y-8">
          <h3 className="font-mono text-xs uppercase tracking-widest text-text-muted">
            Featured
          </h3>
          {featured.map((project) => (
            <motion.div
              key={project.id}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <Card elevated className="overflow-hidden">
                <div className="grid lg:grid-cols-2">
                  <div className="relative aspect-video lg:aspect-auto lg:min-h-[320px]">
                    <ProjectImage project={project} />
                  </div>
                  <div className="flex flex-col justify-center p-6 lg:p-8">
                    <h3 className="text-2xl font-bold text-white">
                      {project.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                      {project.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.tech_stack.map((tech) => (
                        <Badge key={tech}>{tech}</Badge>
                      ))}
                    </div>
                    <div className="mt-6 flex flex-wrap gap-3">
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button variant="ghost" size="sm" className="gap-2">
                            <FiGithub className="h-4 w-4" />
                            Source
                          </Button>
                        </a>
                      )}
                      {project.live_url && (
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button size="sm" className="gap-2">
                            <FiExternalLink className="h-4 w-4" />
                            Live Demo
                          </Button>
                        </a>
                      )}
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setSelectedProject(project)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {other.length > 0 && (
        <div className="space-y-6">
          <h3 className="font-mono text-xs uppercase tracking-widest text-text-muted">
            Other Projects
          </h3>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {other.map((project) => (
              <motion.div key={project.id} variants={fadeUp}>
                <Card
                  className="group cursor-pointer overflow-hidden"
                  onClick={() => setSelectedProject(project)}
                >
                  <div className="relative aspect-video overflow-hidden">
                    <ProjectImage project={project} />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-white group-hover:text-accent-purple transition-colors">
                      {project.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-xs text-text-secondary">
                      {project.description}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {project.tech_stack.slice(0, 3).map((tech) => (
                        <Badge key={tech}>{tech}</Badge>
                      ))}
                    </div>
                    <div className="mt-3 flex gap-4">
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1 text-xs text-text-muted hover:text-white"
                        >
                          <FiGithub className="h-3 w-3" /> source
                        </a>
                      )}
                      {project.live_url && (
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1 text-xs text-text-muted hover:text-white"
                        >
                          <FiExternalLink className="h-3 w-3" /> live demo
                        </a>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}

      {projects.length === 0 && (
        <p className="text-center text-text-secondary">No projects yet.</p>
      )}

      <Modal
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        title={selectedProject?.title}
      >
        {selectedProject && (
          <div className="space-y-4">
            <div className="relative aspect-video overflow-hidden rounded-xl">
              <ProjectImage project={selectedProject} />
            </div>
            <p className="text-text-secondary leading-relaxed">
              {selectedProject.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedProject.tech_stack.map((tech) => (
                <Badge key={tech}>{tech}</Badge>
              ))}
            </div>
            <div className="flex gap-3">
              {selectedProject.github_url && (
                <a
                  href={selectedProject.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="ghost" size="sm" className="gap-2">
                    <FiGithub className="h-4 w-4" />
                    Source
                  </Button>
                </a>
              )}
              {selectedProject.live_url && (
                <a
                  href={selectedProject.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="sm" className="gap-2">
                    <FiExternalLink className="h-4 w-4" />
                    Live Demo
                  </Button>
                </a>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
