"use client";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { pamphletSchema } from "../../validation";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { usePamphlets } from "@/hooks/usePamphlets";
import { getCategories } from "@/services/api";
import { z } from "zod";
import RichTextEditor from "./RichTextEditor";

type PamphletFormValues = z.infer<typeof pamphletSchema>;

type CategoryItem = {
  id: string | number;
  name: string;
};

type PamphletEditItem = {
  id: number | string;
  title?: string;
  thumbnail_image?: string;
  content?: string;
  location?: {
    latitude?: number;
    longitude?: number;
    city?: string;
  };
  url_key?: string;
  short_description?: string;
  category?: string;
  category_name?: string;
  phone?: string;
  email?: string;
};

type CreatePamphletProps = {
  pamphletToEdit?: PamphletEditItem | null;
  onPamphletCreated: () => void;
};

// Bug Fix #8: fixed `rounded-2xltext-gray-500` → `rounded-2xl bg-gray-100`
const LocationPicker = dynamic(() => import("./LocationPicker"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] w-full animate-pulse rounded-2xl bg-gray-100" />
  ),
});

const CreatePamphlet = ({
  pamphletToEdit = null,
  onPamphletCreated,
}: CreatePamphletProps) => {
  const { createItem, updateItem, saving, error: saveError } = usePamphlets();
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categoriesError, setCategoriesError] = useState("");

  const defaultValues = useMemo<PamphletFormValues>(
    () => ({
      title: pamphletToEdit?.title || "",
      thumbnail_image: undefined,
      content: pamphletToEdit?.content || "",
      location: {
        latitude: Number(pamphletToEdit?.location?.latitude || 0),
        longitude: Number(pamphletToEdit?.location?.longitude || 0),
        city: pamphletToEdit?.location?.city || "",
      },
      url_key: pamphletToEdit?.url_key || "",
      short_description: pamphletToEdit?.short_description || "",
      category:
        pamphletToEdit?.category ||
        (pamphletToEdit?.category_name
          ? String(pamphletToEdit.category_name)
          : ""),
      phone: pamphletToEdit?.phone || "",
      email: pamphletToEdit?.email || "",
    }),
    [pamphletToEdit],
  );

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<PamphletFormValues>({
    resolver: zodResolver(pamphletSchema),
    defaultValues,
  });

  const watchedLocation = watch("location");

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  useEffect(() => {
    const fetchCategories = async () => {
      setCategoriesLoading(true);
      setCategoriesError("");
      try {
        const data = await getCategories();
        const normalized = Array.isArray(data)
          ? data
          : Array.isArray(data?.items)
            ? data.items
            : [];

        setCategories(
          normalized.map((item: Record<string, unknown>) => ({
            id: String(item?.id ?? ""),
            name: String(item?.name ?? "Unnamed"),
          })),
        );
      } catch (nextError) {
        setCategoriesError("Failed to load categories");
        console.error("Failed to fetch categories", nextError);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleLocationSelect = (
    latlng: { lat: number; lng: number },
    label?: string,
  ) => {
    setValue(
      "location",
      {
        latitude: latlng.lat,
        longitude: latlng.lng,
        city: label || watchedLocation?.city || "",
      },
      { shouldValidate: true, shouldDirty: true, shouldTouch: true },
    );
  };

  const onSubmit = async (data: PamphletFormValues) => {
    try {
      if (pamphletToEdit) {
        await updateItem(pamphletToEdit.id, data);
      } else {
        await createItem(data);
      }
      onPamphletCreated();
      reset(defaultValues);
    } catch (nextError) {
      console.error("Failed to save pamphlet", nextError);
    }
  };

  // Bug Fix #8: all `font-mediumtext-gray-500` → `font-medium text-gray-500`
  //             all `focus:ring-brand-blue/10text-gray-500` → `focus:ring-brand-blue/10 text-gray-500`
  //             all `text-smtext-gray-500` → `text-sm text-gray-500`
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-500">
              Title
            </label>
            <input
              {...register("title")}
              className="mt-1 block w-full rounded-2xl border border-brand-border px-4 py-2.5 text-sm focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 text-gray-900"
            />
            {errors.title && (
              <p className="mt-2 text-sm text-red-500">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500">
              URL Key
            </label>
            <input
              {...register("url_key")}
              className="mt-1 block w-full rounded-2xl border border-brand-border px-4 py-2.5 text-sm focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 text-gray-900"
            />
            {errors.url_key && (
              <p className="mt-2 text-sm text-red-500">
                {errors.url_key.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500">
              Short Description
            </label>
            <textarea
              {...register("short_description")}
              className="mt-1 block w-full rounded-2xl border border-brand-border px-4 py-2.5 text-sm focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500">
              Category
            </label>
            <select
              {...register("category")}
              disabled={categoriesLoading}
              className="mt-1 block w-full rounded-2xl border border-brand-border px-4 py-2.5 text-sm focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 text-gray-900"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={String(cat.id)} value={String(cat.name)}>
                  {cat.name}
                </option>
              ))}
            </select>
            {categoriesError && (
              <p className="mt-2 text-sm text-red-500">{categoriesError}</p>
            )}
            {errors.category && (
              <p className="mt-2 text-sm text-red-500">
                {errors.category.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500">
              Phone Number
            </label>
            <input
              type="tel"
              {...register("phone")}
              className="mt-1 block w-full rounded-2xl border border-brand-border px-4 py-2.5 text-sm focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 text-gray-900"
            />
            {errors.phone && (
              <p className="mt-2 text-sm text-red-500">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500">
              Email
            </label>
            <input
              type="email"
              {...register("email")}
              className="mt-1 block w-full rounded-2xl border border-brand-border px-4 py-2.5 text-sm focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 text-gray-900"
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500">
              Thumbnail Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                setValue("thumbnail_image", file ?? null, {
                  shouldValidate: true,
                  shouldDirty: true,
                });
              }}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-blue file:text-white hover:file:bg-brand-blue-dark"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-500">
              Content
            </label>
            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <RichTextEditor value={field.value} onChange={field.onChange} />
              )}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">
              Location
            </label>
            <LocationPicker
              onLocationSelect={handleLocationSelect}
              location={{
                lat: watchedLocation?.latitude || 51.505,
                lng: watchedLocation?.longitude || -0.09,
              }}
            />
            {errors.location?.city && (
              <p className="mt-2 text-sm text-red-500">
                {errors.location?.city.message}
              </p>
            )}
            <input type="hidden" {...register("location.city")} />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-brand-blue px-4 py-2.5 text-sm font-semibold text-white"
        >
          {saving
            ? "Saving..."
            : pamphletToEdit
              ? "Update Pamphlet"
              : "Create Pamphlet"}
        </button>
      </div>
      {saveError && <p className="text-sm text-red-500">{saveError}</p>}
    </form>
  );
};

export default CreatePamphlet;
