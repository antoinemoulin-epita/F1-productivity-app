// app/spin/page.tsx
"use client";

import { useRef, useState } from "react";
import { animate, motion, useMotionValue, useTransform } from "motion/react";

// app/spin/page.tsx

// app/spin/page.tsx

// app/spin/page.tsx

// app/spin/page.tsx

type Rarity = "common" | "rare" | "epic" | "legendary";

interface WheelItem {
    id: string;
    name: string;
    rarity: Rarity;
}

const rarityConfig: Record<
    Rarity,
    {
        bg: string;
        light: string;
        badge: string;
    }
> = {
    common: {
        bg: "linear-gradient(135deg, #94a3b8 0%, #64748b 100%)",
        light: "#cbd5e1",
        badge: "#64748b",
    },
    rare: {
        bg: "linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)",
        light: "#93c5fd",
        badge: "#3b82f6",
    },
    epic: {
        bg: "linear-gradient(135deg, #c084fc 0%, #a855f7 100%)",
        light: "#d8b4fe",
        badge: "#a855f7",
    },
    legendary: {
        bg: "linear-gradient(135deg, #fcd34d 0%, #f59e0b 100%)",
        light: "#fde68a",
        badge: "#f59e0b",
    },
};

const wheelItems: WheelItem[] = [
    { id: "1", name: "Rouge", rarity: "common" },
    { id: "2", name: "Scarlet", rarity: "rare" },
    { id: "3", name: "Bleu", rarity: "common" },
    { id: "4", name: "Inferno", rarity: "epic" },
    { id: "5", name: "Vert", rarity: "common" },
    { id: "6", name: "Ocean", rarity: "rare" },
    { id: "7", name: "Jaune", rarity: "common" },
    { id: "8", name: "Or Noir", rarity: "legendary" },
    { id: "9", name: "Noir", rarity: "common" },
    { id: "10", name: "Aurora", rarity: "epic" },
    { id: "11", name: "Blanc", rarity: "common" },
    { id: "12", name: "Storm", rarity: "rare" },
];

