import { Suspense } from "react";
import { ChampionsMetaComponent } from "@/src/pages/champions-meta/ui";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ChampionsMetaComponent />
    </Suspense>
  );
}
