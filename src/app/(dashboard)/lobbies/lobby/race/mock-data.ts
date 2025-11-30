import type { RaceData } from "./types";

export const MOCK_RACE: RaceData = {
    id: "sprint-s12",
    salonName: "EPITA Piscine",
    courseName: "Sprint S12",
    isLive: true,
    endsAt: "2025-11-30T18:00:00Z",
    objective: "Finir le module Auth avant vendredi",
    myProgress: 65,
    myPosition: 2,
    totalParticipants: 8,
    tasksCompleted: 5,
    totalTasks: 12,
    carImageUrl: "/car.png",
    tasks: [
        {
            id: "task-1",
            title: "Module Auth",
            isCompleted: false,
            subtasks: [
                { id: "sub-1-1", title: "Login endpoint", isCompleted: true },
                { id: "sub-1-2", title: "Register endpoint", isCompleted: true },
                { id: "sub-1-3", title: "Magic link", isCompleted: false },
                { id: "sub-1-4", title: "JWT refresh", isCompleted: false },
            ],
        },
        {
            id: "task-2",
            title: "Module Salons",
            isCompleted: false,
            subtasks: [
                { id: "sub-2-1", title: "CRUD salon", isCompleted: true },
                { id: "sub-2-2", title: "Gestion membres", isCompleted: false },
                { id: "sub-2-3", title: "Invitations", isCompleted: false },
            ],
        },
        { id: "task-3", title: "Tests unitaires", isCompleted: true },
        { id: "task-4", title: "Documentation API", isCompleted: false },
        { id: "task-5", title: "Intégration CI/CD", isCompleted: true },
    ],
    participants: [
        { id: "1", username: "Alice", progress: 78, position: 1, car: { name: "Ferrari SF-24", imageUrl: "/cars/red.png", color: "#ef4444" } },
        { id: "2", username: "Antoine", progress: 65, position: 2, isCurrentUser: true, car: { name: "McLaren P1", imageUrl: "/car.png", color: "#f97316" } },
        { id: "3", username: "Benjamin", progress: 52, position: 3, car: { name: "Mercedes W15", imageUrl: "/cars/silver.png", color: "#94a3b8" } },
        { id: "4", username: "Clara", progress: 45, position: 4, car: { name: "Red Bull RB20", imageUrl: "/cars/blue.png", color: "#3b82f6" } },
        { id: "5", username: "David", progress: 38, position: 5, car: { name: "Aston Martin", imageUrl: "/cars/green.png", color: "#22c55e" } },
        { id: "6", username: "Emma", progress: 32, position: 6, car: { name: "Alpine A524", imageUrl: "/cars/pink.png", color: "#ec4899" } },
        { id: "7", username: "Lucas", progress: 25, position: 7, car: { name: "Williams FW46", imageUrl: "/cars/cyan.png", color: "#06b6d4" } },
        { id: "8", username: "Marie", progress: 18, position: 8, car: { name: "Haas VF-24", imageUrl: "/cars/white.png", color: "#e5e7eb" } },
    ],
};