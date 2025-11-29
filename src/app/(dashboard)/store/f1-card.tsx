// f1-card.tsx
"use client";

import { Check, Lock01, Star01 } from "@untitledui/icons";
import { motion } from "motion/react";

type CarRarity = "common" | "rare" | "epic" | "legendary";

export interface CarData {
    id: string;
    name: string;
    rarity: CarRarity;
    imageUrl?: string;
    isOwned: boolean;
    isFavorite?: boolean;
    obtainedAt?: string;
    obtainedFrom?: "starter" | "lootbox_standard" | "lootbox_bronze" | "lootbox_silver" | "lootbox_gold";
}

interface CarCardProps {
    car: CarData;
    onClick?: () => void;
    variant?: "collection" | "catalog" | "selection";
    isSelected?: boolean;
    onSelect?: () => void;
}

// Gradients style aurora par rareté
const rarityGradients: Record<CarRarity, string> = {
    common: `
        radial-gradient(ellipse at 30% 20%, #94a3b8 0%, transparent 40%),
        radial-gradient(ellipse at 70% 80%, #334155 0%, transparent 50%),
        linear-gradient(150deg, #64748b 0%, #475569 40%, #334155 80%, #1e293b 100%)
    `,
    rare: `
        radial-gradient(ellipse at 70% 20%, #60a5fa 0%, transparent 40%),
        radial-gradient(ellipse at 20% 80%, #1e3a8a 0%, transparent 50%),
        linear-gradient(150deg, #3b82f6 0%, #2563eb 35%, #1d4ed8 65%, #1e40af 100%)
    `,
    epic: `
        radial-gradient(ellipse at 25% 25%, #c084fc 0%, transparent 40%),
        radial-gradient(ellipse at 75% 75%, #3b0764 0%, transparent 50%),
        linear-gradient(160deg, #a855f7 0%, #9333ea 35%, #7c3aed 70%, #6d28d9 100%)
    `,
    legendary: `
        radial-gradient(ellipse at 30% 10%, #fcd34d 0%, transparent 40%),
        radial-gradient(ellipse at 70% 90%, #92400e 0%, transparent 50%),
        linear-gradient(150deg, #fbbf24 0%, #f59e0b 35%, #d97706 65%, #b45309 100%)
    `,
};

const rarityConfig: Record<CarRarity, { badgeBg: string; label: string; glow?: string }> = {
    common: {
        badgeBg: "bg-slate-500",
        label: "Common",
    },
    rare: {
        badgeBg: "bg-blue-600",
        label: "Rare",
        glow: "shadow-[0_0_30px_rgba(59,130,246,0.3)]",
    },
    epic: {
        badgeBg: "bg-purple-600",
        label: "Epic",
        glow: "shadow-[0_0_30px_rgba(147,51,234,0.4)]",
    },
    legendary: {
        badgeBg: "bg-amber-600",
        label: "Legendary",
        glow: "shadow-[0_0_40px_rgba(245,158,11,0.5)]",
    },
};

const obtainedFromLabels: Record<NonNullable<CarData["obtainedFrom"]>, string> = {
    starter: "Voiture de départ",
    lootbox_standard: "Box Standard",
    lootbox_bronze: "Box Bronze",
    lootbox_silver: "Box Argent",
    lootbox_gold: "Box Or",
};

