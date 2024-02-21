"use server";

import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";
import { api } from "~/trpc/server";
export async function getAuth() {
  const userId = cookies().get("userId")?.value;

  if (!userId) {
    const uuid = uuidv4();
    cookies().set("userId", uuid);
    return await api.user.create.mutate({ user_id: uuid });
  }

  const res = await api.user.getUser.query({ user_id: userId });
  if (!res) {
    const uuid = uuidv4();
    cookies().set("userId", uuid);
    return await api.user.create.mutate({ user_id: uuid });
  }
  return res;
}
