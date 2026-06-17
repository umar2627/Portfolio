"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ProfileSettings } from "@/components/admin/ProfileSettings";
import { Card } from "@/components/ui/Card";
import { LoadingOverlay } from "@/components/ui/LoadingOverlay";
import { useApiLoading } from "@/hooks/useApiLoading";

interface DashboardStats {
  education: number;
  experience: number;
  projects: number;
  pendingReviews: number;
  unreadMessages: number;
}

export default function AdminDashboard() {
  const { isLoading, withLoading } = useApiLoading();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    void withLoading(async () => {
      try {
        const [edu, exp, proj, reviews, messages] = await Promise.all([
          fetch("/api/admin/education").then((r) => r.json()),
          fetch("/api/admin/experience").then((r) => r.json()),
          fetch("/api/admin/projects").then((r) => r.json()),
          fetch("/api/admin/reviews?filter=pending").then((r) => r.json()),
          fetch("/api/admin/messages").then((r) => r.json()),
        ]);

        setStats({
          education: Array.isArray(edu) ? edu.length : 0,
          experience: Array.isArray(exp) ? exp.length : 0,
          projects: Array.isArray(proj) ? proj.length : 0,
          pendingReviews: Array.isArray(reviews) ? reviews.length : 0,
          unreadMessages: Array.isArray(messages)
            ? messages.filter((m: { is_read: boolean }) => !m.is_read).length
            : 0,
        });
      } catch {
        setStats({
          education: 0,
          experience: 0,
          projects: 0,
          pendingReviews: 0,
          unreadMessages: 0,
        });
      } finally {
        setHasLoaded(true);
      }
    });
  }, [withLoading]);

  const cards = [
    { label: "Education", count: stats?.education, href: "/admin/education" },
    { label: "Experience", count: stats?.experience, href: "/admin/experience" },
    { label: "Projects", count: stats?.projects, href: "/admin/projects" },
    {
      label: "Pending Reviews",
      count: stats?.pendingReviews,
      href: "/admin/reviews",
      highlight: true,
    },
    {
      label: "Unread Messages",
      count: stats?.unreadMessages,
      href: "/admin/messages",
      highlight: true,
    },
  ];

  return (
    <>
      <AdminHeader title="Dashboard" />
      <div className="flex-1 space-y-8 p-6">
        <ProfileSettings />

        <div className="relative">
          <LoadingOverlay show={isLoading} />
          <h2 className="mb-4 text-lg font-bold text-white">Overview</h2>
          {hasLoaded ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {cards.map((card) => (
                <Link key={card.label} href={card.href}>
                  <Card hover className="p-6">
                    <p className="text-sm text-text-secondary">{card.label}</p>
                    <p
                      className={`mt-2 text-3xl font-bold ${
                        card.highlight && card.count
                          ? "text-accent-green"
                          : "text-white"
                      }`}
                    >
                      {card.count ?? 0}
                    </p>
                  </Card>
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
