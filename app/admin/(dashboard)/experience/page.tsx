"use client";

import { useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { SortableList } from "@/components/admin/SortableList";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Modal } from "@/components/ui/Modal";
import { LoadingOverlay } from "@/components/ui/LoadingOverlay";
import { useApiLoading } from "@/hooks/useApiLoading";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import type { Experience } from "@/types";

const emptyForm = {
  title: "",
  company: "",
  company_url: "",
  location: "",
  start_date: "",
  end_date: "",
  current: false,
  description: "",
  tech_stack: "",
};

export default function AdminExperiencePage() {
  const { isLoading, withLoading } = useApiLoading();
  const [items, setItems] = useState<Experience[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const fetchItems = () =>
    withLoading(async () => {
      const res = await fetch("/api/admin/experience");
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
      setHasLoaded(true);
    });

  useEffect(() => {
    void fetchItems();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (item: Experience) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      company: item.company,
      company_url: item.company_url ?? "",
      location: item.location ?? "",
      start_date: item.start_date,
      end_date: item.end_date ?? "",
      current: item.current,
      description: item.description?.join("\n") ?? "",
      tech_stack: item.tech_stack?.join(", ") ?? "",
    });
    setModalOpen(true);
  };

  const handleSave = () =>
    withLoading(async () => {
      const payload = {
        title: form.title,
        company: form.company,
        company_url: form.company_url.trim() || null,
        location: form.location || null,
        start_date: form.start_date,
        end_date: form.current ? null : form.end_date || null,
        current: form.current,
        description: form.description.split("\n").filter(Boolean),
        tech_stack: form.tech_stack.split(",").map((t) => t.trim()).filter(Boolean),
      };

      if (editingId) {
        await fetch(`/api/admin/experience/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch("/api/admin/experience", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      setModalOpen(false);
      await fetchItems();
    });

  const handleDelete = (id: string) => {
    if (!confirm("Delete this entry?")) return;
    void withLoading(async () => {
      await fetch(`/api/admin/experience/${id}`, { method: "DELETE" });
      await fetchItems();
    });
  };

  const handleReorder = (reordered: Experience[]) => {
    setItems(reordered);
    void withLoading(async () => {
      await fetch("/api/admin/experience", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: reordered.map((item, index) => ({ id: item.id, order_index: index })),
        }),
      });
    });
  };

  return (
    <>
      <AdminHeader title="Experience" />
      <div className="relative flex-1 p-6">
        <LoadingOverlay show={isLoading} />
        <div className="mb-6 flex justify-end">
          <Button onClick={openCreate} className="gap-2" disabled={isLoading}>
            <FiPlus className="h-4 w-4" /> Add Experience
          </Button>
        </div>

        {hasLoaded ? (
          <SortableList
            items={items}
            onReorder={handleReorder}
            renderItem={(item) => (
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">{item.title}</p>
                  <p className="text-sm text-text-secondary">{item.company}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(item)} className="text-text-muted hover:text-white">
                    <FiEdit2 className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="text-text-muted hover:text-red-400">
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          />
        ) : null}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Edit Experience" : "Add Experience"}>
        <div className="space-y-4">
          <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Input label="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
          <Input
            label="Company URL"
            type="url"
            placeholder="https://company.com"
            value={form.company_url}
            onChange={(e) => setForm({ ...form, company_url: e.target.value })}
          />
          <Input label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Start Date" type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
            <Input label="End Date" type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} disabled={form.current} />
          </div>
          <label className="flex items-center gap-2 text-sm text-text-secondary">
            <input type="checkbox" checked={form.current} onChange={(e) => setForm({ ...form, current: e.target.checked })} />
            Currently working here
          </label>
          <Textarea label="Description (one bullet per line)" rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <Input label="Tech Stack (comma separated)" value={form.tech_stack} onChange={(e) => setForm({ ...form, tech_stack: e.target.value })} />
          <Button onClick={() => void handleSave()} isLoading={isLoading} className="w-full">Save</Button>
        </div>
      </Modal>
    </>
  );
}
