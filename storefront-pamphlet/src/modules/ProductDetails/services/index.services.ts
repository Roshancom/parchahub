import { getPamphletBySlug } from "@/services/api";

export const getPamphletDetails = async (slug: string) => {
  return getPamphletBySlug(slug);
};
