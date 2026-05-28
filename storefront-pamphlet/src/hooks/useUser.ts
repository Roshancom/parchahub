"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getUserById, updateUserById } from "@/services/api";

type UserProfile = {
  id: number;
  name: string;
  email: string;
  role?: "admin" | "owner";
  created_at?: string;
};

export const useUser = () => {
  const { user, updateSessionUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      if (!user?.id) {
        setProfile(null);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const data = await getUserById(user.id);

        if (!isMounted) {
          return;
        }

        setProfile({
          id: Number(data?.id || user.id),
          name: data?.name || user?.name || "",
          email: data?.email || user?.email || "",
          role: (data?.role || user?.role || "owner") as "admin" | "owner",
          created_at: data?.created_at || user?.created_at,
        });
      } catch (nextError) {
        if (!isMounted) {
          return;
        }

        const message =
          nextError instanceof Error
            ? nextError.message
            : "Unable to load user profile.";
        setError(message);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [user?.id, user?.name, user?.email, user?.role, user?.created_at]);

  const updateProfile = async (payload: { name: string; email: string }) => {
    if (!user?.id) {
      throw new Error("User id is missing.");
    }

    setUpdating(true);
    setError("");

    try {
      const data = await updateUserById(user.id, payload);
      const nextProfile = {
        id: Number(data?.id || user.id),
        name: data?.name || payload.name,
        email: data?.email || payload.email,
        role: (data?.role || user.role || "owner") as "admin" | "owner",
        created_at: data?.created_at || profile?.created_at,
      };

      setProfile(nextProfile);
      updateSessionUser(nextProfile);
      return nextProfile;
    } catch (nextError) {
      const message =
        nextError instanceof Error
          ? nextError.message
          : "Unable to update profile.";
      setError(message);
      throw new Error(message);
    } finally {
      setUpdating(false);
    }
  };

  return {
    profile,
    loading,
    updating,
    error,
    updateProfile,
  };
};

export default useUser;
