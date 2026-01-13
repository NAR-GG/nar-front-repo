"use client";

import HomeLayout from "./home-layout";
import { SearchBox } from "./search-box";

export function HomeComponent() {
  return (
    <div className="w-full flex flex-col gap-25.25">
      <SearchBox />
      <HomeLayout />
    </div>
  );
}
