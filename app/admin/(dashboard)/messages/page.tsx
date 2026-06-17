"use client";

import { useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { LoadingOverlay } from "@/components/ui/LoadingOverlay";
import { useApiLoading } from "@/hooks/useApiLoading";
import { FiTrash2, FiMail, FiInbox } from "react-icons/fi";
import type { ContactMessage } from "@/types";

export default function AdminMessagesPage() {
  const { isLoading, withLoading } = useApiLoading();
  const [items, setItems] = useState<ContactMessage[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [selected, setSelected] = useState<ContactMessage | null>(null);

  const fetchItems = () =>
    withLoading(async () => {
      const res = await fetch("/api/admin/messages");
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
      setHasLoaded(true);
    });

  useEffect(() => {
    void fetchItems();
  }, []);

  const handleMarkRead = (id: string, is_read: boolean) =>
    withLoading(async () => {
      await fetch(`/api/admin/messages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_read }),
      });
      await fetchItems();
    });

  const handleDelete = (id: string) => {
    if (!confirm("Delete this message?")) return;
    void withLoading(async () => {
      await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
      setSelected(null);
      await fetchItems();
    });
  };

  const openMessage = (message: ContactMessage) => {
    setSelected(message);
    if (!message.is_read) {
      void handleMarkRead(message.id, true);
    }
  };

  return (
    <>
      <AdminHeader title="Messages" />
      <div className="relative flex-1 p-6">
        <LoadingOverlay show={isLoading} />
        {hasLoaded && items.length === 0 ? (
          <p className="text-center text-text-secondary">No messages yet.</p>
        ) : hasLoaded ? (
          <div className="space-y-3">
            {items.map((item) => (
              <Card
                key={item.id}
                hover
                className="cursor-pointer p-4"
                onClick={() => openMessage(item)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {item.is_read ? (
                      <FiInbox className="h-4 w-4 text-text-muted" />
                    ) : (
                      <FiMail className="h-4 w-4 text-accent-blue" />
                    )}
                    <div>
                      <p className={`font-medium ${item.is_read ? "text-text-secondary" : "text-white"}`}>
                        {item.name}
                        {item.subject && (
                          <span className="ml-2 text-text-muted">— {item.subject}</span>
                        )}
                      </p>
                      <p className="text-xs text-text-muted">{item.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-text-muted">
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item.id);
                      }}
                      className="text-text-muted hover:text-red-400"
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

      <Modal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.subject ?? "Message"}
      >
        {selected && (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-text-muted">From</p>
              <p className="text-white">
                {selected.name} ({selected.email})
              </p>
            </div>
            <div>
              <p className="text-sm text-text-muted">Date</p>
              <p className="text-white">
                {new Date(selected.created_at).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-text-muted">Message</p>
              <p className="whitespace-pre-wrap text-text-secondary leading-relaxed">
                {selected.message}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                isLoading={isLoading}
                onClick={() => void handleMarkRead(selected.id, !selected.is_read)}
              >
                Mark as {selected.is_read ? "unread" : "read"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                isLoading={isLoading}
                onClick={() => handleDelete(selected.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
