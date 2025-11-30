"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Plus,
    Trophy01,
    Users01,
    Settings01,
    Copy01,
    QrCode01,
    ChevronRight,
    Clock,
    CheckCircle,
    Play,
    Lock01,
    Edit02,
    Trash01,
    Flag06,
    Share07,
    DotsVertical,
    Check,
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
    objective?: string;
    status: CourseStatus;
    startDate: string;
    endDate: string;
    participantsCount: number;
    myProgress?: number;
    myPosition?: number;
    winnerId?: string;
    winnerName?: string;
}

interface SeasonParticipant {
    id: string;
    username: string;
    avatarUrl?: string;
    points: number;
    position: number;
    racesWon: number;
    isCurrentUser?: boolean;
}

interface RecentWinner {
    courseId: string;
    courseName: string;
    winnerId: string;
    winnerName: string;
    winnerAvatarUrl?: string;
    position: number; // 1, 2, 3 for display order
}

interface Salon {
    id: string;
    name: string;
    code: string;
    membersCount: number;
    myRole: "admin" | "co_admin" | "member";
    currentSeason: {
        id: string;
        number: number;
        name: string;
        standings: SeasonParticipant[];
    };
    courses: Course[];
    recentWinners: RecentWinner[];
}

// ============================================================================
// MOCK DATA
// ============================================================================

const MOCK_SALON: Salon = {
    id: "epita-apping01",
    name: "EPITA APPING01",
    code: "EPT2025",
    membersCount: 24,
    myRole: "admin",
    currentSeason: {
        id: "season-1",
        number: 1,
        name: "Piscine SQL",
        standings: [
            { id: "1", username: "Alice", points: 127, position: 1, racesWon: 3, isCurrentUser: false },
            { id: "2", username: "Antoine", points: 98, position: 2, racesWon: 1, isCurrentUser: true },
            { id: "3", username: "Benjamin", points: 85, position: 3, racesWon: 0, isCurrentUser: false },
            { id: "4", username: "Clara", points: 72, position: 4, racesWon: 0, isCurrentUser: false },
            { id: "5", username: "David", points: 65, position: 5, racesWon: 0, isCurrentUser: false },
            { id: "6", username: "Emma", points: 58, position: 6, racesWon: 0, isCurrentUser: false },
            { id: "7", username: "Lucas", points: 45, position: 7, racesWon: 0, isCurrentUser: false },
            { id: "8", username: "Marie", points: 32, position: 8, racesWon: 0, isCurrentUser: false },
        ],
    },
    courses: [
        {
            id: "course-1",
            name: "Module 1 - Introduction SQL",
            objective: "Comprendre les bases de SQL",
            status: "completed",
            startDate: "2025-11-24T09:00:00Z",
            endDate: "2025-11-25T18:00:00Z",
            participantsCount: 24,
            myProgress: 100,
            myPosition: 1,
            winnerId: "1",
            winnerName: "Alice",
        },
        {
            id: "course-2",
            name: "Module 2 - SELECT & WHERE",
            objective: "Maîtriser les requêtes de sélection",
            status: "completed",
            startDate: "2025-11-25T09:00:00Z",
            endDate: "2025-11-26T18:00:00Z",
            participantsCount: 24,
            myProgress: 100,
            myPosition: 2,
            winnerId: "1",
            winnerName: "Alice",
        },
        {
            id: "course-3",
            name: "Module 3 - JOIN",
            objective: "Apprendre les jointures entre tables",
            status: "completed",
            startDate: "2025-11-26T09:00:00Z",
            endDate: "2025-11-27T18:00:00Z",
            participantsCount: 24,
            myProgress: 100,
            myPosition: 3,
            winnerId: "2",
            winnerName: "Antoine",
        },
        {
            id: "course-4",
            name: "Module 4 - Agrégation",
            objective: "GROUP BY, HAVING et fonctions d'agrégation",
            status: "active",
            startDate: "2025-11-27T09:00:00Z",
            endDate: "2025-11-28T18:00:00Z",
            participantsCount: 24,
            myProgress: 65,
            myPosition: 2,
        },
        {
            id: "course-5",
            name: "Module 5 - Sous-requêtes",
            objective: "Requêtes imbriquées et corrélées",
            status: "scheduled",
            startDate: "2025-11-28T09:00:00Z",
            endDate: "2025-11-29T18:00:00Z",
            participantsCount: 24,
        },
        {
            id: "course-6",
            name: "Module 6 - Transactions",
            objective: "ACID, COMMIT, ROLLBACK",
            status: "scheduled",
            startDate: "2025-11-29T09:00:00Z",
            endDate: "2025-11-30T18:00:00Z",
            participantsCount: 24,
        },
        {
            id: "course-7",
            name: "Module 7 - Projet Final",
            objective: "Conception et implémentation d'une BDD complète",
            status: "draft",
            startDate: "2025-11-30T09:00:00Z",
            endDate: "2025-12-01T18:00:00Z",
            participantsCount: 0,
        },
    ],
    recentWinners: [
        { courseId: "course-3", courseName: "Module 3 - JOIN", winnerId: "2", winnerName: "Antoine", position: 1 },
        { courseId: "course-2", courseName: "Module 2 - SELECT", winnerId: "1", winnerName: "Alice", position: 2 },
        { courseId: "course-1", courseName: "Module 1 - Intro", winnerId: "1", winnerName: "Alice", position: 3 },
    ],
};

