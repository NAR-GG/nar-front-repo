import { publicApi } from "@/shared/lib/api-client";
import { storyApiEndPoint } from "./story-endpoint";
import type {
  StoryVideoListData,
  StoryCommentListData,
} from "../model/story.dto";

export const getStoryVideos = async (params: Record<string, unknown>) => {
  const response = await publicApi.get<StoryVideoListData>(
    storyApiEndPoint.getVideos(),
    { params }
  );
  return response.data;
};

export const getStoryVideoComments = async ({
  youtubeVideoId,
  sort = "recent",
  page = 0,
  size = 20,
}: {
  youtubeVideoId: string;
  sort?: string;
  page?: number;
  size?: number;
}) => {
  const response = await publicApi.get<StoryCommentListData>(
    storyApiEndPoint.getVideoComments({ youtubeVideoId }),
    { params: { sort, page, size } }
  );
  return response.data;
};
