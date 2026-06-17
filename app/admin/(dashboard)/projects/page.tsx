"use client";

import { useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { SortableList } from "@/components/admin/SortableList";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Modal } from "@/components/ui/Modal";
import { LoadingOverlay } from "@/components/ui/LoadingOverlay";
import { useApiLoading } from "@/hooks/useApiLoading";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import type { Project } from "@/types";

const emptyForm = {
  title: "",
  description: "",
  tech_stack: "",
  image_url: "",
  live_url: "",
  github_url: "",
  featured: false,
};

export default function AdminProjectsPage() {
  const { isLoading, withLoading } = useApiLoading();
  const [items, setItems] = useState<Project[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const fetchItems = () =>
    withLoading(async () => {
      const res = await fetch("/api/admin/projects");
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

  const openEdit = (item: Project) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      description: item.description,
      tech_stack: item.tech_stack?.join(", ") ?? "",
      image_url: item.image_url ?? "",
      live_url: item.live_url ?? "",
      github_url: item.github_url ?? "",
      featured: item.featured,
    });
    setModalOpen(true);
  };

  const handleSave = () =>
    withLoading(async () => {
      const payload = {
        title: form.title,
        description: form.description,
        tech_stack: form.tech_stack.split(",").map((t) => t.trim()).filter(Boolean),
        image_url: form.image_url || null,
        live_url: form.live_url || null,
        github_url: form.github_url || null,
        featured: form.featured,
      };

      if (editingId) {
        await fetch(`/api/admin/projects/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch("/api/admin/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      setModalOpen(false);
      await fetchItems();
    });

  const handleDelete = (id: string) => {
    if (!confirm("Delete this project?")) return;
    void withLoading(async () => {
      await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
      await fetchItems();
    });
  };

  const handleReorder = (reordered: Project[]) => {
    setItems(reordered);
    void withLoading(async () => {
      await fetch("/api/admin/projects", {
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
      <AdminHeader title="Projects" />
      <div className="relative flex-1 p-6">
        <LoadingOverlay show={isLoading} />
        <div className="mb-6 flex justify-end">
          <Button onClick={openCreate} className="gap-2" disabled={isLoading}>
            <FiPlus className="h-4 w-4" /> Add Project
          </Button>
        </div>

        {hasLoaded ? (
          <SortableList
            items={items}
            onReorder={handleReorder}
            renderItem={(item) => (
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">
                    {item.title}
                    {item.featured && (
                      <span className="ml-2 rounded-full bg-accent-purple/20 px-2 py-0.5 text-xs text-accent-purple">
                        Featured
                      </span>
                    )}
                  </p>
                  <p className="line-clamp-1 text-sm text-text-secondary">{item.description}</p>
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

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Edit Project" : "Add Project"} className="max-w-2xl">
        <div className="space-y-4">
          <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Textarea label="Description" rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <Input label="Tech Stack (comma separated)" value={form.tech_stack} onChange={(e) => setForm({ ...form, tech_stack: e.target.value })} />
          <ImageUpload value={form.image_url} onChange={(url) => setForm({ ...form, image_url: url ?? "" })} />
          <Input label="Live URL" value={form.live_url} onChange={(e) => setForm({ ...form, live_url: e.target.value })} />
          <Input label="GitHub URL" value={form.github_url} onChange={(e) => setForm({ ...form, github_url: e.target.value })} />
          <label className="flex items-center gap-2 text-sm text-text-secondary">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
            Featured project
          </label>
          <Button onClick={() => void handleSave()} isLoading={isLoading} className="w-full">Save</Button>
        </div>
      </Modal>
    </>
  );
}
