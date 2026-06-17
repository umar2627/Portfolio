"use client";

import { useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Button } from "@/components/ui/Button";
import { StarRating } from "@/components/ui/StarRating";
import { Card } from "@/components/ui/Card";
import { LoadingOverlay } from "@/components/ui/LoadingOverlay";
import { useApiLoading } from "@/hooks/useApiLoading";
import { FiCheck, FiX, FiTrash2 } from "react-icons/fi";
import type { Review } from "@/types";

export default function AdminReviewsPage() {
  const { isLoading, withLoading } = useApiLoading();
  const [items, setItems] = useState<Review[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");

  const fetchItems = () =>
    withLoading(async () => {
      const url =
        filter === "all"
          ? "/api/admin/reviews"
          : `/api/admin/reviews?filter=${filter}`;
      const res = await fetch(url);
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
      setHasLoaded(true);
    });

  useEffect(() => {
    void fetchItems();
  }, [filter]);

  const handleApprove = (id: string, approved: boolean) => {
    void withLoading(async () => {
      await fetch(`/api/admin/reviews/${id}/approve`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_approved: approved }),
      });
      await fetchItems();
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this review?")) return;
    void withLoading(async () => {
      await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
      await fetchItems();
    });
  };

  return (
    <>
      <AdminHeader title="Reviews" />
      <div className="relative flex-1 p-6">
        <LoadingOverlay show={isLoading} />
        <div className="mb-6 flex gap-2">
          {(["all", "pending", "approved"] as const).map((f) => (
            <Button
              key={f}
              variant={filter === f ? "primary" : "ghost"}
              size="sm"
              onClick={() => setFilter(f)}
              disabled={isLoading}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Button>
          ))}
        </div>

        {hasLoaded && items.length === 0 ? (
          <p className="text-center text-text-secondary">No reviews found.</p>
        ) : hasLoaded ? (
          <div className="space-y-4">
            {items.map((item) => (
              <Card key={item.id} hover={false} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <p className="font-medium text-white">{item.name}</p>
                      <StarRating rating={item.rating} readonly size="sm" />
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${
                          item.is_approved
                            ? "bg-accent-green/10 text-accent-green"
                            : "bg-yellow-500/10 text-yellow-400"
                        }`}
                      >
                        {item.is_approved ? "Approved" : "Pending"}
                      </span>
                    </div>
                    {(item.role || item.company) && (
                      <p className="text-sm text-text-muted">
                        {item.role}
                        {item.company && ` at ${item.company}`}
                      </p>
                    )}
                    <p className="mt-2 text-sm text-text-secondary">
                      &ldquo;{item.review_text}&rdquo;
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {!item.is_approved && (
                      <button
                        onClick={() => handleApprove(item.id, true)}
                        className="rounded-lg p-2 text-accent-green hover:bg-accent-green/10"
                        title="Approve"
                        disabled={isLoading}
                      >
                        <FiCheck className="h-4 w-4" />
                      </button>
                    )}
                    {item.is_approved && (
                      <button
                        onClick={() => handleApprove(item.id, false)}
                        className="rounded-lg p-2 text-yellow-400 hover:bg-yellow-500/10"
                        title="Reject"
                        disabled={isLoading}
                      >
                        <FiX className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="rounded-lg p-2 text-text-muted hover:bg-red-500/10 hover:text-red-400"
                      title="Delete"
                      disabled={isLoading}
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : null}
      </div>
    </>
  );
}
