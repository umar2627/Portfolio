"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { ExternalLinkButton } from "@/components/shared/ExternalLinkButton";
import { formatDateRange } from "@/lib/utils/techColors";
import { normalizeUrl } from "@/lib/utils/url";
import { fadeUp, staggerContainer } from "@/components/animations/variants";
import type { Education as EducationType } from "@/types";

interface EducationProps {
  education: EducationType[];
}

export function Education({ education }: EducationProps) {
  if (education.length === 0) {
    return (
      <p className="text-center text-text-secondary">No education entries yet.</p>
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {education.map((item, index) => {
        const institutionHref = item.institution_url
          ? normalizeUrl(item.institution_url)
          : null;

        return (
          <motion.div key={item.id} variants={fadeUp}>
            <Card className="h-full p-6">
              <div className="mb-2 flex items-start justify-between gap-2">
                <span className="font-mono text-xs text-text-muted">
                  #{String(index + 1).padStart(2, "0")}
                </span>
                <ExternalLinkButton
                  url={item.institution_url}
                  label={`Visit ${item.institution}`}
                />
              </div>
              <h3 className="text-lg font-bold text-white">{item.degree}</h3>
              <p className="text-sm font-medium text-accent-purple">
                {institutionHref ? (
                  <a
                    href={institutionHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-accent-pink hover:underline"
                  >
                    {item.institution}
                  </a>
                ) : (
                  item.institution
                )}
              </p>
              <p className="mt-1 text-xs text-text-muted">
                {formatDateRange(item.start_date, item.end_date)}
              </p>
              {item.grade && (
                <span className="mt-2 inline-block rounded-full border border-accent-green/30 bg-accent-green/10 px-2 py-0.5 text-xs text-accent-green">
                  {item.grade}
                </span>
              )}
              {item.description && (
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                  {item.description}
                </p>
              )}
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
