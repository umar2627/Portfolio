import { Suspense } from "react";
import { LoginForm } from "@/components/admin/LoginForm";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<LoadingSpinner className="min-h-screen" />}>
      <LoginForm />
    </Suspense>
  );
}
