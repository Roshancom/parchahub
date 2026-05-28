import PamphletCard from "@/core/components/Card";
import CategoryFilter from "./components/Filter";
import Link from "next/link";

export type Pamphlet = {
  id: number;
  title: string;
  thumbnail_image: string | null;
  category: string;
  location: { city: string; latitude: number; longitude: number };
  author_name: string;
  url_key: string;
  short_description: string;
  created_at: string;
};

export type CategoryPamphlets = {
  data?: Array<Pamphlet>;
  items?: Array<Pamphlet>;
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
};

export type WithPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

type FiltersType = {
  id: number;
  name: string;
  slug: string;
  created_at: string;
};

const CategoryListingPage = ({
  pamphlets,
  filters,
  searchParams,
}: {
  pamphlets: CategoryPamphlets;
  filters: Array<FiltersType>;
  searchParams: { [key: string]: string };
}) => {
  const items = Array.isArray(pamphlets)
    ? pamphlets
    : pamphlets?.items || pamphlets?.data || [];

  const page = Number(pamphlets?.page || 1);
  const totalPages = Number(pamphlets?.totalPages || 1);

  const previousQuery = new URLSearchParams({
    ...(searchParams || {}),
    page: String(Math.max(page - 1, 1)),
  }).toString();

  const nextQuery = new URLSearchParams({
    ...(searchParams || {}),
    page: String(Math.min(page + 1, totalPages || 1)),
  }).toString();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex gap-6">
      {/* Sidebar */}
      <aside className="w-72 hidden lg:block">
        <CategoryFilter filters={filters} page={page} />
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">
              Shopping Results
            </h1>
            <p className="text-sm text-neutral-500 mt-1">
              Showing {items.length} pamphlets
            </p>
          </div>
        </div>

        {/* Grid */}
        {items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {items.map((item, index) => (
              <PamphletCard key={index} item={item} />
            ))}
          </div>
        ) : (
          <div className="surface-card p-8 text-center text-neutral-500">
            No pamphlets found for this filter selection.
          </div>
        )}

        {page > 1 && (
          <div className="flex items-center justify-center mt-8 gap-3">
            <Link
              href={page > 1 ? `/categories?${previousQuery}` : "#"}
              className={`px-4 py-2 rounded-full border text-sm font-semibold ${
                page > 1
                  ? "border-brand-border text-neutral-700 hover:border-brand-blue"
                  : "border-brand-border text-neutral-400 pointer-events-none"
              }`}
            >
              Previous
            </Link>
            <span className="text-sm text-neutral-500">
              Page {page} of {totalPages}
            </span>
            <Link
              href={page < totalPages ? `/categories?${nextQuery}` : "#"}
              className={`px-4 py-2 rounded-full border text-sm font-semibold ${
                page < totalPages
                  ? "border-brand-border text-neutral-700 hover:border-brand-blue"
                  : "border-brand-border text-neutral-400 pointer-events-none"
              }`}
            >
              Next
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default CategoryListingPage;
