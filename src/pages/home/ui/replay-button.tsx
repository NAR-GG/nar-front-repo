"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { IconDots } from "@tabler/icons-react";
import { Text } from "@mantine/core";

interface ReplayButtonProps {
  games: {
    gameNumber: number;
    vodUrl?: string;
  }[];
}

export function ReplayButton({ games }: ReplayButtonProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isDotsHovered, setIsDotsHovered] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  const gamesWithVod = games.filter(
    (game) => game.vodUrl && game.vodUrl.length > 0,
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isDropdownOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: "fixed",
        top: rect.bottom + 8,
        left: rect.right - 100,
        zIndex: 9999,
      });
    }
  }, [isDropdownOpen]);

  if (gamesWithVod.length === 0) return null;

  const firstVodUrl = gamesWithVod[0].vodUrl;

  const handleReplayClick = () => {
    if (firstVodUrl) {
      window.open(firstVodUrl, "_blank");
    }
  };

  const handleDotsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleGameSelect = (vodUrl: string) => {
    window.open(vodUrl, "_blank");
    setIsDropdownOpen(false);
  };

  const defaultBorder = "var(--nar-button-2-line)";
  const defaultText = "var(--nar-button-2-text)";
  const activeBorder = "var(--nar-red-500)";

  const dropdownContent = isDropdownOpen && gamesWithVod.length > 0 && (
    <div
      ref={containerRef}
      style={dropdownStyle}
      className="min-w-[100px] bg-[var(--nar-button-2-bg)] rounded-lg py-1 shadow-lg"
    >
      {gamesWithVod.map((game) => (
        <div
          className="group px-4 h-[34px] flex items-center justify-center cursor-pointer whitespace-nowrap"
          key={game.gameNumber}
          onClick={() => handleGameSelect(game.vodUrl!)}
        >
          <span className="text-[14px] font-normal text-(--nar-button-2-text) group-hover:text-(--nar-red-500) transition-colors">
            Game {game.gameNumber}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <div ref={buttonRef} className="relative">
        <div className="flex">
          <button
            type="button"
            onClick={handleReplayClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="px-3 py-1.5 rounded-l-lg transition-all duration-150 cursor-pointer bg-(--nar-button-2-bg)"
            style={{
              borderTop: `1.5px solid ${isHovered ? activeBorder : defaultBorder}`,
              borderBottom: `1.5px solid ${isHovered ? activeBorder : defaultBorder}`,
              borderLeft: `1.5px solid ${isHovered ? activeBorder : defaultBorder}`,
              borderRight: "none",
            }}
          >
            <Text
              size="sm"
              fw={500}
              c={isHovered ? activeBorder : defaultText}
              style={{ transition: "color 0.15s ease" }}
            >
              다시 보기
            </Text>
          </button>

          <button
            type="button"
            onClick={handleDotsClick}
            onMouseEnter={() => setIsDotsHovered(true)}
            onMouseLeave={() => setIsDotsHovered(false)}
            className="px-2 py-1.5 flex items-center justify-center rounded-r-lg transition-all duration-150 cursor-pointer bg-(--nar-button-2-bg) text-(--nar-button-2-text)"
            style={{
              border: `1.5px solid ${isDotsHovered || isDropdownOpen ? activeBorder : defaultBorder}`,
            }}
          >
            <IconDots
              size={18}
              color={
                isDotsHovered || isDropdownOpen ? activeBorder : defaultText
              }
              className="transition-colors duration-150"
            />
          </button>
        </div>
      </div>

      {dropdownContent && createPortal(dropdownContent, document.body)}
    </>
  );
}
