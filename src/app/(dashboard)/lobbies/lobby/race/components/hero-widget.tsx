"use client";

import { Clock } from "@untitledui/icons";
import { motion } from "motion/react";
import type { RaceData } from "../types";
import { getTimeRemaining } from "../utils";

interface HeroWidgetProps {
    race: RaceData;
    onClick: () => void;
}

export function HeroWidget({ race, onClick }: HeroWidgetProps) {
    const { display: timeRemaining } = getTimeRemaining(race.endsAt);
    const visualProgress = Math.max(5, Math.min(95, race.myProgress));

    return (
        <motion.div
            layoutId={`race-card-${race.id}`}
            onClick={onClick}
            className="relative cursor-pointer overflow-hidden rounded-3xl bg-gray-950 p-5 !shadow-2xl transition-shadow hover:shadow-brand-500/20"
            whileHover={{ scale: 1.005 }}
            whileTap={{ scale: 0.995 }}
        >
            {/* Subtle gradient overlay */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-600/5 via-transparent to-purple-600/5" />

            {/* Content */}
            <div className="relative flex flex-col gap-4">
                {/* Header row */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <motion.h1
                            layoutId={`race-title-${race.id}`}
                            className="text-lg font-bold text-white"
                        >
                            {race.courseName}
                        </motion.h1>
                        {race.isLive && (
                            <motion.div
                                layoutId={`race-live-${race.id}`}
                                className="flex items-center gap-1.5 rounded-full bg-green-500/20 px-2 py-0.5"
                            >
                                <span className="relative flex size-1.5">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                                    <span className="relative inline-flex size-1.5 rounded-full bg-green-500" />
                                </span>
                                <span className="text-xs font-semibold text-green-400">Live</span>
                            </motion.div>
                        )}
                        <motion.span
                            layoutId={`race-salon-${race.id}`}
                            className="text-sm text-gray-500"
                        >
                            {race.salonName}
                        </motion.span>
                    </div>

                    {/* Timer */}
                    <motion.div
                        layoutId={`race-timer-${race.id}`}
                        className="flex items-center gap-2 rounded-xl bg-white/5 px-2.5 py-1.5"
                    >
                        <Clock className="size-3.5 text-gray-400" />
                        <span className="font-mono text-sm font-medium text-white">
                            {timeRemaining}
                        </span>
                    </motion.div>
                </div>

                {/* Race Track with % on the right */}
                <div className="flex items-center gap-4">
                    {/* Track container */}
                    <motion.div layoutId={`race-track-${race.id}`} className="relative flex-1">
                        {/* Start line - green */}
                        <div className="absolute -left-0.5 top-0 z-10 h-full w-1 rounded-full bg-green-500" />

                        {/* Finish line - red */}
                        <div className="absolute -right-0.5 top-0 z-10 h-full w-1 rounded-full bg-red-500" />

                        {/* Track */}
 <div className="relative mx-1 h-12 rounded-xl bg-gray-800/60">
    {/* Progress fill - celui-ci garde overflow-hidden */}
    <motion.div
        className="absolute inset-y-0 left-0 overflow-hidden rounded-xl bg-brand-600/40"
        initial={{ width: 0 }}
        animate={{ width: `${visualProgress}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
    />

    {/* Car */}
    <motion.div
        className="absolute top-1/2 z-10 -translate-y-1/2"
        initial={{ left: "0%", opacity: 0 }}
        animate={{ left: `${visualProgress}%`, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        style={{ marginLeft: "-48px" }} // offset pour centrer la voiture sur sa position
    >
        <img
            src="/car.png"
            alt="Ma voiture"
            className="h-26 w-auto drop-shadow-lg"
        />
    </motion.div>
</div>
                    </motion.div>

                    {/* Progress % */}
                    <motion.div layoutId={`race-progress-${race.id}`} className="flex items-baseline gap-0.5">
                        <span className="font-mono text-3xl font-bold text-white">
                            {race.myProgress}
                        </span>
                        <span className="text-sm text-gray-500">%</span>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}