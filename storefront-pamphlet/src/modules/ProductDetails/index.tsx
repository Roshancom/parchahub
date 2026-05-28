"use client";

import { CalendarDays, MapPin } from "lucide-react";
import parse from "html-react-parser";
import Link from "next/link";
import React from "react";
import { getPamphlets } from "@/services/api";

type Pamphlet = {
  id: number;
  title: string;
  content: string | null;
  category: string;
  location: { city: string; latitude: number; longitude: number };
  user_id: number;
  created_at: string;
  author_name: string;
  images: string[];
  thumbnail_image?: string | null;
  url_key?: string;
  contact: { phone: string | null; email: string | null } | null;
};

const PamphletDetails = ({ data }: { data: Pamphlet }) => {
  const [activeImage, setActiveImage] = React.useState(0);
  const [related, setRelated] = React.useState<Array<Pamphlet>>([]);

  React.useEffect(() => {
    let isMounted = true;

    const loadRelated = async () => {
      try {
        const relatedData = await getPamphlets(1, 10, {
          category: data.category,
        });

        const normalized = Array.isArray(relatedData)
          ? relatedData
          : relatedData?.data || relatedData?.items || [];

        const filtered = normalized.filter(
          (item: Pamphlet) => item.url_key && item.url_key !== data.url_key,
        );

        if (isMounted) {
          setRelated(filtered.slice(0, 8));
        }
      } catch (error) {
        console.error("Failed to load related pamphlets", error);
      }
    };

    loadRelated();

    return () => {
      isMounted = false;
    };
  }, [data.category, data.url_key]);

  const gallery =
    data.images && data.images.length > 0
      ? data.images
      : data.thumbnail_image
        ? [data.thumbnail_image]
        : [];

  const mapPoint =
    typeof data.location === "object" &&
    data.location?.latitude &&
    data.location.longitude
      ? { lat: data.location.latitude, lng: data.location.longitude }
      : null;

  return (
    <div className="min-h-screen bg-neutral-100/50">
      <div className="max-w-7xl mx-auto px-4 py-10 grid lg:grid-cols-2 gap-8">
        <section className="surface-card p-4 md:p-6">
          <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-200">
            {gallery.length > 0 ? (
              <img
                src={gallery[activeImage]}
                alt={data.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-neutral-500">
                No Images Available
              </div>
            )}
          </div>

          {gallery.length > 1 ? (
            <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
              {gallery.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  onClick={() => setActiveImage(index)}
                  className={`shrink-0 rounded-xl overflow-hidden border-2 ${
                    activeImage === index
                      ? "border-brand-blue"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${data.title} preview ${index + 1}`}
                    className="w-20 h-20 object-cover"
                  />
                </button>
              ))}
            </div>
          ) : null}
        </section>

        <section className="surface-card p-6 md:p-7">
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 leading-tight">
            {data.title}
          </h1>
          <div className="mt-5 space-y-3 text-sm text-neutral-600">
            <p>
              Posted by{" "}
              <span className="font-semibold text-neutral-900">
                {data.author_name}
              </span>
            </p>
            <p className="inline-flex items-center gap-2">
              <CalendarDays size={16} className="text-brand-blue" />
              {new Date(data.created_at).toLocaleDateString()}
            </p>
            <p className="inline-flex items-center gap-2">
              <MapPin size={16} className="text-brand-blue" />
              {data.location?.city}
            </p>
          </div>

          <div className="mt-7 rounded-2xl border border-brand-border p-4 bg-neutral-50">
            <h2 className="text-base font-semibold text-neutral-900">
              Contact Info
            </h2>
            {data.contact ? (
              <>
                <p className="mt-3 text-sm text-neutral-700">
                  {data.contact.phone ||
                    "Contact information is not available."}
                </p>
                <p className="mt-3 text-sm text-neutral-700">
                  {data.contact.email ||
                    "Contact information is not available."}
                </p>
              </>
            ) : null}
          </div>

          {mapPoint?.lat && mapPoint?.lng ? (
            <div className="mt-6 rounded-2xl overflow-hidden border border-brand-border h-52">
              <iframe
                title="Location Map"
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                marginHeight={0}
                marginWidth={0}
                src={`https://maps.google.com/maps?q=${mapPoint.lat},${mapPoint.lng}&z=15&output=embed`}
              />
            </div>
          ) : null}
        </section>
      </div>

      <section className="max-w-7xl mx-auto px-4 pb-8">
        <div className="surface-card p-6 md:p-8">
          <h2 className="text-2xl font-bold text-neutral-900">Content</h2>
          <p className="mt-4 text-neutral-700 leading-7 whitespace-pre-line">
            {parse(data.content || "No content available.")}
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-12">
        <h2 className="text-2xl font-bold text-neutral-900 mb-5">
          Related Pamphlets
        </h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {related.map((item) => (
            <article
              key={`${item.id}-${item.url_key}`}
              className="surface-card p-3 min-w-[240px] max-w-[240px]"
            >
              {item.thumbnail_image ? (
                <img
                  src={item.thumbnail_image}
                  alt={item.title}
                  className="w-full aspect-[3/4] object-cover rounded-xl"
                />
              ) : (
                <div className="w-full aspect-[3/4] rounded-xl bg-neutral-200 flex items-center justify-center text-sm text-neutral-500">
                  Placeholder
                </div>
              )}
              <h3 className="mt-3 text-sm font-semibold text-neutral-900 line-clamp-2">
                {item.title}
              </h3>
              <Link
                href={`/pamphlet/${item.url_key}`}
                className="mt-3 inline-flex text-xs font-semibold text-brand-blue hover:underline"
              >
                View pamphlet
              </Link>
            </article>
          ))}

          {related.length === 0 ? (
            <div className="surface-card p-5 text-sm text-neutral-500">
              No related pamphlets available.
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
};

export default PamphletDetails;
