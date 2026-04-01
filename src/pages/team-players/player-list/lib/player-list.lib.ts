import type { PositionFilterId } from "@/shared/ui/position-filter";
import type { PlayerCardData } from "@/entities/players/api/players.dto";

export function mapPositionToApi(position: PositionFilterId): string | null {
  if (position === "*") return null;
  if (position === "JUG") return "JUNGLE";
  if (position === "ADC") return "BOT";
  if (position === "SUP") return "SUPPORT";
  return position;
}

export function filterPlayers(
  players: PlayerCardData[],
  searchTerm: string,
  position: PositionFilterId,
): PlayerCardData[] {
  const keyword = searchTerm.trim().toLowerCase();
  const apiPosition = mapPositionToApi(position);

  return players.filter((player) => {
    const matchesSearch =
      keyword.length === 0 ||
      player.playerName.toLowerCase().includes(keyword) ||
      player.profile.name.toLowerCase().includes(keyword) ||
      player.teamCode.toLowerCase().includes(keyword);

    const matchesPosition =
      apiPosition == null || player.profile.position === apiPosition;

    return matchesSearch && matchesPosition;
  });
}
