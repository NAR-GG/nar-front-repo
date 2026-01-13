import { Paper, SegmentedControl, Text } from "@mantine/core";
import Eye from "@/shared/assets/icons/eye.svg";
import ThumbUp from "@/shared/assets/icons/thumb-up.svg";

export function CommunityPosts() {
  return (
    <Paper withBorder radius={24} className="overflow-hidden">
      <div className="flex items-center justify-between pt-[14px] pb-[23px] px-6">
        <Text fz={22} fw={700} lh={1.4} c="var(--nar-text-secondary)">
          커뮤니티 인기글
        </Text>
      </div>
      <div className="w-full flex flex-col gap-2 px-4">
        <SegmentedControl
          data={[
            { label: "전체", value: "all" },
            { label: "네이버", value: "game" },
            { label: "OP.GG", value: "sports" },
            { label: "인벤", value: "inven" },
          ]}
        />
        <div className="flex gap-[11px] py-[10px] w-full h-[314px] overflow-auto items-start">
          <div className="w-10 h-10 flex items-center justify-center">
            <Text fz={18} fw={600} c="var(--nar-text-secondary)">
              1
            </Text>
          </div>
          <div className="w-full flex flex-col gap-[7px]">
            <div className="flex gap-2 items-center">
              <span className="badge-mini">네이버</span>
              <Text fz={16} fw={600} c="var(--nar-text-tertiary)">
                이번 케스파컵 너무 재밌다
              </Text>
            </div>
            <div className="flex items-center">
              <Eye />
              <Text fz={16} fw={600} c="var(--nar-text-tertiary-sub)" ml={4}>
                112
              </Text>
              <div className="bg-[var(--nar-text-tertiary-sub)] w-1 h-1 rounded-full mx-2"></div>
              <ThumbUp />
              <Text fz={16} fw={600} c="var(--nar-text-tertiary-sub)" ml={4}>
                45
              </Text>
              <div className="bg-[var(--nar-text-tertiary-sub)] w-1 h-1 rounded-full mx-2"></div>
              <Text fz={16} fw={600} c="var(--nar-text-tertiary-sub)">
                3일전
              </Text>
            </div>
          </div>
        </div>
      </div>
    </Paper>
  );
}
