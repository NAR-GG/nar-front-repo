"use client";

import { useMediaQuery } from "@mantine/hooks";
import HomeLogo from "@/shared/assets/images/home-logo.svg";
import Search from "@/shared/assets/icons/search.svg";

export function SearchBox() {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const placeholder = isDesktop
    ? "찾으시는 선수/챔피언의 초성 or 단어 전체를 검색해보세요."
    : "초성 or 단어 전체를 검색해보세요.";

  return (
    <div className="w-full flex flex-col items-center gap-10">
      <HomeLogo
        className="w-[209px] sm:w-[416px] h-auto shrink-0"
        preserveAspectRatio="xMidYMid meet"
      />

      <div
        className="
          rounded-[24px]
          p-[3px]
          [background:var(--gradients-nargg)]
          shadow-[0_0_13px_rgba(240,62,62,0.40)]
        "
      >
        <div
          className="
            flex items-center justify-between
            w-[291px] sm:w-[549px] md:w-[846px]
            h-[41px] md:h-[56px]
            rounded-[21px]
            bg-[var(--search-bg)] px-4
            text-[14px] md:text-[18px]
          placeholder:text-gray-400
          "
        >
          <input
            type="text"
            placeholder={placeholder}
            className="flex-1 bg-transparent outline-none"
          />
          <Search className="w-[28px] h-[28px] md:w-[35px] md:h-[35px] text-gray-400" />
        </div>
      </div>
    </div>
  );
}