export function CarCard({ car, onClick, variant = "collection", isSelected = false, onSelect }: CarCardProps) {
    const config = rarityConfig[car.rarity];
    const gradient = rarityGradients[car.rarity];
    const isLocked = !car.isOwned;

    const handleClick = () => {
        if (variant === "selection" && onSelect && car.isOwned) {
            onSelect();
        } else if (onClick) {
            onClick();
        }
    };

    return (
        <motion.div
            layoutId={car.id}
            onClick={handleClick}
            className={`group relative z-0 mx-auto w-full max-w-[280px] cursor-pointer overflow-hidden rounded-3xl bg-white p-2 font-sans shadow-lg dark:bg-neutral-900 dark:shadow-2xl ${car.isOwned ? config.glow || "" : ""} ${isSelected ? "ring-2 ring-green-500 ring-offset-2 ring-offset-bg-primary" : ""} ${isLocked ? "opacity-80" : ""}`}
            whileHover={{ scale: isLocked ? 1.01 : 1.02 }}
            whileTap={{ scale: isLocked ? 1 : 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
            {/* Zone Image avec gradient */}
            <div
                className={`relative h-[140px] w-full overflow-hidden rounded-2xl transition-all duration-300 ${isLocked ? "grayscale-[30%]" : ""}`}
                style={{ background: gradient }}
            >
                {/* Image ou fallback - floutée si non possédée */}
                <motion.div
                    layoutId={`image-${car.id}`}
                    className={`absolute inset-0 bg-cover bg-center ${isLocked ? "scale-105 blur-[6px]" : ""}`}
                    style={{ backgroundImage: car.imageUrl ? `url(${car.imageUrl})` : undefined }}
                >
                    {!car.imageUrl && (
                        <div className="flex h-full w-full flex-col items-center justify-center">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(0,0,0,0.15),transparent)]" />
                            <img
                                src="/car.png"
                                className={`z-10 mt-6 h-40 drop-shadow-lg transition-all ${isLocked ? "scale-105 blur-[6px]" : ""}`}
                                alt={car.name}
                            />
                        </div>
                    )}
                </motion.div>

                {/* Badge Rareté - toujours visible même si floutée */}
                <motion.div
                    layoutId={`badge-${car.id}`}
                    className={`absolute top-0 left-1/2 z-20 -translate-x-1/2 rounded-b-xl border-[3px] border-t-0 border-white px-4 py-1.5 shadow-sm dark:border-neutral-900 ${config.badgeBg}`}
                >
                    <span className="block text-[10px] font-bold tracking-wider text-white uppercase">{config.label}</span>
                </motion.div>

                {/* Overlay verrouillé */}
                {isLocked && (
                    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/40">
                        <div className="flex flex-col items-center gap-1">
                            <Lock01 className="h-8 w-8 text-white/90" />
                        </div>
                    </div>
                )}

                {/* Badge Favorite */}
                {car.isFavorite && car.isOwned && (
                    <div className="absolute top-2 right-2 z-20">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-black/30 backdrop-blur-sm">
                            <Star01 className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        </div>
                    </div>
                )}

                {/* Badge Sélectionnée (mode selection) */}
                {variant === "selection" && isSelected && car.isOwned && (
                    <div className="absolute right-2 bottom-2 z-20">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-green-500 shadow-lg">
                            <Check className="h-4 w-4 text-white" />
                        </div>
                    </div>
                )}
            </div>

            {/* Zone Contenu */}
            <div className="px-2 pt-3 pb-2">
                <motion.h3
                    layoutId={`title-${car.id}`}
                    className={`text-center text-base font-bold tracking-tight ${isLocked ? "text-neutral-400 dark:text-neutral-500" : "text-neutral-900 dark:text-white"}`}
                >
                    {car.name}
                </motion.h3>

                {variant === "collection" && car.isOwned && car.obtainedFrom && (
                    <p className="mt-1 text-center text-xs text-neutral-500 dark:text-neutral-400">{obtainedFromLabels[car.obtainedFrom]}</p>
                )}

                {variant === "collection" && !car.isOwned && <p className="mt-1 text-center text-xs text-neutral-500 dark:text-neutral-400">Non débloquée</p>}

                {variant === "selection" && car.isOwned && (
                    <div className="mt-2 flex justify-center">
                        <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                                isSelected ? "bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400" : "bg-secondary text-tertiary"
                            }`}
                        >
                            {isSelected ? "Sélectionnée" : "Cliquer pour choisir"}
                        </span>
                    </div>
                )}

                {variant === "selection" && !car.isOwned && (
                    <div className="mt-2 flex justify-center">
                        <span className="rounded-full bg-neutral-200 px-3 py-1 text-xs font-medium text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">Non disponible</span>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

// Composant grille avec tri conforme au whitepaper
interface CarGridProps {
    cars: CarData[];
    variant?: "collection" | "catalog" | "selection";
    selectedCarId?: string;
    onSelectCar?: (carId: string) => void;
    onCardClick?: (car: CarData) => void;
}

export function CarGrid({ cars, variant = "collection", selectedCarId, onSelectCar, onCardClick }: CarGridProps) {
    const rarityOrder = { legendary: 0, epic: 1, rare: 2, common: 3 };

    const sortedCars = [...cars].sort((a, b) => {
        // Possédées en premier
        if (a.isOwned !== b.isOwned) return a.isOwned ? -1 : 1;
        // Puis par rareté (Legendary > Epic > Rare > Common)
        return rarityOrder[a.rarity] - rarityOrder[b.rarity];
    });

    return (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {sortedCars.map((car) => (
                <CarCard
                    key={car.id}
                    car={car}
                    variant={variant}
                    isSelected={selectedCarId === car.id}
                    onSelect={() => car.isOwned && onSelectCar?.(car.id)}
                    onClick={() => onCardClick?.(car)}
                />
            ))}
        </div>
    );
}

export { rarityGradients, rarityConfig };
export type { CarRarity, CarData, CarCardProps, CarGridProps };