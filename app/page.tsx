"use client";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div>홈</div>
    </Suspense>
  );
}
