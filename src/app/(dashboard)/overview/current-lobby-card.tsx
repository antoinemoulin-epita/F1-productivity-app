"use client";

import { useState } from "react";
import { 
    ChevronLeft, 
    ChevronRight, 
    Flag06, 
    CheckCircle, 
    Clock, 
    Lock01,
    ChevronRight as ChevronRightIcon,
    Play,
    Plus
} from "@untitledui/icons";
import { motion, AnimatePresence } from "motion/react";
import { cx } from "@/utils/cx";

// ============================================================================
// TYPES
// ============================================================================

type CourseStatus = "completed" | "active" | "preparing" | "scheduled" | "draft" | "cancelled";

interface Course {
    id: string;
    name: string;
    status: CourseStatus;
    startDate: string;
    endDate: string;
    myProgress?: number; // % de tâches complétées dans cette course
    myPosition?: number;
}

interface SeasonParticipant {
    id: string;
    username: string;
    points: number;
    position: number;
    racesWon: number;
    seasonProgress: number; // % de progression dans la saison (0-100)
    isCurrentUser?: boolean;
}

interface Season {
    id: string;
    number: number;
    name: string; // ex: "Piscine SQL"
    startedAt: string;
    endedAt?: string;
    courses: Course[];
    standings: SeasonParticipant[];
}

interface Lobby {
    id: string;
    name: string; // ex: "EPITA APPING01"
    currentSeason: Season;
    mySeasonPosition: number;
    myCompletedCourses: number;
}

// ============================================================================
// MOCK DATA
// ============================================================================

const MOCK_LOBBIES: Lobby[] = [
    {
        id: "epita-apping01",
        name: "EPITA APPING01",
        mySeasonPosition: 2,
        myCompletedCourses: 3,
        currentSeason: {
            id: "season-1",
            number: 1,
            name: "Piscine SQL",
            startedAt: "2025-11-24T09:00:00Z",
            courses: [
                {
                    id: "course-1",
                    name: "Module 1 - Introduction SQL",
                    status: "completed",
                    startDate: "2025-11-24T09:00:00Z",
                    endDate: "2025-11-28T18:00:00Z",
                    myProgress: 100,
                    myPosition: 1,
                },
                {
                    id: "course-2",
                    name: "Module 2 - SELECT & WHERE",
                    status: "completed",
                    startDate: "2025-11-25T09:00:00Z",
                    endDate: "2025-11-28T18:00:00Z",
                    myProgress: 100,
                    myPosition: 2,
                },
                {
                    id: "course-3",
                    name: "Module 3 - JOIN",
                    status: "completed",
                    startDate: "2025-11-26T09:00:00Z",
                    endDate: "2025-11-28T18:00:00Z",
                    myProgress: 100,
                    myPosition: 3,
                },
                {
                    id: "course-4",
                    name: "Module 4 - Agrégation",
                    status: "active",
                    startDate: "2025-11-27T09:00:00Z",
                    endDate: "2025-11-28T18:00:00Z",
                    myProgress: 65,
                    myPosition: 2,
                },
                {
                    id: "course-5",
                    name: "Module 5 - Sous-requêtes",
                    status: "scheduled",
                    startDate: "2025-11-28T09:00:00Z",
                    endDate: "2025-11-28T18:00:00Z",
                },
                {
                    id: "course-6",
                    name: "Module 6 - Transactions",
                    status: "scheduled",
                    startDate: "2025-11-28T14:00:00Z",
                    endDate: "2025-11-28T18:00:00Z",
                },
                {
                    id: "course-7",
                    name: "Module 7 - Projet Final",
                    status: "scheduled",
                    startDate: "2025-11-28T16:00:00Z",
                    endDate: "2025-11-28T18:00:00Z",
                },
            ],
            standings: [
                { id: "1", username: "Alice", points: 127, position: 1, racesWon: 3, seasonProgress: 57, isCurrentUser: false },
                { id: "2", username: "Antoine", points: 98, position: 2, racesWon: 1, seasonProgress: 52, isCurrentUser: true },
                { id: "3", username: "Benjamin", points: 85, position: 3, racesWon: 0, seasonProgress: 43, isCurrentUser: false },
                { id: "4", username: "Clara", points: 72, position: 4, racesWon: 0, seasonProgress: 38, isCurrentUser: false },
                { id: "5", username: "David", points: 65, position: 5, racesWon: 0, seasonProgress: 29, isCurrentUser: false },
            ],
        },
    },
    {
        id: "projet-web",
        name: "Projet Web S2",
        mySeasonPosition: 1,
        myCompletedCourses: 2,
        currentSeason: {
            id: "season-2",
            number: 3,
            name: "Sprint Final",
            startedAt: "2025-12-01T09:00:00Z",
            courses: [
                {
                    id: "pw-1",
                    name: "Setup & Architecture",
                    status: "completed",
                    startDate: "2025-12-01T09:00:00Z",
                    endDate: "2025-12-05T23:59:00Z",
                    myProgress: 100,
                    myPosition: 1,
                },
                {
                    id: "pw-2",
                    name: "Frontend React",
                    status: "completed",
                    startDate: "2025-12-02T09:00:00Z",
                    endDate: "2025-12-05T23:59:00Z",
                    myProgress: 100,
                    myPosition: 1,
                },
                {
                    id: "pw-3",
                    name: "Backend API",
                    status: "active",
                    startDate: "2025-12-03T09:00:00Z",
                    endDate: "2025-12-05T23:59:00Z",
                    myProgress: 45,
                    myPosition: 2,
                },
                {
                    id: "pw-4",
                    name: "Intégration & Tests",
                    status: "scheduled",
                    startDate: "2025-12-04T09:00:00Z",
                    endDate: "2025-12-05T23:59:00Z",
                },
            ],
            standings: [
                { id: "1", username: "Antoine", points: 85, position: 1, racesWon: 2, seasonProgress: 61, isCurrentUser: true },
                { id: "2", username: "Emma", points: 72, position: 2, racesWon: 0, seasonProgress: 50, isCurrentUser: false },
                { id: "3", username: "Lucas", points: 58, position: 3, racesWon: 0, seasonProgress: 38, isCurrentUser: false },
            ],
        },
    },
    {
        id: "nouveau-groupe",
        name: "Nouveau Groupe",
        mySeasonPosition: 1,
        myCompletedCourses: 0,
        currentSeason: {
            id: "season-new",
            number: 1,
            name: "Saison Inaugurale",
            startedAt: "2025-12-01T09:00:00Z",
            courses: [], // No courses yet
            standings: [
                { id: "1", username: "Antoine", points: 0, position: 1, racesWon: 0, seasonProgress: 0, isCurrentUser: true },
                { id: "2", username: "Marie", points: 0, position: 2, racesWon: 0, seasonProgress: 0, isCurrentUser: false },
            ],
        },
    },
];

