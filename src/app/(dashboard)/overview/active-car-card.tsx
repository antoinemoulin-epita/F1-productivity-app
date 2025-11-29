// active-car-card.tsx
"use client";

import { Star01 } from "@untitledui/icons";

type CarRarity = "common" | "rare" | "epic" | "legendary";

interface ActiveCarCardProps {
    name: string;
    rarity: CarRarity;
    imageUrl: string;
    isFavorite?: boolean;
    href?: string;
}

const rarityConfig = {
    common: {
        badgeBg: "bg-slate-500",
        label: "Common",
    },
    rare: {
        badgeBg: "bg-blue-600",
        label: "Rare",
    },
    epic: {
        badgeBg: "bg-purple-600",
        label: "Epic",
    },
    legendary: {
        badgeBg: "bg-amber-600",
        label: "Legendary",
    },
};

export function ActiveCarCard({ name, rarity, imageUrl, isFavorite = false, href = "/garage" }: ActiveCarCardProps) {
    const config = rarityConfig[rarity];

    return (
        <a
            href={href}
            className="group relative flex cursor-pointer overflow-hidden rounded-2xl bg-gray-100 p-3 ring-1 ring-primary/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xs hover:shadow-black/20 hover:ring-primary/20 dark:bg-gray-900 dark:hover:shadow-xl dark:hover:shadow-black/50 lg:h-1/3"
        >
            {/* Zone Image */}
            <div className="relative h-full min-h-[150px] w-full overflow-hidden rounded-2xl bg-white dark:bg-gray-800 lg:min-h-0">
                {/* Image */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <img src={imageUrl} className="z-10 h-32 object-contain drop-shadow-xl transition-all group-hover:scale-105 lg:h-40" alt={name} />
                </div>

                {/* Badge Rareté - haut gauche */}
                <div className={`absolute top-0 left-0 z-20 rounded-br-xl rounded-tl-xl px-3 py-1.5 shadow-sm ${config.badgeBg}`}>
                    <span className="block text-[10px] font-bold tracking-wider text-white uppercase">{config.label}</span>
                </div>

                {/* Badge Favorite */}
                {isFavorite && (
                    <div className="absolute top-2 right-2 z-20">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-black/30 backdrop-blur-sm dark:bg-white/20">
                            <Star01 className="h-4 w-4 fill-yellow-400 text-yellow-400 dark:fill-yellow-300 dark:text-yellow-300" />
                        </div>
                    </div>
                )}

                {/* Nom de la voiture en bas */}
                <div className="absolute bottom-3 left-0 right-0 z-20 px-3">
                    <h3 className="text-center text-base font-bold tracking-tight text-neutral-900 dark:text-white">{name}</h3>
                </div>
            </div>
        </a>
    );
}