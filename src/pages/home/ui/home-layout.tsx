import { CommunityPosts } from "./community-posts";
import { LatestNews } from "./latest-news";
import { TodayGame } from "./today-game";
import { Top5Champion } from "./top5-champion";
import { Top5Progamer } from "./top5-progamer";

export default function HomeLayout() {
  return (
    <section className="mx-auto w-full px-4 pb-16 pt-6">
      <div className="hidden xl:grid grid-cols-[65.84%_31.94%] gap-6">
        <div className="flex flex-col gap-[40px]">
          <div className="min-w-0">
            <TodayGame />
          </div>
          <div className="min-w-0">
            <LatestNews />
          </div>
        </div>
        <div className="flex flex-col gap-[40px]">
          <div className="min-w-0">
            <CommunityPosts />
          </div>
          <div className="min-w-0">
            <Top5Champion />
          </div>
          <div className="min-w-0">
            <Top5Progamer />
          </div>
        </div>
      </div>

      {/* ================== Laptop (lg ~ xl 미만) ================== */}
      <div className="hidden lg:grid xl:hidden gap-[40px]">
        {/* A */}
        <div className="min-w-0">
          <TodayGame />
        </div>

        {/* B: CommunityPosts + LatestNews (1:1) ✅ */}
        <div className="grid grid-cols-2 gap-[40px]">
          <div className="min-w-0">
            <CommunityPosts />
          </div>
          <div className="min-w-0">
            <LatestNews />
          </div>
        </div>

        {/* C: Top5Champion + Top5Progamer (1:1) */}
        <div className="grid grid-cols-2 gap-[40px]">
          <div className="min-w-0">
            <Top5Champion />
          </div>
          <div className="min-w-0">
            <Top5Progamer />
          </div>
        </div>
      </div>

      {/* ================== Tablet (md ~ lg 미만) ================== */}
      <div className="hidden md:grid lg:hidden gap-[40px]">
        <div className="min-w-0">
          <TodayGame />
        </div>

        {/* ✅ Community 먼저 */}
        <div className="min-w-0">
          <CommunityPosts />
        </div>

        <div className="min-w-0">
          <LatestNews />
        </div>

        {/* Top5 row (1:1) */}
        <div className="grid grid-cols-2 gap-[40px]">
          <div className="min-w-0">
            <Top5Champion />
          </div>
          <div className="min-w-0">
            <Top5Progamer />
          </div>
        </div>
      </div>

      {/* ================== Mobile (< md) ================== */}
      <div className="grid md:hidden gap-6">
        <div className="min-w-0">
          <TodayGame />
        </div>
        {/* ✅ Community 먼저 */}
        <div className="min-w-0">
          <CommunityPosts />
        </div>
        <div className="min-w-0">
          <LatestNews />
        </div>
        <div className="min-w-0">
          <Top5Champion />
        </div>
        <div className="min-w-0">
          <Top5Progamer />
        </div>
      </div>
    </section>
  );
}
