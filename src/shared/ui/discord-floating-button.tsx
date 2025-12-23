"use client";

import { useState } from "react";
import { ActionIcon, Text } from "@mantine/core";
import Image from "next/image";

export function DiscordFloatingButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && (
        <div className="fixed flex flex-col bottom-6 right-[104px] bg-[#5865F2] text-white px-3.5 py-2.5 rounded-[20px] whitespace-nowrap shadow-[0_4px_12px_rgba(0,0,0,0.3)] opacity-100 translate-y-0 transition-all duration-300 pointer-events-auto z-[10000] after:content-[''] after:absolute after:bottom-[5%] after:right-[-20px] after:-translate-y-1/2 after:border-[12px] after:border-solid after:border-transparent after:border-l-[#5865F2]">
          <Text fz={12} fw={600}>
            NAR.GG에 오신 것을 환영합니다!
          </Text>
          <Text fz={12} fw={600} className="mt-[18px]">
            문의 방법
          </Text>
          <Text fz={12} fw={600} c="#DEE2E6">
            모든 문의는 디스코드의 &apos;문의사항&apos; 채널에
            <br /> 포스트를 등록해 주시면 됩니다.
          </Text>
        </div>
      )}

      <ActionIcon
        size={60}
        radius="xl"
        variant="filled"
        component="a"
        href="https://discord.gg/VRFD73Hnza"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className="!fixed !bottom-6 !right-6 !z-[9999] !p-0 !bg-[#5865F2] transition-transform duration-[180ms] ease-out hover:scale-[1.08] hover:border-none active:scale-[0.96]"
      >
        <Image
          src="/images/discord.svg"
          alt="디스코드"
          width={60}
          height={60}
          className="object-contain"
        />
      </ActionIcon>
    </>
  );
}
