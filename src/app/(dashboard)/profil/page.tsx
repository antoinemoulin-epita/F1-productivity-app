"use client";

import { useState } from "react";
import { ArrowLeft, Check, Edit02, HomeLine, Lock01, Star01, Trophy01, User01, X } from "@untitledui/icons";
import { motion } from "motion/react";
import { Breadcrumbs } from "@/components/application/breadcrumbs/breadcrumbs";
import { SectionHeader } from "@/components/application/section-headers/section-headers";
import { AvatarProfilePhoto } from "@/components/base/avatar/avatar-profile-photo";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { cx } from "@/utils/cx";

// ============================================================================
// TYPES
// ============================================================================

type CarRarity = "common" | "rare" | "epic" | "legendary";

interface AvatarData {
    id: string;
    name: string;
    imageUrl?: string;
}

interface CarData {
    id: string;
    name: string;
    rarity: CarRarity;
    imageUrl?: string;
    isOwned: boolean;
}

interface SalonPalmares {
    id: string;
    name: string;
    seasonsWon: number;
    racesWon: number;
    racesParticipated: number;
    avgPosition: number;
    currentSeasonPosition: number;
    currentSeasonPoints: number;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const GRADIENT_PRESETS = {
    midnight: {
        background: `
            radial-gradient(ellipse at 25% 25%, #a78bfa 0%, transparent 40%),
            radial-gradient(ellipse at 75% 75%, #1e1b4b 0%, transparent 50%),
            linear-gradient(160deg, #8b5cf6 0%, #6d28d9 35%, #4c1d95 70%, #2e1065 100%)
        `,
    },
} as const;

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

const rarityConfig: Record<CarRarity, { badgeBg: string; label: string }> = {
    common: { badgeBg: "bg-gray-500", label: "Common" },
    rare: { badgeBg: "bg-blue-600", label: "Rare" },
    epic: { badgeBg: "bg-purple-600", label: "Epic" },
    legendary: { badgeBg: "bg-amber-500", label: "Legendary" },
};

// Mock data - Avatars
const AVATARS: AvatarData[] = [
    { id: "pilote-rouge", name: "Pilote Rouge" },
    { id: "pilote-bleu", name: "Pilote Bleu" },
    { id: "pilote-vert", name: "Pilote Vert" },
    { id: "pilote-jaune", name: "Pilote Jaune" },
    { id: "pilote-noir", name: "Pilote Noir" },
    { id: "pilote-blanc", name: "Pilote Blanc" },
    { id: "pilote-orange", name: "Pilote Orange" },
    { id: "pilote-violet", name: "Pilote Violet" },
];

// Mock data - Voitures (19 MVP)
const USER_CARS: CarData[] = [
    { id: "rouge", name: "Rouge", rarity: "common", isOwned: true },
    { id: "bleu", name: "Bleu", rarity: "common", isOwned: true },
    { id: "vert", name: "Vert", rarity: "common", isOwned: true },
    { id: "jaune", name: "Jaune", rarity: "common", isOwned: false },
    { id: "noir", name: "Noir", rarity: "common", isOwned: false },
    { id: "scarlet", name: "Scarlet", rarity: "rare", isOwned: true },
    { id: "ocean", name: "Ocean", rarity: "rare", isOwned: false },
    { id: "inferno", name: "Inferno", rarity: "epic", isOwned: true },
    { id: "aurora", name: "Aurora", rarity: "epic", isOwned: false },
    { id: "or-noir", name: "Or Noir", rarity: "legendary", isOwned: false },
];

// Mock data - Palmarès par salon
const USER_PALMARES: SalonPalmares[] = [
    {
        id: "epita-piscine",
        name: "EPITA Piscine",
        seasonsWon: 2,
        racesWon: 7,
        racesParticipated: 12,
        avgPosition: 2.3,
        currentSeasonPosition: 1,
        currentSeasonPoints: 127,
    },
    {
        id: "projet-web",
        name: "Projet Web S2",
        seasonsWon: 0,
        racesWon: 2,
        racesParticipated: 5,
        avgPosition: 3.8,
        currentSeasonPosition: 3,
        currentSeasonPoints: 45,
    },
    {
        id: "team-algo",
        name: "Team Algo",
        seasonsWon: 1,
        racesWon: 4,
        racesParticipated: 8,
        avgPosition: 2.1,
        currentSeasonPosition: 2,
        currentSeasonPoints: 89,
    },
];

// ============================================================================
// EDITABLE USERNAME COMPONENT
// ============================================================================

interface EditableUsernameProps {
    value: string;
    onChange: (value: string) => void;
}

function EditableUsername({ value, onChange }: EditableUsernameProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState(value);

    const handleSave = () => {
        if (tempValue.trim().length >= 3) {
            onChange(tempValue.trim());
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        setTempValue(value);
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleSave();
        if (e.key === "Escape") handleCancel();
    };

    if (isEditing) {
        return (
            <div className="flex items-center gap-2">
                <Input
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="max-w-[200px] text-center"
                    autoFocus
                    maxLength={20}
                />
                <Button size="sm" color="primary" onClick={handleSave} iconLeading={Check}>
                    OK
                </Button>
                <Button size="sm" color="secondary" onClick={handleCancel} iconLeading={X}>
                    Annuler
                </Button>
            </div>
        );
    }

    return (
        <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="group flex items-center gap-2 rounded-lg px-2 py-1 transition-colors hover:bg-primary_hover"
        >
            <h1 className="text-xl font-semibold text-primary md:text-display-xs">{value}</h1>
            <Edit02 className="size-4 text-quaternary opacity-0 transition-opacity group-hover:opacity-100" />
        </button>
    );
}

// ============================================================================
// AVATAR CARD COMPONENT
// ============================================================================

interface AvatarCardProps {
    avatar: AvatarData;
    isSelected: boolean;
    onSelect: () => void;
}

function AvatarCard({ avatar, isSelected, onSelect }: AvatarCardProps) {
    return (
        <motion.button
            type="button"
            onClick={onSelect}
            className={cx(
                "group relative flex flex-col items-center gap-2 rounded-xl border-2 p-3 transition-colors",
                isSelected
                    ? "border-brand-600 bg-brand-50 dark:bg-brand-500/10"
                    : "border-primary bg-secondary hover:border-secondary_hover hover:bg-primary_hover",
            )}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
            <div
                className={cx(
                    "relative flex size-14 items-center justify-center rounded-full transition-colors sm:size-16",
                    isSelected ? "bg-brand-100 dark:bg-brand-500/20" : "bg-tertiary",
                )}
            >
                {avatar.imageUrl ? (
                    <img src={avatar.imageUrl} alt={avatar.name} className="size-full rounded-full object-cover" />
                ) : (
                    <User01 className={cx("size-7 sm:size-8", isSelected ? "text-brand-600" : "text-quaternary")} />
                )}

                {isSelected && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -right-1 -bottom-1 flex size-5 items-center justify-center rounded-full bg-brand-600 ring-2 ring-white dark:ring-gray-900"
                    >
                        <Check className="size-3 text-white" strokeWidth={3} />
                    </motion.div>
                )}
            </div>

            <span
                className={cx(
                    "text-xs font-medium sm:text-sm",
                    isSelected ? "text-brand-700 dark:text-brand-400" : "text-secondary",
                )}
            >
                {avatar.name}
            </span>
        </motion.button>
    );
}

// ============================================================================
// CAR CARD COMPONENT
// ============================================================================

interface CarCardSelectProps {
    car: CarData;
    isSelected: boolean;
    onSelect: () => void;
}

function CarCardSelect({ car, isSelected, onSelect }: CarCardSelectProps) {
    const config = rarityConfig[car.rarity];
    const gradient = rarityGradients[car.rarity];
    const isLocked = !car.isOwned;

    return (
        <motion.button
            type="button"
            onClick={() => !isLocked && onSelect()}
            disabled={isLocked}
            className={cx(
                "group relative flex w-full flex-col overflow-hidden rounded-2xl border-2 transition-colors",
                isSelected && !isLocked && "border-brand-600 bg-brand-50 dark:bg-brand-500/10",
                !isSelected && !isLocked && "border-primary bg-secondary hover:border-secondary_hover",
                isLocked && "cursor-not-allowed border-primary bg-secondary opacity-70",
            )}
            whileTap={{ scale: isLocked ? 1 : 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
            {/* Image zone avec gradient aurora */}
            <div
                className={cx("relative h-28 w-full overflow-hidden sm:h-32", isLocked && "grayscale-[50%]")}
                style={{ background: gradient }}
            >
                <div className={cx("absolute inset-0 flex items-center justify-center", isLocked && "blur-[3px]")}>
                    {car.imageUrl ? (
                        <img src={car.imageUrl} alt={car.name} className="h-full w-full object-cover" />
                    ) : (
                        <img src="/car.png" className="mt-4 h-20 drop-shadow-md sm:h-24" alt={car.name} />
                    )}
                </div>

                {/* Badge rareté */}
                <div
                    className={cx(
                        "absolute top-0 left-1/2 z-10 -translate-x-1/2 rounded-b-lg border-2 border-t-0 border-white/30 px-2.5 py-1",
                        config.badgeBg,
                    )}
                >
                    <span className="text-[9px] font-bold tracking-wider text-white uppercase sm:text-[10px]">
                        {config.label}
                    </span>
                </div>

                {/* Lock overlay */}
                {isLocked && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/30">
                        <Lock01 className="size-7 text-white/90" />
                    </div>
                )}

                {/* Check badge */}
                {isSelected && !isLocked && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute right-2 bottom-2 z-20 flex size-6 items-center justify-center rounded-full bg-brand-600 ring-2 ring-white"
                    >
                        <Check className="size-3.5 text-white" strokeWidth={3} />
                    </motion.div>
                )}

                {/* Star favorite */}
                {isSelected && !isLocked && (
                    <div className="absolute top-2 right-2 z-20">
                        <Star01 className="size-5 fill-yellow-400 text-yellow-400 drop-shadow-sm" />
                    </div>
                )}
            </div>

            {/* Info zone */}
            <div className="flex flex-col items-center gap-0.5 px-2 py-3">
                <span className={cx("text-sm font-semibold", isLocked ? "text-quaternary" : "text-primary")}>
                    {car.name}
                </span>
                {isLocked ? (
                    <span className="text-xs text-quaternary">Non débloquée</span>
                ) : (
                    <span className={cx("text-xs", isSelected ? "text-brand-600" : "text-tertiary")}>
                        {isSelected ? "★ Favorite" : "Cliquer pour choisir"}
                    </span>
                )}
            </div>
        </motion.button>
    );
}

// ============================================================================
// PALMARES TAB COMPONENT
// ============================================================================

interface PalmaresTabProps {
    salon: SalonPalmares;
    isActive: boolean;
    onClick: () => void;
}

function PalmaresTab({ salon, isActive, onClick }: PalmaresTabProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cx(
                "relative flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                    ? "bg-primary text-primary shadow-sm"
                    : "text-tertiary hover:bg-primary_hover hover:text-secondary",
            )}
        >
            {salon.name}
            {salon.seasonsWon > 0 && (
                <span className="flex items-center gap-0.5 text-xs text-amber-600">
                    {salon.seasonsWon > 1 ? `${salon.seasonsWon}×` : ""}🏆
                </span>
            )}
        </button>
    );
}

