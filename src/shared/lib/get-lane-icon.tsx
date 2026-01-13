import TopIcon from "@/shared/assets/icons/top-light-icon.svg";
import JungleIcon from "@/shared/assets/icons/jungle-light-icon.svg";
import MidIcon from "@/shared/assets/icons/mid-light-icon.svg";
import BotIcon from "@/shared/assets/icons/bot-light-icon.svg";
import SupportIcon from "@/shared/assets/icons/support-light-icon.svg";

export type LaneType = "TOP" | "JUNGLE" | "MID" | "BOT" | "SUPPORT";

export function getLaneIcon(lane: LaneType | string | null | undefined) {
  if (!lane) return null;

  const normalizedLane = lane.toUpperCase();

  switch (normalizedLane) {
    case "TOP":
      return <TopIcon />;
    case "JUNGLE":
    case "JG":
      return <JungleIcon />;
    case "MID":
    case "MIDDLE":
      return <MidIcon />;
    case "BOT":
    case "ADC":
    case "BOTTOM":
      return <BotIcon />;
    case "SUPPORT":
    case "SUP":
      return <SupportIcon />;
    default:
      return null;
  }
}
