"use client";

import { useRequireAuth } from "@/hooks/useRouteAccess";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import Profile from "@/modules/Profile";

export default function AdminProfilePage() {
  const { isReady } = useRequireAuth();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isReady || !mounted) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-2 border-brand-blue border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <Profile
      user={{
        id: user?.id || "",
        name: user?.name || "",
        email: user?.email || "",
      }}
    />
  );
}
