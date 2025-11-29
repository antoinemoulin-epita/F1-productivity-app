// page.tsx (collection page avec lootboxes)
"use client";

import { useState } from "react";
import { CoinsStacked01 } from "@untitledui/icons";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useTheme } from "next-themes";
import { CarCard, CarData } from "./f1-card";
import { F1CardModal } from "./f1-card-modal";
import { LootboxGrid, LootboxType } from "./lootbox-card";
import LootboxCard02 from "./lootbox-card02";

 

// Les 19 voitures MVP VROOM
const initialCarsData: CarData[] = [
    { id: "1", name: "Or Noir", rarity: "legendary", isOwned: true, isFavorite: true, obtainedFrom: "lootbox_gold", obtainedAt: "2025-01-15T10:30:00Z" },
    { id: "2", name: "Inferno", rarity: "epic", isOwned: true, isFavorite: false, obtainedFrom: "lootbox_silver", obtainedAt: "2025-01-10T14:20:00Z" },
    { id: "3", name: "Aurora", rarity: "epic", isOwned: false },
    { id: "4", name: "Phantom", rarity: "epic", isOwned: false },
    { id: "5", name: "Scarlet", rarity: "rare", isOwned: true, isFavorite: false, obtainedFrom: "lootbox_bronze", obtainedAt: "2025-01-08T09:15:00Z" },
    { id: "6", name: "Ocean", rarity: "rare", isOwned: true, isFavorite: false, obtainedFrom: "lootbox_standard", obtainedAt: "2025-01-05T16:45:00Z" },
    { id: "7", name: "Forest", rarity: "rare", isOwned: false },
    { id: "8", name: "Sunset", rarity: "rare", isOwned: false },
    { id: "9", name: "Storm", rarity: "rare", isOwned: false },
    { id: "10", name: "Rouge", rarity: "common", isOwned: true, isFavorite: false, obtainedFrom: "starter", obtainedAt: "2025-01-01T12:00:00Z" },
    { id: "11", name: "Bleu", rarity: "common", isOwned: true, isFavorite: false, obtainedFrom: "lootbox_standard", obtainedAt: "2025-01-03T11:30:00Z" },
    { id: "12", name: "Vert", rarity: "common", isOwned: true, isFavorite: false, obtainedFrom: "lootbox_standard", obtainedAt: "2025-01-04T08:00:00Z" },
    { id: "13", name: "Jaune", rarity: "common", isOwned: false },
    { id: "14", name: "Noir", rarity: "common", isOwned: false },
    { id: "15", name: "Blanc", rarity: "common", isOwned: false },
    { id: "16", name: "Orange", rarity: "common", isOwned: false },
    { id: "17", name: "Violet", rarity: "common", isOwned: false },
    { id: "18", name: "Rose", rarity: "common", isOwned: false },
    { id: "19", name: "Gris", rarity: "common", isOwned: false },
];

