import { TeamListPageComponent } from "@/src/pages/team-players/team-list/ui/team-players-page";
import { Suspense } from "react";

export default function TeamListPage() {
  return (
    <Suspense fallback={null}>
      <TeamListPageComponent />
    </Suspense>
  );
}
