"use client";

import AdminSidebar from "@/components/admin/AdminSidebar";
import { AdminProvider, useAdmin } from "@/components/admin/AdminContext";

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { isSidebarOpen, closeSidebar } = useAdmin();

  return (
    <div className="flex min-h-screen bg-[var(--color-cream)]">
      <AdminSidebar isOpen={isSidebarOpen} />

      <main className="flex-1 lg:ml-0">
        <div onClick={closeSidebar}>
          {children}
        </div>
      </main>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminProvider>
  );
}
