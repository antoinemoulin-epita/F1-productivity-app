"use client";

import { Trophy01, Users01 } from "@untitledui/icons";
import { motion } from "motion/react";
import { cx } from "@/utils/cx";
import type { Participant } from "../types";

interface LeaderboardProps {
    participants: Participant[];
}

export function Leaderboard({ participants }: LeaderboardProps) {
    return (
        <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-gray-100 p-3 ring-1 ring-primary/10 dark:bg-gray-900">
            <div className="flex h-full flex-col overflow-hidden rounded-xl bg-white dark:bg-gray-800">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-700/50">
                    <div className="flex items-center gap-2">
                        <Trophy01 className="size-5 text-amber-500" />
                        <h2 className="text-base font-semibold text-primary">Classement</h2>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-tertiary">
                        <Users01 className="size-4" />
                        <span>{participants.length}</span>
                    </div>
                </div>

                {/* Participants list */}
                <div className="flex-1 overflow-y-auto">
                    <div className="flex flex-col">
                        {participants.map((participant, index) => (
                            <motion.div
                                key={participant.id}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className={cx(
                                    "flex items-center gap-3 border-b border-gray-50 px-4 py-3 last:border-0 dark:border-gray-700/30",
                                    participant.isCurrentUser && "bg-brand-50/50 dark:bg-brand-950/20"
                                )}
                            >
                                {/* Position badge */}
                                <div
                                    className={cx(
                                        "flex size-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold",
                                        participant.position === 1
                                            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400"
                                            : participant.position === 2
                                              ? "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                                              : participant.position === 3
                                                ? "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-400"
                                                : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                                    )}
                                >
                                    {participant.position}
                                </div>

                                {/* Name */}
                                <span
                                    className={cx(
                                        "flex-1 truncate text-sm font-medium",
                                        participant.isCurrentUser
                                            ? "text-brand-700 dark:text-brand-400"
                                            : participant.position === 1
                                              ? "text-amber-700 dark:text-amber-400"
                                              : "text-primary"
                                    )}
                                >
                                    {participant.isCurrentUser ? "Toi" : participant.username}
                                </span>

                                {/* Progress bar mini */}
                                <div className="flex w-16 items-center gap-2">
                                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${participant.progress}%` }}
                                            transition={{ delay: 0.2 + index * 0.05, duration: 0.5 }}
                                            className={cx(
                                                "h-full rounded-full",
                                                participant.isCurrentUser
                                                    ? "bg-brand-500"
                                                    : participant.position === 1
                                                      ? "bg-amber-500"
                                                      : "bg-gray-400 dark:bg-gray-500"
                                            )}
                                        />
                                    </div>
                                </div>

                                {/* Progress percentage */}
                                <span
                                    className={cx(
                                        "w-10 text-right font-mono text-xs",
                                        participant.isCurrentUser
                                            ? "text-brand-600 dark:text-brand-400"
                                            : "text-tertiary"
                                    )}
                                >
                                    {participant.progress}%
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}