"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { CATEGORY } from "../../constants/index.constants";

type CategoryFilter = {
  id: number;
  name: string;
  slug: string;
};

const CategoryFilter = ({
  filters,
  page,
}: {
  filters: Array<CategoryFilter>;
  page: number;
}) => {
  const searchParams = useSearchParams();
  const routes = useRouter();

  const selectedCategory = searchParams?.get(CATEGORY) || "";
  const selectedLocation = searchParams?.get("location") || "";
  const selectedDate = searchParams?.get("date") || "";

  const locationOptions = ["Kathmandu", "Pokhara", "Butwal", "Lalitpur"];
  // const dateAddedOptions = [
  //   { label: "Today", value: "today" },
  //   { label: "This week", value: "this-week" },
  //   { label: "This month", value: "this-month" },
  // ];

  const applyParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams?.toString() || "");

    if (!value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    params.set("page", "1");
    routes.push(`/categories?${params.toString()}`);
  };

  const clearFilters = () => {
    routes.push("/categories");
  };

  const handleClick = ({ type, slug }: { type: string; slug: string }) => {
    const params = new URLSearchParams(searchParams?.toString() || "");

    if (type === CATEGORY) {
      params.set(CATEGORY, slug);
    }

    if (type === "page" && Number(slug) !== page) {
      params.set("page", slug);
    }

    routes.push(`/categories?${params.toString()}`);
  };

  return (
    <div className="bg-white rounded-3xl shadow-soft p-5 border border-brand-border sticky top-24">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg text-neutral-900">Filters</h3>
        <button
          onClick={clearFilters}
          className="text-xs text-brand-blue hover:underline"
        >
          Clear All
        </button>
      </div>

      {/* Categories */}
      <div className="border-t border-brand-border pt-4">
        <h4 className="text-sm font-semibold text-neutral-700 mb-2">
          Category
        </h4>

        <ul className="space-y-2">
          {filters.map((item) => (
            <li
              key={item.id}
              onClick={() => handleClick({ type: CATEGORY, slug: item.slug })}
              className={`cursor-pointer text-sm px-2 py-1 rounded-md capitalize transition-colors ${
                selectedCategory === item.slug
                  ? "bg-blue-50 text-brand-blue"
                  : "hover:bg-neutral-100"
              }`}
            >
              {item.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-brand-border pt-4 mt-4">
        <h4 className="text-sm font-semibold text-neutral-700 mb-2">
          Location
        </h4>
        <ul className="space-y-2">
          {locationOptions.map((location) => (
            <li key={location}>
              <button
                onClick={() => applyParam("location", location)}
                className={`w-full text-left text-sm px-2 py-1 rounded-md transition-colors ${
                  selectedLocation === location
                    ? "bg-blue-50 text-brand-blue"
                    : "text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                {location}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* <div className="border-t border-brand-border pt-4 mt-4">
        <h4 className="text-sm font-semibold text-neutral-700 mb-2">
          Date Added
        </h4>
        <ul className="space-y-2">
          {dateAddedOptions.map((option) => (
            <li key={option.value}>
              <button
                onClick={() => applyParam("date", option.value)}
                className={`w-full text-left text-sm px-2 py-1 rounded-md transition-colors ${
                  selectedDate === option.value
                    ? "bg-blue-50 text-brand-blue"
                    : "text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      </div> */}
    </div>
  );
};

export default CategoryFilter;
