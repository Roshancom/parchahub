"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export const useRequireAuth = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  return {
    isAuthenticated,
    isReady: isAuthenticated,
  };
};

export const useGuestOnly = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/profile");
    }
  }, [isAuthenticated, router]);

  return {
    isAuthenticated,
    isReady: !isAuthenticated,
  };
};

export default useRequireAuth;
