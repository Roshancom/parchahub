import { AUTH_TOKEN_KEY } from "@/context/AuthContext";
import { User } from "@/types";
import { executeFetch } from "@/utils/executeFetch";
import { cookies } from "next/headers";

export const getUser = async () => {
  const cookie = await cookies();

  const token = cookie.get(AUTH_TOKEN_KEY);

  const response = await executeFetch("/user/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json() as Promise<User>;
};
