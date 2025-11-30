"use client";

import { useState } from "react";
import { Grid01, List, Plus, Trophy01, Users03 } from "@untitledui/icons";
import { Button, Group } from "react-aria-components";
import { Avatar } from "@/components/base/avatar/avatar";
import { BadgeWithDot } from "@/components/base/badges/badges";
import { CreateLobbyModal } from "./create-lobbby-modal";

// Mesh gradient presets - modern aurora-style gradients
const GRADIENT_PRESETS = {
    jade: {
        background: `
            radial-gradient(ellipse at 20% 0%, #86efac 0%, transparent 50%),
            radial-gradient(ellipse at 80% 100%, #065f46 0%, transparent 50%),
            linear-gradient(160deg, #4ade80 0%, #16a34a 40%, #166534 100%)
        `,
    },
    arctic: {
        background: `
            radial-gradient(ellipse at 30% 20%, #22d3ee 0%, transparent 45%),
            radial-gradient(ellipse at 70% 80%, #0c4a6e 0%, transparent 50%),
            linear-gradient(165deg, #06b6d4 0%, #0e7490 35%, #164e63 65%, #0f172a 100%)
        `,
    },
    aurora: {
        background: `
            radial-gradient(ellipse at 70% 20%, #f472b6 0%, transparent 40%),
            radial-gradient(ellipse at 20% 80%, #1e3a8a 0%, transparent 50%),
            linear-gradient(150deg, #1e3a5f 0%, #4c1d95 40%, #be185d 80%, #f472b6 100%)
        `,
    },
    rose: {
        background: `
            radial-gradient(ellipse at 80% 20%, #fda4af 0%, transparent 40%),
            radial-gradient(ellipse at 20% 90%, #9f1239 0%, transparent 50%),
            linear-gradient(145deg, #fecdd3 0%, #fb7185 30%, #e11d48 60%, #be123c 100%)
        `,
    },
    ocean: {
        background: `
            radial-gradient(ellipse at 25% 15%, #5eead4 0%, transparent 45%),
            radial-gradient(ellipse at 75% 85%, #134e4a 0%, transparent 50%),
            linear-gradient(155deg, #2dd4bf 0%, #14b8a6 35%, #0f766e 70%, #115e59 100%)
        `,
    },
    ember: {
        background: `
            radial-gradient(ellipse at 30% 10%, #fcd34d 0%, transparent 40%),
            radial-gradient(ellipse at 70% 90%, #7c2d12 0%, transparent 50%),
            linear-gradient(150deg, #fbbf24 0%, #f97316 35%, #ea580c 65%, #9a3412 100%)
        `,
    },
    midnight: {
        background: `
            radial-gradient(ellipse at 25% 25%, #a78bfa 0%, transparent 40%),
            radial-gradient(ellipse at 75% 75%, #1e1b4b 0%, transparent 50%),
            linear-gradient(160deg, #8b5cf6 0%, #6d28d9 35%, #4c1d95 70%, #2e1065 100%)
        `,
    },
    steel: {
        background: `
            radial-gradient(ellipse at 20% 20%, #94a3b8 0%, transparent 45%),
            radial-gradient(ellipse at 80% 80%, #0f172a 0%, transparent 50%),
            linear-gradient(155deg, #64748b 0%, #475569 40%, #334155 70%, #1e293b 100%)
        `,
    },
} as const;

type GradientPreset = keyof typeof GRADIENT_PRESETS;

// Types
interface SalonMember {
    id: string;
    username: string;
    avatarUrl?: string;
}

interface Salon {
    id: string;
    name: string;
    code: string;
    gradient: GradientPreset;
    members: SalonMember[];
    membersCount: number;
    role: "admin" | "co_admin" | "member";
    currentSeason: number;
    hasActiveCourse: boolean;
    lastSeasonWinner?: {
        username: string;
        seasonsWon: number;
    };
}

type ViewMode = "grid" | "list";

