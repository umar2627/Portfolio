"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ExternalLinkButton } from "@/components/shared/ExternalLinkButton";
import { formatDateRange } from "@/lib/utils/techColors";
import { normalizeUrl } from "@/lib/utils/url";
import { fadeUp, staggerContainer } from "@/components/animations/variants";
import type { Experience as ExperienceType } from "@/types";

interface ExperienceProps {
  experience: ExperienceType[];
}

export function Experience({ experience }: ExperienceProps) {
  if (experience.length === 0) {
    return (
      <p className="text-center text-text-secondary">No experience entries yet.</p>
    );
  }

  return (
    <div className="relative">
      <div className="absolute left-6 top-0 hidden h-full w-px bg-white/10 md:block" />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="space-y-8"
      >
        {experience.map((item) => {
          const companyHref = item.company_url ? normalizeUrl(item.company_url) : null;

          return (
            <motion.div key={item.id} variants={fadeUp} className="relative md:pl-16">
              <div className="absolute left-4 top-8 hidden h-4 w-4 rounded-full border-2 border-accent-purple bg-primary md:block" />

              <Card className="p-6">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">{item.title}</h3>
                    <p className="text-sm font-medium text-accent-purple">
                      {companyHref ? (
                        <a
                          href={companyHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="transition-colors hover:text-accent-pink hover:underline"
                        >
                          {item.company}
                        </a>
                      ) : (
                        item.company
                      )}
                      {item.location && (
                        <span className="text-text-muted"> · {item.location}</span>
                      )}
                    </p>
                    <p className="mt-1 text-xs text-text-muted">
                      {formatDateRange(item.start_date, item.end_date, item.current)}
                    </p>
                  </div>
                  <ExternalLinkButton
                    url={item.company_url}
                    label={`Visit ${item.company}`}
                  />
                </div>

                {item.description && item.description.length > 0 && (
                  <ul className="mb-4 space-y-2">
                    {item.description.map((desc, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-text-secondary"
                      >
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent-purple" />
                        {desc}
                      </li>
                    ))}
                  </ul>
                )}

                {item.tech_stack && item.tech_stack.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {item.tech_stack.map((tech) => (
                      <Badge key={tech}>{tech}</Badge>
                    ))}
                  </div>
                )}
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