// ============================================================================
// COURSE STATUS BADGE
// ============================================================================

interface CourseStatusBadgeProps {
    status: CourseStatus;
}

function CourseStatusBadge({ status }: CourseStatusBadgeProps) {
    const config = {
        completed: {
            icon: CheckCircle,
            label: "Terminé",
            className: "bg-green-50 text-green-700 dark:bg-green-950/50 dark:text-green-400",
            iconClassName: "text-green-600 dark:text-green-400",
        },
        active: {
            icon: Play,
            label: "En cours",
            className: "bg-brand-50 text-brand-700 dark:bg-brand-950/50 dark:text-brand-400",
            iconClassName: "text-brand-600 dark:text-brand-400",
            pulse: true,
        },
        preparing: {
            icon: Clock,
            label: "Préparation",
            className: "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400",
            iconClassName: "text-amber-600 dark:text-amber-400",
        },
        scheduled: {
            icon: Lock01,
            label: "À venir",
            className: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
            iconClassName: "text-gray-400 dark:text-gray-500",
        },
        draft: {
            icon: Clock,
            label: "Brouillon",
            className: "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500",
            iconClassName: "text-gray-300 dark:text-gray-600",
        },
        cancelled: {
            icon: Clock,
            label: "Annulé",
            className: "bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400",
            iconClassName: "text-red-500 dark:text-red-400",
        },
    };

    const { icon: Icon, label, className, iconClassName, pulse } = config[status] || config.draft;

    return (
        <div className={cx("flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium", className)}>
            {pulse ? (
                <span className="relative flex size-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75" />
                    <span className="relative inline-flex size-2 rounded-full bg-brand-500" />
                </span>
            ) : (
                <Icon className={cx("size-3", iconClassName)} />
            )}
            <span>{label}</span>
        </div>
    );
}

// ============================================================================
// COURSE ITEM COMPONENT
// ============================================================================

interface CourseItemProps {
    course: Course;
    onClick: (courseId: string) => void;
}

