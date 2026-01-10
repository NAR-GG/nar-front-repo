import { Badge } from "@/src/shared/ui/badge";
import { Paper, Text } from "@mantine/core";

function SourcePill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center justify-center px-3 py-1 text-[14px] font-medium rounded-[12px] bg-[var(--mantine-color-gray-1)] text-[var(--mantine-color-gray-7)]">
      {children}
    </span>
  );
}

function NewsRow({
  title,
  source,
  time,
}: {
  title: string;
  source: string;
  time: string;
}) {
  return (
    <div className="flex items-center gap-4 h-full">
      <div className="w-[100px] h-[61px] rounded-[8px] bg-[var(--mantine-color-gray-2)] shrink-0" />
      <div className="min-w-0 flex flex-col justify-center gap-2">
        <Text
          fz={14}
          fw={600}
          c="var(--mantine-color-text)"
          className="line-clamp-2"
        >
          {title}
        </Text>

        <div className="flex items-center gap-2.5">
          <Badge theme="mini">{source}</Badge>
          <Text fz={12} fw={500} c="var(--mantine-color-dark-2)">
            {time}
          </Text>
        </div>
      </div>
    </div>
  );
}

export function LatestNews() {
  return (
    <Paper withBorder radius={24} className="overflow-hidden">
      <div className="flex items-center justify-between pt-[14px] pb-[23px] px-6">
        <Text fz={22} fw={700} lh={1.4} c="var(--mantine-color-text)">
          최신 뉴스
        </Text>
        <Text
          fz={16}
          c="var(--mantine-color-dark-2)"
          className="cursor-pointer"
        >
          더보기
        </Text>
      </div>

      <div className="px-6 pb-6">
        <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-[28px] gap-[28px]">
          <div className="relative lg:h-full md:h-[215px] h-[180px] w-full rounded-[24px] overflow-hidden bg-[var(--mantine-color-gray-2)]">
            <div className="absolute inset-0 bg-[var(--mantine-color-gray-2)]" />
            <div className="absolute inset-x-0 bottom-0 h-[150px] bg-gradient-to-t from-black/80 via-black/35 to-transparent" />
            <div className="absolute inset-0 p-4 flex flex-col justify-end">
              <Badge theme="new">NEW</Badge>
              <Text
                fz={20}
                fw={800}
                lh={1.2}
                c="white"
                className="line-clamp-2"
              >
                [LCK] 무적 기세의 젠지, 월즈 3연속 우승 T1, 드라마의 주인공
                KT... 2025 시...
              </Text>
              <Text fz={14} fw={600} c="white">
                포모스
              </Text>
            </div>
          </div>

          <div className="w-full h-full">
            <div className="flex flex-col gap-2">
              <NewsRow
                title="스트리머, 유저가 함께 만든 연말 무대 ‘2025 SOOP 스트리머 대상' 성황리..."
                source="네이버"
                time="4시간 전"
              />
              <NewsRow
                title="한화생명e스포츠, ‘몬스터 에너지와 함께하는 2026 HLE FAN FEST’ 개최"
                source="포모스"
                time="어제"
              />
              <NewsRow
                title="KT 롤스터 비디디 곽보성, 1,000만 원 기부로 나눔 실천"
                source="포모스"
                time="2025.12.26"
              />
            </div>
          </div>
        </div>
      </div>
    </Paper>
  );
}
