import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getStoryVideoComments } from "../api/story.api";
import { storyQueries } from "./story.queries";

export const useGetStoryVideoComments = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ videoId }: { videoId: number }) =>
      getStoryVideoComments({ videoId }),
    onSuccess: (_data, variables) => {
      queryClient.setQueryData(storyQueries.comments(variables.videoId), _data);
    },
  });
};
