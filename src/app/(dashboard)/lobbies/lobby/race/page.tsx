"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { HeroWidget } from "./components/hero-widget";
import { RaceModal } from "./components/race-modal";
import { TasksList } from "./components/tasks-list";
import { Leaderboard } from "./components/leaderboard";
import { MOCK_RACE } from "./mock-data";

export default function RacePage() {
    const [race, setRace] = useState(MOCK_RACE);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleToggleTask = (taskId: string) => {
        setRace((prev) => ({
            ...prev,
            tasks: prev.tasks.map((task) =>
                task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
            ),
        }));
    };

    const handleToggleSubtask = (taskId: string, subtaskId: string) => {
        setRace((prev) => ({
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
        }));
    };

    return (
        <>
            <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-8">
                <div className="flex flex-col gap-5">
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