// Mock data
const mockSalons: Salon[] = [
    {
        id: "1",
        name: "EPITA Piscine 2025",
        code: "ABC123",
        gradient: "jade",
        members: [
            { id: "1", username: "Alice", avatarUrl: "https://www.untitledui.com/images/avatars/olivia-rhye?fm=webp&q=80" },
            { id: "2", username: "Bob", avatarUrl: "https://www.untitledui.com/images/avatars/phoenix-baker?fm=webp&q=80" },
            { id: "3", username: "Charlie", avatarUrl: "https://www.untitledui.com/images/avatars/lana-steiner?fm=webp&q=80" },
            { id: "4", username: "Diana", avatarUrl: "https://www.untitledui.com/images/avatars/demi-wilkinson?fm=webp&q=80" },
        ],
        membersCount: 12,
        role: "admin",
        currentSeason: 3,
        hasActiveCourse: true,
        lastSeasonWinner: { username: "Alice", seasonsWon: 2 },
    },
    {
        id: "2",
        name: "Projet Startup",
        code: "XYZ789",
        gradient: "aurora",
        members: [
            { id: "5", username: "Eve", avatarUrl: "https://www.untitledui.com/images/avatars/candice-wu?fm=webp&q=80" },
            { id: "6", username: "Frank", avatarUrl: "https://www.untitledui.com/images/avatars/natali-craig?fm=webp&q=80" },
        ],
        membersCount: 5,
        role: "member",
        currentSeason: 1,
        hasActiveCourse: false,
    },
    {
        id: "3",
        name: "Fitness Challenge",
        code: "FIT456",
        gradient: "ocean",
        members: [
            { id: "7", username: "Grace", avatarUrl: "https://www.untitledui.com/images/avatars/drew-cano?fm=webp&q=80" },
            { id: "8", username: "Henry", avatarUrl: "https://www.untitledui.com/images/avatars/orlando-diggs?fm=webp&q=80" },
            { id: "9", username: "Ivy", avatarUrl: "https://www.untitledui.com/images/avatars/andi-lane?fm=webp&q=80" },
        ],
        membersCount: 8,
        role: "co_admin",
        currentSeason: 2,
        hasActiveCourse: true,
        lastSeasonWinner: { username: "Bob", seasonsWon: 1 },
    },
    {
        id: "4",
        name: "Weekend Warriors",
        code: "WAR999",
        gradient: "ember",
        members: [{ id: "10", username: "Jack", avatarUrl: "https://www.untitledui.com/images/avatars/kate-morrison?fm=webp&q=80" }],
        membersCount: 15,
        role: "member",
        currentSeason: 5,
        hasActiveCourse: false,
        lastSeasonWinner: { username: "Jack", seasonsWon: 3 },
    },
];

// Role badge component
const RoleBadge = ({ role }: { role: Salon["role"] }) => {
    const config: Record<Salon["role"], { color: "brand" | "purple" | "gray"; label: string }> = {
        admin: { color: "brand", label: "Admin" },
        co_admin: { color: "purple", label: "Co-admin" },
        member: { color: "gray", label: "Membre" },
    };
    return (
        <BadgeWithDot color={config[role].color} type="modern" size="sm">
            {config[role].label}
        </BadgeWithDot>
    );
};

