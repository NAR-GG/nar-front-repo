"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import {
  Paper,
  Group,
  Button,
  Text,
  Stack,
  Box,
  Divider,
  Checkbox,
  Popover,
  TextInput,
  ScrollArea,
  SegmentedControl,
  Flex,
} from "@mantine/core";
import { IconSearch, IconX, IconChevronDown } from "@tabler/icons-react";
import { useMediaQuery } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { categoriesQueries } from "@/entities/categories/model/categories.queries";
import type { ChampionData } from "@/entities/champions/api/champions.dto";
import type { Mode, SortValue, SelectOption, Filters } from "@/shared/types/filter.types";
import {
  getLeagueOptions,
  getSplitOptions,
  getTeamOptions,
  cascadeFiltersOnChange,
  getSearchButtonText,
  getSelectedCountText,
  getTagClassName,
  getMultiSelectDisplayText,
} from "../lib/filter-options";
import { removeFilterTagValue } from "@/shared/lib/filter-utils";

interface CustomMultiSelectProps {
  label: string;
  placeholder: string;
  data: SelectOption[];
  value: string[];
  onChange?: (value: string[]) => void;
  disabled?: boolean;
}

function CustomMultiSelect({
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
        item.label.toLowerCase().includes(searchTerm.toLowerCase())
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
    [value, onChange]
  );

  const getSelectedStyle = useCallback(
    (hasSelection: boolean) => {
      if (disabled) {
        return {
          borderColor: "#ced4da",
          borderWidth: "1px",
          boxShadow: "none",
        };
      }
      return {
        borderColor: hasSelection ? "#1976d2" : "#ced4da",
        borderWidth: hasSelection ? "2px" : "1px",
        boxShadow: hasSelection ? "0 0 0 1px #1976d2" : "none",
      };
    },
    [disabled]
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

  return (
    <Box>
      <Text size="sm" fw={500} mb={4}>
        {label}
      </Text>
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
            rightSection={<IconChevronDown size={16} />}
            styles={{
              root: {
                ...getSelectedStyle(value.length > 0),
                width: "100%",
                height: "36px",
                padding: "0 12px",
                backgroundColor: disabled ? "#f8f9fa" : "#fff",
              },
            }}
          >
            <Text
              size="sm"
              c={disabled ? "dark" : value.length > 0 ? "dark" : "placeholder"}
            >
              {getMultiSelectDisplayText(label, value, placeholder)}
            </Text>
          </Button>
        </Popover.Target>
        <Popover.Dropdown
          p={8}
          style={{ maxWidth: "300px" }}
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

interface FilterSectionProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  selectedChampions: (ChampionData | null)[];
  onCombinationSearch: () => void;
  currentMode: Mode;
  isSearchable?: boolean;
  sort?: SortValue;
  onSortChange?: (value: SortValue) => void;
}

export function FilterSection({
  filters,
  onFiltersChange,
  selectedChampions,
  onCombinationSearch,
  currentMode,
  isSearchable = true,
  sort,
  onSortChange,
}: FilterSectionProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const { data: categoryData, isLoading } = useQuery(
    categoriesQueries.tree()
  );

  const leagueOptions = useMemo(
    () => (categoryData ? getLeagueOptions(categoryData) : []),
    [categoryData],
  );

  const splitOptions = useMemo(
    () => (categoryData ? getSplitOptions(categoryData, filters.leagueNames) : []),
    [categoryData, filters.leagueNames],
  );

  const teamOptions = useMemo(
    () => (categoryData ? getTeamOptions(categoryData, filters.leagueNames, filters.splitNames) : []),
    [categoryData, filters.leagueNames, filters.splitNames],
  );

  const handleFilterChange = useCallback(
    (field: keyof Filters, value: string[]) => {
      if (!categoryData) return;
      onFiltersChange(cascadeFiltersOnChange(filters, field, value, categoryData));
    },
    [filters, categoryData, onFiltersChange],
  );

  const removeTag = useCallback(
    (type: "league" | "split" | "team", value: string) => {
      const [field, values] = removeFilterTagValue(filters, type, value);
      handleFilterChange(field, values);
    },
    [filters, handleFilterChange]
  );

  const sortControl = sort && onSortChange && (
    <SegmentedControl
      value={sort}
      onChange={(value) => onSortChange(value as SortValue)}
      data={[
        {
          label: (
            <Group gap="xs" wrap="nowrap">
              <Text size="sm">최신순</Text>
            </Group>
          ),
          value: "DESC",
        },
        {
          label: (
            <Group gap="xs" wrap="nowrap">
              <Text size="sm">오래된순</Text>
            </Group>
          ),
          value: "ASC",
        },
      ]}
    />
  );

  if (isLoading) {
    return (
      <Paper p="md" withBorder radius="md">
        <Group justify="center" p="xl">
          <Text c="dimmed">필터 옵션을 불러오는 중...</Text>
        </Group>
      </Paper>
    );
  }

  return (
    <Paper p="md" withBorder radius="md">
      {isMobile ? (
        <Stack gap="md">
          <Group grow>
            <CustomMultiSelect
              label="시즌"
              placeholder="시즌"
              data={[]}
              value={[]}
              disabled
            />
            <CustomMultiSelect
              label="리그"
              placeholder="리그를 선택하세요"
              data={leagueOptions}
              value={filters.leagueNames || []}
              onChange={(value) => handleFilterChange("leagueNames", value)}
            />
          </Group>
          <Group grow>
            <CustomMultiSelect
              label="스플릿"
              placeholder="스플릿을 선택하세요"
              data={splitOptions}
              value={filters.splitNames || []}
              onChange={(value) => handleFilterChange("splitNames", value)}
              disabled={
                !filters.leagueNames || filters.leagueNames.length === 0
              }
            />
            <CustomMultiSelect
              label="팀"
              placeholder="팀을 선택하세요"
              data={teamOptions}
              value={filters.teamNames || []}
              onChange={(value) => handleFilterChange("teamNames", value)}
              disabled={
                !filters.leagueNames || filters.leagueNames.length === 0
              }
            />
          </Group>

          <Flex justify="flex-end">
            {isSearchable ? (
              <Group gap="md" align="center">
                <Text size="sm" c="dimmed">
                  {getSelectedCountText(currentMode, selectedChampions.filter(Boolean).length)}
                </Text>
                <Button
                  leftSection={<IconSearch size={16} />}
                  onClick={onCombinationSearch}
                  disabled={selectedChampions.filter(Boolean).length === 0}
                >
                  {getSearchButtonText(currentMode)}
                </Button>
              </Group>
            ) : (
              sortControl
            )}
          </Flex>
        </Stack>
      ) : (
        <Group justify="space-between" align="end">
          <Group gap="md">
            <Box style={{ width: 120 }}>
              <CustomMultiSelect
                label="시즌"
                placeholder="시즌"
                data={[]}
                value={[]}
                disabled
              />
            </Box>
            <Box style={{ width: 150 }}>
              <CustomMultiSelect
                label="리그"
                placeholder="리그를 선택하세요"
                data={leagueOptions}
                value={filters.leagueNames || []}
                onChange={(value) => handleFilterChange("leagueNames", value)}
              />
            </Box>
            <Box style={{ width: 150 }}>
              <CustomMultiSelect
                label="스플릿"
                placeholder="스플릿을 선택하세요"
                data={splitOptions}
                value={filters.splitNames || []}
                onChange={(value) => handleFilterChange("splitNames", value)}
                disabled={
                  !filters.leagueNames || filters.leagueNames.length === 0
                }
              />
            </Box>
            <Box style={{ width: 150 }}>
              <CustomMultiSelect
                label="팀"
                placeholder="팀을 선택하세요"
                data={teamOptions}
                value={filters.teamNames || []}
                onChange={(value) => handleFilterChange("teamNames", value)}
                disabled={
                  !filters.leagueNames || filters.leagueNames.length === 0
                }
              />
            </Box>
          </Group>

          {isSearchable ? (
            <Group gap="md" align="center">
              <Text size="sm" c="dimmed">
                {getSelectedCountText(currentMode, selectedChampions.filter(Boolean).length)}
              </Text>
              <Button
                leftSection={<IconSearch size={16} />}
                onClick={onCombinationSearch}
                disabled={selectedChampions.filter(Boolean).length === 0}
              >
                {getSearchButtonText(currentMode)}
              </Button>
            </Group>
          ) : (
            sortControl
          )}
        </Group>
      )}

      {(filters.leagueNames?.length > 0 ||
        filters.splitNames?.length > 0 ||
        filters.teamNames?.length > 0) && (
        <>
          <Divider my="md" />
          <Group gap="xs" style={{ flexWrap: "wrap" }}>
            {filters.leagueNames?.map((league) => (
              <button
                key={`league-${league}`}
                className={getTagClassName("league")}
                onClick={() => removeTag("league", league)}
              >
                <Text size="xs">리그: {league}</Text>
                <IconX size={14} className="pointer-events-none" />
              </button>
            ))}
            {filters.splitNames?.map((split) => (
              <button
                key={`split-${split}`}
                className={getTagClassName("split")}
                onClick={() => removeTag("split", split)}
              >
                <Text size="xs">스플릿: {split}</Text>
                <IconX size={14} className="pointer-events-none" />
              </button>
            ))}
            {filters.teamNames?.map((team) => (
              <button
                key={`team-${team}`}
                className={getTagClassName("team")}
                onClick={() => removeTag("team", team)}
              >
                <Text size="xs">팀: {team}</Text>
                <IconX size={14} className="pointer-events-none" />
              </button>
            ))}
          </Group>
        </>
      )}
    </Paper>
  );
}
