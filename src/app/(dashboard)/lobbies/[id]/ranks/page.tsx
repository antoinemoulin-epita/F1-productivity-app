"use client";

import { useParams } from "next/navigation";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
    HomeLine,
    Trophy01,
    ChevronLeft,
    ChevronRight,
    Calendar,
    Users01,
    Flag06,
    ChevronDown,
    Check,
} from "@untitledui/icons";
import { motion, AnimatePresence } from "motion/react";
import { Breadcrumbs } from "@/components/application/breadcrumbs/breadcrumbs";
import { cx } from "@/utils/cx";
import { MOCK_RANKING_DATA } from "./mock-data";
import type { Season, CourseRanking, RankingEntry } from "./types";

// ============================================================================
// SEASON TABS
// ============================================================================

interface SeasonTabsProps {
    seasons: Season[];
    selectedSeasonId: string;
    onSelect: (seasonId: string) => void;
}

function SeasonTabs({ seasons, selectedSeasonId, onSelect }: SeasonTabsProps) {
    const selectedIndex = seasons.findIndex((s) => s.id === selectedSeasonId);

    const goToPrevious = () => {
        if (selectedIndex < seasons.length - 1) {
            onSelect(seasons[selectedIndex + 1].id);
        }
    };

    const goToNext = () => {
        if (selectedIndex > 0) {
            onSelect(seasons[selectedIndex - 1].id);
        }
    };

    const selectedSeason = seasons.find((s) => s.id === selectedSeasonId);

    return (
        <div className="flex items-center gap-2">
            <button
                type="button"
                onClick={goToPrevious}
                disabled={selectedIndex >= seasons.length - 1}
                className="rounded-lg p-2 text-tertiary transition-colors hover:bg-secondary hover:text-primary disabled:cursor-not-allowed disabled:opacity-30"
            >
                <ChevronLeft className="size-5" />
            </button>

            <div className="flex min-w-[200px] flex-col items-center">
                <span className="text-lg font-bold text-primary">
                    Saison {String(selectedSeason?.number).padStart(2, "0")}
                </span>
                <span className="text-sm text-tertiary">{selectedSeason?.name}</span>
                {selectedSeason?.status === "current" && (
                    <span className="mt-1 flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-400">
                        <span className="relative flex size-1.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                            <span className="relative inline-flex size-1.5 rounded-full bg-green-500" />
                        </span>
                        En cours
                    </span>
                )}
            </div>

            <button
                type="button"
                onClick={goToNext}
                disabled={selectedIndex <= 0}
                className="rounded-lg p-2 text-tertiary transition-colors hover:bg-secondary hover:text-primary disabled:cursor-not-allowed disabled:opacity-30"
            >
                <ChevronRight className="size-5" />
            </button>
        </div>
    );
}

// ============================================================================
// COURSE SELECTOR
// ============================================================================

interface CourseSelectorProps {
    courses: CourseRanking[];
    selectedCourseId: string | null;
    onSelect: (courseId: string | null) => void;
}