// Salon Card - Grid View
const SalonCardGrid = ({ salon }: { salon: Salon }) => {
    const extraMembers = salon.membersCount - salon.members.length;

    return (
        <a
        href={`/lobbies/${salon.id}/hub`}
            className="group relative flex flex-col overflow-hidden rounded-2xl bg-gray-100 ring-1 ring-primary/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xs hover:shadow-black/20 hover:ring-primary/20 dark:bg-gray-900"
        >
            {/* Gradient Header Zone */}
            <div className="relative h-32" style={GRADIENT_PRESETS[salon.gradient]}>
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute right-4 top-4 h-20 w-20 rounded-full bg-white/20 blur-2xl" />
                    <div className="absolute bottom-2 left-6 h-12 w-12 rounded-full bg-black/10 blur-xl" />
                </div>

                <div className="absolute left-3 top-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-black/30 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                        S{salon.currentSeason}
                    </span>
                </div>

                {salon.lastSeasonWinner && (
                    <div className="absolute right-3 top-3">
                        <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500/90 px-2.5 py-1 text-xs font-semibold text-yellow-950 backdrop-blur-sm">
                            <Trophy01 className="h-3.5 w-3.5" />
                            {salon.lastSeasonWinner.seasonsWon > 1 && `×${salon.lastSeasonWinner.seasonsWon}`}
                        </span>
                    </div>
                )}

                {salon.hasActiveCourse && (
                    <div className="absolute bottom-3 right-3">
                        <BadgeWithDot color="success" type="modern" size="sm">
                            En cours
                        </BadgeWithDot>
                    </div>
                )}
            </div>

            {/* Content Zone */}
            <div className="flex flex-1 flex-col gap-3 p-4">
                <div>
                    <h3 className="line-clamp-1 text-base font-semibold text-primary">{salon.name}</h3>
                    <p className="mt-0.5 text-sm text-tertiary">
                        Code: <span className="font-mono text-secondary">{salon.code}</span>
                    </p>
                </div>

                <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2">
                        <div className="flex -space-x-1.5">
                            {salon.members.slice(0, 4).map((member) => (
                                <Avatar key={member.id} className="ring-2 ring-bg-primary" size="xs" src={member.avatarUrl} alt={member.username} />
                            ))}
                            {extraMembers > 0 && (
                                <Avatar
                                    size="xs"
                                    className="ring-2 ring-bg-primary"
                                    placeholder={
                                        <span className="flex items-center justify-center text-[10px] font-semibold text-quaternary">+{extraMembers}</span>
                                    }
                                />
                            )}
                        </div>
                        <span className="text-sm text-tertiary">{salon.membersCount} joueurs</span>
                    </div>

                    <RoleBadge role={salon.role} />
                </div>
            </div>
        </a>
    );
};

// Salon Card - List View
const SalonCardList = ({ salon }: { salon: Salon }) => {
    const extraMembers = salon.membersCount - salon.members.length;

    return (
        <a
        href={`/lobbies/${salon.id}/hub`}
        className="group flex items-center gap-4 rounded-xl bg-primary p-3 ring-1 ring-primary/10 transition-all duration-200 hover:shadow-lg hover:ring-primary/20"
        >
            <div className="relative h-14 w-14 flex-shrink-0 rounded-lg" style={GRADIENT_PRESETS[salon.gradient]}>
                {salon.lastSeasonWinner && <Trophy01 className="absolute bottom-1 right-1 h-4 w-4 text-yellow-300 drop-shadow-md" />}
                {salon.hasActiveCourse && (
                    <span className="absolute -right-1 -top-1 h-3 w-3 animate-pulse rounded-full border-2 border-bg-primary bg-green-500" />
                )}
            </div>

            <div className="flex flex-1 flex-col gap-1">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-primary">{salon.name}</span>
                    <span className="rounded bg-secondary px-1.5 py-0.5 font-mono text-xs text-tertiary">{salon.code}</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex -space-x-1">
                        {salon.members.slice(0, 3).map((member) => (
                            <Avatar key={member.id} className="ring-[1.5px] ring-bg-primary" size="xxs" src={member.avatarUrl} alt={member.username} />
                        ))}
                        {extraMembers > 0 && (
                            <Avatar
                                size="xxs"
                                className="ring-[1.5px] ring-bg-primary"
                                placeholder={<span className="flex items-center justify-center text-[9px] font-semibold text-quaternary">+{extraMembers}</span>}
                            />
                        )}
                    </div>
                    <span className="text-xs text-tertiary">
                        {salon.membersCount} joueurs • Saison {salon.currentSeason}
                    </span>
                </div>
            </div>

            <RoleBadge role={salon.role} />
        </a>
    );
};

// Create Salon Card - Grid View (now a button)
const CreateLobbyCardGrid = ({ onClick }: { onClick: () => void }) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className="group relative flex min-h-[13.5rem] cursor-pointer flex-col items-center justify-center gap-4 overflow-hidden rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 transition-colors duration-200 hover:border-gray-400 hover:bg-gray-100/80 dark:border-gray-700 dark:bg-gray-800/50 dark:hover:border-gray-600 dark:hover:bg-gray-800"
        >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white ring-1 ring-gray-200 transition-all duration-300 group-hover:scale-110 group-hover:shadow-md group-hover:ring-gray-300 dark:bg-gray-700 dark:ring-gray-600 dark:group-hover:ring-gray-500">
                <Plus className="h-6 w-6 text-gray-400 transition-colors group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300" />
            </div>

            <div className="flex flex-col items-center gap-1">
                <span className="text-base font-semibold text-gray-600 dark:text-gray-400">Créer un salon</span>
                <span className="text-sm text-gray-400 dark:text-gray-500">Invite tes amis et lance des courses</span>
            </div>
        </button>
    );
};

