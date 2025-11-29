// f1-card-modal.tsx
"use client";

import { Star01, X } from "@untitledui/icons";
import { motion, useReducedMotion } from "motion/react";
import { useTheme } from "next-themes";
import type { CarData, CarRarity } from "./f1-card";
import { rarityGradients } from "./f1-card";

interface F1CardModalProps {
    car: CarData;
    onClose: () => void;
    onSetFavorite?: (carId: string) => void;
    transition?: object;
}

const rarityConfig: Record<CarRarity, { label: string; badgeBg: string }> = {
    common: { badgeBg: "bg-slate-500", label: "Common" },
    rare: { badgeBg: "bg-blue-600", label: "Rare" },
    epic: { badgeBg: "bg-purple-600", label: "Epic" },
    legendary: { badgeBg: "bg-amber-600", label: "Legendary" },
};

const obtainedFromLabels: Record<NonNullable<CarData["obtainedFrom"]>, string> = {
    starter: "Voiture de départ",
    lootbox_standard: "Box Standard",
    lootbox_bronze: "Box Bronze",
    lootbox_silver: "Box Argent",
    lootbox_gold: "Box Or",
};

export function F1CardModal({ car, onClose, onSetFavorite, transition }: F1CardModalProps) {
    const { theme } = useTheme();
    const prefersReducedMotion = useReducedMotion();

    const config = rarityConfig[car.rarity];
    const gradient = rarityGradients[car.rarity];
    const isDark = theme === "dark";
    const isLocked = !car.isOwned;

    const formattedDate = car.obtainedAt
        ? new Date(car.obtainedAt).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
          })
        : null;

    return (
        <motion.div
            layoutId={car.id}
            className={`pointer-events-auto z-50 w-full max-w-md overflow-hidden rounded-3xl shadow-2xl ${isDark ? "bg-neutral-900" : "bg-white"}`}
            style={{ willChange: "transform", transform: "translateZ(0)" }}
            transition={transition}
            onClick={(e) => e.stopPropagation()}
        >
            {/* Section image avec gradient aurora */}
            <div className="relative">
                <motion.div
                    layoutId={`image-${car.id}`}
                    className={`relative flex h-64 items-center justify-center ${isLocked ? "grayscale-[30%]" : ""}`}
                    style={{ background: gradient }}
                >
                    {/* Bouton fermer */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-30 flex h-8 w-8 items-center justify-center rounded-full bg-black/30 backdrop-blur-sm transition-colors hover:bg-black/50"
                    >
                        <X className="h-5 w-5 text-white" />
                    </button>

                    {/* Badge rareté */}
                    <motion.div
                        layoutId={`badge-${car.id}`}
                        className={`absolute top-0 left-1/2 z-20 -translate-x-1/2 rounded-b-xl border-[3px] border-t-0 px-5 py-2 shadow-sm ${isDark ? "border-neutral-900" : "border-white"} ${config.badgeBg}`}
                    >
                        <span className="block text-xs font-bold tracking-wider text-white uppercase">{config.label}</span>
                    </motion.div>

                    {/* Image ou fallback - floutée si non possédée */}
                    {car.imageUrl ? (
                        <div
                            className={`absolute inset-0 bg-cover bg-center ${isLocked ? "scale-105 blur-[8px]" : ""}`}
                            style={{ backgroundImage: `url(${car.imageUrl})` }}
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(0,0,0,0.15),transparent)]" />
                            <img src="/car.png" className={`z-10 h-60 drop-shadow-lg ${isLocked ? "scale-105 blur-[8px]" : ""}`} alt={car.name} />
                        </div>
                    )}

                    {/* Overlay verrouillé */}
                    {isLocked && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/30">
                            <div className="rounded-full bg-black/50 px-4 py-2 backdrop-blur-sm">
                                <span className="text-sm font-medium text-white">🔒 Non débloquée</span>
                            </div>
                        </div>
                    )}

                    {/* Badge favorite */}
                    {car.isFavorite && car.isOwned && (
                        <div className="absolute top-4 left-4 z-20">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black/30 backdrop-blur-sm">
                                <Star01 className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Gradient overlay */}
                <div className={`absolute right-0 bottom-0 left-0 h-20 bg-gradient-to-t to-transparent ${isDark ? "from-neutral-900" : "from-white"}`} />
            </div>

            {/* Section info */}
            <div className="px-6 pt-4 pb-6">
                <motion.h2
                    layoutId={`title-${car.id}`}
                    className={`mb-4 text-center text-3xl font-black ${isLocked ? "text-neutral-400 dark:text-neutral-500" : isDark ? "text-white" : "text-neutral-900"}`}
                    style={{ willChange: "transform" }}
                >
                    {car.name}
                </motion.h2>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{
                        delay: prefersReducedMotion ? 0 : 0.05,
                        duration: 0.2,
                        ease: [0.25, 0.1, 0.25, 1],
                    }}
                >
                    {/* Infos si possédée */}
                    {car.isOwned && (
                        <div className={`mb-6 rounded-2xl p-4 ${isDark ? "bg-neutral-800" : "bg-neutral-50"}`}>
                            {car.obtainedFrom && (
                                <div className="mb-3 flex items-center justify-between">
                                    <span className={isDark ? "text-neutral-400" : "text-neutral-600"}>Origine</span>
                                    <span className={`font-medium ${isDark ? "text-white" : "text-neutral-900"}`}>{obtainedFromLabels[car.obtainedFrom]}</span>
                                </div>
                            )}
                            {formattedDate && (
                                <div className="flex items-center justify-between">
                                    <span className={isDark ? "text-neutral-400" : "text-neutral-600"}>Obtenue le</span>
                                    <span className={`font-medium ${isDark ? "text-white" : "text-neutral-900"}`}>{formattedDate}</span>
                                </div>
                            )}
                            {car.isFavorite && (
                                <div className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-amber-500/10 py-2">
                                    <Star01 className="h-4 w-4 fill-amber-500 text-amber-500" />
                                    <span className="text-sm font-medium text-amber-600 dark:text-amber-400">Voiture favorite</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Message si non possédée */}
                    {!car.isOwned && (
                        <div className={`mb-6 rounded-2xl p-4 text-center ${isDark ? "bg-neutral-800" : "bg-neutral-50"}`}>
                            <p className={`mb-2 ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>Cette voiture n'est pas encore dans ta collection.</p>
                            <p className={`text-sm ${isDark ? "text-neutral-500" : "text-neutral-500"}`}>Ouvre des lootboxes pour tenter de la débloquer !</p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3">
                        {car.isOwned && onSetFavorite && !car.isFavorite && (
                            <button
                                onClick={() => onSetFavorite(car.id)}
                                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-amber-500 px-4 py-3 font-bold text-white transition-colors hover:bg-amber-600"
                            >
                                <Star01 className="h-5 w-5" />
                                Définir favorite
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className={`flex-1 rounded-2xl px-4 py-3 font-bold transition-colors ${
                                isDark ? "bg-neutral-800 text-white hover:bg-neutral-700" : "bg-neutral-200 text-neutral-900 hover:bg-neutral-300"
                            } ${car.isOwned && onSetFavorite && !car.isFavorite ? "" : "w-full"}`}
                        >
                            Fermer
                        </button>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}