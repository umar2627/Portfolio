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
import type { Education } from "@/types";

const emptyForm = {
  degree: "",
  institution: "",
  institution_url: "",
  start_date: "",
  end_date: "",
  grade: "",
  description: "",
};

export default function AdminEducationPage() {
  const { isLoading, withLoading } = useApiLoading();
  const [items, setItems] = useState<Education[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const fetchItems = () =>
    withLoading(async () => {
      const res = await fetch("/api/admin/education");
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

  const openEdit = (item: Education) => {
    setEditingId(item.id);
    setForm({
      degree: item.degree,
      institution: item.institution,
      institution_url: item.institution_url ?? "",
      start_date: item.start_date,
      end_date: item.end_date ?? "",
      grade: item.grade ?? "",
      description: item.description ?? "",
    });
    setModalOpen(true);
  };

  const handleSave = () =>
    withLoading(async () => {
      const payload = {
        degree: form.degree,
        institution: form.institution,
        institution_url: form.institution_url.trim() || null,
        start_date: form.start_date,
        end_date: form.end_date || null,
        grade: form.grade || null,
        description: form.description || null,
      };

      if (editingId) {
        await fetch(`/api/admin/education/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch("/api/admin/education", {
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
      await fetch(`/api/admin/education/${id}`, { method: "DELETE" });
      await fetchItems();
    });
  };

  const handleReorder = (reordered: Education[]) => {
    setItems(reordered);
    void withLoading(async () => {
      await fetch("/api/admin/education", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: reordered.map((item, index) => ({
            id: item.id,
            order_index: index,
          })),
        }),
      });
    });
  };

  return (
    <>
      <AdminHeader title="Education" />
      <div className="relative flex-1 p-6">
        <LoadingOverlay show={isLoading} />
        <div className="mb-6 flex justify-end">
          <Button onClick={openCreate} className="gap-2" disabled={isLoading}>
            <FiPlus className="h-4 w-4" /> Add Education
          </Button>
        </div>

        {hasLoaded && items.length === 0 ? (
          <p className="text-center text-text-secondary">No education entries yet.</p>
        ) : hasLoaded ? (
          <SortableList
            items={items}
            onReorder={handleReorder}
            renderItem={(item) => (
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">{item.degree}</p>
                  <p className="text-sm text-text-secondary">{item.institution}</p>
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

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Edit Education" : "Add Education"}>
        <div className="space-y-4">
          <Input label="Degree" value={form.degree} onChange={(e) => setForm({ ...form, degree: e.target.value })} />
          <Input label="Institution" value={form.institution} onChange={(e) => setForm({ ...form, institution: e.target.value })} />
          <Input
            label="Institution URL"
            type="url"
            placeholder="https://university.edu"
            value={form.institution_url}
            onChange={(e) => setForm({ ...form, institution_url: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Start Date" type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
            <Input label="End Date" type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} />
          </div>
          <Input label="Grade" value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })} />
          <Textarea label="Description" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <Button onClick={() => void handleSave()} isLoading={isLoading} className="w-full">Save</Button>
        </div>
      </Modal>
    </>
  );
}
