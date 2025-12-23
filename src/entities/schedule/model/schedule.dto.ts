import type { ApiResponse } from "@/shared/types/api";

export interface ScheduleTeamScore {
  teamName: string;
  score: number;
}

export interface ScheduleMatchSummary {
  matchId: string;
  scheduledTime: string;
  leagueInfo: string;
  teamA: ScheduleTeamScore;
  teamB: ScheduleTeamScore;
}

export interface DateScheduleData {
  date: string;
  matches: ScheduleMatchSummary[];
}

export type DateScheduleResponseDTO = ApiResponse<DateScheduleData>;

export interface MatchDetailPlayer {
  position: string;
  playerName: string;
  championName: string;
}

export interface MatchDetailTeam {
  teamName: string;
  isWin: boolean;
  players: MatchDetailPlayer[];
}

export interface MatchDetailGame {
  id: number;
  gameNumber: number;
  gameLengthSeconds: number;
  blueTeam: MatchDetailTeam;
  redTeam: MatchDetailTeam;
}

export interface MatchDetailData {
  summary: ScheduleMatchSummary;
  gameDetails: MatchDetailGame[];
}

export type MatchDetailResponseDTO = ApiResponse<MatchDetailData>;
