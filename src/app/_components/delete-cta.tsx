"use client";
import { useCallback } from "react";
import { unFollowPodcast } from "../actions/follow-podcast";
import { useRouter } from "next/navigation";

const DeleteCta = ({ id }: { id: number }) => {
  const router = useRouter();
  const onUnfollow = useCallback(async () => {
    await unFollowPodcast(id);
    router.refresh();
  }, [id, router]);
  return (
    <button
      className="rounded-full bg-white/20 px-4 py-2 transition hover:bg-white/10 hover:no-underline"
      onClick={onUnfollow}
    >
      -
    </button>
  );
};

export default DeleteCta;
