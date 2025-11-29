// lootbox-card.tsx
"use client";

import { useState } from "react";
import { Box, ChevronDown, Gift01 } from "@untitledui/icons";
import { AnimatePresence, motion } from "motion/react";

// lootbox-card.tsx

// lootbox-card.tsx

// lootbox-card.tsx

// lootbox-card.tsx

// lootbox-card.tsx

// lootbox-card.tsx

type LootboxType = "bronze" | "silver" | "gold";

interface LootboxData {
    type: LootboxType;
    price: number;
    probabilities: {
        common: number;
        rare: number;
        epic: number;
        legendary: number;
    };
}

const lootboxConfig: Record<
    LootboxType,
    {
        name: string;
        glowColor: string;
        accentColor: string;
        buttonGradient: string;
        boxColors: {
            primary: string;
            secondary: string;
            accent: string;
            glow: string;
        };
    }
> = {
    bronze: {
        name: "Box Bronze",
        glowColor: "rgba(217, 119, 6, 0.3)",
        accentColor: "text-amber-500",
        buttonGradient: "from-amber-500 to-amber-600",
        boxColors: {
            primary: "#d97706",
            secondary: "#92400e",
            accent: "#fbbf24",
            glow: "rgba(217, 119, 6, 0.4)",
        },
    },
    silver: {
        name: "Box Argent",
        glowColor: "rgba(148, 163, 184, 0.3)",
        accentColor: "text-slate-300",
        buttonGradient: "from-slate-400 to-slate-500",
        boxColors: {
            primary: "#94a3b8",
            secondary: "#64748b",
            accent: "#e2e8f0",
            glow: "rgba(148, 163, 184, 0.5)",
        },
    },
    gold: {
        name: "Box Or",
        glowColor: "rgba(250, 204, 21, 0.3)",
        accentColor: "text-yellow-400",
        buttonGradient: "from-yellow-400 to-yellow-500",
        boxColors: {
            primary: "#eab308",
            secondary: "#ca8a04",
            accent: "#fde047",
            glow: "rgba(250, 204, 21, 0.5)",
        },
    },
};

const lootboxes: LootboxData[] = [
    {
        type: "bronze",
        price: 10,
        probabilities: { common: 86, rare: 8, epic: 4, legendary: 2 },
    },
    {
        type: "silver",
        price: 20,
        probabilities: { common: 72, rare: 16, epic: 8, legendary: 4 },
    },
    {
        type: "gold",
        price: 50,
        probabilities: { common: 44, rare: 32, epic: 16, legendary: 8 },
    },
];

