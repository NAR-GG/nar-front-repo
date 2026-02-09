"use client";

import { SegmentedControl, Group, Text } from "@mantine/core";
import type { SortValue } from "@/shared/types/filter.types";

export interface SortOption {
  label: string;
  value: SortValue;
}

interface SortControlProps {
  value: SortValue;
  onChange: (value: SortValue) => void;
  options?: SortOption[];
}

const defaultOptions: SortOption[] = [
  { label: "최신순", value: "DESC" },
  { label: "오래된순", value: "ASC" },
];

export function SortControl({
  value,
  onChange,
  options = defaultOptions,
}: SortControlProps) {
  return (
    <SegmentedControl
      value={value}
      onChange={(val) => onChange(val as SortValue)}
      data={options.map((option) => ({
        label: (
          <Group gap="xs" wrap="nowrap">
            <Text size="sm">{option.label}</Text>
          </Group>
        ),
        value: option.value,
      }))}
    />
  );
}