export default function SpinPage() {
    const [isSpinning, setIsSpinning] = useState(false);
    const [hasSpun, setHasSpun] = useState(false);
    const [result, setResult] = useState<WheelItem | null>(null);

    const wheelRotation = useMotionValue(0);
    const cardCounterRotation = useTransform(wheelRotation, (r) => -r);
    const currentRotationRef = useRef(0);

    const ITEMS_COUNT = wheelItems.length;
    const ITEM_ANGLE = 360 / ITEMS_COUNT;
    const WHEEL_RADIUS = 280;
    const CENTER_RADIUS = 55;
    const CORNER_RADIUS = 6; // Rayon des cercles aux coins

    const getRandomResult = () => {
        const rand = Math.random() * 100;
        let targetRarity: Rarity;

        if (rand < 86) targetRarity = "common";
        else if (rand < 94) targetRarity = "rare";
        else if (rand < 98) targetRarity = "epic";
        else targetRarity = "legendary";

        const candidates = wheelItems.filter((i) => i.rarity === targetRarity);
        const winner = candidates[Math.floor(Math.random() * candidates.length)];
        return wheelItems.findIndex((i) => i.id === winner.id);
    };

    const spin = async () => {
        if (isSpinning || hasSpun) return;
        setIsSpinning(true);
        setResult(null);

        const predeterminedResult = getRandomResult();
        const targetAngle = predeterminedResult * ITEM_ANGLE;
        const fullRotations = (5 + Math.random() * 3) * 360;
        const finalRotation = currentRotationRef.current + fullRotations + (360 - targetAngle);

        await animate(wheelRotation, finalRotation, {
            duration: 5,
            ease: [0.12, 0.8, 0.2, 1],
        });

        currentRotationRef.current = finalRotation;
        setIsSpinning(false);
        setHasSpun(true);
        setResult(wheelItems[predeterminedResult]);
    };

    const reset = () => {
        setHasSpun(false);
        setResult(null);
    };

    const toRad = (deg: number) => (deg * Math.PI) / 180;

    // Créer un path pour une section
    const createSectionPath = (index: number) => {
        const startAngle = index * ITEM_ANGLE - 90;
        const endAngle = startAngle + ITEM_ANGLE;

        const startRad = toRad(startAngle);
        const endRad = toRad(endAngle);

        const outerR = WHEEL_RADIUS - 6;
        const innerR = CENTER_RADIUS + 6;

        const ox1 = WHEEL_RADIUS + Math.cos(startRad) * outerR;
        const oy1 = WHEEL_RADIUS + Math.sin(startRad) * outerR;
        const ox2 = WHEEL_RADIUS + Math.cos(endRad) * outerR;
        const oy2 = WHEEL_RADIUS + Math.sin(endRad) * outerR;

        const ix1 = WHEEL_RADIUS + Math.cos(startRad) * innerR;
        const iy1 = WHEEL_RADIUS + Math.sin(startRad) * innerR;
        const ix2 = WHEEL_RADIUS + Math.cos(endRad) * innerR;
        const iy2 = WHEEL_RADIUS + Math.sin(endRad) * innerR;

        const largeArc = ITEM_ANGLE > 180 ? 1 : 0;

        return `
            M ${ox1} ${oy1}
            A ${outerR} ${outerR} 0 ${largeArc} 1 ${ox2} ${oy2}
            L ${ix2} ${iy2}
            A ${innerR} ${innerR} 0 ${largeArc} 0 ${ix1} ${iy1}
            Z
        `;
    };

    // Calculer les positions des 4 coins d'une section
    const getCornerPositions = (index: number) => {
        const startAngle = index * ITEM_ANGLE - 90;
        const endAngle = startAngle + ITEM_ANGLE;

        const startRad = toRad(startAngle);
        const endRad = toRad(endAngle);

        const outerR = WHEEL_RADIUS - 6;
        const innerR = CENTER_RADIUS + 6;

        return [
            // Coin extérieur début
            {
                x: WHEEL_RADIUS + Math.cos(startRad) * outerR,
                y: WHEEL_RADIUS + Math.sin(startRad) * outerR,
            },
            // Coin extérieur fin
            {
                x: WHEEL_RADIUS + Math.cos(endRad) * outerR,
                y: WHEEL_RADIUS + Math.sin(endRad) * outerR,
            },
            // Coin intérieur fin
            {
                x: WHEEL_RADIUS + Math.cos(endRad) * innerR,
                y: WHEEL_RADIUS + Math.sin(endRad) * innerR,
            },
            // Coin intérieur début
            {
                x: WHEEL_RADIUS + Math.cos(startRad) * innerR,
                y: WHEEL_RADIUS + Math.sin(startRad) * innerR,
            },
        ];
    };

    return (
        <div className="flex min-h-screen flex-col items-center bg-slate-50 px-4 py-8">
            {/* Header */}
            <div className="mb-8 text-center">
                <h1 className="text-2xl font-semibold text-slate-900">Lootbox Standard</h1>
                <p className="mt-1 text-sm text-slate-500">Tourne la roue et découvre ta voiture</p>
            </div>

            {/* Conteneur principal */}
            <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                <div className="relative flex flex-col items-center px-6 pt-8 pb-6">
                    {/* Pointeur */}
                    <div className="absolute top-4 left-1/2 z-20 -translate-x-1/2">
                        <svg width="24" height="20" viewBox="0 0 24 20">
                            <path d="M12 20L0 0H24L12 20Z" fill="#0f172a" />
                        </svg>
                    </div>

                    {/* Zone de la roue */}
                    <div className="relative overflow-hidden" style={{ height: "340px", width: "100%" }}>
                        <div className="absolute left-1/2 -translate-x-1/2" style={{ top: "20px" }}>
                            <motion.div
                                style={{
                                    width: WHEEL_RADIUS * 2,
                                    height: WHEEL_RADIUS * 2,
                                    rotate: wheelRotation,
                                }}
                            >
                                <svg width={WHEEL_RADIUS * 2} height={WHEEL_RADIUS * 2} viewBox={`0 0 ${WHEEL_RADIUS * 2} ${WHEEL_RADIUS * 2}`}>
                                    <defs>
                                        {wheelItems.map((item) => {
                                            const config = rarityConfig[item.rarity];
                                            return (
                                                <linearGradient key={`grad-${item.id}`} id={`grad-${item.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                                    <stop offset="0%" stopColor={config.light} />
                                                    <stop offset="100%" stopColor={config.badge} />
                                                </linearGradient>
                                            );
                                        })}
                                    </defs>

                                    {/* Fond de la roue */}
                                    <circle cx={WHEEL_RADIUS} cy={WHEEL_RADIUS} r={WHEEL_RADIUS - 2} fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="2" />

                                    {/* Sections */}
                                    {wheelItems.map((item, index) => (
                                        <path
                                            key={item.id}
                                            d={createSectionPath(index)}
                                            fill={`url(#grad-${item.id})`}
                                            style={{
                                                filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.06))",
                                            }}
                                        />
                                    ))}

                                    {/* Cercles blancs aux coins de chaque section */}
                                    {wheelItems.map((_, index) => {
                                        const corners = getCornerPositions(index);
                                        return corners.map((corner, cornerIndex) => (
                                            <circle key={`corner-${index}-${cornerIndex}`} cx={corner.x} cy={corner.y} r={CORNER_RADIUS} fill="#f1f5f9" />
                                        ));
                                    })}

                                    {/* Cercle central */}
                                    <circle
                                        cx={WHEEL_RADIUS}
                                        cy={WHEEL_RADIUS}
                                        r={CENTER_RADIUS}
                                        fill="white"
                                        stroke="#e2e8f0"
                                        strokeWidth="2"
                                        style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }}
                                    />
                                </svg>

                                {/* Labels */}
                                {wheelItems.map((item, index) => {
                                    const angle = index * ITEM_ANGLE;
                                    const rad = ((angle - 90 + ITEM_ANGLE / 2) * Math.PI) / 180;
                                    const labelRadius = (WHEEL_RADIUS + CENTER_RADIUS) / 2 + 10;
                                    const x = WHEEL_RADIUS + Math.cos(rad) * labelRadius;
                                    const y = WHEEL_RADIUS + Math.sin(rad) * labelRadius;

                                    return (
                                        <motion.div
                                            key={`label-${item.id}`}
                                            className="pointer-events-none absolute flex flex-col items-center"
                                            style={{
                                                left: x,
                                                top: y,
                                                transform: "translate(-50%, -50%)",
                                                rotate: cardCounterRotation,
                                            }}
                                        >
                                            <span className="text-xl">🏎️</span>
                                            <span className="mt-0.5 text-[11px] font-semibold whitespace-nowrap text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
                                                {item.name}
                                            </span>
                                        </motion.div>
                                    );
                                })}

                                {/* Texte central */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                    <motion.span className="text-sm font-bold text-slate-700" style={{ rotate: cardCounterRotation, display: "block" }}>
                                        VROOM
                                    </motion.span>
                                </div>
                            </motion.div>
                        </div>

                        {/* Fade */}
                        <div
                            className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
                            style={{
                                background: "linear-gradient(to top, white 0%, transparent 100%)",
                            }}
                        />
                    </div>

                    {/* Bouton */}
                    <motion.button
                        onClick={hasSpun ? reset : spin}
                        disabled={isSpinning}
                        className="mt-2 w-full rounded-xl px-6 py-3 text-base font-semibold text-white transition-colors"
                        style={{
                            background: isSpinning ? "#94a3b8" : "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                        }}
                        whileHover={!isSpinning ? { scale: 1.02 } : {}}
                        whileTap={!isSpinning ? { scale: 0.98 } : {}}
                    >
                        {isSpinning ? "Rotation en cours..." : hasSpun ? "Tourner à nouveau" : "Tourner la roue"}
                    </motion.button>
                </div>

                {/* Résultat */}
                {result && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="border-t border-slate-100">
                        <div className="flex items-center gap-4 p-6">
                            <div className="flex h-16 w-16 items-center justify-center rounded-xl" style={{ background: rarityConfig[result.rarity].bg }}>
                                <span className="text-3xl">🏎️</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-xs font-medium tracking-wider text-slate-400 uppercase">Tu as gagné</p>
                                <p className="text-lg font-semibold text-slate-900">{result.name}</p>
                                <span
                                    className="inline-block rounded-full px-2 py-0.5 text-xs font-medium text-white uppercase"
                                    style={{ background: rarityConfig[result.rarity].badge }}
                                >
                                    {result.rarity}
                                </span>
                            </div>
                            <button className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">Voir collection</button>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Probabilités */}
            <div className="mt-6 flex flex-wrap justify-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-slate-400" />
                    Common 86%
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-blue-500" />
                    Rare 8%
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-purple-500" />
                    Epic 4%
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                    Legendary 2%
                </span>
            </div>

            <div className="mt-4 rounded-lg bg-slate-100 px-4 py-2 text-center text-sm text-slate-600">
                Tu as <span className="font-semibold">1 tour gratuit</span> disponible aujourd'hui
            </div>
        </div>
    );
}
