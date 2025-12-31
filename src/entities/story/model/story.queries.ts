import { queryOptions, infiniteQueryOptions } from "@tanstack/react-query";
import { getStoryVideos, getStoryVideoComments } from "../api/story.api";

export const storyQueries = {
  all: () => ["story"] as const,

  videos: () => [...storyQueries.all(), "videos"] as const,
  videoList: (params: {
    category: string;
    period: string;
    sort: string;
    size: number;
  }) =>
    infiniteQueryOptions({
      queryKey: [...storyQueries.videos(), params],
      queryFn: ({ pageParam }) =>
        getStoryVideos({ ...params, page: pageParam }),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => {
        if (!lastPage || lastPage.last) return undefined;
        return lastPage.number + 1;
      },
    }),

  comments: (youtubeVideoId: string) =>
    [...storyQueries.all(), "videos", youtubeVideoId, "comments"] as const,
  commentList: (youtubeVideoId: string) =>
    queryOptions({
      queryKey: storyQueries.comments(youtubeVideoId),
      queryFn: () => getStoryVideoComments({ youtubeVideoId: youtubeVideoId }),
    }),
};