// ============================================================================
// PALMARES CONTENT COMPONENT
// ============================================================================

interface PalmaresContentProps {
    salon: SalonPalmares;
}

function PalmaresContent({ salon }: PalmaresContentProps) {
    const winRate = salon.racesParticipated > 0 
        ? Math.round((salon.racesWon / salon.racesParticipated) * 100) 
        : 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
            {/* Saisons gagnées */}
            <div className="flex flex-col gap-1 rounded-xl border border-secondary bg-secondary p-4">
                <div className="flex items-center gap-2">
                    <Trophy01 className="size-5 text-amber-500" />
                    <span className="text-sm font-medium text-secondary">Saisons gagnées</span>
                </div>
                <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-primary">{salon.seasonsWon}</span>
                    {salon.seasonsWon > 0 && (
                        <span className="text-lg">
                            {Array.from({ length: Math.min(salon.seasonsWon, 5) })
                                .map(() => "🏆")
                                .join("")}
                        </span>
                    )}
                </div>
            </div>

            {/* Courses gagnées */}
            <div className="flex flex-col gap-1 rounded-xl border border-secondary bg-secondary p-4">
                <span className="text-sm font-medium text-secondary">Courses gagnées</span>
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-primary">{salon.racesWon}</span>
                    <span className="text-sm text-tertiary">/ {salon.racesParticipated}</span>
                    <span className="ml-auto rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        {winRate}%
                    </span>
                </div>
            </div>

            {/* Position moyenne */}
            <div className="flex flex-col gap-1 rounded-xl border border-secondary bg-secondary p-4">
                <span className="text-sm font-medium text-secondary">Position moyenne</span>
                <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-primary">{salon.avgPosition.toFixed(1)}</span>
                    <span className="text-sm text-tertiary">/ course</span>
                </div>
            </div>

            {/* Saison en cours */}
            <div className="flex flex-col gap-1 rounded-xl border border-brand-200 bg-brand-50 p-4 dark:border-brand-800 dark:bg-brand-950">
                <span className="text-sm font-medium text-brand-700 dark:text-brand-300">Saison en cours</span>
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-brand-600">#{salon.currentSeasonPosition}</span>
                    <span className="text-sm text-brand-600/70">{salon.currentSeasonPoints} pts</span>
                </div>
            </div>
        </motion.div>
    );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function ProfilPage() {
    const [username, setUsername] = useState("Antoine");
    const [selectedAvatar, setSelectedAvatar] = useState<string>("pilote-bleu");
    const [selectedCar, setSelectedCar] = useState<string>("rouge");
    const [activeSalonId, setActiveSalonId] = useState<string>(USER_PALMARES[0]?.id || "");

    // Tri des voitures: possédées d'abord, puis par rareté (legendary > epic > rare > common)
    const rarityOrder: Record<CarRarity, number> = { legendary: 0, epic: 1, rare: 2, common: 3 };
    const sortedCars = [...USER_CARS].sort((a, b) => {
        if (a.isOwned !== b.isOwned) return a.isOwned ? -1 : 1;
        return rarityOrder[a.rarity] - rarityOrder[b.rarity];
    });

    const ownedCount = USER_CARS.filter((c) => c.isOwned).length;
    const activeSalon = USER_PALMARES.find((s) => s.id === activeSalonId);
    const totalTrophies = USER_PALMARES.reduce((sum, s) => sum + s.seasonsWon, 0);
    const totalRacesWon = USER_PALMARES.reduce((sum, s) => sum + s.racesWon, 0);
    const totalRaces = USER_PALMARES.reduce((sum, s) => sum + s.racesParticipated, 0);

    return (
        <div className="relative flex flex-col items-center bg-primary px-1 pt-1 pb-12">
            {/* Header Gradient */}
            <div
                className="h-40 w-full rounded-xl lg:h-60"
                style={{ background: GRADIENT_PRESETS.midnight.background }}
            />

            {/* Main Content */}
            <div className="relative -mt-12 w-full max-w-(--breakpoint-xl) px-3 md:-mt-16 md:px-8">
                {/* Breadcrumbs Desktop */}
                <div className="absolute top-22 left-0 z-10 flex max-md:hidden">
                    <Breadcrumbs type="button" maxVisibleItems={3}>
                        <Breadcrumbs.Item href="/overview" icon={HomeLine} />
                        <Breadcrumbs.Item href="#">Mon profil</Breadcrumbs.Item>
                    </Breadcrumbs>
                </div>

                {/* Back Button Mobile */}
                <div className="absolute top-17 left-0 flex md:hidden">
                    <Button href="#" color="link-gray" size="md" iconLeading={ArrowLeft}>
                        Retour
                    </Button>
                </div>

                {/* Profile Header */}
                <div className="relative flex flex-col items-center gap-4 border-b border-secondary pb-6 md:gap-5 md:pb-8">
                    {/* Avatar */}
                    <AvatarProfilePhoto
                        verified
                        className="lg:hidden"
                        size="md"
                        src="/pilote2.png"
                        alt={username}
                    />
                    <AvatarProfilePhoto
                        verified
                        className="max-lg:hidden"
                        size="lg"
                        src="/pilote2.png"
                        alt={username}
                    />

                    <div className="flex w-full flex-col items-center gap-1">
                        {/* Editable Username */}
                        <EditableUsername value={username} onChange={setUsername} />
                        <p className="text-md text-tertiary">antoine.moulin@gmail.com</p>
                    </div>

                    {/* Stats globales */}
                    <div className="flex gap-8 text-center">
                        <div>
                            <p className="text-lg font-semibold text-primary">{totalRaces}</p>
                            <p className="text-xs text-tertiary">Courses</p>
                        </div>
                        <div className="h-10 w-px bg-border-secondary" />
                        <div>
                            <p className="text-lg font-semibold text-primary">
                                {totalRacesWon}
                                {totalTrophies > 0 && <span className="ml-1 text-amber-500">({totalTrophies}🏆)</span>}
                            </p>
                            <p className="text-xs text-tertiary">Victoires</p>
                        </div>
                        <div className="h-10 w-px bg-border-secondary" />
                        <div>
                            <p className="text-lg font-semibold text-primary">{ownedCount}</p>
                            <p className="text-xs text-tertiary">Voitures</p>
                        </div>
                    </div>
                </div>

                {/* ============================================ */}
                {/* PALMARES SECTION */}
                {/* ============================================ */}
                <section className="mt-6 md:mt-8">
                    <SectionHeader.Root>
                        <SectionHeader.Group>
                            <div className="flex flex-1 flex-col justify-center gap-0.5">
                                <SectionHeader.Heading>Palmarès</SectionHeader.Heading>
                                <SectionHeader.Subheading>
                                    Tes statistiques détaillées par salon.
                                </SectionHeader.Subheading>
                            </div>
                        </SectionHeader.Group>
                    </SectionHeader.Root>

                    {/* Salon Tabs */}
                    <div className="mt-4 flex gap-1 overflow-x-auto rounded-xl bg-secondary p-1">
                        {USER_PALMARES.map((salon) => (
                            <PalmaresTab
                                key={salon.id}
                                salon={salon}
                                isActive={activeSalonId === salon.id}
                                onClick={() => setActiveSalonId(salon.id)}
                            />
                        ))}
                    </div>

                    {/* Salon Stats */}
                    {activeSalon && (
                        <div className="mt-4">
                            <PalmaresContent key={activeSalon.id} salon={activeSalon} />
                        </div>
                    )}
                </section>

                {/* ============================================ */}
                {/* AVATAR SELECTION */}
                {/* ============================================ */}
                <section className="mt-8 md:mt-10">
                    <SectionHeader.Root>
                        <SectionHeader.Group>
                            <div className="flex flex-1 flex-col justify-center gap-0.5">
                                <SectionHeader.Heading>Choisis ton avatar</SectionHeader.Heading>
                                <SectionHeader.Subheading>
                                    Ton avatar est visible par tous les pilotes dans tes salons.
                                </SectionHeader.Subheading>
                            </div>
                        </SectionHeader.Group>
                    </SectionHeader.Root>

                    <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-5 sm:gap-3 md:grid-cols-6 lg:grid-cols-8">
                        {AVATARS.map((avatar) => (
                            <AvatarCard
                                key={avatar.id}
                                avatar={avatar}
                                isSelected={selectedAvatar === avatar.id}
                                onSelect={() => setSelectedAvatar(avatar.id)}
                            />
                        ))}
                    </div>
                </section>

                {/* ============================================ */}
                {/* CAR SELECTION */}
                {/* ============================================ */}
                
                <section className="mt-8 md:mt-10">
                    <SectionHeader.Root>
                        <SectionHeader.Group>
                            <div className="flex flex-1 flex-col justify-center gap-0.5">
                                <SectionHeader.Heading>Voiture favorite</SectionHeader.Heading>
                                <SectionHeader.Subheading>
                                    Ta voiture favorite sera sélectionnée par défaut au début de chaque course.
                                </SectionHeader.Subheading>
                            </div>
                        </SectionHeader.Group>
                    </SectionHeader.Root>

                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5">
                        {sortedCars.map((car) => (
                            <CarCardSelect
                                key={car.id}
                                car={car}
                                isSelected={selectedCar === car.id}
                                onSelect={() => setSelectedCar(car.id)}
                            />
                        ))}
                    </div>

                    <p className="mt-4 text-sm text-tertiary">
                        Tu possèdes <span className="font-medium text-secondary">{ownedCount}</span> voitures sur{" "}
                        <span className="font-medium text-secondary">{USER_CARS.length}</span>. Obtiens-en plus dans le{" "}
                        <a href="/shop" className="font-medium text-brand-600 hover:underline">
                            Magasin
                        </a>
                        .
                    </p>
                </section>
            </div>
        </div>
    );
}