// Create Salon Card - List View (now a button)
const CreateLobbyCardList = ({ onClick }: { onClick: () => void }) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className="group flex cursor-pointer items-center gap-4 rounded-xl border-2 border-dashed border-primary/20 bg-primary p-3 transition-all duration-200 hover:border-primary/40 hover:shadow-lg"
        >
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg bg-secondary/50">
                <Plus className="h-6 w-6 text-tertiary transition-colors group-hover:text-primary" />
            </div>

            <div className="flex flex-1 flex-col gap-0.5 text-left">
                <span className="text-sm font-semibold text-secondary transition-colors group-hover:text-primary">Créer un salon</span>
                <span className="text-xs text-tertiary">Invite tes amis et lance des courses</span>
            </div>
        </button>
    );
};

// View Toggle Button Group
const ViewToggle = ({ viewMode, onChange }: { viewMode: ViewMode; onChange: (mode: ViewMode) => void }) => (
    <Group className="inline-flex rounded-lg bg-secondary p-1 ring-1 ring-primary/5">
        <Button
            onPress={() => onChange("grid")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium outline-none transition-all ${
                viewMode === "grid" ? "bg-primary text-primary shadow-sm" : "text-tertiary hover:text-primary"
            }`}
        >
            <Grid01 className="h-4 w-4" />
            <span className="hidden sm:inline">Grille</span>
        </Button>
        <Button
            onPress={() => onChange("list")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium outline-none transition-all ${
                viewMode === "list" ? "bg-primary text-primary shadow-sm" : "text-tertiary hover:text-primary"
            }`}
        >
            <List className="h-4 w-4" />
            <span className="hidden sm:inline">Liste</span>
        </Button>
    </Group>
);

// Main Component
const MyLobbiesPart = () => {
    const [viewMode, setViewMode] = useState<ViewMode>("grid");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [salons, setSalons] = useState<Salon[]>(mockSalons);

    // TODO: Récupérer depuis le contexte auth
    const isUserVerified = true;

    const handleSalonCreated = (newSalon: { id: string; name: string; code: string }) => {
        // Ajouter le nouveau salon à la liste (en prod, refetch depuis l'API)
        const randomGradients: GradientPreset[] = ["jade", "arctic", "aurora", "rose", "ocean", "ember", "midnight", "steel"];
        const randomGradient = randomGradients[Math.floor(Math.random() * randomGradients.length)];

        setSalons((prev) => [
            ...prev,
            {
                ...newSalon,
                gradient: randomGradient,
                members: [],
                membersCount: 1,
                role: "admin" as const,
                currentSeason: 1,
                hasActiveCourse: false,
            },
        ]);
    };

    return (
        <div className="flex h-full flex-col">
            {/* Header */}
            <div className="flex items-center justify-between pb-4">
                <div className="flex items-center gap-3">
                    <Users03 className="h-5 w-5 text-tertiary" />
                    <h3 className="text-base font-semibold text-primary">Mes Salons</h3>
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-tertiary">{salons.length}</span>
                </div>
                <ViewToggle viewMode={viewMode} onChange={setViewMode} />
            </div>

            {/* Salons list */}
            <div className="flex-1 overflow-y-visible">
                {viewMode === "grid" ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {salons.map((salon) => (
                            <SalonCardGrid key={salon.id} salon={salon} />
                        ))}
                        <CreateLobbyCardGrid onClick={() => setIsCreateModalOpen(true)} />
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {salons.map((salon) => (
                            <SalonCardList key={salon.id} salon={salon} />
                        ))}
                        <CreateLobbyCardList onClick={() => setIsCreateModalOpen(true)} />
                    </div>
                )}
            </div>

            {/* Create Salon Modal */}
            <CreateLobbyModal
                isOpen={isCreateModalOpen}
                onOpenChange={setIsCreateModalOpen}
                isUserVerified={isUserVerified}
                onSalonCreated={handleSalonCreated}
            />
        </div>
    );
};

export default MyLobbiesPart;