import { PlayerListPageComponent } from "@/src/pages/team-players/player-list/ui";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <PlayerListPageComponent />
    </Suspense>
  );
}
