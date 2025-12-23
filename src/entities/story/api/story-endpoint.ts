const STORY_PREFIX = {
  story: "/story",
};

export const storyApiEndPoint = {
  getVideos: () => `${STORY_PREFIX.story}/videos`,
  getVideoComments: ({ videoId }: { videoId: number }) =>
    `${STORY_PREFIX.story}/videos/${videoId}/comments`,
};
