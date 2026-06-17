"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { FiUpload, FiX } from "react-icons/fi";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

interface ImageUploadProps {
  value?: string | null;
  onChange: (url: string | null) => void;
  className?: string;
}

export function ImageUpload({ value, onChange, className }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      onChange(data.url);
    } catch {
      // Upload failed silently — user can retry
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {value ? (
        <div className="relative aspect-video w-full max-w-xs overflow-hidden rounded-xl border border-white/[0.08]">
          <Image src={value} alt="Upload preview" fill className="object-cover" />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
          >
            <FiX className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex aspect-video w-full max-w-xs flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/[0.15] bg-card/30 text-text-muted hover:border-accent-purple/30 hover:text-white"
        >
          <FiUpload className="h-6 w-6" />
          <span className="text-sm">Upload image</span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
      />
      {isUploading && (
        <Button variant="ghost" size="sm" isLoading disabled>
          Uploading...
        </Button>
      )}
    </div>
  );
}
