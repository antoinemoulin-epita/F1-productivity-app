export interface SubTask {
    id: string;
    title: string;
    isCompleted: boolean;
}

export interface Task {
    id: string;
    title: string;
    isCompleted: boolean;
    subtasks?: SubTask[];
}

export interface Participant {
    id: string;
    username: string;
    progress: number;
    position: number;
    avatar?: string;
    isCurrentUser?: boolean;
    car: {
        name: string;
        imageUrl: string;
        color: string;
    };
}

export interface RaceData {
    id: string;
    salonName: string;
    courseName: string;
    isLive: boolean;
    endsAt: string;
    objective: string;
    tasks: Task[];
    participants: Participant[];
    myProgress: number;
    myPosition: number;
    totalParticipants: number;
    tasksCompleted: number;
    totalTasks: number;
    carImageUrl: string;
}