import { SearchPodcast } from "./_components/search-podcast";

import FollowedList from "./_components/followed-list";

export default async function Home() {
  return (
    <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
      <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
        Search new cool Podcast
      </h1>
      <div className="w-full">
        <FollowedList />
        <SearchPodcast />
      </div>
    </div>
  );
}
