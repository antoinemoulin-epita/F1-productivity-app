"use client";

import { useState } from "react";
import { Check, ChevronDown, ChevronLeft, ChevronRight, Flag06 } from "@untitledui/icons";
import { motion, AnimatePresence } from "motion/react";
import { cx } from "@/utils/cx";

// ============================================================================
// TYPES
// ============================================================================

interface SubTask {
    id: string;
    title: string;
    isCompleted: boolean;
}

interface Task {
    id: string;
    title: string;
    isCompleted: boolean;
    subtasks?: SubTask[];
}

interface Participant {
    id: string;
    username: string;
    progress: number;
    position: number;
    isCurrentUser?: boolean;
}

interface Lobby {
    id: string;
    name: string;
    courseName: string;
    isLive: boolean;
    endsAt: string;
    tasks: Task[];
    participants: Participant[];
    myProgress: number;
    myPosition: number;
    totalParticipants: number;
}

// ============================================================================
// MOCK DATA
// ============================================================================

const MOCK_LOBBIES: Lobby[] = [
    {
        id: "epita-piscine",
        name: "EPITA Piscine",
        courseName: "Sprint S12",
        isLive: true,
        endsAt: "2025-11-30T18:00:00Z",
        myProgress: 65,
        myPosition: 2,
        totalParticipants: 8,
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
            {
                id: "task-3",
                title: "Tests unitaires",
                isCompleted: true,
            },
            {
                id: "task-4",
                title: "Documentation API",
                isCompleted: false,
            },
        ],
        participants: [
            { id: "1", username: "Alice", progress: 78, position: 1 },
            { id: "2", username: "Antoine", progress: 65, position: 2, isCurrentUser: true },
            { id: "3", username: "Benjamin", progress: 52, position: 3 },
            { id: "4", username: "Clara", progress: 45, position: 4 },
            { id: "5", username: "David", progress: 38, position: 5 },
        ],
    },
    {
        id: "projet-web",
        name: "Projet Web S2",
        courseName: "Final Sprint",
        isLive: true,
        endsAt: "2025-12-05T23:59:00Z",
        myProgress: 42,
        myPosition: 3,
        totalParticipants: 5,
        tasks: [
            { id: "pw-1", title: "Frontend React", isCompleted: true },
            { id: "pw-2", title: "Backend Node", isCompleted: false },
            { id: "pw-3", title: "Base de données", isCompleted: false },
        ],
        participants: [
            { id: "1", username: "Emma", progress: 67, position: 1 },
            { id: "2", username: "Lucas", progress: 55, position: 2 },
            { id: "3", username: "Antoine", progress: 42, position: 3, isCurrentUser: true },
        ],
    },
];

// ============================================================================
// CHECKBOX COMPONENT
// ============================================================================

interface CheckboxProps {
    checked: boolean;
    onChange: () => void;
    disabled?: boolean;
}

function Checkbox({ checked, onChange, disabled }: CheckboxProps) {
    return (
        <button
            type="button"
            onClick={onChange}
            disabled={disabled}
            className={cx(
                "flex size-5 shrink-0 items-center justify-center rounded-md border-2 transition-all",
                checked
                    ? "border-brand-600 bg-brand-600"
                    : "border-gray-300 bg-white hover:border-brand-400 dark:border-gray-600 dark:bg-gray-800",
                disabled && "cursor-not-allowed opacity-50",
            )}
        >
            {checked && <Check className="size-3.5 text-white" strokeWidth={3} />}
        </button>
    );
}

// ============================================================================
// TASK ITEM COMPONENT
// ============================================================================

interface TaskItemProps {
    task: Task;
    onToggle: (taskId: string) => void;
    onToggleSubtask: (taskId: string, subtaskId: string) => void;
}