// ============================================================================
// COURSE STATUS CONFIG
// ============================================================================

const courseStatusConfig = {
    completed: {
        icon: CheckCircle,
        label: "Terminé",
        bgClass: "bg-green-50 dark:bg-green-950/30",
        borderClass: "border-green-200 dark:border-green-800",
        badgeClass: "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400",
        iconClass: "text-green-600 dark:text-green-400",
    },
    active: {
        icon: Play,
        label: "En cours",
        bgClass: "bg-brand-50 dark:bg-brand-950/30",
        borderClass: "border-brand-200 dark:border-brand-800",
        badgeClass: "bg-brand-100 text-brand-700 dark:bg-brand-900/50 dark:text-brand-400",
        iconClass: "text-brand-600 dark:text-brand-400",
        pulse: true,
    },
    preparing: {
        icon: Clock,
        label: "Préparation",
        bgClass: "bg-amber-50 dark:bg-amber-950/30",
        borderClass: "border-amber-200 dark:border-amber-800",
        badgeClass: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400",
        iconClass: "text-amber-600 dark:text-amber-400",
    },
    scheduled: {
        icon: Lock01,
        label: "Planifié",
        bgClass: "bg-gray-50 dark:bg-gray-800/50",
        borderClass: "border-gray-200 dark:border-gray-700",
        badgeClass: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
        iconClass: "text-gray-400 dark:text-gray-500",
    },
    draft: {
        icon: Edit02,
        label: "Brouillon",
        bgClass: "bg-gray-50/50 dark:bg-gray-800/30",
        borderClass: "border-dashed border-gray-300 dark:border-gray-600",
        badgeClass: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500",
        iconClass: "text-gray-400 dark:text-gray-600",
    },
    cancelled: {
        icon: Trash01,
        label: "Annulé",
        bgClass: "bg-red-50/50 dark:bg-red-950/20",
        borderClass: "border-red-200 dark:border-red-900",
        badgeClass: "bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400",
        iconClass: "text-red-500 dark:text-red-400",
    },
};

// ============================================================================
// RECENT WINNERS CARD
// ============================================================================

interface RecentWinnersCardProps {
    winners: RecentWinner[];
}

