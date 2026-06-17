"use client";

import { useRequireAuth } from "@/hooks/useRouteAccess";
import Link from "next/link";
import { FileText, LayoutDashboard, LogOut, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/profile", label: "Profile", icon: User },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, loading } = useRequireAuth();
  const { user, logout } = useAuth();
  const pathname = usePathname();

  // Don't render admin layout on login page
  const isLoginPage = pathname === "/admin/login" || pathname === "/admin/register";

  if (loading && !isLoginPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="animate-spin w-8 h-8 border-2 border-brand-blue border-t-transparent rounded-full" />
      </div>
    );
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-neutral-200 flex flex-col">
        <div className="p-6 border-b border-neutral-100">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-2 font-heading text-xl font-extrabold tracking-tight text-neutral-900"
          >
            <div className="w-8 h-8 rounded-lg bg-brand-blue flex items-center justify-center">
              <FileText size={16} className="text-white" />
            </div>
            ParchaHub
            <span className="text-xs font-semibold text-brand-blue bg-brand-blue/10 px-2 py-0.5 rounded-full ml-1">
              Admin
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-brand-blue text-white"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-neutral-100">
          {user && (
            <div className="mb-3 px-4 py-2 bg-neutral-50 rounded-lg">
              <p className="text-sm font-medium text-neutral-900 truncate">
                {user.name}
              </p>
              <p className="text-xs text-neutral-400 truncate">{user.email}</p>
            </div>
          )}
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-6 py-8">{children}</div>
      </main>
    </div>
  );
}
