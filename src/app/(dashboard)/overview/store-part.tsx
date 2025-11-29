"use client";

import React from "react";
import { motion } from "framer-motion";
import { cx } from "@/utils/cx";

// Types
interface LootboxItem {
    type: "bronze" | "silver" | "gold";
    price: number;
    imageUrl: string;
}

interface MiniLootboxCardProps {
    item: LootboxItem;
    index: number;
    onBuy?: (type: string) => void;
}

// Configuration des tiers
const tierConfig = {
    bronze: {
        label: "Bronze",
        badgeClasses: "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300",
        ringHover: "hover:ring-orange-300 dark:hover:ring-orange-500/40",
        buttonClasses: "bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-400",
        glowColor: "group-hover:shadow-orange-500/20",
    },
    silver: {
        label: "Silver",
        badgeClasses: "bg-slate-100 text-slate-600 dark:bg-slate-500/20 dark:text-slate-300",
        ringHover: "hover:ring-slate-400 dark:hover:ring-slate-500/40",
        buttonClasses: "bg-slate-700 hover:bg-slate-800 dark:bg-slate-500 dark:hover:bg-slate-400",
        glowColor: "group-hover:shadow-slate-500/20",
    },
    gold: {
        label: "Gold",
        badgeClasses: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
        ringHover: "hover:ring-amber-300 dark:hover:ring-amber-500/40",
        buttonClasses: "bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-400",
        glowColor: "group-hover:shadow-amber-500/20",
    },
};

// Mini Lootbox Card Component
const MiniLootboxCard = ({ item, index, onBuy }: MiniLootboxCardProps) => {
    const theme = tierConfig[item.type];

    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            className={cx(
                "group relative flex items-center gap-3 rounded-xl p-2.5",
                "bg-white dark:bg-gray-800",
                "border border-gray-200 dark:border-gray-700/50",
                "ring-1 ring-transparent transition-all duration-300",
                theme.ringHover,
                "hover:shadow-lg",
                theme.glowColor,
            )}
        >
            {/* Image container */}
            <div className="relative flex size-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-800">
                <img
                    src={item.imageUrl}
                    alt={`${item.type} lootbox`}
                    className="size-12 object-contain transition-transform duration-300 group-hover:scale-110"
                />
            </div>

            {/* Info section */}
            <div className="flex min-w-0 flex-1 flex-col gap-1">
                {/* Badge + Price row */}
                <div className="flex items-center justify-between gap-2">
                    <span
                        className={cx(
                            "rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                            theme.badgeClasses,
                        )}
                    >
                        {theme.label}
                    </span>
                    <div className="flex items-baseline gap-0.5">
                        <span className="font-mono text-sm font-bold text-primary">{item.price}</span>
                        <span className="text-[10px] font-medium text-tertiary">RC</span>
                    </div>
                </div>

                {/* Buy button */}
                <button
                    onClick={() => onBuy?.(item.type)}
                    className={cx(
                        "flex w-full items-center justify-center gap-1.5 rounded-lg py-1.5",
                        "text-xs font-semibold text-white",
                        "transition-all duration-200 active:scale-[0.98]",
                        theme.buttonClasses,
                    )}
                >
                    <span>Acheter</span>
                    <ArrowIcon className="size-3" />
                </button>
            </div>
        </motion.div>
    );
};

// Arrow Icon
const ArrowIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
);

// Chevron Icon
const ChevronRightIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
);

// Main StorePart Component
const StorePart = () => {
    const lootboxes: LootboxItem[] = [
        { type: "bronze", price: 10, imageUrl: "/bronze.png" },
        { type: "silver", price: 20, imageUrl: "/silver.png" },
        { type: "gold", price: 50, imageUrl: "/gold.png" },
    ];

    const handleBuy = (type: string) => {
        console.log(`Buying ${type} lootbox`);
    };

    const handleClaimFreeBox = () => {
        console.log("Claiming free box");
    };

    return (
        <div className="h-full rounded-2xl bg-gray-100 p-3 ring-1 ring-primary/10 transition-all duration-300 hover:ring-primary/20 dark:bg-gray-900">
            <div className="flex h-full flex-col overflow-hidden rounded-xl bg-white dark:bg-gray-800">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-gray-700/50">
                    <h3 className="text-sm font-semibold text-primary">Boutique</h3>
                    <button className="group flex items-center gap-0.5 text-xs font-medium text-tertiary transition-colors hover:text-primary">
                        <span>Tout voir</span>
                        <ChevronRightIcon className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                    </button>
                </div>

                {/* Lootbox list */}
                <div className="flex flex-1 flex-col justify-around bg-gray-50/50 p-3 dark:bg-gray-900/30">
                    {lootboxes.map((item, index) => (
                        <MiniLootboxCard key={item.type} item={item} index={index} onBuy={handleBuy} />
                    ))}
                </div>

                {/* Footer - Free box (sobre et élégant) */}
                <button
                    onClick={handleClaimFreeBox}
                    className="group flex items-center justify-between border-t border-gray-100 px-4 py-3 transition-colors hover:bg-gray-50 dark:border-gray-700/50 dark:hover:bg-gray-700/30"
                >
                    <div className="flex items-center gap-3">
                        {/* Gift icon avec dot indicateur */}
                        <div className="relative">
                            <span className="text-base">🎁</span>
                            {/* Pulse dot */}
                            <span className="absolute -top-0.5 -right-1 flex size-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                                <span className="relative inline-flex size-2 rounded-full bg-green-500" />
                            </span>
                        </div>
                        <div className="flex flex-col items-start">
                            <span className="text-xs font-medium text-primary">Box gratuite</span>
                            <span className="text-[10px] text-tertiary">Disponible</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-medium text-tertiary transition-colors group-hover:text-primary">
                        <span>Réclamer</span>
                        <ChevronRightIcon className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                    </div>
                </button>
            </div>
        </div>
    );
};

export default StorePart;