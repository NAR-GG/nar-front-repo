"use client";

import { useState } from "react";
import { Paper, SegmentedControl, Text, Skeleton } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { homeQueries } from "@/entities/home/model/home.queries";
import type { CommunityData } from "@/entities/home/model/home.dto";
import { formatRelativeTime } from "@/shared/lib/format-date";
import Eye from "@/shared/assets/icons/eye.svg";
import ThumbUp from "@/shared/assets/icons/thumb-up.svg";

function PostRow({ rank, post }: { rank: number; post: CommunityData }) {
  return (
    <a
      href={post.postUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex gap-[11px] py-[10px] w-full items-start hover:opacity-80 transition-opacity"
    >
      <div className="w-10 h-10 flex items-center justify-center">
        <Text
          fz={18}
          fw={600}
          c={rank <= 2 ? "var(--nar-red-600)" : "var(--nar-text-secondary)"}
        >
          {rank}
        </Text>
      </div>
      <div className="w-full flex flex-col gap-[7px]">
        <div className="flex gap-2 items-start">
          <span className="badge-mini mt-0.5">{post.communityType}</span>
          <Text fz={16} fw={600} c="var(--nar-text-tertiary)">
            {post.title}
          </Text>
        </div>
        <div className="flex items-center">
          <Eye />
          <Text fz={12} fw={600} c="var(--nar-text-tertiary-sub)" ml={4}>
            {post.viewCount}
          </Text>
          <div className="bg-[var(--nar-text-tertiary-sub)] w-1 h-1 rounded-full mx-2"></div>
          <ThumbUp />
          <Text fz={12} fw={600} c="var(--nar-text-tertiary-sub)" ml={4}>
            {post.voteCount}
          </Text>
          <div className="bg-[var(--nar-text-tertiary-sub)] w-1 h-1 rounded-full mx-2"></div>
          <Text fz={12} fw={600} c="var(--nar-text-tertiary-sub)">
            {formatRelativeTime(post.createdAt)}
          </Text>
        </div>
      </div>
    </a>
  );
}

function PostListSkeleton() {
  return (
    <>
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex gap-[11px] py-[10px] w-full items-start">
          <Skeleton width={40} height={40} radius="md" />
          <div className="flex flex-col gap-[7px] flex-1">
            <Skeleton height={20} />
            <Skeleton height={16} width="60%" />
          </div>
        </div>
      ))}
    </>
  );
}

export function CommunityPosts() {
  const [sort, setSort] = useState<"latest" | "popular">("popular");

  const { data: posts, isLoading } = useQuery(homeQueries.community({ sort }));

  return (
    <Paper withBorder radius={24} className="overflow-hidden">
      <div className="flex items-center justify-between pt-[14px] pb-[23px] px-6">
        <Text fz={22} fw={700} lh={1.4} c="var(--nar-text-secondary)">
          커뮤니티 인기글
        </Text>
      </div>
      <div className="w-full flex flex-col gap-2 px-4">
        <SegmentedControl
          value={sort}
          onChange={(value) => setSort(value as "latest" | "popular")}
          data={[
            { label: "인기", value: "popular" },
            { label: "최신", value: "latest" },
          ]}
        />
        <div className="flex flex-col h-[314px] overflow-auto items-start">
          {isLoading ? (
            <PostListSkeleton />
          ) : (
            posts
              ?.slice(0, 10)
              .map((post, index) => (
                <PostRow key={post.id} rank={index + 1} post={post} />
              ))
          )}
        </div>
      </div>
    </Paper>
  );
}
