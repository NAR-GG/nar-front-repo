import { TodayGame } from "./today-game";

export default function HomeLayout() {
  return (
    <>
      <section
        className="
          mx-auto w-full
          px-4 pb-16 pt-6
          min-[1201px]:max-w-[1200px]
          min-[1201px]:grid min-[1201px]:grid-cols-[1fr_360px] min-[1201px]:gap-6
          lg:max-w-[900px]
          md:max-w-[900px]
          max-w-[580px]
        "
      >
        <div className="min-w-0">{/* <TodayGame /> */}</div>

        <aside className="hidden min-[1201px]:block">
          {/* 커뮤니티 인기글 / TOP5 챔피언 등 */}
        </aside>

        <div className="mt-6 min-[1201px]:hidden">
          {/* 커뮤니티 인기글 / TOP5 챔피언 등 */}
        </div>
      </section>
    </>
  );
}
