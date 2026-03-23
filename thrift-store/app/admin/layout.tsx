"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/layout/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    const userRaw = localStorage.getItem("admin_user");
    const user = userRaw ? JSON.parse(userRaw) : null;

    const isLoginPage = pathname === "/admin";
    const isAdmin = user?.role === "admin";

    if (!isLoginPage && (!token || !isAdmin)) {
      router.replace("/admin");
      return;
    }

    if (isLoginPage && token && isAdmin) {
      router.replace("/admin/analytics");
      return;
    }

    setReady(true);
  }, [pathname, router]);

  if (!ready) {
    return <div className="min-h-screen bg-[#ffffff]" />;
  }

  if (pathname === "/admin") {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-[#ffffff]">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
