"use client";

import { useState } from "react";
import { Trophy01, Flag03, Users01, AlertCircle, ArrowRight, Zap } from "@untitledui/icons";
import MyLobbiesPart from "./my-lobbies-part";

// ============================================================================
// Constants
// ============================================================================

const MAX_SALONS_PER_USER = 20; // Whitepaper section 17

// ============================================================================
// StatsCard - Stats globales utilisateur
// ============================================================================
interface GlobalStats {
    totalRaces: number;
    racesWon: number;
    seasonsWon: number;
    totalSalons: number;
}


 const StatsCard = ({ stats }: { stats: GlobalStats }) => {
    const statItems = [
        { label: "Courses jouées", value: stats.totalRaces, icon: Flag03 },
        { label: "Victoires", value: stats.racesWon, icon: Trophy01 },
        { label: "Saisons gagnées", value: stats.seasonsWon, icon: Trophy01, highlight: true },
        { label: "Salons actifs", value: stats.totalSalons, icon: Users01 },
    ];

    return (
        <div className="rounded-2xl border border-primary/10 bg-gray-100 p-4 dark:bg-gray-900">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-tertiary">
                Mes Stats
            </h3>
            <div className="space-y-3">
                {statItems.map((item) => (
                    <div key={item.label} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <item.icon className="size-4 text-quaternary" />
                            <span className="text-sm text-secondary">{item.label}</span>
                        </div>
                        <span
                            className={`text-sm font-semibold ${
                                item.highlight && item.value > 0
                                    ? "text-amber-500"
                                    : "text-primary"
                            }`}
                        >
                            {item.highlight && item.value > 0 && "🏆 "}
                            {item.value}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};
// ============================================================================
// SalonsLimitIndicator - Indicateur X/20 salons
// ============================================================================

const SalonsLimitIndicator = ({ current }: { current: number }) => {
    const percentage = (current / MAX_SALONS_PER_USER) * 100;
    const isNearLimit = current >= MAX_SALONS_PER_USER - 2;
    const isAtLimit = current >= MAX_SALONS_PER_USER;

    return (
        <div className="rounded-2xl border border-primary/10 bg-gray-100 p-4 dark:bg-gray-900">
            <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Users01 className="size-4 text-tertiary" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-tertiary">
                        Mes salons
                    </span>
                </div>
                <span 
                    className={`text-sm font-semibold tabular-nums ${
                        isAtLimit ? "text-error-500" : isNearLimit ? "text-warning-500" : "text-primary"
                    }`}
                >
                    {current}/{MAX_SALONS_PER_USER}
                </span>
            </div>
            
            {/* Progress bar */}
            <div className="h-2 overflow-hidden rounded-full bg-secondary">
                <div
                    className={`h-full rounded-full transition-all duration-500 ${
                        isAtLimit 
                            ? "bg-error-500" 
                            : isNearLimit 
                                ? "bg-warning-500" 
                                : "bg-brand-500"
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                />
            </div>
            
            {isAtLimit && (
                <p className="mt-2 text-xs text-error-500">
                    Limite atteinte. Quitte un salon pour en rejoindre un nouveau.
                </p>
            )}
        </div>
    );
};

// ============================================================================
// JoinByCodeCard - Rejoindre un salon par code
// Endpoint: POST /api/salons/join { code: string }
// Errors: 404 (code invalide), 400 (déjà membre, limite atteinte)
// ============================================================================

const JoinByCodeCard = ({ 
    currentSalonsCount,
    onJoinSuccess 
}: { 
    currentSalonsCount: number;
    onJoinSuccess?: (salon: { id: string; name: string; code: string }) => void;
}) => {
    const [code, setCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isAtLimit = currentSalonsCount >= MAX_SALONS_PER_USER;
    const isValidCode = /^[A-Z0-9]{6}$/.test(code);

    const handleSubmit = async () => {
        if (!isValidCode || isAtLimit) return;

        setIsLoading(true);
        setError(null);

        try {
            // TODO: Remplacer par l'appel API réel
            // const response = await fetch('/api/salons/join', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ code }),
            // });
            
            // Simulation
            await new Promise((resolve) => setTimeout(resolve, 1000));
            
            // Mock: 10% chance d'erreur pour tester
            if (Math.random() < 0.1) {
                throw new Error("Code invalide");
            }

            // Succès
            onJoinSuccess?.({ 
                id: crypto.randomUUID(), 
                name: `Salon ${code}`, 
                code 
            });
            setCode("");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Une erreur est survenue");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCodeChange = (value: string) => {
        // Forcer uppercase et filtrer caractères invalides
        const cleaned = value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
        setCode(cleaned);
        setError(null);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && isValidCode && !isAtLimit) {
            handleSubmit();
        }
    };

    return (
        <div className="rounded-2xl border border-primary/10 bg-gray-100 p-4 dark:bg-gray-900">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-tertiary">
                Rejoindre un salon
            </h3>
            
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <input
                        type="text"
                        value={code}
                        onChange={(e) => handleCodeChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="ABC123"
                        disabled={isAtLimit || isLoading}
                        maxLength={6}
                        className={`
                            w-full rounded-lg border bg-primary px-3 py-2.5 
                            font-mono text-sm uppercase tracking-[0.2em] text-primary 
                            placeholder:font-sans placeholder:tracking-normal placeholder:text-quaternary 
                            focus:outline-none focus:ring-2 focus:ring-brand-500/50
                            disabled:cursor-not-allowed disabled:opacity-50
                            dark:bg-gray-800
                            ${error ? "border-error-500" : "border-primary/20"}
                        `}
                    />
                    {code.length > 0 && code.length < 6 && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-quaternary">
                            {code.length}/6
                        </span>
                    )}
                </div>
                
                <button
                    onClick={handleSubmit}
                    disabled={!isValidCode || isAtLimit || isLoading}
                    className={`
                        flex items-center justify-center rounded-lg px-4 py-2.5 
                        text-sm font-semibold text-white transition-all
                        disabled:cursor-not-allowed disabled:opacity-50
                        ${isValidCode && !isAtLimit
                            ? "bg-brand-600 hover:bg-brand-700 active:scale-95"
                            : "bg-gray-400 dark:bg-gray-600"
                        }
                    `}
                >
                    {isLoading ? (
                        <div className="size-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    ) : (
                        <ArrowRight className="size-5" />
                    )}
                </button>
            </div>

            {/* Error message */}
            {error && (
                <div className="mt-2 flex items-center gap-1.5 text-xs text-error-500">
                    <AlertCircle className="size-3.5" />
                    <span>{error}</span>
                </div>
            )}

            {/* Limit warning */}
            {isAtLimit && (
                <p className="mt-2 text-xs text-tertiary">
                    Tu as atteint la limite de {MAX_SALONS_PER_USER} salons.
                </p>
            )}
        </div>
    );
};

// ============================================================================
// TipsCard - Conseils rapides
// ============================================================================

const TipsCard = () => {
    const tips = [
        { icon: Zap, text: "Valide des tâches pour faire avancer ta voiture" },
        { icon: Trophy01, text: "Gagne des courses pour monter dans le classement" },
        { icon: Flag03, text: "Le vainqueur de saison reçoit le trophée 🏆" },
    ];

    const [currentTip, setCurrentTip] = useState(0);

    // Rotation automatique des tips
    useState(() => {
        const interval = setInterval(() => {
            setCurrentTip((prev) => (prev + 1) % tips.length);
        }, 5000);
        return () => clearInterval(interval);
    });

    const tip = tips[currentTip];

    return (
        <div className="rounded-2xl border border-primary/10 bg-gradient-to-br from-brand-50 to-brand-100/50 p-4 dark:from-brand-950/50 dark:to-brand-900/30">
            <div className="flex items-start gap-3">
                <div className="flex size-8 flex-shrink-0 items-center justify-center rounded-lg bg-brand-500/20">
                    <tip.icon className="size-4 text-brand-600 dark:text-brand-400" />
                </div>
                <div>
                    <p className="text-xs font-medium text-brand-700 dark:text-brand-300">
                        Astuce
                    </p>
                    <p className="mt-0.5 text-sm text-brand-900 dark:text-brand-100">
                        {tip.text}
                    </p>
                </div>
            </div>
            
            {/* Dots indicator */}
            <div className="mt-3 flex justify-center gap-1.5">
                {tips.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentTip(index)}
                        className={`size-1.5 rounded-full transition-all ${
                            index === currentTip 
                                ? "bg-brand-500 w-3" 
                                : "bg-brand-300 dark:bg-brand-700"
                        }`}
                    />
                ))}
            </div>
        </div>
    );
};

// ============================================================================
// LobbiesPage - Page principale
// ============================================================================

const LobbiesPage = () => {
    // TODO: Récupérer depuis l'API GET /api/auth/me
    const userStats: GlobalStats = {
        totalRaces: 24,
        racesWon: 7,
        seasonsWon: 2,
        totalSalons: 3,
    };

    // Callback quand un salon est rejoint via code
    const handleJoinSuccess = (salon: { id: string; name: string; code: string }) => {
        // TODO: Refresh la liste des salons ou ajouter à la liste locale
        console.log("Joined salon:", salon);
        // Potentiellement naviguer vers le salon
        // router.push(`/lobbies/${salon.id}`);
    };

    return (
        <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
                {/* Left column - MES SALONS (main content) */}
                <div className="min-h-[400px] flex-1 lg:min-h-[calc(100vh-12rem)]">
                    <MyLobbiesPart />
                </div>

                {/* Right column - Sidebar */}
                <div className="flex w-full flex-col gap-4 lg:w-[280px] lg:flex-shrink-0">
                    {/* Rejoindre par code */}
                    <JoinByCodeCard 
                        currentSalonsCount={userStats.totalSalons}
                        onJoinSuccess={handleJoinSuccess}
                    />

                    {/* Indicateur limite salons */}
                    <SalonsLimitIndicator current={userStats.totalSalons} />

                    {/* Stats globales */}
                    <StatsCard stats={userStats} />

                    {/* Tips rotatifs */}
                    <TipsCard />
                </div>
            </div>
        </div>
    );
};

export default LobbiesPage;