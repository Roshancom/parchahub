import { Pamphlet } from "@/modules/Category";
import { MapPin } from "lucide-react";
import Link from "next/link";

// Bug Fix B: prepend the API origin when the stored value is just a filename or
// a server-relative path, so the browser fetches from the backend, not the
// Next.js server.
const API_ORIGIN = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api"
).replace(/\/api\/?$/, "");

const getThumbnailUrl = (thumbnail_image?: string | null): string | null => {
  if (!thumbnail_image) return null;
  if (thumbnail_image.startsWith("http://") || thumbnail_image.startsWith("https://")) {
    return thumbnail_image;
  }
  // Relative path like "/uploads/foo.jpg" or plain filename "foo.jpg"
  const clean = thumbnail_image.startsWith("/") ? thumbnail_image : `/uploads/${thumbnail_image}`;
  return `${API_ORIGIN}${clean}`;
};

const PamphletCard = ({ item }: { item: Pamphlet }) => {
  const {
    author_name,
    category,
    created_at,
    short_description,
    thumbnail_image,
    location,
    title,
    url_key,
  } = item || {};

  const thumbUrl = getThumbnailUrl(thumbnail_image);

  return (
    <Link href={`/pamphlet/${url_key}`} className="block">
      <article className="group bg-white rounded-3xl shadow-soft hover:shadow-lift transition-all overflow-hidden border border-brand-border h-full">
        <div className="relative aspect-[3/4] overflow-hidden bg-neutral-200">
          {thumbUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={thumbUrl}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-sm text-neutral-500 bg-gradient-to-br from-neutral-100 to-neutral-200">
              <span className="opacity-50">No image</span>
            </div>
          )}
        </div>

        <div className="p-4">
          <span className="inline-flex text-xs px-2.5 py-1 bg-success-100 text-success-700 rounded-full mb-2 capitalize">
            {category}
          </span>
          <h3 className="text-base font-semibold text-neutral-900 line-clamp-1">
            {title}
          </h3>
          <p className="text-sm text-neutral-500 mt-1 line-clamp-2">
            {short_description || "No description available"}
          </p>
          <div className="text-xs text-neutral-500 mt-3 flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1 line-clamp-1">
              <MapPin size={13} className="text-brand-blue shrink-0" />
              {location?.city || "—"}
            </span>
            <span className="shrink-0">
              {created_at ? new Date(created_at).toLocaleDateString() : "—"}
            </span>
          </div>
          {author_name && (
            <p className="text-xs text-neutral-400 mt-1 truncate">by {author_name}</p>
          )}
        </div>
      </article>
    </Link>
  );
};

export default PamphletCard;
