import { type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type Block =
  | { type: "heading"; text: string }
  | { type: "bullet"; text: string }
  | { type: "paragraph"; text: string };

function parseDescription(description: string): Block[] {
  const normalized = description.replace(/\r\n/g, "\n").trim();
  if (!normalized) return [];

  const hasLineBreaks = normalized.includes("\n");
  const lines = hasLineBreaks
    ? normalized.split("\n")
    : splitInlineSections(normalized);

  const blocks: Block[] = [];
  let paragraphBuffer: string[] = [];

  const flushParagraph = () => {
    if (paragraphBuffer.length > 0) {
      blocks.push({ type: "paragraph", text: paragraphBuffer.join(" ") });
      paragraphBuffer = [];
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      flushParagraph();
      continue;
    }

    const mdHeading = line.match(/^#{1,3}\s+(.+)$/);
    if (mdHeading) {
      flushParagraph();
      blocks.push({ type: "heading", text: mdHeading[1] });
      continue;
    }

    const boldHeading = line.match(/^\*\*(.+?)\*\*:?\s*(.*)$/);
    if (boldHeading) {
      flushParagraph();
      blocks.push({ type: "heading", text: boldHeading[1] });
      if (boldHeading[2]) {
        blocks.push({ type: "paragraph", text: boldHeading[2] });
      }
      continue;
    }

    const sectionLabel = line.match(/^([A-Za-z][\w\s&/'()-]{0,48}):\s*(.*)$/);
    if (sectionLabel && sectionLabel[1].length <= 40) {
      flushParagraph();
      blocks.push({ type: "heading", text: sectionLabel[1] });
      if (sectionLabel[2]) {
        paragraphBuffer.push(sectionLabel[2]);
      }
      continue;
    }

    const bullet =
      line.match(/^[-*•]\s+(.+)$/) ?? line.match(/^\d+\.\s+(.+)$/);
    if (bullet) {
      flushParagraph();
      blocks.push({ type: "bullet", text: bullet[1] });
      continue;
    }

    paragraphBuffer.push(line);
  }

  flushParagraph();
  return blocks;
}

function splitInlineSections(text: string): string[] {
  const numbered = text.split(/(?=\s\d+\.\s+)/).map((part) => part.trim()).filter(Boolean);
  if (numbered.length > 1) return numbered;

  const labeled = text.split(/(?=\s[A-Z][a-zA-Z\s&/-]{2,30}:\s)/).map((part) => part.trim()).filter(Boolean);
  if (labeled.length > 1) return labeled;

  return [text];
}

interface ProjectDescriptionProps {
  description: string;
  size?: "xs" | "sm" | "base";
  className?: string;
}

export function ProjectDescription({
  description,
  size = "sm",
  className,
}: ProjectDescriptionProps) {
  const blocks = parseDescription(description);

  const textSize = {
    xs: "text-xs",
    sm: "text-sm",
    base: "text-base",
  }[size];

  if (blocks.length === 0) return null;

  const hasStructure = blocks.some(
    (block) => block.type === "heading" || block.type === "bullet"
  );

  if (!hasStructure) {
    return (
      <p className={cn(textSize, "leading-relaxed text-text-secondary", className)}>
        {blocks[0]?.type === "paragraph" ? blocks[0].text : description}
      </p>
    );
  }

  const bullets: string[] = [];
  const elements: ReactNode[] = [];

  const flushBullets = () => {
    if (bullets.length === 0) return;
    elements.push(
      <ul key={`bullets-${elements.length}`} className="space-y-1.5">
        {bullets.map((text, i) => (
          <li
            key={i}
            className={cn(
              "flex items-start gap-2 text-text-secondary",
              textSize
            )}
          >
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent-purple" />
            <span className="leading-relaxed">{text}</span>
          </li>
        ))}
      </ul>
    );
    bullets.length = 0;
  };

  for (const block of blocks) {
    if (block.type === "bullet") {
      bullets.push(block.text);
      continue;
    }

    flushBullets();

    if (block.type === "heading") {
      elements.push(
        <h4
          key={`heading-${elements.length}`}
          className={cn(
            "font-semibold text-white",
            size === "xs" ? "text-xs" : "text-sm",
            elements.length > 0 && "mt-3 first:mt-0"
          )}
        >
          {block.text}
        </h4>
      );
    } else {
      elements.push(
        <p
          key={`paragraph-${elements.length}`}
          className={cn(textSize, "leading-relaxed text-text-secondary")}
        >
          {block.text}
        </p>
      );
    }
  }

  flushBullets();

  return <div className={cn("space-y-2", className)}>{elements}</div>;
}
