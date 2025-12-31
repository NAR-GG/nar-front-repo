import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getStoryVideoComments } from "../api/story.api";
import { storyQueries } from "./story.queries";

export const useGetStoryVideoComments = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ youtubeVideoId }: { youtubeVideoId: string }) =>
      getStoryVideoComments({ youtubeVideoId }),
    onSuccess: (_data, variables) => {
      queryClient.setQueryData(
        storyQueries.comments(variables.youtubeVideoId),
        _data
      );
    },
  });
};
