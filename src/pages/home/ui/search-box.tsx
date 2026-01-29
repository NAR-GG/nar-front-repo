"use client";

import { useState } from "react";
import HomeLogo from "@/shared/assets/images/home-logo.svg";
import Search from "@/shared/assets/icons/search.svg";
import Info from "@/shared/assets/icons/info-circle.svg";
import SearchGray from "@/shared/assets/icons/search-gray.svg";
import { Text } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { searchQueries } from "@/entities/search/model/search.queries";
import Image from "next/image";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

export function SearchBox() {
  const router = useRouter();
  const placeholder = "검색어를 입력해주세요.";
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch] = useDebouncedValue(searchValue, 500);

  const { data: searchResults } = useQuery({
    ...searchQueries.authComplate({ q: debouncedSearch, limit: 10 }),
    enabled: debouncedSearch.length > 0,
  });

  return (
    <>
      <div className="w-full flex flex-col items-center">
        <HomeLogo
          className="w-[209px] sm:w-[416px] h-auto shrink-0"
          preserveAspectRatio="xMidYMid meet"
        />

        <div className="relative mt-10 w-[297px] sm:w-[555px] md:w-[852px] h-[47px] sm:h-[50px] md:h-[56px]">
          <div className="absolute top-0 left-0 right-0 z-50">
            <div
              className="
                relative group
                rounded-[27px]
                p-[3px]
                overflow-hidden
                shadow-[0px_0px_13px_0px_#F03E3E66]
                [background:var(--nar_gradients)]
                transition-shadow duration-500 ease-in-out
              "
            >
              <div className="absolute inset-0 bg-transparent transition-opacity duration-300 group-hover:opacity-0 group-focus-within:opacity-0 pointer-events-none" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div
                  className="
                  w-[500%] aspect-square
                  bg-conic-spinner
                  animate-spin-slow
                "
                />
              </div>
              <div className="relative z-10 rounded-[24px] overflow-hidden bg-(--nar-searchbar-bg)">
                <div className="flex items-center justify-between w-full text-[14px] md:text-[18px] px-[32px] py-[15.5px] md:py-[12px]">
                  <input
                    type="text"
                    placeholder={placeholder}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="flex-1 bg-transparent outline-none placeholder:text-(--nar-searchbar-text)"
                  />
                  <Search className="w-[28px] h-[28px] md:w-[35px] md:h-[35px] text-(--nar-searchbar-text)" />
                </div>

                {searchValue && (
                  <div className="w-full">
                    <div className="bg-[var(--mantine-color-gray-2)] w-full py-[13px] px-[14px] border-l-4 [border-image:var(--nar_gradients)_1] flex gap-[10px] items-center text-[var(--mantine-color-gray-8)]">
                      &apos;{searchValue}&apos;로 검색
                      <SearchGray />
                    </div>
                    {searchResults?.suggestions &&
                      searchResults.suggestions.length > 0 && (
                        <>
                          <div className="w-full py-[13px] px-[14px] bg-[var(--mantine-color-white)]">
                            <Text
                              c="var(--mantine-color-gray-6)"
                              fw={700}
                              fz={18}
                            >
                              LCK
                            </Text>
                          </div>
                          {searchResults.suggestions.map((result) => (
                            <div
                              key={result.gameId}
                              onClick={() =>
                                router.push(
                                  `/pro-matches/${result.gameId}/record`,
                                )
                              }
                              className="w-full py-[13px] px-[14px] bg-[#FBFBFB] flex items-center justify-between cursor-pointer hover:bg-[var(--mantine-color-gray-1)]"
                            >
                              <div className="flex items-center gap-[5px] md:gap-[20px]">
                                <Image
                                  src={result.blueTeamImageUrl}
                                  alt={result.blueTeamName}
                                  width={44}
                                  height={44}
                                  className="w-[36px] h-[36px] md:w-[44px] md:h-[44px]"
                                />
                                <Text
                                  c="var(--mantine-color-gray-8)"
                                  fw={600}
                                  fz={{ base: 14, md: 18 }}
                                >
                                  {result.blueTeamCode}
                                </Text>
                                <Text
                                  c="var(--mantine-color-gray-8)"
                                  fw={600}
                                  fz={{ base: 14, md: 18 }}
                                >
                                  VS
                                </Text>
                                <Image
                                  src={result.redTeamImageUrl}
                                  alt={result.redTeamName}
                                  width={44}
                                  height={44}
                                  className="w-[36px] h-[36px] md:w-[44px] md:h-[44px]"
                                />
                                <Text
                                  c="var(--mantine-color-gray-8)"
                                  fw={600}
                                  fz={{ base: 14, md: 18 }}
                                >
                                  {result.redTeamCode}
                                </Text>
                              </div>
                              <div className="flex items-center gap-[12px] md:gap-[24px]">
                                <Text
                                  c="var(--nar-text-tertiary-sub)"
                                  fw={500}
                                  fz={{ base: 10, md: 16 }}
                                >
                                  {dayjs(result.gameDate).format("YYYY/MM/DD")}
                                </Text>
                                <Text
                                  c="var(--nar-text-tertiary-sub)"
                                  fw={500}
                                  fz={{ base: 10, md: 16 }}
                                >
                                  {result.patch}
                                </Text>
                              </div>
                            </div>
                          ))}
                        </>
                      )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="relative w-[291px] sm:w-[549px] md:w-[846px] justify-center sm:justify-stretch mt-[30px] sm:mt-[19px] px-5 flex items-center gap-4 md:gap-[19px]">
          <div className="flex items-center gap-1 md:gap-2 shrink-0">
            <Text
              c="var(--nar-text-2)"
              fw={500}
              fz={{ base: 14, md: 16 }}
              className="whitespace-nowrap"
            >
              추천 검색어
            </Text>
            <div className="relative shrink-0">
              <Info
                className={`w-[17px] h-[17px] min-w-[17px] min-h-[17px] md:w-[21px] md:h-[21px] md:min-w-[21px] md:min-h-[21px] shrink-0 cursor-pointer ${isInfoOpen ? "text-(--nar-text-GNB-hover)" : "text-[#5C5F66]"}`}
                onClick={() => setIsInfoOpen(!isInfoOpen)}
              />
            </div>
          </div>
          {isInfoOpen && (
            <div className="absolute top-full left-0 sm:left-[100px] mt-2 flex flex-col items-center justify-center p-6 gap-[6px] w-[291px] sm:w-[630px] bg-(--nar-bg-secondary) shadow-[0px_4px_12px_0px_#0000000F] rounded-[24px] z-50">
              <div className="flex flex-col items-center justify-center gap-[6px]">
                <Text c="var(--nar-text-2)" fw={400} fz={16}>
                  나르지지는 여러분이 가장 쉽고 빠르게 데이터를 찾을 수 있도록
                  설계되었습니다.
                </Text>
              </div>
              <ul className="flex flex-col list-disc list-inside marker:text-(--nar-text-red)">
                <li>
                  <Text
                    component="span"
                    c="var(--nar-text-red)"
                    fw={400}
                    fz={16}
                  >
                    자유로운 검색:
                  </Text>{" "}
                  <Text
                    component="span"
                    c="var(--nar-text-tertiary)"
                    fw={400}
                    fz={16}
                  >
                    한글, 영어는 물론 &apos;ㅌㅇㅋ&apos; 같은 초성만으로도 팀과
                    선수를 찾을 수 있어요.
                  </Text>
                </li>
                <li>
                  <Text
                    component="span"
                    c="var(--nar-text-red)"
                    fw={400}
                    fz={16}
                  >
                    매치업 검색:
                  </Text>{" "}
                  <Text
                    component="span"
                    c="var(--nar-text-tertiary)"
                    fw={400}
                    fz={16}
                  >
                    &apos;티원 vs 젠지&apos;처럼 궁금한 대진을 직접 입력해
                    보세요.
                  </Text>
                </li>
              </ul>
              <div className="mt-[17px]">
                <Text c="var(--nar-text-tertiary-sub)" fw={400} fz={14}>
                  "나르지지와 함께 스마트하게 데이터를 탐색해 보세요!"
                </Text>
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 md:gap-6 whitespace-nowrap">
            <Text
              c="var(--nar-text-3)"
              fw={400}
              fz={{ base: 14, md: 16 }}
              className="hover:cursor-pointer"
              onClick={() => setSearchValue("T1 VS Gen.G")}
            >
              T1 VS Gen.G
            </Text>
            <Text
              c="var(--nar-text-3)"
              fw={400}
              fz={{ base: 14, md: 16 }}
              className="hover:cursor-pointer"
              onClick={() => setSearchValue("ㅍㅇㅋ")}
            >
              ㅍㅇㅋ
            </Text>
            <Text
              c="var(--nar-text-3)"
              fw={400}
              fz={{ base: 14, md: 16 }}
              className="hover:cursor-pointer"
              onClick={() => setSearchValue("한화")}
            >
              한화
            </Text>
            <Text
              c="var(--nar-text-3)"
              fw={400}
              fz={{ base: 14, md: 16 }}
              className="hover:cursor-pointer"
              onClick={() => setSearchValue("hanwha")}
            >
              hanwha
            </Text>
          </div>
        </div>
      </div>
    </>
  );
}
