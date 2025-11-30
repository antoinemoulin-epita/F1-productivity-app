"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    Plus,
    Trophy01,
    Users01,
    Clock,
    CheckCircle,
    Play,
    Lock01,
    Edit02,
    Trash01,
    Flag06,
    DotsVertical,
    HomeLine,
} from "@untitledui/icons";
import { motion, AnimatePresence } from "motion/react";
import { Breadcrumbs } from "@/components/application/breadcrumbs/breadcrumbs";
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

// ============================================================================
// MOCK DATA
// ============================================================================

const MOCK_LOBBY = {
    id: "epita-apping01",
    name: "EPITA APPING01",
    seasonName: "Piscine SQL",
    seasonNumber: 1,
};

const MOCK_COURSES: Course[] = [
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
];

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
// MAIN PAGE
// ============================================================================

export default function RacesListPage() {
    const router = useRouter();
    const courses = MOCK_COURSES;
    const lobby = MOCK_LOBBY;
    const isAdmin = true; // TODO: récupérer depuis le contexte

    const params = useParams();
    const lobbyId = params.id as string;



    const handleCourseClick = (courseId: string) => {
        router.push(`/lobbies/${lobbyId}/races/${courseId}`);
    };


    // Filter and sort courses
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



    const handleAddCourse = () => console.log("Add course");
    const handleEditCourse = (id: string) => console.log("Edit:", id);
    const handleDeleteCourse = (id: string) => console.log("Delete:", id);

    return (
        <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-8">
            <div className="flex flex-col gap-5">
                {/* Breadcrumb */}
                <Breadcrumbs type="text" divider="chevron">
                    <Breadcrumbs.Item href="/lobbies">
                        <HomeLine className="size-4" />
                    </Breadcrumbs.Item>
                    <Breadcrumbs.Item href="/lobbies/lobby/hub">{lobby.name}</Breadcrumbs.Item>
                    <Breadcrumbs.Item isCurrent>Courses</Breadcrumbs.Item>
                </Breadcrumbs>

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-primary">Courses</h1>
                        <p className="text-sm text-tertiary">
                            Saison {String(lobby.seasonNumber).padStart(2, "0")} - {lobby.seasonName}
                        </p>
                    </div>

                    {isAdmin && (
                        <button
                            type="button"
                            onClick={handleAddCourse}
                            className="flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700"
                        >
                            <Plus className="size-4" />
                            Nouvelle course
                        </button>
                    )}
                </div>

                {/* Stats bar */}
                <div className="flex items-center gap-4 text-sm text-tertiary">
                    <span className="flex items-center gap-1.5">
                        <span className="relative flex size-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75" />
                            <span className="relative inline-flex size-2 rounded-full bg-brand-500" />
                        </span>
                        {activeCourses.length} en cours
                    </span>
                    <span>·</span>
                    <span>{upcomingCourses.length} à venir</span>
                    <span>·</span>
                    <span>{completedCourses.length} terminées</span>
                </div>

                {/* Courses grid */}
                {sortedCourses.length > 0 ? (
                    <div className="space-y-8">
                        {/* Active */}
                        {activeCourses.length > 0 && (
                            <section>
                                <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-secondary">
                                    <span className="relative flex size-2">
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75" />
                                        <span className="relative inline-flex size-2 rounded-full bg-brand-500" />
                                    </span>
                                    En cours
                                </h2>
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {activeCourses.map((course) => (
                                        <CourseCard
                                            key={course.id}
                                            course={course}
                                            isAdmin={isAdmin}
                                            onEdit={handleEditCourse}
                                            onDelete={handleDeleteCourse}
                                            onClick={handleCourseClick}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Upcoming */}
                        {upcomingCourses.length > 0 && (
                            <section>
                                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-secondary">
                                    À venir
                                </h2>
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {upcomingCourses.map((course) => (
                                        <CourseCard
                                            key={course.id}
                                            course={course}
                                            isAdmin={isAdmin}
                                            onEdit={handleEditCourse}
                                            onDelete={handleDeleteCourse}
                                            onClick={handleCourseClick}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Completed */}
                        {completedCourses.length > 0 && (
                            <section>
                                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-secondary">
                                    Terminées
                                </h2>
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {completedCourses.map((course) => (
                                        <CourseCard
                                            key={course.id}
                                            course={course}
                                            isAdmin={isAdmin}
                                            onEdit={handleEditCourse}
                                            onDelete={handleDeleteCourse}
                                            onClick={handleCourseClick}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Drafts */}
                        {isAdmin && draftCourses.length > 0 && (
                            <section>
                                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-tertiary">
                                    Brouillons
                                </h2>
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {draftCourses.map((course) => (
                                        <CourseCard
                                            key={course.id}
                                            course={course}
                                            isAdmin={isAdmin}
                                            onEdit={handleEditCourse}
                                            onDelete={handleDeleteCourse}
                                            onClick={handleCourseClick}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="flex size-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                            <Flag06 className="size-8 text-gray-400" />
                        </div>
                        <h3 className="mt-4 text-lg font-semibold text-primary">Aucune course</h3>
                        <p className="mt-1 max-w-sm text-sm text-tertiary">
                            {isAdmin
                                ? "Créez votre première course pour lancer la compétition !"
                                : "L'administrateur n'a pas encore créé de courses."}
                        </p>
                        {isAdmin && (
                            <button
                                type="button"
                                onClick={handleAddCourse}
                                className="mt-4 flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
                            >
                                <Plus className="size-4" />
                                Créer une course
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}