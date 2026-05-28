"use client";

import { MapPin } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getCategories, getPamphlets } from "@/services/api";

type Category = {
  id: number;
  name: string;
  slug: string;
};

type Pamphlet = {
  id: number;
  title: string;
  url_key: string;
  category: string;
  short_description: string;
  content: string;
  thumbnail_image: string | null;
  created_at: string;
  user_id: number;
  location_id: number;
  location: {
    city: string;
    latitude: number;
    longitude: number;
  } | null;
};

type PamphletPayload = {
  data?: Array<Pamphlet>;
  items?: Array<Pamphlet>;
};

// Bug Fix B+C: resolve relative thumbnail paths to the backend origin
const API_ORIGIN = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api"
).replace(/\/api\/?$/, "");

const getThumbnailUrl = (src?: string | null): string | null => {
  if (!src) return null;
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  const clean = src.startsWith("/") ? src : `/uploads/${src}`;
  return `${API_ORIGIN}${clean}`;
};

const Home = () => {
  const [categories, setCategories] = useState<Array<Category>>([]);
  const [pamphlets, setPamphlets] = useState<Array<Pamphlet>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const hydrate = async () => {
      setLoading(true);
      try {
        const [categoryData, pamphletData] = await Promise.all([
          getCategories(),
          getPamphlets(1, 8),
        ]);

        if (!isMounted) return;

        setCategories(Array.isArray(categoryData) ? categoryData : []);

        const normalizedPamphlets = Array.isArray(pamphletData)
          ? pamphletData
          : (pamphletData as PamphletPayload)?.data ||
            (pamphletData as PamphletPayload)?.items ||
            [];

        setPamphlets(normalizedPamphlets);
      } catch (error) {
        console.error("Failed to load landing page data", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    hydrate();
    return () => { isMounted = false; };
  }, []);

  const filteredPamphlets = useMemo(() => {
    return pamphlets && pamphlets.length > 0 ? pamphlets.slice(0, 8) : [];
  }, [pamphlets]);

  return (
    <div>
      <section className="relative border-b border-brand-border overflow-hidden bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-10 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
            Discover Local Pamphlets
          </h1>
          <p className="text-lg text-neutral-500 max-w-xl mx-auto">
            Browse awareness pamphlets, events, services, and more from your
            community.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 pt-12 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-neutral-900">
            Browse Categories
          </h2>
        </div>
        <div className="overflow-x-auto pb-2">
          <div className="inline-flex gap-3 min-w-max">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categories?category=${category.slug}`}
                className="pill-button hover:-translate-y-0.5"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Top Pamphlets */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-neutral-900">
            Top / Popular Pamphlets
          </h2>
          <Link
            href="/categories"
            className="text-sm font-semibold text-brand-blue hover:underline"
          >
            View all
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="surface-card p-4">
                <div className="skeleton-shimmer rounded-2xl w-full aspect-[3/4]" />
                <div className="mt-4 h-4 rounded skeleton-shimmer" />
                <div className="mt-2 h-3 w-2/3 rounded skeleton-shimmer" />
                <div className="mt-3 h-3 w-1/2 rounded skeleton-shimmer" />
              </div>
            ))}
          </div>
        ) : filteredPamphlets.length === 0 ? (
          <div className="surface-card p-12 text-center text-neutral-400">
            <p className="text-lg font-medium mb-1">No pamphlets yet</p>
            <p className="text-sm">Run the seed script to populate initial data.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {filteredPamphlets.map((item) => {
              const thumbUrl = getThumbnailUrl(item.thumbnail_image);
              return (
                <Link
                  key={item.id}
                  href={`/pamphlet/${item.url_key}`}
                  className="block"
                >
                  <article className="surface-card p-4 hover:-translate-y-1 transition-transform h-full">
                    {/* Bug Fix C: replaced <Image width={30} height={30}> with a plain
                        <img> that fills the aspect-ratio container correctly */}
                    {thumbUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={thumbUrl}
                        alt={item.title}
                        className="w-full aspect-[3/4] rounded-2xl object-cover"
                      />
                    ) : (
                      <div className="w-full aspect-[3/4] rounded-2xl bg-neutral-100 flex items-center justify-center text-sm text-neutral-400">
                        No image
                      </div>
                    )}
                    <h3 className="mt-4 text-base font-bold text-neutral-900 line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm text-neutral-500 line-clamp-2">
                      {item.short_description}
                    </p>
                    <p className="mt-2 text-sm text-neutral-600 flex items-center justify-between gap-1">
                      <span className="inline-flex items-center gap-1 line-clamp-1">
                        <MapPin size={13} className="text-brand-blue shrink-0" />
                        {/* Bug Fix A result: location.city is now correctly populated */}
                        {item.location?.city || "—"}
                      </span>
                      <span className="shrink-0 text-xs text-neutral-400">
                        {item.created_at
                          ? new Date(item.created_at).toLocaleDateString()
                          : ""}
                      </span>
                    </p>
                  </article>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
