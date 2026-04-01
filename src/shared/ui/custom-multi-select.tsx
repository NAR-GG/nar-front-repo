"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import {
  Box,
  Button,
  Checkbox,
  Popover,
  ScrollArea,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { IconSearch, IconChevronDown } from "@tabler/icons-react";
import type { SelectOption } from "@/shared/types/filter.types";

interface CustomMultiSelectProps {
  label?: string;
  placeholder: string;
  data: SelectOption[];
  value: string[];
  onChange?: (value: string[]) => void;
  disabled?: boolean;
}

export function CustomMultiSelect({
  label,
  placeholder,
  data,
  value = [],
  onChange,
  disabled = false,
}: CustomMultiSelectProps) {
  const [opened, setOpened] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = useMemo(() => {
    let filtered = data;
    if (searchTerm) {
      filtered = data.filter((item) =>
        item.label.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }
    return filtered.slice(0, 100);
  }, [data, searchTerm]);

  const handleToggle = useCallback(
    (itemValue: string) => {
      const newValue = value.includes(itemValue)
        ? value.filter((v) => v !== itemValue)
        : [...value, itemValue];
      onChange?.(newValue);
    },
    [value, onChange],
  );

  const getSelectedStyle = useCallback(
    (isOpened: boolean) => {
      if (disabled) {
        return {
          border: "1px solid var(--nar-line)",
          outline: "none",
        };
      }
      return {
        border: isOpened
          ? "1px solid var(--nar-red-500)"
          : "1px solid var(--nar-line)",
        outline: "none",
      };
    },
    [disabled],
  );

  const handleClose = () => {
    setOpened(false);
    setSearchTerm("");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (opened) {
        const target = event.target as HTMLElement;
        const isPopoverClick = target.closest("[data-mantine-popover]");
        const isButtonClick = target.closest("button");

        if (!isPopoverClick && !isButtonClick) {
          handleClose();
        }
      }
    };

    if (opened) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [opened]);

  const getDisplayText = () => {
    if (label === "시즌") {
      return "2026";
    }
    if (value.length > 0) {
      return `${value.length}개 선택됨`;
    }
    return placeholder;
  };

  return (
    <Box>
      {label && (
        <Text size="sm" fw={500} mb={4}>
          {label}
        </Text>
      )}
      <Popover
        opened={opened && !disabled}
        onClose={handleClose}
        position="bottom-start"
        shadow="md"
        withinPortal={false}
        closeOnClickOutside={true}
        closeOnEscape={true}
        trapFocus={false}
        clickOutsideEvents={["mousedown", "touchstart"]}
      >
        <Popover.Target>
          <Button
            variant="default"
            onClick={() => !disabled && setOpened(!opened)}
            disabled={disabled}
            justify="space-between"
            rightSection={<IconChevronDown size={18} />}
            styles={{
              root: {
                ...getSelectedStyle(opened),
                width: "100%",
                minWidth: 120,
                height: "36px",
                padding: "0 12px",
                backgroundColor: disabled
                  ? "var(--nar-bg-tertiary)"
                  : "var(--nar-bg-secondary)",
                borderRadius: "10px",
                color: "var(--nar-text-primary)",
              },
            }}
          >
            <Text size="sm" c={disabled ? "dimmed" : "var(--nar-text-primary)"}>
              {getDisplayText()}
            </Text>
          </Button>
        </Popover.Target>
        <Popover.Dropdown
          p={8}
          style={{ maxWidth: "192px" }}
          data-mantine-popover
        >
          <Stack gap={8}>
            {data.length > 0 && (
              <TextInput
                placeholder="검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="sm"
                leftSection={<IconSearch size={16} />}
                styles={{
                  input: {
                    "&:focus": {
                      borderColor: "var(--nar-red-500) !important",
                      outline: "none !important",
                    },
                  },
                }}
              />
            )}
            <ScrollArea.Autosize mah={200}>
              <Stack gap={4}>
                {filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <Checkbox
                      key={item.value}
                      label={item.label}
                      checked={value.includes(item.value)}
                      onChange={() => handleToggle(item.value)}
                      styles={{
                        root: {
                          padding: "4px 8px",
                          borderRadius: "4px",
                        },
                        label: { cursor: "pointer" },
                        input: {
                          backgroundColor: value.includes(item.value)
                            ? "var(--nar-red-500)"
                            : undefined,
                          borderColor: value.includes(item.value)
                            ? "var(--nar-red-500)"
                            : undefined,
                          cursor: "pointer",
                        },
                      }}
                    />
                  ))
                ) : (
                  <Text size="sm" c="dimmed" ta="center" p="md">
                    {searchTerm
                      ? "검색 결과가 없습니다"
                      : "선택할 수 있는 항목이 없습니다"}
                  </Text>
                )}
              </Stack>
            </ScrollArea.Autosize>
            {data.length > 100 && (
              <Text size="xs" c="dimmed">
                {data.length - 100}개 더 있습니다. 검색을 사용하세요.
              </Text>
            )}
          </Stack>
        </Popover.Dropdown>
      </Popover>
    </Box>
  );
}
