"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiHome,
  FiBook,
  FiBriefcase,
  FiFolder,
  FiStar,
  FiMail,
} from "react-icons/fi";
import { cn } from "@/lib/utils/cn";

const links = [
  { href: "/admin", label: "Dashboard", icon: FiHome },
  { href: "/admin/education", label: "Education", icon: FiBook },
  { href: "/admin/experience", label: "Experience", icon: FiBriefcase },
  { href: "/admin/projects", label: "Projects", icon: FiFolder },
  { href: "/admin/reviews", label: "Reviews", icon: FiStar },
  { href: "/admin/messages", label: "Messages", icon: FiMail },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 flex-col border-r border-white/[0.08] bg-card p-4">
      <Link href="/admin" className="mb-8 font-mono text-lg font-bold text-white">
        <span className="text-accent-purple">&lt;</span>admin
        <span className="text-accent-purple"> /&gt;</span>
      </Link>
      <nav className="flex flex-col gap-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive =
            link.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                isActive
                  ? "bg-accent-purple/10 text-white"
                  : "text-text-secondary hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
      <Link
        href="/"
        className="mt-auto pt-4 text-sm text-text-muted hover:text-white"
      >
        ← Back to site
      </Link>
    </aside>
  );
}
