"use client";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";

const DeleteCta = ({ id }: { id: number }) => {
  const router = useRouter();
  const unFollowPodcast = api.userPodcasts.delete.useMutation({
    onSuccess: async () => {
      router.refresh();
    },
  });
  const onClickUnfollow = useCallback(() => {
    unFollowPodcast.mutate({ external_id: id });
  }, [id, unFollowPodcast]);
  return (
    <button
      className="h-10 rounded-full bg-white/20 px-4 py-2 transition hover:bg-white/10 hover:no-underline"
      onClick={onClickUnfollow}
    >
      -
    </button>
  );
};

export default DeleteCta;