function CourseItem({ course, onClick }: CourseItemProps) {
    const isClickable = course.status !== "draft";
    const isCompleted = course.status === "completed";
    const isActive = course.status === "active" || course.status === "preparing";
    const isScheduled = course.status === "scheduled";

    return (
        <motion.button
            type="button"
            onClick={() => isClickable && onClick(course.id)}
            disabled={!isClickable}
            className={cx(
                "group flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all",
                isClickable && "cursor-pointer",
                isCompleted && "border-green-200 bg-green-50/50 hover:bg-green-50 dark:border-green-900 dark:bg-green-950/20 dark:hover:bg-green-950/40",
                isActive && "border-brand-200 bg-brand-50/50 hover:bg-brand-50 dark:border-brand-900 dark:bg-brand-950/20 dark:hover:bg-brand-950/40",
                isScheduled && "border-gray-200 bg-gray-50/50 hover:bg-gray-100/50 dark:border-gray-700 dark:bg-gray-800/50 dark:hover:bg-gray-800",
                !isClickable && "cursor-not-allowed opacity-50",
            )}
            whileHover={isClickable ? { scale: 1.01 } : undefined}
            whileTap={isClickable ? { scale: 0.99 } : undefined}
        >
            {/* Status indicator */}
            <div className={cx(
                "flex size-8 shrink-0 items-center justify-center rounded-lg",
                isCompleted && "bg-green-100 dark:bg-green-900/50",
                isActive && "bg-brand-100 dark:bg-brand-900/50",
                isScheduled && "bg-gray-200 dark:bg-gray-700",
            )}>
                {isCompleted && <CheckCircle className="size-4 text-green-600 dark:text-green-400" />}
                {isActive && (
                    <span className="relative flex size-3">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75" />
                        <span className="relative inline-flex size-3 rounded-full bg-brand-500" />
                    </span>
                )}
                {isScheduled && <Lock01 className="size-4 text-gray-400 dark:text-gray-500" />}
            </div>

            {/* Course info */}
            <div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
                <span className={cx(
                    "truncate text-sm font-medium",
                    isCompleted && "text-green-900 dark:text-green-100",
                    isActive && "text-brand-900 dark:text-brand-100",
                    isScheduled && "text-gray-600 dark:text-gray-400",
                )}>
                    {course.name}
                </span>
                
                {/* Progress bar for active courses */}
                {isActive && course.myProgress !== undefined && (
                    <div className="mt-1 flex items-center gap-2">
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-brand-100 dark:bg-brand-900/50">
                            <motion.div
                                className="h-full rounded-full bg-brand-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${course.myProgress}%` }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                            />
                        </div>
                        <span className="text-xs font-medium text-brand-600 dark:text-brand-400">
                            {course.myProgress}%
                        </span>
                    </div>
                )}

                {/* Position for completed courses */}
                {isCompleted && course.myPosition !== undefined && (
                    <span className="text-xs text-green-600 dark:text-green-400">
                        Terminé #{course.myPosition}
                    </span>
                )}
            </div>

            {/* Chevron */}
            {isClickable && (
                <ChevronRightIcon className={cx(
                    "size-4 transition-transform group-hover:translate-x-0.5",
                    isCompleted && "text-green-400 dark:text-green-600",
                    isActive && "text-brand-400 dark:text-brand-600",
                    isScheduled && "text-gray-300 dark:text-gray-600",
                )} />
            )}
        </motion.button>
    );
}

// ============================================================================
// SEASON STANDINGS COMPONENT
// ============================================================================

interface SeasonStandingsProps {
    position: number;
    totalParticipants: number;
    completedCourses: number;
    totalCourses: number;
    standings: SeasonParticipant[];
}

