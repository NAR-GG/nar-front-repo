import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { HomeComponent } from "@/src/pages/home/ui";
import { homeQueries } from "@/entities/home/model/home.queries";
import dayjs from "dayjs";

export default async function Page() {
  const queryClient = new QueryClient();

  const today = dayjs().format("YYYY-MM-DD");

  // 서버에서 데이터 미리 가져오기 (Prefetch)
  await Promise.all([
    queryClient.prefetchQuery(homeQueries.championTop5()),
    queryClient.prefetchQuery(homeQueries.playerTop5()),
    queryClient.prefetchQuery(homeQueries.newsList()),
    queryClient.prefetchQuery(homeQueries.community({ sort: "popular" })),
    queryClient.prefetchQuery(
      homeQueries.schedule({ date: today, league: "ALL" })
    ),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomeComponent />
    </HydrationBoundary>
  );
}
