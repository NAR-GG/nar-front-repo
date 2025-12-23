import type { ApiResponse } from "@/shared/types/api";
import type { Pageable } from "@/shared/types/common";

export interface StorySort {
  sorted: boolean;
  empty: boolean;
  unsorted: boolean;
}

export interface StoryPageResponse<T> {
  totalElements: number;
  totalPages: number;
  pageable: Pageable;
  size: number;
  content: T[];
  number: number;
  sort: StorySort;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface StoryVideoData {
  videoId: number;
  youtubeVideoId: string;
  title: string;
  videoUrl: string;
  thumbnailUrl: string;
  channelType: string;
  publishedAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  channelId: number;
  channelName: string;
  channelProfileUrl: string;
}

export type StoryVideoListData = StoryPageResponse<StoryVideoData>;
export type StoryVideoListResponseDTO = ApiResponse<StoryVideoListData>;

export interface StoryCommentData {
  youtubeCommentId: string;
  authorDisplayName: string;
  authorProfileImageUrl: string;
  textDisplay: string;
  likeCount: number;
  publishedAt: string;
}

export type StoryCommentListData = StoryPageResponse<StoryCommentData>;
export type StoryCommentListResponseDTO = ApiResponse<StoryCommentListData>;
