import { Suspense } from "react";
import { MatchListPage } from "@/pages/pro-matches/list/ui";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <MatchListPage />
    </Suspense>
  );
}
