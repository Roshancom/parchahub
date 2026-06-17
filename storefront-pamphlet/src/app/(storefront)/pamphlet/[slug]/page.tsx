import PamphletDetails from "@/modules/ProductDetails";
import { getPamphletDetails } from "@/modules/ProductDetails/services/index.services";
import { notFound } from "next/navigation";

const PDPPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const pamphlet = await getPamphletDetails(slug);

  if (!pamphlet) {
    notFound();
  }

  return <PamphletDetails data={pamphlet} />;
};

export default PDPPage;
