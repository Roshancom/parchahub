export const executeFetch = async (
  url: `/${string}`,
  options?: RequestInit,
) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";

  if (!baseUrl) {
    throw new Error("API URL is not defined");
  }

  const newUrl = new URL(`${baseUrl}${url}`);

  try {
    const response = await fetch(newUrl, options);
    return response;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};
