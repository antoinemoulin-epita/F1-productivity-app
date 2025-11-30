export interface Subtask {
    id: string;
    title: string;
    isCompleted: boolean;
}

export interface Task {
    id: string;
    title: string;
    isCompleted: boolean;
    subtasks?: Subtask[];
}

export interface Participant {
    id: string;
    username: string;
    avatarUrl?: string;
    progress: number;
    position: number;
    isCurrentUser?: boolean;
}

export type RaceStatus = "completed" | "active" | "preparing" | "scheduled" | "draft" | "cancelled";

export interface RaceData {
    id: string;
    courseName: string;
    salonName: string;
    salonId: string;
    isLive: boolean;
    myProgress: number;
    endsAt: string;
    status: RaceStatus;
    participants: Participant[];
    tasks: Task[];
}