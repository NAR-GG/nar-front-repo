import { useInfiniteQuery } from "@tanstack/react-query";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const useGetYoutubeList = ({
  category = "all",
  size = 20,
  sort = "publishedAt,desc",
} = {}) => {
  return useInfiniteQuery({
    queryKey: ["youtubeList", { category, size, sort }],
    queryFn: async ({ pageParam = 0 }) => {
      const params = new URLSearchParams();

      params.set("category", category);
      params.set("page", String(pageParam));
      params.set("size", String(size));
      if (sort) params.append("sort", sort);

      const url = `${API_BASE_URL}/api/story/videos?${params.toString()}`;
      const res = await fetch(url, {
        method: "GET",
        headers: { accept: "*/*" },
      });

      if (!res.ok) {
        throw new Error(
          `유튜브 리스트를 조회하는데 실패했습니다.: ${res.status}`
        );
      }

      const data = await res.json();
      return data;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.last) return undefined;
      return lastPage.number + 1;
    },
  });
};
