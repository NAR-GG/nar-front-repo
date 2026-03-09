import type { PlayerCardSide } from "../model/players.dto";

const PLAYERS_PREFIX = {
  players: "/players",
};

export interface PlayerCardListParams {
  league?: string;
  year?: number;
  split?: string;
  patch?: string;
  side?: PlayerCardSide;
  page: number;
  size: number;
}

export const playersApiEndPoint = {
  getPlayerCardList: (params?: PlayerCardListParams) => {
    const searchParams = new URLSearchParams();

    if (params?.league) {
      searchParams.set("league", params.league);
    }
    if (params?.year) {
      searchParams.set("year", params.year.toString());
    }
    if (params?.split) {
      searchParams.set("split", params.split);
    }
    if (params?.patch) {
      searchParams.set("patch", params.patch);
    }
    if (params?.side) {
      searchParams.set("side", params.side);
    }
    if (params?.page !== undefined) {
      searchParams.set("page", params.page.toString());
    }
    if (params?.size !== undefined) {
      searchParams.set("size", params.size.toString());
    }

    const queryString = searchParams.toString();
    return queryString
      ? `${PLAYERS_PREFIX.players}/cards?${queryString}`
      : PLAYERS_PREFIX.players;
  },
};
