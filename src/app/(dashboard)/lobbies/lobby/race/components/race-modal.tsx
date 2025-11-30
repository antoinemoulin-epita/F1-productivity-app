"use client";

import { useRef, useEffect, useState, type RefObject } from "react";
import { Clock, Trophy01, XClose } from "@untitledui/icons";
import { motion } from "motion/react";
import { useOnClickOutside } from "usehooks-ts";
import { cx } from "@/utils/cx";
import type { RaceData, Participant } from "../types";
import { getTimeRemaining } from "../utils";

interface RaceModalProps {
    race: RaceData;
    onClose: () => void;
}

export function RaceModal({ race, onClose }: RaceModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const [timeLeft, setTimeLeft] = useState(getTimeRemaining(race.endsAt));

    useOnClickOutside(modalRef as RefObject<HTMLElement>, onClose);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(getTimeRemaining(race.endsAt));
        }, 1000);
        return () => clearInterval(interval);
    }, [race.endsAt]);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [onClose]);

    const sortedParticipants = [...race.participants].sort((a, b) => b.progress - a.progress);
    const leader = sortedParticipants[0];

    return (
        <motion.div
            ref={modalRef}
            layoutId={`race-card-${race.id}`}
            className="fixed inset-4 z-50 flex flex-col overflow-hidden rounded-[2rem] bg-gray-950 lg:inset-8"
            style={{
                boxShadow: `
                    0 0 0 1px rgba(255,255,255,0.03),
                    0 4px 6px -1px rgba(0,0,0,0.4),
                    0 20px 25px -5px rgba(0,0,0,0.5),
                    0 40px 60px -12px rgba(0,0,0,0.6)
                `,
            }}
        >
            {/* Background */}
            <div className="pointer-events-none absolute inset-0">
                <div
                    className="absolute inset-0 opacity-[0.015]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                    }}
                />
                <div
                    className="absolute -top-1/2 left-1/2 h-full w-[200%] -translate-x-1/2"
                    style={{
                        background: "radial-gradient(ellipse at center top, rgba(255,255,255,0.02) 0%, transparent 60%)",
                    }}
                />
            </div>

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-3">
                    <motion.h1
                        layoutId={`race-title-${race.id}`}
                        className="text-lg font-semibold tracking-tight text-white"
                    >
                        {race.courseName}
                    </motion.h1>

                    {race.isLive && (
                        <motion.div
                            layoutId={`race-live-${race.id}`}
                            className="flex items-center gap-1.5"
                        >
                            <span className="relative flex size-1.5">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex size-1.5 rounded-full bg-emerald-400" />
                            </span>
                            <span className="text-xs font-medium text-emerald-400">Live</span>
                        </motion.div>
                    )}

                    <motion.span
                        layoutId={`race-salon-${race.id}`}
                        className="text-sm text-white/40"
                    >
                        {race.salonName}
                    </motion.span>
                </div>

                <div className="flex items-center gap-3">
                    <motion.div
                        layoutId={`race-timer-${race.id}`}
                        className="flex items-center gap-2 rounded-full bg-white/[0.04] px-3 py-1.5"
                    >
                        <Clock className="size-3.5 text-white/40" />
                        <span className="font-mono text-sm tabular-nums text-white/80">
                            {timeLeft.days > 0 && `${timeLeft.days}j `}
                            {String(timeLeft.hours).padStart(2, "0")}:
                            {String(timeLeft.minutes).padStart(2, "0")}
                            {timeLeft.days === 0 && `:${String(timeLeft.seconds).padStart(2, "0")}`}
                        </span>
                    </motion.div>

                    <button
                        onClick={onClose}
                        className="flex size-8 items-center justify-center rounded-full text-white/40 transition-colors hover:bg-white/[0.04] hover:text-white/60"
                    >
                        <XClose className="size-4" />
                    </button>
                </div>
            </div>

            <div className="mx-6 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

            {/* Main Content */}
            <div className="relative z-10 flex flex-1 flex-col gap-4 overflow-auto p-6">
                {/* Leader badge */}
                <div className="flex justify-center">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/[0.04] px-4 py-2">
                        <div className="flex size-5 items-center justify-center rounded-full bg-amber-500/20">
                            <Trophy01 className="size-3 text-amber-400" />
                        </div>
                        <span className="text-sm font-medium text-white/80">{leader.username}</span>
                        <span className="text-sm tabular-nums text-white/40">{leader.progress}%</span>
                    </div>
                </div>

                {/* Race Track */}
                <motion.div layoutId={`race-track-${race.id}`} className="relative flex-1">
                    <div
                        className="relative h-full rounded-2xl bg-white/[0.02] p-5"
                        style={{ boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.03)" }}
                    >
                        {/* Track markers */}
                        <div className="mb-4 flex items-center justify-between px-1">
                            <div className="flex items-center gap-2">
                                <div className="size-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                                <span className="text-[10px] font-medium uppercase tracking-widest text-white/30">
                                    Start
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-medium uppercase tracking-widest text-white/30">
                                    Finish
                                </span>
                                <div className="size-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.2)]" />
                            </div>
                        </div>

                        {/* Lanes container */}
                        <div className="relative">
                            <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-white/[0.03]" />
                            <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-emerald-500/40 via-emerald-500/20 to-emerald-500/40" />
                            <div className="absolute right-0 top-0 h-full w-px bg-gradient-to-b from-white/20 via-white/10 to-white/20" />

                            <div className="relative flex flex-col gap-3 px-2">
                                {sortedParticipants.map((participant, index) => (
                                    <RaceLane
                                        key={participant.id}
                                        participant={participant}
                                        index={index}
                                        isCurrentUser={participant.isCurrentUser ?? false}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}

interface RaceLaneProps {
    participant: Participant;
    index: number;
    isCurrentUser: boolean;
}

function RaceLane({ participant, index, isCurrentUser = false }: RaceLaneProps) {
    const isLeader = index === 0;

    return (
        <div className="group relative">
            <div
                className={cx(
                    "relative h-16 rounded-xl transition-colors",
                    isCurrentUser ? "bg-white/[0.04]" : "bg-transparent hover:bg-white/[0.02]"
                )}
            >
                {/* Progress track */}
                <div className="absolute inset-x-3 inset-y-2 rounded-lg bg-white/[0.03]" />

                {/* Progress fill */}
                <motion.div
                    className="absolute inset-y-2 left-3 rounded-lg"
                    initial={{ width: 0 }}
                    animate={{ width: `calc(${participant.progress}% - 24px)` }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    style={{
                        background: isLeader
                            ? "linear-gradient(90deg, rgba(251,191,36,0.15) 0%, rgba(251,191,36,0.05) 100%)"
                            : isCurrentUser
                              ? "linear-gradient(90deg, rgba(99,102,241,0.15) 0%, rgba(99,102,241,0.05) 100%)"
                              : "linear-gradient(90deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
                    }}
                />

                {/* Car icon */}
                <motion.div
                    className="absolute top-1/2 -translate-y-1/2"
                    initial={{ left: "12px" }}
                    animate={{ left: `calc(${participant.progress}% - 12px)` }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                >
                     
                       <img src="/car.png" alt="" className="w-20" />
                 </motion.div>

                {/* Position badge */}
                <div className="absolute left-6 top-1/2 -translate-y-1/2">
                    <span
                        className={cx(
                            "text-xs font-bold tabular-nums",
                            isLeader ? "text-amber-400" : "text-white/30"
                        )}
                    >
                        {index + 1}
                    </span>
                </div>

                {/* User info */}
                <div className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center gap-3">
                    <span
                        className={cx(
                            "text-sm font-medium",
                            isLeader ? "text-amber-400" : isCurrentUser ? "text-white" : "text-white/60"
                        )}
                    >
                        {participant.username}
                    </span>
                    <span className="min-w-[3ch] text-right font-mono text-sm tabular-nums text-white/40">
                        {participant.progress}%
                    </span>
                </div>
            </div>
        </div>
    );
}