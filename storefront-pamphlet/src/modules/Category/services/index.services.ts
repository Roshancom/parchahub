import {
  getCategories as getCategoriesFromAPI,
  getPamphlets as getPamphletsFromAPI,
} from "@/services/api";

export const getPamphlets = async (searchParams: { [key: string]: string }) => {
  const page = Number(searchParams?.page || 1);
  const limit = Number(searchParams?.limit || 12);

  const filters = Object.entries(searchParams || {}).reduce(
    (acc, [key, value]) => {
      if (!["page", "limit"].includes(key) && value) {
        acc[key] = value;
      }

      return acc;
    },
    {} as { [key: string]: string },
  );

  return getPamphletsFromAPI(page, limit, filters);
};

export const getFilterData = async () => {
  return getCategoriesFromAPI();
};