export default function CollectionPage() {
    const [cars, setCars] = useState<CarData[]>(initialCarsData);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [userBalance, setUserBalance] = useState(125); // RC de l'utilisateur
    const [purchasingType, setPurchasingType] = useState<LootboxType | null>(null);
    const prefersReducedMotion = useReducedMotion();
    const { theme } = useTheme();

    const selectedCar = cars.find((car) => car.id === selectedId);

    // Définir une voiture comme favorite
    const handleSetFavorite = (carId: string) => {
        setCars((prevCars) =>
            prevCars.map((car) => ({
                ...car,
                isFavorite: car.id === carId,
            })),
        );
    };

    // Achat de lootbox (simulation)
    const handlePurchaseLootbox = async (type: LootboxType) => {
        const prices = { bronze: 10, silver: 20, gold: 50 };
        const price = prices[type];

        if (userBalance < price) return;

        setPurchasingType(type);

        // Simulation d'achat (à remplacer par appel API)
        await new Promise((resolve) => setTimeout(resolve, 1500));

        setUserBalance((prev) => prev - price);
        setPurchasingType(null);

        // TODO: Déclencher l'animation d'ouverture et ajouter la voiture obtenue
        alert(`Lootbox ${type} achetée ! Animation d'ouverture à implémenter.`);
    };

    // Stats de collection
    const ownedCount = cars.filter((c) => c.isOwned).length;
    const totalCount = cars.length;
    const ownedByRarity = {
        legendary: cars.filter((c) => c.isOwned && c.rarity === "legendary").length,
        epic: cars.filter((c) => c.isOwned && c.rarity === "epic").length,
        rare: cars.filter((c) => c.isOwned && c.rarity === "rare").length,
        common: cars.filter((c) => c.isOwned && c.rarity === "common").length,
    };
    const totalByRarity = {
        legendary: cars.filter((c) => c.rarity === "legendary").length,
        epic: cars.filter((c) => c.rarity === "epic").length,
        rare: cars.filter((c) => c.rarity === "rare").length,
        common: cars.filter((c) => c.rarity === "common").length,
    };

    const springTransition = {
        type: "spring" as const,
        damping: 30,
        stiffness: 300,
        mass: 0.8,
    };

    const transition = prefersReducedMotion ? { duration: 0.2 } : springTransition;

    const isDark = theme === "dark";
 
    // Tri: possédées d'abord, puis par rareté
    const rarityOrder = { legendary: 0, epic: 1, rare: 2, common: 3 };
    const sortedCars = [...cars].sort((a, b) => {
        if (a.isOwned !== b.isOwned) return a.isOwned ? -1 : 1;
        return rarityOrder[a.rarity] - rarityOrder[b.rarity];
    });

    return (
        <div className={`min-h-screen `}>
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Header avec solde RC */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-primary">Magasin</h1>
                        <p className="text-secondary">Ouvre des lootboxes pour agrandir ta collection</p>
                    </div>

                    {/* Solde RC */}
                    <motion.div
                        className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-amber-500/10 to-yellow-500/10 px-5 py-3 dark:from-amber-500/20 dark:to-yellow-500/20"
                        whileHover={{ scale: 1.02 }}
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-yellow-500">
                            <CoinsStacked01 className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <p className="text-xs text-tertiary">Solde</p>
                            <p className="text-xl font-bold text-amber-600 dark:text-amber-400">{userBalance} RC</p>
                        </div>
                    </motion.div>
                </div>

                {/* Section Lootboxes */}
                <section className="mb-12">
                    <h2 className="mb-6 text-xl font-bold text-primary">Lootboxes</h2>
                    <div className="flex flex-row w-full justify-between">
                        <LootboxCard02 type="bronze" price="500" currency="CR" imageUrl="/bronze-box.png" />
                        <LootboxCard02 type="silver" price="1000" currency="CR" imageUrl="/silver-box.png" />
                        <LootboxCard02 type="gold" price="2000" currency="CR" imageUrl="/gold-box.png" />
                    </div>
                </section>

                {/* Séparateur */}
                <div className="mb-12 flex items-center gap-4">
                    <div className="via-border h-px flex-1 bg-gradient-to-r from-transparent to-transparent" />
                    <span className="text-sm font-medium text-tertiary">Ma Collection</span>
                    <div className="via-border h-px flex-1 bg-gradient-to-r from-transparent to-transparent" />
                </div>

                {/* Section Collection */}
                <section>
                    {/* Stats de collection */}
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-primary">Mes Voitures</h2>
                            <p className="text-secondary">
                                {ownedCount}/{totalCount} voitures débloquées
                            </p>
                        </div>

                        {/* Stats par rareté */}
                        <div className="flex flex-wrap gap-2">
                            <div className="flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1.5">
                                <div className="h-2 w-2 rounded-full bg-amber-500" />
                                <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                                    {ownedByRarity.legendary}/{totalByRarity.legendary}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 rounded-full bg-purple-500/10 px-3 py-1.5">
                                <div className="h-2 w-2 rounded-full bg-purple-500" />
                                <span className="text-xs font-medium text-purple-600 dark:text-purple-400">
                                    {ownedByRarity.epic}/{totalByRarity.epic}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1.5">
                                <div className="h-2 w-2 rounded-full bg-blue-500" />
                                <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                                    {ownedByRarity.rare}/{totalByRarity.rare}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 rounded-full bg-slate-500/10 px-3 py-1.5">
                                <div className="h-2 w-2 rounded-full bg-slate-500" />
                                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                                    {ownedByRarity.common}/{totalByRarity.common}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Grid de cartes */}
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4 xl:grid-cols-5">
                        {sortedCars.map((car, index) => (
                            <motion.div key={car.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03 }}>
                                <CarCard car={car} variant="collection" onClick={() => setSelectedId(car.id)} />
                            </motion.div>
                        ))}
                    </div>
                </section>
            </div>

            {/* Modal */}
            <AnimatePresence mode="wait">
                {selectedId && selectedCar && (
                    <>
                        <motion.div
                            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                            animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
                            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                            transition={{ duration: 0.2 }}
                            onClick={() => setSelectedId(null)}
                            className={`fixed inset-0 z-40 ${isDark ? "bg-black/80" : "bg-black/60"}`}
                            style={{ willChange: "opacity" }}
                        />

                        <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
                            <F1CardModal car={selectedCar} onClose={() => setSelectedId(null)} onSetFavorite={handleSetFavorite} transition={transition} />
                        </div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
