export interface StoryCardViewModel {
  videoId: number;
  youtubeVideoId: string;
  title: string;
  videoUrl: string;
  thumbnailUrl: string;
  channelType: string;
  timeAgo: string;
  likeCount: number;
  commentCount: number;
  channelName: string;
  channelProfileUrl: string;
}

export interface CommentViewModel {
  id: number;
  profileUrl: string;
  nickname: string;
  timeAgo: string;
  content: string;
  likeCount: number;
}