function TaskItem({ task, onToggle, onToggleSubtask }: TaskItemProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const hasSubtasks = task.subtasks && task.subtasks.length > 0;
    const completedSubtasks = task.subtasks?.filter((s) => s.isCompleted).length || 0;
    const totalSubtasks = task.subtasks?.length || 0;

    const isParentCompleted = hasSubtasks 
        ? completedSubtasks === totalSubtasks 
        : task.isCompleted;

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
            <div
                className={cx(
                    "flex items-center gap-3 px-4 py-3",
                    hasSubtasks && "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50",
                )}
                onClick={() => hasSubtasks && setIsExpanded(!isExpanded)}
            >
                <Checkbox
                    checked={isParentCompleted}
                    onChange={() => !hasSubtasks && onToggle(task.id)}
                    disabled={hasSubtasks}
                />

                <span
                    className={cx(
                        "flex-1 text-sm font-medium",
                        isParentCompleted ? "text-tertiary line-through" : "text-primary",
                    )}
                >
                    {task.title}
                </span>

                {hasSubtasks && (
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-tertiary">
                            {completedSubtasks}/{totalSubtasks}
                        </span>
                        <motion.div
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <ChevronDown className="size-4 text-quaternary" />
                        </motion.div>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {hasSubtasks && isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="border-t border-gray-100 bg-gray-50 px-4 py-2 dark:border-gray-700 dark:bg-gray-900/50">
                            <div className="flex flex-col gap-2">
                                {task.subtasks?.map((subtask) => (
                                    <div
                                        key={subtask.id}
                                        className="flex items-center gap-3 rounded-lg py-1.5"
                                    >
                                        <Checkbox
                                            checked={subtask.isCompleted}
                                            onChange={() => onToggleSubtask(task.id, subtask.id)}
                                        />
                                        <span
                                            className={cx(
                                                "text-sm",
                                                subtask.isCompleted
                                                    ? "text-tertiary line-through"
                                                    : "text-secondary",
                                            )}
                                        >
                                            {subtask.title}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ============================================================================
// RACE TRACK PROGRESS COMPONENT (Redesigned)
// ============================================================================

interface RaceTrackProgressProps {
    progress: number;
    position: number;
    totalParticipants: number;
    participants: Participant[];
}

function RaceTrackProgress({ progress, position, totalParticipants, participants }: RaceTrackProgressProps) {
    const topParticipants = participants.slice(0, 5);
    
    // Générer les segments de la piste (20 segments)
    const totalSegments = 20;
    const filledSegments = Math.round((progress / 100) * totalSegments);

    return (
        <div className="space-y-5">
            {/* Header stats */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-brand-600 font-mono text-sm font-bold text-white shadow-sm">
                        #{position}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-medium text-tertiary">Position</span>
                        <span className="text-sm text-secondary">sur {totalParticipants} pilotes</span>
                    </div>
                </div>

                <div className="flex flex-col items-end">
                    <span className="text-xs font-medium text-tertiary">Progression</span>
                    <div className="flex items-baseline gap-1">
                        <span className="font-mono text-2xl font-bold text-primary">{progress}</span>
                        <span className="text-sm text-tertiary">%</span>
                    </div>
                </div>
            </div>

            {/* Segmented track bar - more prominent */}
            <div className="relative py-2">
                {/* Track background with segments */}
                <div className="flex h-4 gap-0.5 overflow-hidden rounded-full bg-gray-100 p-0.5 dark:bg-gray-800">
                    {Array.from({ length: totalSegments }).map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: i * 0.02, duration: 0.2 }}
                            className={cx(
                                "flex-1 rounded-full transition-colors duration-300",
                                i < filledSegments
                                    ? "bg-brand-500"
                                    : "bg-gray-200 dark:bg-gray-700",
                            )}
                        />
                    ))}
                </div>

                {/* Position markers on track */}
                <div className="absolute inset-x-0 top-2 h-4">
                    {topParticipants.map((p) => (
                        <motion.div
                            key={p.id}
                            className="absolute top-1/2 -translate-y-1/2"
                            style={{ left: `${p.progress}%` }}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.4 + p.position * 0.08, type: "spring", stiffness: 300 }}
                        >
                            <div
                                className={cx(
                                    "size-3 -translate-x-1/2 rounded-full border-2 border-white shadow-sm dark:border-gray-900",
                                    p.isCurrentUser
                                        ? "bg-brand-600"
                                        : "bg-gray-400 dark:bg-gray-500",
                                )}
                            />
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Leaderboard cards - more compact */}
            <div className="grid grid-cols-5 gap-1.5">
                {topParticipants.map((p) => (
                    <motion.div
                        key={p.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + p.position * 0.05 }}
                        className={cx(
                            "relative flex flex-col items-center gap-1 rounded-lg py-2 transition-colors",
                            p.isCurrentUser
                                ? "bg-brand-50 ring-1 ring-brand-200 dark:bg-brand-950/30 dark:ring-brand-800"
                                : "bg-gray-50 dark:bg-gray-800/50",
                        )}
                    >
                        {/* Position badge */}
                        <div
                            className={cx(
                                "flex size-6 items-center justify-center rounded-md text-[11px] font-bold",
                                p.position === 1
                                    ? "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400"
                                    : p.position === 2
                                      ? "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                                      : p.position === 3
                                        ? "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-400"
                                        : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
                            )}
                        >
                            {p.position}
                        </div>

                        {/* Name */}
                        <span
                            className={cx(
                                "max-w-full truncate px-1 text-[11px] font-medium",
                                p.isCurrentUser ? "text-brand-700 dark:text-brand-400" : "text-secondary",
                            )}
                        >
                            {p.isCurrentUser ? "Toi" : p.username}
                        </span>

                        {/* Progress */}
                        <span className={cx(
                            "font-mono text-[10px]",
                            p.isCurrentUser ? "text-brand-600 dark:text-brand-500" : "text-tertiary",
                        )}>
                            {p.progress}%
                        </span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function CurrentLobbyWidget() {
    const [currentLobbyIndex, setCurrentLobbyIndex] = useState(0);
    const [lobbies, setLobbies] = useState(MOCK_LOBBIES);

    const currentLobby = lobbies[currentLobbyIndex];
    const hasMultipleLobbies = lobbies.length > 1;

    const goToPrevious = () => {
        setCurrentLobbyIndex((prev) => (prev === 0 ? lobbies.length - 1 : prev - 1));
    };

    const goToNext = () => {
        setCurrentLobbyIndex((prev) => (prev === lobbies.length - 1 ? 0 : prev + 1));
    };

    const handleToggleTask = (taskId: string) => {
        setLobbies((prev) =>
            prev.map((lobby, idx) =>
                idx === currentLobbyIndex
                    ? {
                          ...lobby,
                          tasks: lobby.tasks.map((task) =>
                              task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task,
                          ),
                      }
                    : lobby,
            ),
        );
    };

    const handleToggleSubtask = (taskId: string, subtaskId: string) => {
        setLobbies((prev) =>
            prev.map((lobby, idx) =>
                idx === currentLobbyIndex
                    ? {
                          ...lobby,
                          tasks: lobby.tasks.map((task) =>
                              task.id === taskId && task.subtasks
                                  ? {
                                        ...task,
                                        subtasks: task.subtasks.map((sub) =>
                                            sub.id === subtaskId
                                                ? { ...sub, isCompleted: !sub.isCompleted }
                                                : sub,
                                        ),
                                    }
                                  : task,
                          ),
                      }
                    : lobby,
            ),
        );
    };

    const getTimeRemaining = (endsAt: string) => {
        const now = new Date();
        const end = new Date(endsAt);
        const diff = end.getTime() - now.getTime();

        if (diff <= 0) return "Terminé";

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (days > 0) return `${days}j ${hours}h`;
        if (hours > 0) return `${hours}h ${minutes}m`;
        return `${minutes}m`;
    };

    if (!currentLobby) {
        return (
            <div className="h-full rounded-2xl bg-gray-100 p-3 ring-1 ring-primary/10 dark:bg-gray-900">
                <div className="flex h-full flex-col items-center justify-center rounded-xl bg-white p-8 dark:bg-gray-800">
                    <Flag06 className="size-12 text-quaternary" />
                    <p className="mt-4 text-lg font-medium text-secondary">Aucune course en cours</p>
                    <p className="mt-1 text-sm text-tertiary">Rejoins un salon pour participer !</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full rounded-2xl bg-gray-100 p-3 ring-1 ring-primary/10 transition-all duration-300 hover:ring-primary/20 dark:bg-gray-900">
            <div className="flex h-full flex-col overflow-hidden rounded-xl bg-white dark:bg-gray-800">
            {/* ============================================ */}
            {/* HEADER */}
            {/* ============================================ */}
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-700/50">
                <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                        <h2 className="text-lg font-semibold text-primary">{currentLobby.courseName}</h2>
                        <span className="text-sm text-tertiary">•</span>
                        <span className="text-sm text-tertiary">{getTimeRemaining(currentLobby.endsAt)}</span>
                    </div>

                    {/* Salon selector */}
                    <div className="flex items-center gap-1">
                        {hasMultipleLobbies && (
                            <button
                                type="button"
                                onClick={goToPrevious}
                                className="rounded p-0.5 text-quaternary transition-colors hover:bg-secondary hover:text-secondary"
                            >
                                <ChevronLeft className="size-4" />
                            </button>
                        )}
                        <span className="text-sm font-medium text-secondary">{currentLobby.name}</span>
                        {hasMultipleLobbies && (
                            <button
                                type="button"
                                onClick={goToNext}
                                className="rounded p-0.5 text-quaternary transition-colors hover:bg-secondary hover:text-secondary"
                            >
                                <ChevronRight className="size-4" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Live badge */}
                {currentLobby.isLive && (
                    <div className="flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 dark:bg-green-950/50">
                        <span className="relative flex size-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                            <span className="relative inline-flex size-2 rounded-full bg-green-500" />
                        </span>
                        <span className="text-sm font-semibold text-green-600 dark:text-green-400">Live</span>
                    </div>
                )}
            </div>

            {/* ============================================ */}
            {/* TASKS LIST */}
            {/* ============================================ */}
            <div className="flex-1 overflow-y-auto p-4">
                <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-secondary uppercase tracking-wide">
                        Tâches
                    </h3>
                    <span className="text-xs text-tertiary">
                        {currentLobby.tasks.filter((t) => t.isCompleted || (t.subtasks && t.subtasks.every((s) => s.isCompleted))).length}
                        /{currentLobby.tasks.length} terminées
                    </span>
                </div>

                <div className="flex flex-col gap-2">
                    {currentLobby.tasks.map((task) => (
                        <TaskItem
                            key={task.id}
                            task={task}
                            onToggle={handleToggleTask}
                            onToggleSubtask={handleToggleSubtask}
                        />
                    ))}
                </div>
            </div>

            {/* ============================================ */}
            {/* PROGRESS FOOTER */}
            {/* ============================================ */}
            <div className="border-t border-gray-100 bg-gray-50/80 p-5 dark:border-gray-700/50 dark:bg-gray-800/50">
                <RaceTrackProgress
                    progress={currentLobby.myProgress}
                    position={currentLobby.myPosition}
                    totalParticipants={currentLobby.totalParticipants}
                    participants={currentLobby.participants}
                />
            </div>
            </div>
        </div>
    );
}