function SeasonStandings({ 
    position, 
    totalParticipants, 
    completedCourses, 
    totalCourses, 
    standings 
}: SeasonStandingsProps) {
    const topParticipants = standings.slice(0, 5);
    const progressPercent = totalCourses > 0 ? Math.round((completedCourses / totalCourses) * 100) : 0;
    const hasCourses = totalCourses > 0;

    return (
        <div className="space-y-5">
            {/* Header stats */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-brand-600 font-mono text-sm font-bold text-white shadow-sm">
                        #{position}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-medium text-tertiary">Position saison</span>
                        <span className="text-sm text-secondary">sur {totalParticipants} pilotes</span>
                    </div>
                </div>

                <div className="flex flex-col items-end">
                    <span className="text-xs font-medium text-tertiary">Progression</span>
                    {hasCourses ? (
                        <div className="flex items-baseline gap-1">
                            <span className="font-mono text-2xl font-bold text-primary">{completedCourses}</span>
                            <span className="text-sm text-tertiary">/ {totalCourses} courses</span>
                        </div>
                    ) : (
                        <span className="text-sm text-tertiary">En attente</span>
                    )}
                </div>
            </div>

            {/* Segmented track bar with position markers - only show if there are courses */}
            {hasCourses && (
                <div className="relative py-6 pb-0">
                    {/* Position markers above the track */}
                    <div className="absolute inset-x-0 top-0 h-5">
                        {topParticipants.map((p) => (
                        <motion.div
                            key={p.id}
                            className="absolute bottom-0"
                            style={{ left: `${p.seasonProgress}%` }}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.3 + p.position * 0.08, type: "spring", stiffness: 300 }}
                        >
                            <div
                                className={cx(
                                    "size-4 -translate-x-1/2 rounded-full border-2 border-white shadow-sm dark:border-gray-800",
                                    p.isCurrentUser
                                        ? "bg-brand-500"
                                        : "bg-gray-400 dark:bg-gray-500",
                                )}
                            />
                        </motion.div>
                    ))}
                </div>

                {/* Track background with segments */}
                <div className="flex h-3 gap-0.5 overflow-hidden rounded-full bg-gray-100 p-0.5 dark:bg-gray-700">
                    {Array.from({ length: totalCourses }).map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: i * 0.03, duration: 0.2 }}
                            className={cx(
                                "flex-1 rounded-full transition-colors duration-300",
                                i < completedCourses
                                    ? "bg-brand-500"
                                    : "bg-gray-200 dark:bg-gray-600",
                            )}
                        />
                    ))}
                </div>

                {/* Labels */}
                <div className="mt-2 flex justify-between text-xs text-tertiary">
                    <span>{progressPercent}% de la saison</span>
                    <span>{totalCourses - completedCourses} courses restantes</span>
                </div>
            </div>
            )}

            {/* Leaderboard */}
            <div className="grid grid-cols-5 gap-2">
                {topParticipants.map((p) => (
                    <motion.div
                        key={p.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + p.position * 0.05 }}
                        className={cx(
                            "relative flex flex-col items-center rounded-lg py-2 transition-colors",
                            p.isCurrentUser
                                ? "bg-brand-50 ring-1 ring-brand-200 dark:bg-brand-950/30 dark:ring-brand-800"
                                : "bg-gray-50 hover:bg-gray-100 dark:bg-gray-800/50",
                        )}
                    >
                        <section className="flex w-full flex-row items-center justify-between px-2">
                            <div className="flex flex-row items-center gap-1">
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

                                <span
                                    className={cx(
                                        "max-w-full truncate px-1 text-[11px] font-medium",
                                        p.isCurrentUser ? "text-brand-700 dark:text-brand-400" : "text-secondary",
                                    )}
                                >
                                    {p.isCurrentUser ? "Toi" : p.username}
                                </span>
                            </div>
                            <div>
                                <span
                                    className={cx(
                                        "font-mono text-[10px]",
                                        p.isCurrentUser ? "text-brand-600 dark:text-brand-500" : "text-tertiary",
                                    )}
                                >
                                    {p.points}pts
                                </span>
                            </div>
                        </section>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function CurrentSeasonWidget() {
    const [currentLobbyIndex, setCurrentLobbyIndex] = useState(0);
    const lobbies = MOCK_LOBBIES;

    const currentLobby = lobbies[currentLobbyIndex];
    const hasMultipleLobbies = lobbies.length > 1;

    const goToPrevious = () => {
        setCurrentLobbyIndex((prev) => (prev === 0 ? lobbies.length - 1 : prev - 1));
    };

    const goToNext = () => {
        setCurrentLobbyIndex((prev) => (prev === lobbies.length - 1 ? 0 : prev + 1));
    };

    const handleCourseClick = (courseId: string) => {
        // Navigation vers la page détail de la course
        console.log("Navigate to course:", courseId);
        // router.push(`/courses/${courseId}`);
    };

    // Filter out draft courses
    const visibleCourses = currentLobby?.currentSeason.courses.filter(
        (c) => c.status !== "draft"
    ) || [];

    const completedCourses = visibleCourses.filter((c) => c.status === "completed").length;

    if (!currentLobby) {
        return (
            <div className="h-full rounded-2xl bg-gray-100 p-3 ring-1 ring-primary/10 dark:bg-gray-900">
                <div className="flex h-full flex-col items-center justify-center rounded-xl bg-white p-8 dark:bg-gray-800">
                    <Flag06 className="size-12 text-quaternary" />
                    <p className="mt-4 text-lg font-medium text-secondary">Aucune saison en cours</p>
                    <p className="mt-1 text-sm text-tertiary">Rejoins un salon pour participer !</p>
                </div>
            </div>
        );
    }

    const season = currentLobby.currentSeason;

    return (
        <div className="h-full rounded-2xl bg-gray-100 p-3 ring-1 ring-primary/10 transition-all duration-300 hover:ring-primary/20 dark:bg-gray-900">
            <div className="flex h-full flex-col overflow-hidden rounded-xl bg-white dark:bg-gray-800">
{/* ============================================ */}
                {/* HEADER */}
                {/* ============================================ */}
                <div className="shrink-0 flex items-start justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-700/50">
                    <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1">
                            {hasMultipleLobbies && (
                                <>
                                    <button
                                        type="button"
                                        onClick={goToPrevious}
                                        className="rounded p-0.5 text-quaternary transition-colors hover:bg-secondary hover:text-secondary"
                                    >
                                        <ChevronLeft className="size-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={goToNext}
                                        className="rounded p-0.5 text-quaternary transition-colors hover:bg-secondary hover:text-secondary"
                                    >
                                        <ChevronRight className="size-4" />
                                    </button>
                                </>
                            )}
                            <h2 className="text-lg font-semibold text-primary">{currentLobby.name}</h2>
                        </div>
    
                        <span className="text-sm font-medium text-secondary">
                            Saison {String(season.number).padStart(2, "0")} - {season.name}
                        </span>
                    </div>
    
                    {visibleCourses.some(c => c.status === "active" || c.status === "preparing") ? (
                        <div className="flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 dark:bg-green-950/50">
                            <span className="relative flex size-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                                <span className="relative inline-flex size-2 rounded-full bg-green-500" />
                            </span>
                            <span className="text-sm font-semibold text-green-600 dark:text-green-400">Active</span>
                        </div>
                    ) : visibleCourses.length === 0 ? (
                        <div className="flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 dark:bg-gray-700/50">
                            <span className="size-2 rounded-full bg-gray-400 dark:bg-gray-500" />
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">En attente</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 dark:bg-amber-950/50">
                            <span className="size-2 rounded-full bg-amber-500" />
                            <span className="text-sm font-medium text-amber-600 dark:text-amber-400">Planifiée</span>
                        </div>
                    )}
                </div>
                {/* ============================================ */}
                {/* COURSES LIST */}
                {/* ============================================ */}
                <div className="min-h-0 flex-1 overflow-y-auto p-4">
                    {visibleCourses.length > 0 ? (
                        <>
                            <div className="mb-3 flex items-center justify-between">
                                <h3 className="text-sm font-semibold uppercase tracking-wide text-secondary">
                                    Courses
                                </h3>
                                <span className="text-xs text-tertiary">
                                    {completedCourses}/{visibleCourses.length} terminées
                                </span>
                            </div>
    
                            <div className="flex flex-col gap-2">
                                <AnimatePresence mode="popLayout">
                                    {visibleCourses.map((course, index) => (
                                        <motion.div
                                            key={course.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <CourseItem
                                                course={course}
                                                onClick={handleCourseClick}
                                            />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex h-full flex-col items-center justify-center px-6 py-10 text-center"
                        >
                            <div className="flex size-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700/50">
                                <Flag06 className="size-6 text-gray-400 dark:text-gray-500" />
                            </div>
                            <h3 className="mt-4 text-sm font-semibold text-primary">
                                Aucune course
                            </h3>
                            <p className="mt-1 max-w-[220px] text-sm text-tertiary">
                                Les courses de cette saison n'ont pas encore été créées.
                            </p>
                        </motion.div>
                    )}
                </div>
    
                {/* ============================================ */}
                {/* SEASON STANDINGS FOOTER */}
                {/* ============================================ */}
                <div className="shrink-0 border-t border-gray-100 bg-gray-50/80 p-5 dark:border-gray-700/50 dark:bg-gray-800/50">
                    <SeasonStandings
                        position={currentLobby.mySeasonPosition}
                        totalParticipants={season.standings.length}
                        completedCourses={completedCourses}
                        totalCourses={visibleCourses.length}
                        standings={season.standings}
                    />
                </div>
            </div>
        </div>
    );
}