// Composant SVG de la lootbox stylisée
function LootboxIcon({ colors, isHovered }: { colors: typeof lootboxConfig.bronze.boxColors; isHovered: boolean }) {
    return (
        <motion.svg
            viewBox="0 0 120 100"
            className="h-full w-full drop-shadow-2xl"
            animate={{
                y: isHovered ? -8 : 0,
                scale: isHovered ? 1.05 : 1,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            {/* Glow effect */}
            <defs>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
                <linearGradient id={`boxGrad-${colors.primary}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={colors.accent} />
                    <stop offset="50%" stopColor={colors.primary} />
                    <stop offset="100%" stopColor={colors.secondary} />
                </linearGradient>
            </defs>

            {/* Back panel */}
            <motion.rect x="15" y="20" width="90" height="55" rx="8" fill={colors.secondary} opacity="0.8" />

            {/* Main box body */}
            <motion.rect x="10" y="35" width="100" height="55" rx="10" fill={`url(#boxGrad-${colors.primary})`} filter="url(#glow)" />

            {/* Lid */}
            <motion.path
                d="M10 40 L10 30 Q10 20 20 20 L100 20 Q110 20 110 30 L110 40 Z"
                fill={colors.primary}
                animate={{
                    d: isHovered ? "M10 40 L10 25 Q10 10 20 5 L100 5 Q110 10 110 25 L110 40 Z" : "M10 40 L10 30 Q10 20 20 20 L100 20 Q110 20 110 30 L110 40 Z",
                    y: isHovered ? -5 : 0,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
            />

            {/* Lid top highlight */}
            <motion.rect
                x="25"
                y="22"
                width="70"
                height="8"
                rx="4"
                fill={colors.accent}
                opacity="0.6"
                animate={{
                    y: isHovered ? 12 : 22,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
            />

            {/* Center gem/lock */}
            <motion.g
                animate={{
                    scale: isHovered ? [1, 1.2, 1] : 1,
                }}
                transition={{
                    duration: 0.6,
                    repeat: isHovered ? Infinity : 0,
                    repeatDelay: 0.3,
                }}
            >
                <polygon points="60,45 75,55 75,70 60,80 45,70 45,55" fill={colors.accent} opacity="0.9" />
                <polygon points="60,50 70,57 70,67 60,74 50,67 50,57" fill="#1e293b" opacity="0.8" />
            </motion.g>

            {/* Side accents */}
            <rect x="12" y="50" width="4" height="25" rx="2" fill={colors.accent} opacity="0.5" />
            <rect x="104" y="50" width="4" height="25" rx="2" fill={colors.accent} opacity="0.5" />

            {/* Sparkles when hovered */}
            <AnimatePresence>
                {isHovered && (
                    <>
                        <motion.circle
                            cx="30"
                            cy="30"
                            r="3"
                            fill={colors.accent}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1, repeat: Infinity }}
                        />
                        <motion.circle
                            cx="90"
                            cy="25"
                            r="2"
                            fill={colors.accent}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1, delay: 0.3, repeat: Infinity }}
                        />
                        <motion.circle
                            cx="100"
                            cy="45"
                            r="2.5"
                            fill={colors.accent}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1, delay: 0.6, repeat: Infinity }}
                        />
                    </>
                )}
            </AnimatePresence>
        </motion.svg>
    );
}

interface LootboxCardProps {
    lootbox: LootboxData;
    userBalance: number;
    onPurchase: (type: LootboxType) => void;
    isPurchasing?: boolean;
}

export function LootboxCard({ lootbox, userBalance, onPurchase, isPurchasing = false }: LootboxCardProps) {
    const [showProbabilities, setShowProbabilities] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const config = lootboxConfig[lootbox.type];
    const canAfford = userBalance >= lootbox.price;

    return (
        <motion.div
            className="relative"
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
            {/* Glow background */}
            <motion.div
                className="absolute -inset-2 rounded-3xl opacity-0 blur-xl"
                style={{ background: config.glowColor }}
                animate={{ opacity: isHovered ? 0.8 : 0 }}
                transition={{ duration: 0.3 }}
            />

            <motion.div
                className="relative overflow-visible rounded-2xl bg-[#1a1f35] shadow-xl"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
                {/* Zone de la box - déborde en haut */}
                <div className="relative -mt-8 flex h-[140px] items-center justify-center px-6 pt-8">
                    {/* Glow derrière la box */}
                    <motion.div
                        className="absolute inset-x-8 top-8 bottom-0 rounded-full blur-2xl"
                        style={{ background: config.boxColors.glow }}
                        animate={{ opacity: isHovered ? 0.6 : 0.3 }}
                    />

                    {/* Lootbox SVG */}
                    <div className="relative z-0 h-[100px] w-[120px]">
                        <LootboxIcon colors={config.boxColors} isHovered={isHovered} />
                    </div>
                </div>

                {/* Contenu */}
                <div className="px-4 pt-2 pb-4 text-center">
                    {/* Nom */}
                    <h3 className="text-lg font-bold text-white">{config.name}</h3>

                    {/* Toggle probabilités */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowProbabilities(!showProbabilities);
                        }}
                        className="mt-1 inline-flex items-center gap-1 text-xs text-slate-400 transition-colors hover:text-slate-300"
                    >
                        <span>Probabilités</span>
                        <motion.div animate={{ rotate: showProbabilities ? 180 : 0 }} transition={{ duration: 0.2 }}>
                            <ChevronDown className="h-3 w-3" />
                        </motion.div>
                    </button>

                    {/* Probabilités déroulantes */}
                    <AnimatePresence>
                        {showProbabilities && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                            >
                                <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-500">Common</span>
                                        <span className="font-medium text-slate-400">{lootbox.probabilities.common}%</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-blue-400">Rare</span>
                                        <span className="font-medium text-blue-400">{lootbox.probabilities.rare}%</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-purple-400">Epic</span>
                                        <span className="font-medium text-purple-400">{lootbox.probabilities.epic}%</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-amber-400">Legendary</span>
                                        <span className="font-medium text-amber-400">{lootbox.probabilities.legendary}%</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Bouton d'achat */}
                    <motion.button
                        onClick={() => onPurchase(lootbox.type)}
                        disabled={!canAfford || isPurchasing}
                        className={`mt-4 w-full rounded-xl py-3 font-bold text-slate-900 transition-all ${
                            canAfford ? `bg-gradient-to-r ${config.buttonGradient} hover:brightness-110` : "cursor-not-allowed bg-slate-700 text-slate-500"
                        }`}
                        whileHover={canAfford ? { scale: 1.02 } : {}}
                        whileTap={canAfford ? { scale: 0.98 } : {}}
                    >
                        {isPurchasing ? (
                            <motion.div
                                className="mx-auto h-5 w-5 rounded-full border-2 border-slate-900 border-t-transparent"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                        ) : (
                            <span>{lootbox.price} RC</span>
                        )}
                    </motion.button>
                </div>
            </motion.div>
        </motion.div>
    );
}

interface LootboxGridProps {
    userBalance: number;
    onPurchase: (type: LootboxType) => void;
    purchasingType?: LootboxType | null;
}

export function LootboxGrid({ userBalance, onPurchase, purchasingType }: LootboxGridProps) {
    return (
        <div className="grid grid-cols-1 gap-8 pt-12 sm:grid-cols-3">
            {lootboxes.map((lootbox, index) => (
                <motion.div
                    key={lootbox.type}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        delay: index * 0.1,
                        type: "spring",
                        stiffness: 300,
                        damping: 25,
                    }}
                >
                    <LootboxCard lootbox={lootbox} userBalance={userBalance} onPurchase={onPurchase} isPurchasing={purchasingType === lootbox.type} />
                </motion.div>
            ))}
        </div>
    );
}

export { lootboxes, lootboxConfig };
export type { LootboxType, LootboxData };
