import CategoryListingPage from "@/modules/Category";
import {
  getFilterData,
  getPamphlets,
} from "@/modules/Category/services/index.services";

const CategoriesPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) => {
  const _searchParams = await searchParams;
  const pamphlets = await getPamphlets(_searchParams);
  const filters = await getFilterData();

  return (
    <CategoryListingPage
      pamphlets={pamphlets}
      filters={filters}
      searchParams={_searchParams}
    />
  );
};

export default CategoriesPage;
