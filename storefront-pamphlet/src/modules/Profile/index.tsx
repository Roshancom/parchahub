"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useUser } from "@/hooks/useUser";
import CreatePamphlet from "./components/CreatePamphlet";
import PamphletHistory from "./components/PamphletHistory";
import { useAuth } from "@/context/AuthContext";
import { User } from "@/types";

type ProfileFormValues = {
  name: string;
  email: string;
};

const Profile = ({ user }: { user: User }) => {
  const { updateProfile, updating, error, profile } = useUser();
  const [successMessage, setSuccessMessage] = useState("");

  console.log({ user, profile });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    defaultValues: {
      name: profile?.name || user?.name || "",
      email: profile?.email || user?.email || "",
    },
  });

  const [activeTab, setActiveTab] = useState("portfolio");
  const [activeSection, setActiveSection] = useState("create");

  const { logout } = useAuth();

  const onSubmit = async (data: ProfileFormValues) => {
    if (user) {
      await updateProfile({ name: data.name, email: data.email });
      setSuccessMessage("Profile updated successfully!");

      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
    }
  };

  useEffect(() => {
    reset({
      name: profile?.name || user?.name || "",
      email: profile?.email || user?.email || "",
    });
  }, [profile?.name, profile?.email, user?.name, user?.email, reset]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 h-screen ">
      <div className="rounded-3xl border border-brand-border p-4 md:p-5 surface-card">
        <h2 className="text-2xl font-bold text-white mb-6">My Profile</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-500">
              Name
            </label>
            <input
              {...register("name", { required: "Name is required" })}
              className="mt-1 block w-full rounded-2xl border border-brand-border px-4 py-2.5 text-sm focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10  "
            />
            {errors.name && (
              <p className="mt-2 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">
              Email
            </label>
            <input
              type="email"
              {...register("email")}
              disabled
              className="mt-1 block w-full rounded-2xl border border-brand-border px-4 py-2.5 text-sm text-gray-400 cursor-not-allowed"
            />
          </div>
          <div className="flex justify-between">
            <button
              type="submit"
              disabled={updating}
              className="rounded-full bg-brand-blue px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-70 text-white"
            >
              {updating ? "Saving..." : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={logout}
              disabled={updating}
              className="rounded-full bg-brand-blue px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-70 text-white"
            >
              LogOut
            </button>
          </div>
          {successMessage && (
            <p className="mt-4 text-sm text-green-500">{successMessage}</p>
          )}
          {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Profile;
