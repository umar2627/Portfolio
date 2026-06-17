import { FiExternalLink } from "react-icons/fi";
import { cn } from "@/lib/utils/cn";
import { normalizeUrl } from "@/lib/utils/url";

interface ExternalLinkButtonProps {
  url: string | null | undefined;
  className?: string;
  label?: string;
}

export function ExternalLinkButton({ url, className, label = "Open link" }: ExternalLinkButtonProps) {
  if (!url?.trim()) return null;

  const href = normalizeUrl(url);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={cn(
        "inline-flex shrink-0 rounded-lg p-2 text-text-muted transition-colors hover:bg-white/5 hover:text-accent-purple",
        className
      )}
    >
      <FiExternalLink className="h-4 w-4" />
    </a>
  );
}