function CourseSelector({ courses, selectedCourseId, onSelect }: CourseSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);

    const selectedCourse = selectedCourseId ? courses.find((c) => c.id === selectedCourseId) : null;
    const displayText = selectedCourse ? selectedCourse.name : "Classement général";

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
                <Flag06 className="size-4 text-tertiary" />
                <span className="max-w-[200px] truncate">{displayText}</span>
                <ChevronDown className={cx("size-4 text-tertiary transition-transform", isOpen && "rotate-180")} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute left-0 top-full z-20 mt-2 w-72 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
                        >
                            <div className="max-h-80 overflow-y-auto p-2">
                                {/* Option classement général */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        onSelect(null);
                                        setIsOpen(false);
                                    }}
                                    className={cx(
                                        "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
                                        selectedCourseId === null
                                            ? "bg-brand-50 text-brand-700 dark:bg-brand-950/30 dark:text-brand-400"
                                            : "text-secondary hover:bg-gray-100 dark:hover:bg-gray-700"
                                    )}
                                >
                                    <Trophy01 className="size-4" />
                                    <span className="flex-1 text-sm font-medium">Classement général</span>
                                    {selectedCourseId === null && <Check className="size-4" />}
                                </button>

                                <div className="my-2 border-t border-gray-100 dark:border-gray-700" />

                                {/* Courses */}
                                {courses.map((course) => (
                                    <button
                                        key={course.id}
                                        type="button"
                                        onClick={() => {
                                            onSelect(course.id);
                                            setIsOpen(false);
                                        }}
                                        className={cx(
                                            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
                                            selectedCourseId === course.id
                                                ? "bg-brand-50 text-brand-700 dark:bg-brand-950/30 dark:text-brand-400"
                                                : "text-secondary hover:bg-gray-100 dark:hover:bg-gray-700"
                                        )}
                                    >
                                        <div className="flex flex-col flex-1 gap-0.5">
                                            <span className="text-sm font-medium">{course.name}</span>
                                            <span className="text-xs text-tertiary">
                                                {new Date(course.date).toLocaleDateString("fr-FR", {
                                                    day: "numeric",
                                                    month: "short",
                                                })}
                                                {course.status === "active" && " • En cours"}
                                                {course.winnerName && ` • 🏆 ${course.winnerName}`}
                                            </span>
                                        </div>
                                        {selectedCourseId === course.id && <Check className="size-4" />}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

// ============================================================================
// CHAMPION BANNER
// ============================================================================

interface ChampionBannerProps {
    season: Season;
}

function ChampionBanner({ season }: ChampionBannerProps) {
    if (season.status !== "completed" || !season.champion) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-500/20 to-amber-500/10 px-6 py-4 ring-1 ring-amber-500/20"
        >
            <div className="flex size-12 items-center justify-center rounded-full bg-amber-500/20">
                <Trophy01 className="size-6 text-amber-500" />
            </div>
            <div className="flex flex-col">
                <span className="text-xs font-medium uppercase tracking-wide text-amber-600 dark:text-amber-400">
                    Champion Saison {season.number}
                </span>
                <span className="text-lg font-bold text-primary">{season.champion.username}</span>
            </div>
            <div className="ml-4 flex flex-col items-end">
                <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                    {season.champion.points}
                </span>
                <span className="text-xs text-tertiary">points</span>
            </div>
        </motion.div>
    );
}

// ============================================================================
// RANKING TABLE
// ============================================================================

interface RankingTableProps {
    rankings: RankingEntry[];
    showRacesWon?: boolean;
    isSeasonRanking?: boolean;
}

function RankingTable({ rankings, showRacesWon = true, isSeasonRanking = false }: RankingTableProps) {
    return (
        <div className="overflow-hidden rounded-2xl bg-gray-100 p-3 ring-1 ring-primary/10 dark:bg-gray-900">
            <div className="overflow-hidden rounded-xl bg-white dark:bg-gray-800">
                {/* Header */}
                <div className="grid grid-cols-12 gap-4 border-b border-gray-100 px-4 py-3 text-xs font-medium uppercase tracking-wide text-tertiary dark:border-gray-700">
                    <div className="col-span-1">#</div>
                    <div className="col-span-4">Joueur</div>
                    <div className="col-span-2 text-right">Points</div>
                    {showRacesWon && <div className="col-span-2 text-right">Victoires</div>}
                    <div className={cx("text-right", showRacesWon ? "col-span-3" : "col-span-5")}>
                        {isSeasonRanking ? "Moy. position" : "Courses"}
                    </div>
                </div>

                {/* Rows */}
                <div className="divide-y divide-gray-50 dark:divide-gray-700/50">
                    {rankings.map((entry, index) => (
                        <motion.div
                            key={entry.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.03 }}
                            className={cx(
                                "grid grid-cols-12 gap-4 px-4 py-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/30",
                                entry.isCurrentUser && "bg-brand-50/50 dark:bg-brand-950/20"
                            )}
                        >
                            {/* Position */}
                            <div className="col-span-1 flex items-center">
                                <div
                                    className={cx(
                                        "flex size-8 items-center justify-center rounded-lg text-sm font-bold",
                                        entry.position === 1 && "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400",
                                        entry.position === 2 && "bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-300",
                                        entry.position === 3 && "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-400",
                                        entry.position > 3 && "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                                    )}
                                >
                                    {entry.position}
                                </div>
                            </div>

                            {/* Username */}
                            <div className="col-span-4 flex items-center gap-3">
                                <span
                                    className={cx(
                                        "text-sm font-medium",
                                        entry.isCurrentUser ? "text-brand-700 dark:text-brand-400" : "text-primary"
                                    )}
                                >
                                    {entry.isCurrentUser ? "Toi" : entry.username}
                                </span>
                                {entry.position === 1 && (
                                    <span className="text-base">🏆</span>
                                )}
                            </div>

                            {/* Points */}
                            <div className="col-span-2 flex items-center justify-end">
                                <span
                                    className={cx(
                                        "font-mono text-sm font-semibold",
                                        entry.isCurrentUser ? "text-brand-600 dark:text-brand-400" : "text-primary"
                                    )}
                                >
                                    {entry.points}
                                </span>
                            </div>

                            {/* Races won */}
                            {showRacesWon && (
                                <div className="col-span-2 flex items-center justify-end gap-1">
                                    {entry.racesWon > 0 ? (
                                        <>
                                            <Trophy01 className="size-3.5 text-amber-500" />
                                            <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                                                {entry.racesWon}
                                            </span>
                                        </>
                                    ) : (
                                        <span className="text-sm text-tertiary">-</span>
                                    )}
                                </div>
                            )}

                            {/* Average position / Races participated */}
                            <div className={cx("flex items-center justify-end", showRacesWon ? "col-span-3" : "col-span-5")}>
                                <span className="text-sm text-tertiary">
                                    {isSeasonRanking
                                        ? `#${entry.averagePosition.toFixed(1)}`
                                        : `${entry.racesParticipated} course${entry.racesParticipated > 1 ? "s" : ""}`}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// STATS CARDS
// ============================================================================

interface StatsCardsProps {
    season: Season;
}

function StatsCards({ season }: StatsCardsProps) {
    const totalCourses = season.courses.length;
    const completedCourses = season.courses.filter((c) => c.status === "completed").length;
    const totalParticipants = season.standings.length;

    const currentUser = season.standings.find((s) => s.isCurrentUser);

    return (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <div className="rounded-xl bg-gray-100 p-4 dark:bg-gray-800/50">
                <div className="flex items-center gap-2 text-tertiary">
                    <Flag06 className="size-4" />
                    <span className="text-xs font-medium uppercase tracking-wide">Courses</span>
                </div>
                <div className="mt-2 text-2xl font-bold text-primary">
                    {completedCourses}/{totalCourses}
                </div>
            </div>

            <div className="rounded-xl bg-gray-100 p-4 dark:bg-gray-800/50">
                <div className="flex items-center gap-2 text-tertiary">
                    <Users01 className="size-4" />
                    <span className="text-xs font-medium uppercase tracking-wide">Participants</span>
                </div>
                <div className="mt-2 text-2xl font-bold text-primary">{totalParticipants}</div>
            </div>

            {currentUser && (
                <>
                    <div className="rounded-xl bg-brand-50 p-4 dark:bg-brand-950/30">
                        <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400">
                            <Trophy01 className="size-4" />
                            <span className="text-xs font-medium uppercase tracking-wide">Ta position</span>
                        </div>
                        <div className="mt-2 text-2xl font-bold text-brand-700 dark:text-brand-400">
                            #{currentUser.position}
                        </div>
                    </div>

                    <div className="rounded-xl bg-brand-50 p-4 dark:bg-brand-950/30">
                        <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400">
                            <span className="text-xs font-medium uppercase tracking-wide">Tes points</span>
                        </div>
                        <div className="mt-2 text-2xl font-bold text-brand-700 dark:text-brand-400">
                            {currentUser.points}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function RanksPage() {
    const params = useParams();
    const lobbyId = params.id as string;

    const data = MOCK_RANKING_DATA;
    const [selectedSeasonId, setSelectedSeasonId] = useState(data.currentSeasonId);
    const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

    const selectedSeason = useMemo(
        () => data.seasons.find((s) => s.id === selectedSeasonId) || data.seasons[0],
        [data.seasons, selectedSeasonId]
    );

    const displayedRankings = useMemo(() => {
        if (selectedCourseId) {
            const course = selectedSeason.courses.find((c) => c.id === selectedCourseId);
            return course?.rankings || [];
        }
        return selectedSeason.standings;
    }, [selectedSeason, selectedCourseId]);

    const selectedCourse = selectedCourseId
        ? selectedSeason.courses.find((c) => c.id === selectedCourseId)
        : null;

    // Reset course selection when changing season
    const handleSeasonChange = (seasonId: string) => {
        setSelectedSeasonId(seasonId);
        setSelectedCourseId(null);
    };

    return (
        <div className="mx-auto max-w-5xl px-4 py-6 md:px-6 lg:px-8">
            <div className="flex flex-col gap-6">
                {/* Breadcrumb */}
                <Breadcrumbs type="text" divider="chevron">
                    <Breadcrumbs.Item href="/lobbies">
                        <HomeLine className="size-4" />
                    </Breadcrumbs.Item>
                    <Breadcrumbs.Item href={`/lobbies/${lobbyId}/hub`}>{data.lobbyName}</Breadcrumbs.Item>
                    <Breadcrumbs.Item isCurrent>Classements</Breadcrumbs.Item>
                </Breadcrumbs>

                {/* Header */}
                <div className="flex flex-col items-center gap-6">
                    <h1 className="text-2xl font-bold text-primary">Classements</h1>
                    <SeasonTabs
                        seasons={data.seasons}
                        selectedSeasonId={selectedSeasonId}
                        onSelect={handleSeasonChange}
                    />
                </div>

                {/* Champion banner for completed seasons */}
                <ChampionBanner season={selectedSeason} />

                {/* Stats */}
                <StatsCards season={selectedSeason} />

                {/* Course selector + Title */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-primary">
                            {selectedCourse ? selectedCourse.name : "Classement général"}
                        </h2>
                        {selectedCourse && (
                            <p className="text-sm text-tertiary">
                                {new Date(selectedCourse.date).toLocaleDateString("fr-FR", {
                                    weekday: "long",
                                    day: "numeric",
                                    month: "long",
                                })}
                                {selectedCourse.winnerName && ` • Vainqueur: ${selectedCourse.winnerName}`}
                            </p>
                        )}
                    </div>
                    <CourseSelector
                        courses={selectedSeason.courses}
                        selectedCourseId={selectedCourseId}
                        onSelect={setSelectedCourseId}
                    />
                </div>

                {/* Ranking table */}
                <RankingTable
                    rankings={displayedRankings}
                    showRacesWon={!selectedCourseId}
                    isSeasonRanking={!selectedCourseId}
                />
            </div>
        </div>
    );
}