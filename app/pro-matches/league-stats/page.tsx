import { LeagueStatsPage } from "@/src/pages/league-stats/ui/league-stats-page";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <LeagueStatsPage />
    </Suspense>
  );
}
