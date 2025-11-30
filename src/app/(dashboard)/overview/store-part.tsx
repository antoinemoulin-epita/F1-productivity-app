"use client";

import React from "react";
import { motion } from "framer-motion";
import { Lock01 } from "@untitledui/icons";
import { cx } from "@/utils/cx";

interface LootboxItem {
    type: "bronze" | "silver" | "gold";
    price: number;
    imageUrl: string;
}

interface MiniLootboxRowProps {
    item: LootboxItem;
    index: number;
    onBuy?: (type: string) => void;
}

interface StorePartProps {
    isLocked?: boolean;
    lockedMessage?: string;
}

const tierConfig = {
    bronze: {
        label: "Bronze",
        badgeClasses: "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300",
        buttonClasses: "bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-400",
    },
    silver: {
        label: "Silver",
        badgeClasses: "bg-slate-100 text-slate-600 dark:bg-slate-500/20 dark:text-slate-300",
        buttonClasses: "bg-slate-700 hover:bg-slate-800 dark:bg-slate-500 dark:hover:bg-slate-400",
    },
    gold: {
        label: "Gold",
        badgeClasses: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
        buttonClasses: "bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-400",
    },
};

const MiniLootboxRow = ({ item, index, onBuy }: MiniLootboxRowProps) => {
    const theme = tierConfig[item.type];

    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            className="group flex items-center gap-5 px-4 py-4 transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-700/30"
        >
            <div className="relative flex size-16 flex-shrink-0 items-center justify-center">
                <img
                    src={item.imageUrl}
                    alt={`${item.type} lootbox`}
                    className="size-16 object-contain transition-transform duration-300 group-hover:scale-110"
                />
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-2">
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

                <button
                    onClick={() => onBuy?.(item.type)}
                    className={cx(
                        "flex w-full items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold text-white transition-all duration-200 active:scale-[0.98]",
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

const ArrowIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
);

const ChevronRightIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
);

const StorePart = ({ isLocked = false, lockedMessage = "Bientôt disponible" }: StorePartProps) => {
    const lootboxes: LootboxItem[] = [
        { type: "bronze", price: 10, imageUrl: "/bronze.png" },
        { type: "silver", price: 20, imageUrl: "/silver.png" },
        { type: "gold", price: 50, imageUrl: "/gold.png" },
    ];

    const handleBuy = (type: string) => {
        if (isLocked) return;
        console.log(`Buying ${type} lootbox`);
    };

    const handleClaimFreeBox = () => {
        if (isLocked) return;
        console.log("Claiming free box");
    };

    return (
        <div 
            className={cx(
                "h-full rounded-2xl bg-gray-100 p-3 ring-1 ring-primary/10 transition-all duration-300 dark:bg-gray-900",
                isLocked ? "cursor-not-allowed" : "hover:ring-primary/20"
            )}
        >
            <div className="relative flex h-full flex-col overflow-hidden rounded-xl bg-white dark:bg-gray-800">
                <div className={cx(
                    "flex h-full flex-col transition-all duration-300",
                    isLocked && "scale-[1.02] blur-[6px] grayscale-[30%]"
                )}>
                    <div className="shrink-0 flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-gray-700/50">
                        <h3 className="text-sm font-semibold text-primary">Boutique</h3>
                        <button 
                            className="group flex items-center gap-0.5 text-xs font-medium text-tertiary transition-colors hover:text-primary"
                            disabled={isLocked}
                        >
                            <span>Tout voir</span>
                            <ChevronRightIcon className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                        </button>
                    </div>

                    <div className="min-h-0 flex-1 overflow-y-auto">
                        {lootboxes.map((item, index) => (
                            <React.Fragment key={item.type}>
                                <MiniLootboxRow
                                    item={item}
                                    index={index}
                                    onBuy={isLocked ? undefined : handleBuy}
                                />
                                {index < lootboxes.length - 1 && (
                                    <div className="h-px bg-gray-100 dark:bg-gray-700/50" />
                                )}
                            </React.Fragment>
                        ))}
                    </div>

                    <button
                        onClick={handleClaimFreeBox}
                        disabled={isLocked}
                        className="shrink-0 group flex items-center justify-between border-t border-gray-100 px-4 py-3 transition-colors hover:bg-gray-50 dark:border-gray-700/50 dark:hover:bg-gray-700/30"
                    >
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <span className="text-base">🎁</span>
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

                {isLocked && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 bg-black/40 backdrop-blur-[2px]"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 20 }}
                            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm"
                        >
                            <Lock01 className="h-7 w-7 text-white/90" />
                        </motion.div>
                        <motion.div
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-col items-center gap-1"
                        >
                            <span className="text-sm font-semibold text-white">
                                {lockedMessage}
                            </span>
                            <span className="text-xs text-white/60">
                                Revenez plus tard
                            </span>
                        </motion.div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default StorePart;