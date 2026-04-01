import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";
import type { StoryVideoData, StoryCommentData } from "@/entities/story/api/story.dto";
import type { StoryCardViewModel, CommentViewModel } from "./youtube-stories.viewmodel";

dayjs.extend(relativeTime);
dayjs.locale("ko");

const getTimeAgo = (publishedAt: string) =>
  publishedAt ? dayjs(publishedAt).fromNow() : "";

export const toStoryCardViewModel = (story: StoryVideoData): StoryCardViewModel => ({
  videoId: story.videoId,
  youtubeVideoId: story.youtubeVideoId,
  title: story.title,
  videoUrl: story.videoUrl,
  thumbnailUrl: story.thumbnailUrl,
  channelType: story.channelType,
  timeAgo: getTimeAgo(story.publishedAt),
  likeCount: story.likeCount,
  commentCount: story.commentCount,
  channelName: story.channelName,
  channelProfileUrl: story.channelProfileUrl,
});

export const toCommentViewModel = (comment: StoryCommentData, index: number): CommentViewModel => ({
  id: index,
  profileUrl: comment.authorProfileImageUrl,
  nickname: comment.authorDisplayName,
  timeAgo: getTimeAgo(comment.publishedAt),
  content: comment.textDisplay,
  likeCount: comment.likeCount,
});
