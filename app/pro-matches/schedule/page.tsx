import { Suspense } from "react";
import { SchedulePageComponent } from "@/src/pages/pro-matches/schedule/ui";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <SchedulePageComponent />
    </Suspense>
  );
}
