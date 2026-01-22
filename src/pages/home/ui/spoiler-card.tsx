import { Text } from "@mantine/core";

interface SpoilerCardProps {
  onReveal?: () => void;
}

export function SpoilerCard({ onReveal }: SpoilerCardProps) {
  return (
    <div
      className="relative cursor-pointer bg-[var(--nar-bg-cont-livebox)] bg-[var(--nar-bg-blur)] rounded-[14px]"
      onClick={onReveal}
    >
      <div className="flex items-center gap-3.5 py-3.25 px-3.25 md:px-2.75">
        <Text
          fz={{ base: 28, sm: 36 }}
          fw={700}
          c="var(--nar-text-tertiary-sub)"
        >
          0
        </Text>
        <Text
          fz={{ base: 28, sm: 36 }}
          fw={700}
          c="var(--nar-text-tertiary-sub)"
        >
          :
        </Text>
        <Text
          fz={{ base: 28, sm: 36 }}
          fw={700}
          c="var(--nar-text-tertiary-sub)"
        >
          0
        </Text>
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center rounded-[14px] bg-[var(--nar-bg-blur)] backdrop-blur-[2.5px]">
        <Text fz={14} fw={400} c="var(--nar-text-tertiary)">
          스포방지
        </Text>
        <Text fz={10} fw={400} c="var(--nar-text-tertiary-sub)">
          클릭시 스코어 확인 가능
        </Text>
      </div>
    </div>
  );
}
