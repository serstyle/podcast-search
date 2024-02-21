import { useEffect, useState } from "react";
import { getAuth } from "../app/actions/cookies";
import { type inferRouterOutputs } from "@trpc/server";
import { type AppRouter } from "~/server/api/root";

type RouterOutput = inferRouterOutputs<AppRouter>;
export const useAuth = () => {
  const [user, setUser] = useState<RouterOutput["user"]["getUser"]>(null);
  useEffect(() => {
    getAuth()
      .then((res) => setUser(res))
      .catch((e) => console.error(e));
  }, []);
  return user;
};
