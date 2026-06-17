const techColorMap: Record<string, { bg: string; text: string; border: string }> = {
  react: { bg: "bg-cyan-500/10", text: "text-cyan-400", border: "border-cyan-500/30" },
  "next.js": { bg: "bg-white/10", text: "text-white", border: "border-white/30" },
  nextjs: { bg: "bg-white/10", text: "text-white", border: "border-white/30" },
  typescript: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/30" },
  javascript: { bg: "bg-yellow-500/10", text: "text-yellow-400", border: "border-yellow-500/30" },
  node: { bg: "bg-green-500/10", text: "text-green-400", border: "border-green-500/30" },
  "node.js": { bg: "bg-green-500/10", text: "text-green-400", border: "border-green-500/30" },
  go: { bg: "bg-sky-500/10", text: "text-sky-400", border: "border-sky-500/30" },
  golang: { bg: "bg-sky-500/10", text: "text-sky-400", border: "border-sky-500/30" },
  rust: { bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/30" },
  redis: { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/30" },
  kafka: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/30" },
  postgresql: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/30" },
  postgres: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/30" },
  docker: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/30" },
  kubernetes: { bg: "bg-indigo-500/10", text: "text-indigo-400", border: "border-indigo-500/30" },
  aws: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/30" },
  python: { bg: "bg-yellow-500/10", text: "text-yellow-400", border: "border-yellow-500/30" },
  tailwind: { bg: "bg-teal-500/10", text: "text-teal-400", border: "border-teal-500/30" },
  "tailwind css": { bg: "bg-teal-500/10", text: "text-teal-400", border: "border-teal-500/30" },
  graphql: { bg: "bg-pink-500/10", text: "text-pink-400", border: "border-pink-500/30" },
  mongodb: { bg: "bg-green-500/10", text: "text-green-400", border: "border-green-500/30" },
  supabase: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/30" },
  prisma: { bg: "bg-indigo-500/10", text: "text-indigo-400", border: "border-indigo-500/30" },
};

const defaultColors = {
  bg: "bg-purple-500/10",
  text: "text-purple-400",
  border: "border-purple-500/30",
};

export function getTechColors(tech: string) {
  const key = tech.toLowerCase().trim();
  return techColorMap[key] ?? defaultColors;
}

export function formatDateRange(
  start: string,
  end: string | null,
  current?: boolean
): string {
  const startDate = new Date(start).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
  if (current || !end) return `${startDate} - Present`;
  const endDate = new Date(end).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
  return `${startDate} - ${endDate}`;
}
