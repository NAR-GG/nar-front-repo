const STORY_PREFIX = {
  story: "/story",
};

export const storyApiEndPoint = {
  getVideos: () => `${STORY_PREFIX.story}/videos`,
  getVideoComments: ({ youtubeVideoId }: { youtubeVideoId: string }) =>
    `${STORY_PREFIX.story}/videos/${youtubeVideoId}/comments`,
};
