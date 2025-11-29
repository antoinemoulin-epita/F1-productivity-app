"use client";

import { Target01, TrendUp01, Trophy01, Zap } from "@untitledui/icons";
import { AuthenticatedHeader } from "@/components/application/app-navigation/authenticated-header";
import { CarCard } from "./car-card";

export default function Main02Page() {
    return (
        <div className="min-h-screen bg-primary">
            {/* Header */}
            <AuthenticatedHeader />

            {/* Section contenu */}
            <section className="py-16 md:py-24">
                <div className="mx-auto flex w-full max-w-container flex-col gap-12 px-4 md:px-8">
                    {/* Header Section */}
                    <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                        <div>
                            <span className="inline-block rounded-full bg-brand-secondary/10 px-3 py-1 text-sm font-semibold text-brand-secondary">
                                GRAND PRIX EN DIRECT
                            </span>
                            <h1 className="mt-4 text-display-sm font-semibold text-primary md:text-display-md">Course 02 - Champion Invenal</h1>
                            <p className="mt-2 text-lg text-tertiary">
                                La course des champions commence maintenant. Complétez vos tâches et avancez vers la victoire.
                            </p>
                        </div>

                        {/* Stats rapides */}
                        <div className="grid grid-cols-2 gap-4 md:gap-6">
                            <div className="rounded-lg bg-secondary p-4 md:p-6">
                                <p className="text-sm font-medium text-tertiary">Participants</p>
                                <p className="mt-2 text-2xl font-bold text-primary">13</p>
                            </div>
                            <div className="rounded-lg bg-secondary p-4 md:p-6">
                                <p className="text-sm font-medium text-tertiary">Terminés</p>
                                <p className="mt-2 text-2xl font-bold text-brand-secondary">5</p>
                            </div>
                        </div>
                    </div>

                    {/* LEADERBOARD MAIN SECTION */}
                    <div className="space-y-8">
                        {/* Race Track Visualization */}
                        <div className="overflow-hidden rounded-xl border border-white/10 bg-[#1a1a1a] p-6 md:p-8 dark:bg-[#1a1a1a]">
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-white">Piste en direct</h2>
                                <span className="text-xs font-medium text-green-400">● En course</span>
                            </div>

                            {/* Track Background */}
                            <div className="relative min-h-80 overflow-x-auto rounded-lg bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-8">
                                <div className="absolute top-0 bottom-0 left-0 w-1 bg-green-500/50" />
                                <div className="absolute top-0 right-0 bottom-0 w-1 bg-red-500/50" />

                                <div className="absolute top-1/2 right-0 left-0 h-1 -translate-y-1/2 bg-gradient-to-r from-green-500/30 via-gray-600/30 to-red-500/30" />

                                {/* Cars on track (placeholder positions) */}
                                <div className="flex h-full flex-col gap-5 py-2">
                                    <CarCard name="Antoine" position={1} progress={85} accentColor="rgb(250 204 21)" bgColor="rgb(252 165 165 / 0.2)" />
                                    <CarCard name="Nathan" position={2} progress={72} bgColor="rgb(147 197 253 / 0.2)" />
                                    <CarCard name="Benjamin" position={3} progress={63} bgColor="rgb(134 239 172 / 0.2)" />
                                </div>
                            </div>

                            {/* Legend */}
                            <div className="mt-6 flex flex-wrap gap-6 border-t border-white/5 pt-6">
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full bg-green-500" />
                                    <span className="text-xs text-gray-400">Départ</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full bg-red-500" />
                                    <span className="text-xs text-gray-400">Arrivée</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Zap className="h-3 w-3 text-yellow-400" />
                                    <span className="text-xs text-gray-400">Leader</span>
                                </div>
                            </div>
                        </div>

                        {/* Leaderboard Section */}
                        <div className="overflow-hidden rounded-xl border border-white/10 bg-[#1a1a1a]">
                            {/* Leaderboard Header */}
                            <div className="border-b border-white/5 px-6 py-4 md:px-8">
                                <h2 className="text-lg font-semibold text-white">Classement</h2>
                            </div>

                            {/* Leaderboard Rows */}
                            <div className="divide-y divide-white/5">
                                {/* Row 1 - Leader with gold */}
                                <div className="group relative overflow-hidden bg-gradient-to-r from-yellow-500/5 via-transparent to-transparent px-6 py-5 transition-colors hover:bg-white/5 md:px-8">
                                    <div className="flex items-center justify-between gap-4">
                                        {/* Rank + Car + Name */}
                                        <div className="flex min-w-0 flex-1 items-center gap-4">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/20">
                                                <Trophy01 className="h-5 w-5 text-yellow-400" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-white">Antoine Moulin</p>
                                                <p className="text-xs text-gray-500">F1 Red Dragon • Champion</p>
                                            </div>
                                        </div>

                                        {/* Stats */}
                                        <div className="flex items-center gap-6 md:gap-8">
                                            {/* Tasks */}
                                            <div className="text-right">
                                                <p className="text-xs text-gray-500">Tâches</p>
                                                <p className="text-sm font-bold text-white">24</p>
                                            </div>

                                            {/* Points */}
                                            <div className="text-right">
                                                <p className="text-xs text-gray-500">Points</p>
                                                <p className="flex items-center gap-1 text-sm font-bold text-yellow-400">
                                                    <TrendUp01 className="h-4 w-4" />
                                                    2,450
                                                </p>
                                            </div>

                                            {/* Progress Bar */}
                                            <div className="hidden w-24 md:block">
                                                <div className="h-2 overflow-hidden rounded-full bg-gray-700">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all"
                                                        style={{ width: "85%" }}
                                                    />
                                                </div>
                                                <p className="mt-1 text-xs text-gray-500">85%</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Row 2 */}
                                <div className="group relative overflow-hidden px-6 py-5 transition-colors hover:bg-white/5 md:px-8">
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex min-w-0 flex-1 items-center gap-4">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-700/50 text-sm font-bold text-white">
                                                2
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-white">Léa Dupont</p>
                                                <p className="text-xs text-gray-500">F1 Ocean Blue • Rising Star</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6 md:gap-8">
                                            <div className="text-right">
                                                <p className="text-xs text-gray-500">Tâches</p>
                                                <p className="text-sm font-bold text-white">19</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-gray-500">Points</p>
                                                <p className="flex items-center gap-1 text-sm font-bold text-blue-400">
                                                    <TrendUp01 className="h-4 w-4" />
                                                    1,880
                                                </p>
                                            </div>
                                            <div className="hidden w-24 md:block">
                                                <div className="h-2 overflow-hidden rounded-full bg-gray-700">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-blue-400 to-blue-500 transition-all"
                                                        style={{ width: "72%" }}
                                                    />
                                                </div>
                                                <p className="mt-1 text-xs text-gray-500">72%</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Row 3 */}
                                <div className="group relative overflow-hidden px-6 py-5 transition-colors hover:bg-white/5 md:px-8">
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex min-w-0 flex-1 items-center gap-4">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-700/50 text-sm font-bold text-white">
                                                3
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-white">Thomas Martin</p>
                                                <p className="text-xs text-gray-500">F1 Sunset Orange • Competitor</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6 md:gap-8">
                                            <div className="text-right">
                                                <p className="text-xs text-gray-500">Tâches</p>
                                                <p className="text-sm font-bold text-white">16</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-gray-500">Points</p>
                                                <p className="flex items-center gap-1 text-sm font-bold text-orange-400">
                                                    <TrendUp01 className="h-4 w-4" />
                                                    1,420
                                                </p>
                                            </div>
                                            <div className="hidden w-24 md:block">
                                                <div className="h-2 overflow-hidden rounded-full bg-gray-700">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-orange-400 to-orange-500 transition-all"
                                                        style={{ width: "58%" }}
                                                    />
                                                </div>
                                                <p className="mt-1 text-xs text-gray-500">58%</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Row 4 */}
                                <div className="group relative overflow-hidden px-6 py-5 transition-colors hover:bg-white/5 md:px-8">
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex min-w-0 flex-1 items-center gap-4">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-700/50 text-sm font-bold text-white">
                                                4
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-white">Sophie Chen</p>
                                                <p className="text-xs text-gray-500">F1 Neon Green • Rookie</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6 md:gap-8">
                                            <div className="text-right">
                                                <p className="text-xs text-gray-500">Tâches</p>
                                                <p className="text-sm font-bold text-white">12</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-gray-500">Points</p>
                                                <p className="flex items-center gap-1 text-sm font-bold text-green-400">
                                                    <TrendUp01 className="h-4 w-4" />
                                                    980
                                                </p>
                                            </div>
                                            <div className="hidden w-24 md:block">
                                                <div className="h-2 overflow-hidden rounded-full bg-gray-700">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-green-400 to-green-500 transition-all"
                                                        style={{ width: "42%" }}
                                                    />
                                                </div>
                                                <p className="mt-1 text-xs text-gray-500">42%</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Voir plus */}
                                <div className="px-6 py-5 text-center md:px-8">
                                    <button className="text-sm font-semibold text-brand-secondary transition hover:text-brand-primary">
                                        Voir les 9 autres participants →
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Info Cards */}
                    <div className="grid gap-6 md:grid-cols-3">
                        {/* Card 1 */}
                        <div className="rounded-xl border border-gray-200 bg-secondary p-6 dark:border-gray-800">
                            <div className="mb-3 inline-flex rounded-lg bg-brand-secondary/10 p-3">
                                <Target01 className="h-6 w-6 text-brand-secondary" />
                            </div>
                            <h3 className="font-semibold text-primary">Objectif hebdo</h3>
                            <p className="mt-2 text-sm text-tertiary">Complétez 10 tâches pour débloquer la F1 Rare "Stripes".</p>
                        </div>

                        {/* Card 2 */}
                        <div className="rounded-xl border border-gray-200 bg-secondary p-6 dark:border-gray-800">
                            <div className="mb-3 inline-flex rounded-lg bg-yellow-500/10 p-3">
                                <Trophy01 className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                            </div>
                            <h3 className="font-semibold text-primary">Récompenses</h3>
                            <p className="mt-2 text-sm text-tertiary">Le champion reçoit +500 pts et une F1 Épique exclusive.</p>
                        </div>

                        {/* Card 3 */}
                        <div className="rounded-xl border border-gray-200 bg-secondary p-6 dark:border-gray-800">
                            <div className="mb-3 inline-flex rounded-lg bg-brand-secondary/10 p-3">
                                <Zap className="h-6 w-6 text-brand-secondary" />
                            </div>
                            <h3 className="font-semibold text-primary">Fins dans</h3>
                            <p className="mt-2 text-sm text-tertiary">La ligue se termine le 02 janvier à 23h59. Accélérez !</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-gray-200 bg-secondary py-12 dark:border-gray-800">
                <div className="mx-auto max-w-container px-4 md:px-8">
                    <div className="grid gap-8 md:grid-cols-4">
                        <div>
                            <p className="font-semibold text-primary">Monki</p>
                            <p className="mt-2 text-sm text-tertiary">Gamifiez votre productivité en groupe.</p>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-primary">Produit</p>
                            <ul className="mt-4 space-y-2 text-sm text-tertiary">
                                <li>
                                    <a href="#" className="hover:text-primary">
                                        Features
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-primary">
                                        Pricing
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-primary">Ressources</p>
                            <ul className="mt-4 space-y-2 text-sm text-tertiary">
                                <li>
                                    <a href="#" className="hover:text-primary">
                                        Blog
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-primary">
                                        Aide
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-primary">Légal</p>
                            <ul className="mt-4 space-y-2 text-sm text-tertiary">
                                <li>
                                    <a href="#" className="hover:text-primary">
                                        Confidentialité
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-primary">
                                        Conditions
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-8 border-t border-gray-200 pt-8 text-center text-sm text-tertiary dark:border-gray-800">
                        <p>© 2025 Monki. Tous droits réservés.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
