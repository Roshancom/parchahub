"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  createPamphlet,
  deletePamphletById,
  getPamphlets,
  updatePamphletById,
} from "@/services/api";

type PamphletItem = {
  id: number | string;
  title: string;
  thumbnail_image?: string;
  category: string;
  category_name?: string;
  location: {
    latitude: number;
    longitude: number;
    city: string;
  };
  url_key: string;
  short_description?: string;
  phone: string;
  email?: string;
  content: string;
  author_name?: string;
  created_at?: string;
};

type PamphletFormPayload = {
  title: string;
  thumbnail_image?: File | FileList | null;
  content?: string;
  location: {
    latitude: number;
    longitude: number;
    city: string;
  };
  url_key: string;
  short_description?: string;
  category: string;
  phone: string;
  email?: string;
};

type RawPamphlet = {
  id?: number | string;
  _id?: number | string;
  title?: string;
  thumbnail_image?: string;
  category?: string | { id?: string | number; name?: string };
  location?:
    | string
    | {
        latitude?: number | string;
        longitude?: number | string;
        city?: string;
      };
  url_key?: string;
  short_description?: string;
  phone?: string | number;
  email?: string;
  content?: string;
  author_name?: string;
  created_at?: string;
};

const parseLocation = (location: RawPamphlet["location"]) => {
  if (!location) {
    return { latitude: 0, longitude: 0, city: "" };
  }

  if (typeof location === "string") {
    try {
      const parsed = JSON.parse(location);
      return {
        latitude: Number(parsed?.latitude || 0),
        longitude: Number(parsed?.longitude || 0),
        city: parsed?.city || "",
      };
    } catch {
      return { latitude: 0, longitude: 0, city: location };
    }
  }

  return {
    latitude: Number(location.latitude || 0),
    longitude: Number(location.longitude || 0),
    city: location?.city || "",
  };
};

const normalizePamphlet = (item: RawPamphlet = {}): PamphletItem => ({
  id: item?.id || item?._id || Date.now(),
  title: item?.title || "Untitled",
  thumbnail_image: item?.thumbnail_image || "",
  category:
    typeof item?.category === "object"
      ? String(item?.category?.id || "")
      : String(item?.category || ""),
  category_name:
    typeof item?.category === "object"
      ? item?.category?.name || ""
      : String(item?.category || ""),
  location: parseLocation(item?.location),
  url_key: item?.url_key || "",
  short_description: item?.short_description || "",
  phone: String(item?.phone || ""),
  email: item?.email || "",
  content: item?.content || "",
  author_name: item?.author_name,
  created_at: item?.created_at,
});

const getThumbnailFile = (
  thumbnail: PamphletFormPayload["thumbnail_image"],
): File | null => {
  if (!thumbnail) {
    return null;
  }

  if (thumbnail instanceof File) {
    return thumbnail;
  }

  if (thumbnail instanceof FileList && thumbnail.length > 0) {
    return thumbnail.item(0);
  }

  return null;
};

const toRequestPayload = (payload: PamphletFormPayload): FormData => {
  const formData = new FormData();

  formData.append("title", payload.title);
  formData.append("content", payload.content || "");
  formData.append("url_key", payload.url_key);
  formData.append("short_description", payload.short_description || "");
  formData.append("category", String(payload.category));
  formData.append("phone", String(payload.phone || ""));
  formData.append("email", payload.email || "");

  formData.append(
    "location",
    JSON.stringify({
      latitude: Number(payload.location?.latitude || 0),
      longitude: Number(payload.location?.longitude || 0),
      city: payload.location?.city || "",
    }),
  );

  const file = getThumbnailFile(payload.thumbnail_image);
  if (file instanceof File) {
    formData.append("thumbnail_image", file);
  }

  return formData;
};

export const usePamphlets = () => {
  const { user, isAdmin } = useAuth();
  const [items, setItems] = useState<PamphletItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Bug Fix #6: remove the broken user_id query param — the backend ignores it.
  // This hook is used for CRUD operations (create/update/delete) for admins or
  // general listing. The PamphletHistory component uses /user/pamphlets/:id directly.
  const fetchItems = useCallback(async () => {
    if (!user?.id && !isAdmin) {
      setItems([]);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await getPamphlets(1, 50);

      const list = Array.isArray(response)
        ? response
        : response?.items || response?.data || [];

      setItems(list.map(normalizePamphlet));
    } catch (nextError) {
      const message =
        nextError instanceof Error
          ? nextError.message
          : "Unable to load pamphlets.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [isAdmin, user?.id]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const createItem = async (payload: PamphletFormPayload) => {
    setSaving(true);
    setError("");

    const normalizedPayload = toRequestPayload(payload);

    try {
      const created = await createPamphlet(normalizedPayload);
      const nextItem = normalizePamphlet(created);

      return nextItem;
    } catch (nextError) {
      const message =
        nextError instanceof Error
          ? nextError.message
          : "Unable to create pamphlet.";
      setError(message);
      throw new Error(message);
    } finally {
      setSaving(false);
    }
  };

  const updateItem = async (
    id: number | string,
    payload: PamphletFormPayload,
  ) => {
    setSaving(true);
    setError("");

    const normalizedPayload = toRequestPayload(payload);

    try {
      const updated = await updatePamphletById(id, normalizedPayload);
      const nextItem = normalizePamphlet(updated);

      return nextItem;
    } catch (nextError) {
      const message =
        nextError instanceof Error
          ? nextError.message
          : "Unable to update pamphlet.";
      setError(message);
      throw new Error(message);
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = async (id: number | string) => {
    setSaving(true);
    setError("");

    try {
      await deletePamphletById(id);
      return true;
    } catch (nextError) {
      const message =
        nextError instanceof Error
          ? nextError.message
          : "Unable to delete pamphlet.";
      setError(message);
      throw new Error(message);
    } finally {
      setSaving(false);
    }
  };

  return {
    items,
    loading,
    saving,
    error,
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
  };
};

export default usePamphlets;