function RecentWinnersCard({ winners }: RecentWinnersCardProps) {
    const medals = ["🥇", "🥈", "🥉"];

    return (
        <div className="h-full rounded-2xl bg-gray-100 p-3 ring-1 ring-primary/10 dark:bg-gray-900">
            <div className="flex h-full flex-col rounded-xl bg-white dark:bg-gray-800">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-gray-700/50">
                    <div className="flex items-center gap-2">
                         <h3 className="text-sm font-semibold text-primary">Derniers vainqueurs</h3>
                    </div>
                </div>

                {/* Winners list */}
                <div className="flex flex-1 flex-col">
                    {winners.length > 0 ? (
                        winners.map((winner, index) => (
                            <motion.div
                                key={winner.courseId}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={cx(
                                    "flex items-center gap-3 px-4 py-1",
                                    index < winners.length - 1 && "border-b border-gray-100 dark:border-gray-700/50"
                                )}
                            >
                                <span className="text-lg">{medals[index] || "🏁"}</span>
                                <div className="flex flex-row w-full justify-between overflow-hidden py-2">
                                    <span className="truncate text-sm font-medium text-primary">
                                        {winner.winnerName}
                                    </span>
                                    <span className="truncate text-xs text-tertiary">{winner.courseName}</span>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
                            <Trophy01 className="size-8 text-gray-300 dark:text-gray-600" />
                            <p className="mt-2 text-sm text-tertiary">Aucun vainqueur pour l'instant</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// SEASON STANDINGS CARD
// ============================================================================

interface SeasonStandingsCardProps {
    seasonNumber: number;
    seasonName: string;
    standings: SeasonParticipant[];
}

function SeasonStandingsCard({ seasonNumber, seasonName, standings }: SeasonStandingsCardProps) {
    const displayedStandings = standings.slice(0, 8);

    return (
        <div className="h-full rounded-2xl bg-gray-100 p-3 ring-1 ring-primary/10 dark:bg-gray-900">
            <div className="flex h-full flex-col overflow-hidden rounded-xl bg-white dark:bg-gray-800">
                {/* Header */}
                <div className="shrink-0 flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-gray-700/50">
                    <div className="flex flex-col gap-0.5">
                        <h3 className="text-sm font-semibold text-primary">Classement Saison</h3>
                        <span className="text-xs text-tertiary">
                            S{String(seasonNumber).padStart(2, "0")} - {seasonName}
                        </span>
                    </div>
                    <button
                        type="button"
                        className="flex items-center gap-1 text-xs font-medium text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-400"
                    >
                        Voir tout
                        <ChevronRight className="size-3" />
                    </button>
                </div>

                {/* Standings list */}
                <div className="min-h-0 flex flex-1 flex-col overflow-y-auto">
                    {displayedStandings.map((participant, index) => (
                        <motion.div
                            key={participant.id}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.03 }}
                            className={cx(
                                "flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/30",
                                participant.isCurrentUser && "bg-brand-50/50 dark:bg-brand-950/20"
                            )}
                        >
                            {/* Position */}
                            <div
                                className={cx(
                                    "flex size-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold",
                                    participant.position === 1 &&
                                        "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400",
                                    participant.position === 2 &&
                                        "bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-300",
                                    participant.position === 3 &&
                                        "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-400",
                                    participant.position > 3 &&
                                        "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                                )}
                            >
                                {participant.position}
                            </div>

                            {/* Name */}
                            <span
                                className={cx(
                                    "flex-1 truncate text-sm font-medium",
                                    participant.isCurrentUser ? "text-brand-700 dark:text-brand-400" : "text-primary"
                                )}
                            >
                                {participant.isCurrentUser ? "Toi" : participant.username}
                            </span>

                            {/* Wins */}
                            {participant.racesWon > 0 && (
                                <div className="flex items-center gap-0.5">
                                    <Trophy01 className="size-3 text-amber-500" />
                                    <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                                        {participant.racesWon}
                                    </span>
                                </div>
                            )}

                            {/* Points */}
                            <span
                                className={cx(
                                    "font-mono text-sm",
                                    participant.isCurrentUser
                                        ? "font-semibold text-brand-600 dark:text-brand-400"
                                        : "text-tertiary"
                                )}
                            >
                                {participant.points}
                                <span className="text-xs">pts</span>
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// COURSE CARD
// ============================================================================

interface CourseCardProps {
    course: Course;
    isAdmin: boolean;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
    onClick?: (id: string) => void;
}

function CourseCard({ course, isAdmin, onEdit, onDelete, onClick }: CourseCardProps) {
    const [showMenu, setShowMenu] = useState(false);
    const config = courseStatusConfig[course.status];
    const Icon = config.icon;

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
    };

    const getTimeRemaining = () => {
        const now = new Date();
        const end = new Date(course.endDate);
        const diff = end.getTime() - now.getTime();

        if (diff <= 0) return null;

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days}j ${hours % 24}h`;
        return `${hours}h`;
    };

    const timeRemaining = course.status === "active" ? getTimeRemaining() : null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cx(
                "group relative flex cursor-pointer flex-col rounded-xl border p-4 transition-all",
                config.bgClass,
                config.borderClass,
                "hover:shadow-md"
            )}
            onClick={() => onClick?.(course.id)}
        >
            {/* Admin menu */}
            {isAdmin && (
                <div className="absolute right-2 top-2">
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowMenu(!showMenu);
                        }}
                        className="rounded-lg p-1.5 opacity-0 transition-all hover:bg-white/50 group-hover:opacity-100 dark:hover:bg-gray-700/50"
                    >
                        <DotsVertical className="size-4 text-tertiary" />
                    </button>

                    <AnimatePresence>
                        {showMenu && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="absolute right-0 top-8 z-10 min-w-[140px] rounded-lg border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-800"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button
                                    type="button"
                                    onClick={() => {
                                        onEdit?.(course.id);
                                        setShowMenu(false);
                                    }}
                                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-secondary transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    <Edit02 className="size-4" />
                                    Modifier
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        onDelete?.(course.id);
                                        setShowMenu(false);
                                    }}
                                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                                >
                                    <Trash01 className="size-4" />
                                    Supprimer
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}

            {/* Status badge */}
            <div className="mb-3 flex items-center justify-between">
                <div className={cx("flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium", config.badgeClass)}>
                    {config.pulse ? (
                        <span className="relative flex size-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75" />
                            <span className="relative inline-flex size-2 rounded-full bg-brand-500" />
                        </span>
                    ) : (
                        <Icon className={cx("size-3", config.iconClass)} />
                    )}
                    {config.label}
                </div>

                {timeRemaining && (
                    <span className="text-xs font-medium text-brand-600 dark:text-brand-400">
                        {timeRemaining} restant
                    </span>
                )}
            </div>

            {/* Course name */}
            <h4 className="mb-1 line-clamp-2 text-sm font-semibold text-primary">{course.name}</h4>

            {/* Objective */}
            {course.objective && (
                <p className="mb-3 line-clamp-2 text-xs text-tertiary">{course.objective}</p>
            )}

            {/* Footer */}
            <div className="mt-auto flex items-center justify-between pt-2">
                <span className="text-xs text-tertiary">
                    {formatDate(course.startDate)} → {formatDate(course.endDate)}
                </span>

                {course.status === "active" && course.myProgress !== undefined && (
                    <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-600">
                            <div
                                className="h-full rounded-full bg-brand-500"
                                style={{ width: `${course.myProgress}%` }}
                            />
                        </div>
                        <span className="text-xs font-medium text-brand-600 dark:text-brand-400">
                            {course.myProgress}%
                        </span>
                    </div>
                )}

                {course.status === "completed" && course.winnerName && (
                    <div className="flex items-center gap-1">
                        <Trophy01 className="size-3 text-amber-500" />
                        <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                            {course.winnerName}
                        </span>
                    </div>
                )}

                {(course.status === "scheduled" || course.status === "draft") && (
                    <div className="flex items-center gap-1">
                        <Users01 className="size-3 text-tertiary" />
                        <span className="text-xs text-tertiary">{course.participantsCount}</span>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

// ============================================================================
// COURSES GRID
// ============================================================================

interface CoursesGridProps {
    courses: Course[];
    isAdmin: boolean;
    onAddCourse?: () => void;
    onEditCourse?: (id: string) => void;
    onDeleteCourse?: (id: string) => void;
    onCourseClick?: (id: string) => void;
}

function CoursesGrid({ courses, isAdmin, onAddCourse, onEditCourse, onDeleteCourse, onCourseClick }: CoursesGridProps) {
    // Filter out cancelled, sort: active first, then preparing, then scheduled, then completed, then draft
    const sortedCourses = [...courses]
        .filter((c) => c.status !== "cancelled")
        .sort((a, b) => {
            const order = { active: 0, preparing: 1, scheduled: 2, completed: 3, draft: 4, cancelled: 5 };
            return order[a.status] - order[b.status];
        });

    const activeCourses = sortedCourses.filter((c) => c.status === "active" || c.status === "preparing");
    const upcomingCourses = sortedCourses.filter((c) => c.status === "scheduled");
    const completedCourses = sortedCourses.filter((c) => c.status === "completed");
    const draftCourses = sortedCourses.filter((c) => c.status === "draft");

    return (
        <div className="flex  h-full flex-col rounded-2xl bg-gray-100 p-3 ring-1 ring-primary/10 dark:bg-gray-900">
            <div className="flex h-full flex-col overflow-hidden rounded-xl bg-white dark:bg-gray-800">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-700/50">
                    <div className="flex flex-col gap-0.5">
                        <h2 className="text-lg font-semibold text-primary">Courses</h2>
                        <span className="text-xs text-tertiary">
                            {activeCourses.length} en cours · {upcomingCourses.length} à venir · {completedCourses.length} terminées
                        </span>
                    </div>

                    {isAdmin && (
                        <button
                            type="button"
                            onClick={onAddCourse}
                            className="flex items-center gap-2 rounded-lg bg-brand-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
                        >
                            <Plus className="size-4" />
                            Nouvelle course
                        </button>
                    )}
                </div>

                {/* Courses content */}
                <div className="flex-1 overflow-y-auto p-4 h-full">
                    {sortedCourses.length > 0 ? (
                        <div className="space-y-6">
                            {/* Active courses */}
                            {activeCourses.length > 0 && (
                                <section>
                                    <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-secondary">
                                        <span className="relative flex size-2">
                                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75" />
                                            <span className="relative inline-flex size-2 rounded-full bg-brand-500" />
                                        </span>
                                        En cours
                                    </h3>
                                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                        {activeCourses.map((course, index) => (
                                            <motion.div
                                                key={course.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                            >
                                                <CourseCard
                                                    course={course}
                                                    isAdmin={isAdmin}
                                                    onEdit={onEditCourse}
                                                    onDelete={onDeleteCourse}
                                                    onClick={onCourseClick}
                                                />
                                            </motion.div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Upcoming courses */}
                            {upcomingCourses.length > 0 && (
                                <section>
                                    <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-secondary">
                                        À venir
                                    </h3>
                                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                        {upcomingCourses.map((course, index) => (
                                            <motion.div
                                                key={course.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                            >
                                                <CourseCard
                                                    course={course}
                                                    isAdmin={isAdmin}
                                                    onEdit={onEditCourse}
                                                    onDelete={onDeleteCourse}
                                                    onClick={onCourseClick}
                                                />
                                            </motion.div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Completed courses */}
                            {completedCourses.length > 0 && (
                                <section>
                                    <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-secondary">
                                        Terminées
                                    </h3>
                                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                        {completedCourses.map((course, index) => (
                                            <motion.div
                                                key={course.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                            >
                                                <CourseCard
                                                    course={course}
                                                    isAdmin={isAdmin}
                                                    onEdit={onEditCourse}
                                                    onDelete={onDeleteCourse}
                                                    onClick={onCourseClick}
                                                />
                                            </motion.div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Draft courses (admin only) */}
                            {isAdmin && draftCourses.length > 0 && (
                                <section>
                                    <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-tertiary">
                                        Brouillons
                                    </h3>
                                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                        {draftCourses.map((course, index) => (
                                            <motion.div
                                                key={course.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                            >
                                                <CourseCard
                                                    course={course}
                                                    isAdmin={isAdmin}
                                                    onEdit={onEditCourse}
                                                    onDelete={onDeleteCourse}
                                                    onClick={onCourseClick}
                                                />
                                            </motion.div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex h-full flex-col items-center justify-center px-6 py-16 text-center"
                        >
                            <div className="flex size-14 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700/50">
                                <Flag06 className="size-7 text-gray-400 dark:text-gray-500" />
                            </div>
                            <h3 className="mt-4 text-base font-semibold text-primary">Aucune course</h3>
                            <p className="mt-1 max-w-xs text-sm text-tertiary">
                                {isAdmin
                                    ? "Créez votre première course pour lancer la compétition !"
                                    : "L'administrateur n'a pas encore créé de courses."}
                            </p>
                            {isAdmin && (
                                <button
                                    type="button"
                                    onClick={onAddCourse}
                                    className="mt-4 flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
                                >
                                    <Plus className="size-4" />
                                    Créer une course
                                </button>
                            )}
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// SALON HEADER
// ============================================================================

interface SalonHeaderProps {
    salon: Salon;
    onInvite?: () => void;
    onSettings?: () => void;
    onCopyCode?: () => void;
    onShowQR?: () => void;
}

function SalonHeader({ salon, onInvite, onSettings, onCopyCode, onShowQR }: SalonHeaderProps) {
    const [codeCopied, setCodeCopied] = useState(false);

    const handleCopyCode = () => {
        navigator.clipboard.writeText(salon.code);
        setCodeCopied(true);
        setTimeout(() => setCodeCopied(false), 2000);
        onCopyCode?.();
    };

    return (
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-xl bg-brand-600 text-lg font-bold text-white">
                    {salon.name.charAt(0)}
                </div>
                <div className="flex flex-col gap-0.5">
                    <h1 className="text-xl font-bold text-primary">{salon.name}</h1>
                    <div className="flex items-center gap-3 text-sm text-tertiary">
                        <span className="flex items-center gap-1">
                            <Users01 className="size-4" />
                            {salon.membersCount} membres
                        </span>
                        <span>·</span>
                        <button
                            type="button"
                            onClick={handleCopyCode}
                            className="flex items-center gap-1 font-mono transition-colors hover:text-secondary"
                        >
                            {codeCopied ? (
                                <CheckCircle className="size-3.5 text-green-500" />
                            ) : (
                                <Copy01 className="size-3.5" />
                            )}
                            {salon.code}
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={onShowQR}
                    className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-secondary transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                    <QrCode01 className="size-4" />
                    QR Code
                </button>
                <button
                    type="button"
                    onClick={onInvite}
                    className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-secondary transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                    <Share07 className="size-4" />
                    Inviter
                </button>
                {(salon.myRole === "admin" || salon.myRole === "co_admin") && (
                    <button
                        type="button"
                        onClick={onSettings}
                        className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-secondary transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
                    >
                        <Check className="size-4" />
                        Terminer saison
                    </button>
                )}
            </div>
        </div>
    );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function SalonOverviewPage() {
    const params = useParams();
    const lobbyId = params.id as string;
 
    const router = useRouter();
    const salon = MOCK_SALON;
    const isAdmin = salon.myRole === "admin" || salon.myRole === "co_admin";

    // Handlers
    const handleInvite = () => console.log("Open invite modal");
    const handleSettings = () => console.log("Open settings");
    const handleCopyCode = () => console.log("Code copied");
    const handleShowQR = () => console.log("Show QR code modal");
    const handleAddCourse = () => console.log("Open add course modal");
    const handleEditCourse = (id: string) => console.log("Edit course:", id);
    const handleDeleteCourse = (id: string) => console.log("Delete course:", id);
    const handleCourseClick = (id: string) => {
        router.push(`/lobbies/${lobbyId}/hub/${id}`);
    };

    return (
        <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-8">
            {/* Header */}
            <SalonHeader
                salon={salon}
                onInvite={handleInvite}
                onSettings={handleSettings}
                onCopyCode={handleCopyCode}
                onShowQR={handleShowQR}
            />

            {/* Main content */}
            <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
                {/* Left column - 30% */}
                <div className="flex w-full flex-col gap-4 lg:w-[30%] lg:max-h-[calc(100vh-12rem)] lg:gap-6">
                    {/* Recent winners */}
                    <div className="shrink-0">
                        <RecentWinnersCard winners={salon.recentWinners} />
                    </div>

                    {/* Season standings */}
                    <div className="min-h-0 flex-1">
                        <SeasonStandingsCard
                            seasonNumber={salon.currentSeason.number}
                            seasonName={salon.currentSeason.name}
                            standings={salon.currentSeason.standings}
                        />
                    </div>
                </div>

                {/* Right column - 70% */}
                <div className="flex-1 lg:max-h-[calc(100vh-12rem)]">
                    <CoursesGrid
                        courses={salon.courses}
                        isAdmin={isAdmin}
                        onAddCourse={handleAddCourse}
                        onEditCourse={handleEditCourse}
                        onDeleteCourse={handleDeleteCourse}
                        onCourseClick={handleCourseClick}
                    />
                </div>
            </div>
        </div>
    );
}