import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api",
});

API.interceptors.request.use((config) => {
  if (typeof window === "undefined") {
    return config;
  }

  const token = window.localStorage.getItem("pamphlet_jwt");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => {
    if (response?.data?.success === false) {
      console.error("API responded with success=false", response.data);
    }

    return response;
  },
  (error) => {
    console.error("API request failed", error?.response?.data || error.message);
    return Promise.reject(error);
  },
);

const extractData = (response, fallback) => {
  if (response?.data?.success === false) {
    console.error("API response marked unsuccessful", response.data);
    return fallback;
  }

  return response?.data?.data ?? fallback;
};

const normalizeAuthPayload = (response) => {
  const root = response?.data || {};
  const data = root?.data || root;
  const user = data?.user || data?.profile || root?.user || null;
  const token =
    data?.token ||
    data?.accessToken ||
    root?.token ||
    root?.accessToken ||
    null;

  if (!token) {
    throw new Error("Authentication token was not returned by the API.");
  }

  return {
    token,
    user: {
      id: user?.id || user?.user_id || data?.id || null,
      name: user?.name || data?.name || "User",
      email: user?.email || data?.email || "",
      role: user?.role || data?.role || "owner",
      created_at: user?.created_at || data?.created_at || null,
    },
  };
};

const getMultipartConfig = (payload) => {
  if (!(payload instanceof FormData)) {
    return undefined;
  }

  // Let the browser set the boundary automatically for multipart bodies.
  return {
    headers: {
      Accept: "application/json",
    },
  };
};

export const getCategories = async () => {
  const response = await API.get("/categories");
  return extractData(response, []);
};

export const getPamphlets = async (page = 1, limit = 12, filters = {}) => {
  const response = await API.get("/pamphlets", {
    params: {
      page,
      limit,
      ...filters,
    },
  });

  return extractData(response, {
    data: [],
    page,
    totalPages: 1,
    total: 0,
    limit,
  });
};

export const getPamphletBySlug = async (url_key) => {
  try {
    const response = await API.get(`/pamphlets/${url_key}`);
    return extractData(response, null);
  } catch (error) {
    if (error?.response?.status === 404) {
      return null;
    }

    console.error("Failed to fetch pamphlet by slug", error);
    return null;
  }
};

export const loginUser = async (payload) => {
  const response = await API.post("/auth/login", payload);
  return normalizeAuthPayload(response);
};

export const registerUser = async (payload) => {
  await API.post("/auth/register", payload);
};

export const requestPasswordReset = async (email) => {
  await API.post("/reset-password", { email });
  return true;
};

export const getUserById = async (id) => {
  const response = await API.get(`/user/${id}`);
  const data = extractData(response, []);

  if (Array.isArray(data)) {
    return data[0] || null;
  }

  return data || null;
};

export const updateUserById = async (id, payload) => {
  const response = await API.put(`/user/${id}`, payload);
  const data = extractData(response, null);

  if (Array.isArray(data)) {
    return data[0] || null;
  }

  return data || null;
};

export const createPamphlet = async (payload) => {
  const response = await API.post(
    "/pamphlets",
    payload,
    getMultipartConfig(payload),
  );
  return extractData(response, null);
};

export const updatePamphletById = async (id, payload) => {
  const response = await API.put(
    `/pamphlets/${id}`,
    payload,
    getMultipartConfig(payload),
  );
  return extractData(response, null);
};

export const deletePamphletById = async (id) => {
  await API.delete(`/pamphlets/${id}`);
  return true;
};

export default API;
