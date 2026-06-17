"use client";

import { useState, useRef } from "react";
import { FiUpload, FiFileText, FiX } from "react-icons/fi";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { cn } from "@/lib/utils/cn";

interface ResumeUploadProps {
  value?: string | null;
  onChange: (url: string | null) => void;
  className?: string;
}

export function ResumeUpload({ value, onChange, className }: ResumeUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("File too large (max 10MB)");
      return;
    }

    setError("");
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "resume");

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      onChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {value ? (
        <div className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-card/30 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-purple/10">
              <FiFileText className="h-5 w-5 text-accent-purple" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Resume PDF uploaded</p>
              <p className="max-w-[200px] truncate text-xs text-text-muted">
                {value.split("/").pop()}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="rounded-lg p-2 text-text-muted hover:bg-white/5 hover:text-white"
          >
            <FiX className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/[0.15] bg-card/30 px-4 py-6 text-text-muted transition-colors hover:border-accent-purple/30 hover:text-white disabled:opacity-50"
        >
          {isUploading ? (
            <LoadingSpinner size="sm" />
          ) : (
            <FiUpload className="h-5 w-5" />
          )}
          <span className="text-sm">
            {isUploading ? "Uploading..." : "Upload resume PDF"}
          </span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        onChange={handleUpload}
        className="hidden"
      />

      {error && <p className="text-xs text-red-400">{error}</p>}
      <p className="text-xs text-text-muted">PDF only, max 10MB</p>
    </div>
  );
}
