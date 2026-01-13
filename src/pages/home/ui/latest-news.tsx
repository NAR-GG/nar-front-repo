"use client";

import { Paper, Text, Skeleton } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { homeQueries } from "@/entities/home/model/home.queries";
import type { NewsData } from "@/entities/home/model/home.dto";
import { formatRelativeTime } from "@/shared/lib/format-date";
import Image from "next/image";

function NewsRow({ news }: { news: NewsData }) {
  return (
    <a
      href={news.postUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-4 h-full hover:opacity-80 transition-opacity"
    >
      <div className="relative w-[100px] h-[61px] rounded-[8px] bg-(--mantine-color-gray-2) shrink-0 overflow-hidden">
        {news.thumbnail && (
          <Image
            src={news.thumbnail}
            alt={news.title}
            fill
            className="object-cover"
          />
        )}
      </div>
      <div className="min-w-0 flex flex-col justify-center gap-2">
        <Text
          fz={14}
          fw={600}
          c="var(--nar-text-secondary)"
          className="line-clamp-2"
        >
          {news.title}
        </Text>

        <div className="flex items-center gap-2.5">
          <span className="badge-mini">{news.officeName}</span>
          <Text fz={12} fw={500} c="var(--nar-text-tertiary-sub)">
            {formatRelativeTime(news.createdAt)}
          </Text>
        </div>
      </div>
    </a>
  );
}

function MainNewsCard({ news }: { news: NewsData }) {
  return (
    <a
      href={news.postUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="relative lg:h-full md:h-[215px] h-[180px] w-full rounded-[24px] overflow-hidden bg-[var(--mantine-color-gray-2)] block hover:opacity-90 transition-opacity"
    >
      {news.thumbnail ? (
        <img
          src={news.thumbnail}
          alt={news.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-[var(--mantine-color-gray-2)]" />
      )}
      <div className="absolute inset-x-0 bottom-0 h-[150px] bg-gradient-to-t from-black/80 via-black/35 to-transparent" />
      <div className="absolute inset-0 p-4 flex flex-col justify-end">
        <span className="badge-new">NEW</span>
        <Text
          fz={20}
          fw={800}
          lh={1.2}
          c="var(--nar-white)"
          className="line-clamp-2"
        >
          {news.title}
        </Text>
        <Text fz={14} fw={600} c="var(--nar-white)">
          {news.officeName}
        </Text>
      </div>
    </a>
  );
}

function NewsListSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-4 h-full">
          <Skeleton width={100} height={61} radius={8} />
          <div className="flex flex-col gap-2 flex-1">
            <Skeleton height={16} />
            <Skeleton height={12} width="60%" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function LatestNews() {
  const { data: newsList, isLoading } = useQuery(homeQueries.newsList());

  const mainNews = newsList?.[0];
  const subNews = newsList?.slice(1, 4) ?? [];

  return (
    <Paper withBorder radius={24} className="overflow-hidden">
      <div className="flex items-center justify-between pt-[14px] pb-[23px] px-6">
        <Text fz={22} fw={700} lh={1.4} c="var(--nar-text-secondary)">
          최신 뉴스
        </Text>
        <Text
          fz={16}
          c="var(--nar-text-tertiary-sub)"
          className="cursor-pointer"
        >
          더보기
        </Text>
      </div>

      <div className="px-6 pb-6">
        <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-[28px] gap-[28px]">
          {isLoading ? (
            <Skeleton
              className="lg:h-full md:h-[215px] h-[180px]"
              radius={24}
            />
          ) : mainNews ? (
            <MainNewsCard news={mainNews} />
          ) : null}

          <div className="w-full h-full">
            {isLoading ? (
              <NewsListSkeleton />
            ) : (
              <div className="flex flex-col gap-2">
                {subNews.map((news) => (
                  <NewsRow key={news.id} news={news} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Paper>
  );
}
