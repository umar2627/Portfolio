"use client";

import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/Button";

export function AdminHeader({ title }: { title: string }) {
  const { data: session } = useSession();

  return (
    <header className="flex items-center justify-between border-b border-white/[0.08] bg-card/50 px-6 py-4">
      <h1 className="text-xl font-bold text-white">{title}</h1>
      <div className="flex items-center gap-4">
        <span className="text-sm text-text-secondary">{session?.user?.email}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          Logout
        </Button>
      </div>
    </header>
  );
}
