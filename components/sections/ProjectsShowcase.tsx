"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FiGithub, FiExternalLink } from "react-icons/fi";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { FilterPill } from "@/components/ui/FilterPill";
import { SearchInput } from "@/components/ui/SearchInput";
import { Modal } from "@/components/ui/Modal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { fadeUp, staggerContainer } from "@/components/animations/variants";
import type { Project, ProjectFilter } from "@/types";

interface ProjectsShowcaseProps {
  projects: Project[];
}

const filters: { key: ProjectFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "featured", label: "Featured" },
  { key: "full-stack", label: "Full-Stack" },
  { key: "open-source", label: "Open Source" },
  { key: "backend", label: "Backend" },
];

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
  const [activeFilter, setActiveFilter] = useState<ProjectFilter>("all");
  const [search, setSearch] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesSearch =
        !search ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        p.tech_stack.some((t) => t.toLowerCase().includes(search.toLowerCase()));

      if (!matchesSearch) return false;

      switch (activeFilter) {
        case "featured":
          return p.featured;
        case "full-stack":
          return p.tech_stack.some((t) =>
            ["react", "next.js", "node.js", "typescript"].includes(t.toLowerCase())
          );
        case "open-source":
          return !!p.github_url;
        case "backend":
          return p.tech_stack.some((t) =>
            ["go", "rust", "node.js", "postgresql", "redis", "kafka"].includes(
              t.toLowerCase()
            )
          );
        default:
          return true;
      }
    });
  }, [projects, activeFilter, search]);

  const featured = filteredProjects.filter((p) => p.featured);
  const other = filteredProjects.filter((p) => !p.featured);

  const liveCount = projects.filter((p) => p.live_url).length;

  const filterCounts = useMemo(() => {
    const counts: Record<ProjectFilter, number> = {
      all: projects.length,
      featured: projects.filter((p) => p.featured).length,
      "full-stack": projects.filter((p) =>
        p.tech_stack.some((t) =>
          ["react", "next.js", "node.js", "typescript"].includes(t.toLowerCase())
        )
      ).length,
      "open-source": projects.filter((p) => p.github_url).length,
      backend: projects.filter((p) =>
        p.tech_stack.some((t) =>
          ["go", "rust", "node.js", "postgresql", "redis", "kafka"].includes(
            t.toLowerCase()
          )
        )
      ).length,
    };
    return counts;
  }, [projects]);

  return (
    <div className="space-y-12">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeader
          number="03"
          label="PROJECTS"
          title="Things I've shipped."
          gradientWord="shipped."
          breadcrumb="~/ projects"
          description="A collection of projects I've built — from open-source tools to production systems serving millions of users."
        />
        <div className="flex gap-8">
          <div className="text-center">
            <p className="text-3xl font-bold text-accent-blue">{projects.length}+</p>
            <p className="text-xs text-text-muted">Total Projects</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-accent-green">12k+</p>
            <p className="text-xs text-text-muted">GitHub Stars</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-accent-cyan">{liveCount}</p>
            <p className="text-xs text-text-muted">Live Products</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <FilterPill
              key={f.key}
              label={f.label}
              count={filterCounts[f.key]}
              active={activeFilter === f.key}
              onClick={() => setActiveFilter(f.key)}
            />
          ))}
        </div>
        <SearchInput
          value={search}
          onChange={setSearch}
          className="w-full sm:w-64"
        />
      </div>

      {featured.length > 0 && (
        <div className="space-y-8">
          <h3 className="font-mono text-xs uppercase tracking-widest text-text-muted">
            Featured
          </h3>
          {featured.map((project, index) => (
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
                    <span className="font-mono text-sm text-text-muted">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-2 text-2xl font-bold text-white">
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
            {other.map((project, index) => (
              <motion.div key={project.id} variants={fadeUp}>
                <Card
                  className="group cursor-pointer overflow-hidden"
                  onClick={() => setSelectedProject(project)}
                >
                  <div className="relative aspect-video overflow-hidden">
                    <ProjectImage project={project} />
                    <span className="absolute right-3 top-3 font-mono text-xs text-white/60">
                      #{String(index + featured.length + 1).padStart(2, "0")}
                    </span>
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

      {filteredProjects.length === 0 && (
        <p className="text-center text-text-secondary">No projects match your filters.</p>
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
