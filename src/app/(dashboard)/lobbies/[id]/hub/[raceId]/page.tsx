"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { HomeLine, AlertCircle } from "@untitledui/icons";
import { Breadcrumbs } from "@/components/application/breadcrumbs/breadcrumbs";
import { HeroWidget } from "./components/hero-widget";
import { RaceModal } from "./components/race-modal";
import { TasksList } from "./components/tasks-list";
import { Leaderboard } from "./components/leaderboard";
import { getRaceById } from "./mock-data";
import type { RaceData } from "./types";

export default function RacePage() {
    const params = useParams();
    const router = useRouter();
    const lobbyId = params.id as string;
    const raceId = params.raceId as string;

    const [race, setRace] = useState<RaceData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            const raceData = getRaceById(raceId);
            setRace(raceData);
            setIsLoading(false);
        }, 300);

        return () => clearTimeout(timer);
    }, [raceId]);

    const handleToggleTask = (taskId: string) => {
        if (!race) return;
        setRace((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                tasks: prev.tasks.map((task) =>
                    task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
                ),
            };
        });
    };

    const handleToggleSubtask = (taskId: string, subtaskId: string) => {
        if (!race) return;
        setRace((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                tasks: prev.tasks.map((task) =>
                    task.id === taskId && task.subtasks
                        ? {
                              ...task,
                              subtasks: task.subtasks.map((sub) =>
                                  sub.id === subtaskId
                                      ? { ...sub, isCompleted: !sub.isCompleted }
                                      : sub
                              ),
                          }
                        : task
                ),
            };
        });
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-8">
                <div className="flex flex-col gap-5">
                    <div className="h-5 w-64 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                    <div className="h-32 animate-pulse rounded-3xl bg-gray-200 dark:bg-gray-700" />
                    <div className="flex flex-col gap-5 lg:flex-row">
                        <div className="h-96 flex-1 animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-700" />
                        <div className="h-96 w-full animate-pulse rounded-2xl bg-gray-200 lg:w-72 dark:bg-gray-700" />
                    </div>
                </div>
            </div>
        );
    }

    // Not found state
    if (!race) {
        return (
            <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-8">
                <div className="flex flex-col gap-5">
                    <Breadcrumbs type="text" divider="chevron">
                        <Breadcrumbs.Item href="/lobbies">
                            <HomeLine className="size-4" />
                        </Breadcrumbs.Item>
                         <Breadcrumbs.Item isCurrent>Introuvable</Breadcrumbs.Item>
                    </Breadcrumbs>

                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="flex size-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                            <AlertCircle className="size-8 text-red-500" />
                        </div>
                        <h1 className="mt-4 text-xl font-bold text-primary">Course introuvable</h1>
                        <p className="mt-2 max-w-sm text-sm text-tertiary">
                            La course avec l'identifiant "{raceId}" n'existe pas ou a été supprimée.
                        </p>
                        <button
                            type="button"
                            onClick={() => router.push(`/lobbies/${lobbyId}/races`)}
                            className="mt-6 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
                        >
                            Retour aux courses
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-8">
                <div className="flex flex-col gap-5">
                    {/* Breadcrumb */}
                    <Breadcrumbs type="text" divider="chevron">
                        <Breadcrumbs.Item href="/lobbies">
                            <HomeLine className="size-4" />
                        </Breadcrumbs.Item>
                        <Breadcrumbs.Item href={`/lobbies/${lobbyId}/hub`}>
                            {race.salonName}
                        </Breadcrumbs.Item>
                         <Breadcrumbs.Item isCurrent>{race.courseName}</Breadcrumbs.Item>
                    </Breadcrumbs>

                    <HeroWidget race={race} onClick={() => setIsModalOpen(true)} />

                    <div className="flex flex-col gap-5 lg:flex-row">
                        <div className="min-h-[400px] flex-1 lg:min-h-[calc(100vh-20rem)]">
                            <TasksList
                                tasks={race.tasks}
                                onToggleTask={handleToggleTask}
                                onToggleSubtask={handleToggleSubtask}
                            />
                        </div>

                        <div className="min-h-[400px] w-full lg:w-72 lg:min-h-[calc(100vh-20rem)]">
                            <Leaderboard participants={race.participants} />
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm"
                        onClick={() => setIsModalOpen(false)}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isModalOpen && (
                    <RaceModal race={race} onClose={() => setIsModalOpen(false)} />
                )}
            </AnimatePresence>
        </>
    );
}