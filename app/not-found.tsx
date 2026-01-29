"use client";

import Link from "next/link";
import NotFoundIcon from "@/shared/assets/icons/not-found.svg";
import ArrowRight from "@/shared/assets/icons/arrow-right.svg";
import { Text } from "@mantine/core";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="relative w-[90vw] sm:w-[879px]">
        <NotFoundIcon className="w-full h-auto" />
        <div className="flex flex-col absolute left-[10%] top-[15%] sm:left-[10%] sm:top-[15%]">
          <Text c="var(--nar-text-primary)" fw={700} fz={{ base: 32, sm: 66 }}>
            Oops!..
          </Text>
          <Text
            c="var(--nar-text-primary)"
            fw={700}
            fz={{ base: 18, sm: 34 }}
            className="mt-[10px] sm:mt-[21px]"
          >
            Page not found :(
          </Text>
          <Text
            c="var(--nar-text-tertiary-sub)"
            fw={500}
            fz={{ base: 12, sm: 16 }}
            className="mt-[4px] sm:mt-[8px]"
          >
            길을 잃으셨나요?...나르도 부메랑을 잃어버렸어요...
          </Text>
          <Link
            href="/"
            className="mt-[30px] sm:mt-[60px] px-[10px] py-2 rounded-lg [background:var(--nar_gradients)] text-(--mantine-color-white) hover:opacity-80 transition-opacity text-[12px] sm:text-[16px] flex gap-[2px] w-fit"
          >
            BACK TO HOME
            <ArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
}
