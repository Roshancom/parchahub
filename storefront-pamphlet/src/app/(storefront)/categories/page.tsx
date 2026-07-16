"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import CategoryListingPage, {
  type CategoryPamphlets,
} from "@/modules/Category";
import {
  getFilterData,
  getPamphlets,
} from "@/modules/Category/services/index.services";

type FilterItem = {
  id: number;
  name: string;
  slug: string;
  created_at: string;
};

const FALLBACK_PAMPHLETS: CategoryPamphlets = {
  data: [],
  page: 1,
  totalPages: 1,
  total: 0,
  limit: 12,
};

function CategoriesPageContent() {
  const searchParams = useSearchParams();

  const [pamphlets, setPamphlets] = useState<CategoryPamphlets | null>(null);
  const [filters, setFilters] = useState<FilterItem[]>([]);
  const [loading, setLoading] = useState(true);

  const _searchParams = Object.fromEntries(searchParams?.entries() ?? []);

  useEffect(() => {
    let isMounted = true;

    Promise.all([getPamphlets(_searchParams), getFilterData()])
      .then(([pamphletsData, filtersData]) => {
        if (!isMounted) return;
        setPamphlets(pamphletsData as CategoryPamphlets);
        setFilters(filtersData as FilterItem[]);
      })
      .catch((error) => {
        console.error("Failed to load category page data:", error);
        if (isMounted) {
          setPamphlets(FALLBACK_PAMPHLETS);
          setFilters([]);
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams?.toString()]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-6">
          <aside className="w-72 hidden lg:block">
            <div className="bg-white rounded-3xl p-5 border border-brand-border sticky top-24">
              <div className="skeleton-shimmer h-4 w-24 rounded mb-6" />
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="skeleton-shimmer h-3 w-32 rounded mb-3"
                />
              ))}
            </div>
          </aside>
          <main className="flex-1">
            <div className="skeleton-shimmer h-8 w-48 rounded mb-6" />
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-3xl overflow-hidden border border-brand-border"
                >
                  <div className="skeleton-shimmer aspect-[3/4]" />
                  <div className="p-4 space-y-2">
                    <div className="skeleton-shimmer h-3 w-16 rounded-full" />
                    <div className="skeleton-shimmer h-4 w-full rounded" />
                    <div className="skeleton-shimmer h-3 w-3/4 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <CategoryListingPage
      pamphlets={pamphlets ?? FALLBACK_PAMPHLETS}
      filters={filters}
      searchParams={_searchParams}
    />
  );
}

export default function CategoriesPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex gap-6">
            <aside className="w-72 hidden lg:block">
              <div className="bg-white rounded-3xl p-5 border border-brand-border sticky top-24">
                <div className="skeleton-shimmer h-4 w-24 rounded mb-6" />
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="skeleton-shimmer h-3 w-32 rounded mb-3"
                  />
                ))}
              </div>
            </aside>
            <main className="flex-1">
              <div className="skeleton-shimmer h-8 w-48 rounded mb-6" />
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-3xl overflow-hidden border border-brand-border"
                  >
                    <div className="skeleton-shimmer aspect-[3/4]" />
                    <div className="p-4 space-y-2">
                      <div className="skeleton-shimmer h-3 w-16 rounded-full" />
                      <div className="skeleton-shimmer h-4 w-full rounded" />
                      <div className="skeleton-shimmer h-3 w-3/4 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </main>
          </div>
        </div>
      }
    >
      <CategoriesPageContent />
    </Suspense>
  );
}
