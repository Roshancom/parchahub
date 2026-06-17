"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export const useRequireAuth = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/admin/login");
    }
  }, [isAuthenticated, router]);

  return {
    isAuthenticated,
    loading: !isAuthenticated,
    isReady: isAuthenticated,
  };
};

export const useGuestOnly = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/admin/dashboard");
    }
  }, [isAuthenticated, router]);

  return {
    isAuthenticated,
    isReady: !isAuthenticated,
  };
};

export default useRequireAuth;
