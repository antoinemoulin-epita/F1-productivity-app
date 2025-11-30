export interface RankingEntry {
    id: string;
    username: string;
    avatarUrl?: string;
    points: number;
    position: number;
    racesWon: number;
    racesParticipated: number;
    averagePosition: number;
    isCurrentUser?: boolean;
}

export interface CourseRanking {
    id: string;
    name: string;
    date: string;
    status: "completed" | "active";
    rankings: RankingEntry[];
    winnerId?: string;
    winnerName?: string;
}

export interface Season {
    id: string;
    number: number;
    name: string;
    status: "current" | "completed";
    startDate: string;
    endDate?: string;
    courses: CourseRanking[];
    standings: RankingEntry[];
    champion?: {
        id: string;
        username: string;
        points: number;
    };
}

export interface LobbyRankingData {
    lobbyId: string;
    lobbyName: string;
    seasons: Season[];
    currentSeasonId: string;
}