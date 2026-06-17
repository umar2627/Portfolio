"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { ResumeUpload } from "@/components/admin/ResumeUpload";
import { LoadingOverlay } from "@/components/ui/LoadingOverlay";
import { useApiLoading } from "@/hooks/useApiLoading";
import { useToast } from "@/components/providers/ToastProvider";

interface ProfileForm {
  name: string;
  title: string;
  bio: string;
  profile_image: string;
  resume_url: string;
}

export function ProfileSettings() {
  const { isLoading, withLoading } = useApiLoading();
  const [form, setForm] = useState<ProfileForm>({
    name: "",
    title: "",
    bio: "",
    profile_image: "",
    resume_url: "",
  });
  const [hasLoaded, setHasLoaded] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    void withLoading(async () => {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      setForm({
        name: data.name ?? "",
        title: data.title ?? "",
        bio: data.bio ?? "",
        profile_image: data.profile_image ?? "",
        resume_url: data.resume_url ?? "",
      });
      setHasLoaded(true);
    });
  }, [withLoading]);

  const saveSettings = async (data: Partial<ProfileForm>, message: string) => {
    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to save");
    showToast(message, "success");
  };

  const handleSave = () =>
    withLoading(async () => {
      try {
        await saveSettings(form, "Profile updated successfully!");
      } catch {
        showToast("Failed to update profile", "error");
      }
    });

  const handleResumeChange = (url: string | null) => {
    const resume_url = url ?? "";
    setForm((prev) => ({ ...prev, resume_url }));
    void withLoading(async () => {
      try {
        await saveSettings({ resume_url }, "Resume PDF saved!");
      } catch {
        showToast("Failed to save resume", "error");
      }
    });
  };

  return (
    <Card hover={false} className="relative p-6">
      <LoadingOverlay show={isLoading} />
      <h2 className="mb-6 text-lg font-bold text-white">Profile Settings</h2>

      {hasLoaded ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-sm font-medium text-text-secondary">
                Profile Image
              </p>
              {form.profile_image && (
                <div className="relative mb-3 h-24 w-24 overflow-hidden rounded-xl border border-white/[0.08]">
                  <Image
                    src={form.profile_image}
                    alt="Profile preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <ImageUpload
                value={form.profile_image}
                onChange={(url) =>
                  setForm({ ...form, profile_image: url ?? "" })
                }
              />
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-text-secondary">
                Resume PDF
              </p>
              <ResumeUpload
                value={form.resume_url}
                onChange={handleResumeChange}
              />
            </div>
          </div>

          <div className="space-y-4">
            <Input
              label="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your Name"
            />
            <Input
              label="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Full Stack Developer"
            />
            <Textarea
              label="Bio"
              rows={5}
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              placeholder="Write your bio..."
            />
            <Button onClick={() => void handleSave()} isLoading={isLoading}>
              Save Profile
            </Button>
          </div>
        </div>
      ) : null}
    </Card>
  );
}
