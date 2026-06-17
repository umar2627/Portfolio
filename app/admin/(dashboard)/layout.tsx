import { SessionProvider } from "@/components/admin/SessionProvider";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <div className="flex min-h-screen bg-primary">
        <AdminSidebar />
        <div className="flex flex-1 flex-col">{children}</div>
      </div>
    </SessionProvider>
  );
}
