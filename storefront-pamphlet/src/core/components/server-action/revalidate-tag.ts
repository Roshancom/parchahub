"use server";

import { CATEGORY } from "@/modules/Category/constants/index.constants";
import { revalidateTag } from "next/cache";

export const revalidateCategoryTag = async () => {
  revalidateTag(CATEGORY, { expire: 0 });
};
