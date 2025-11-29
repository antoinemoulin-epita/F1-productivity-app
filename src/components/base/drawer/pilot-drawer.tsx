"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  VaulDrawer,
  DrawerAnimatedView,
  DrawerSection,
  DrawerDivider,
  DrawerButton,
  DrawerActions,
  DrawerActionButton,
  DrawerStatsGrid,
  DrawerStat,
} from "./vault-drawer";
import {
  Trophy,
  Clock,
  CheckCircle2,
  Circle,
  ChevronRight,
  Shield,
  UserX,
  AlertTriangle,
  Car,
} from "lucide-react";
import clsx from "clsx";

// =============================================================================
// Types
// =============================================================================

interface PilotCar {
  id: string;
  name: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  imageUrl: string;
}

interface PilotActivity {
  id: string;
  taskTitle: string;
  parentTitle?: string;
  status: "validated" | "pending" | "rejected";
  timestamp: string;
  canVote?: boolean;
}

interface PilotSeasonStats {
  position: number;
  points: number;
  coursesParticipated: number;
  victories: number;
}

interface FaceToFaceData {
  myWins: number;
  theirWins: number;
  myAvgPosition: number;
  theirAvgPosition: number;
  myTasksPerCourse: number;
  theirTasksPerCourse: number;
  myDailyChampion: number;
  theirDailyChampion: number;
}

interface CurrentCourseProgress {
  position: number;
  progress: number;
  lastActivity: string;
}

interface Pilot {
  id: string;
  username: string;
  avatarUrl: string;
  memberSince: string;
  isSeasonWinner: boolean;
  seasonsWon: number;
  favoriteCar: PilotCar;
  seasonStats: PilotSeasonStats;
  faceToFace?: FaceToFaceData;
  currentCourse?: CurrentCourseProgress;
  recentActivity: PilotActivity[];
  garage: PilotCar[];
}

interface PilotProfileDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pilot: Pilot;
  isAdmin?: boolean;
  currentUserId?: string;
  onPromote?: (pilotId: string) => void;
  onKick?: (pilotId: string) => void;
  onVoteProof?: (activityId: string) => void;
}

// =============================================================================
// Rarity Config
// =============================================================================

const RARITY_CONFIG = {
  common: {
    label: "Common",
    bgColor: "bg-gray-100",
    textColor: "text-gray-600",
    borderColor: "border-gray-200",
  },
  rare: {
    label: "Rare",
    bgColor: "bg-blue-50",
    textColor: "text-blue-600",
    borderColor: "border-blue-200",
  },
  epic: {
    label: "Epic",
    bgColor: "bg-purple-50",
    textColor: "text-purple-600",
    borderColor: "border-purple-200",
  },
  legendary: {
    label: "Legendary",
    bgColor: "bg-amber-50",
    textColor: "text-amber-600",
    borderColor: "border-amber-200",
  },
};

// =============================================================================
// Main Component
// =============================================================================

export function PilotProfileDrawer({
  open,
  onOpenChange,
  pilot,
  isAdmin = false,
  currentUserId,
  onPromote,
  onKick,
  onVoteProof,
}: PilotProfileDrawerProps) {
  const [view, setView] = useState<"profile" | "kick-confirm">("profile");

  // Reset view when drawer closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setTimeout(() => setView("profile"), 200);
    }
    onOpenChange(open);
  };

  const isSelf = currentUserId === pilot.id;

  return (
    <VaulDrawer open={open} onOpenChange={handleOpenChange} maxWidth={400}>
      <AnimatePresence initial={false} mode="popLayout">
        {view === "profile" ? (
          <motion.div
            key="profile"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.26, 0.08, 0.25, 1] }}
          >
            <ProfileView
              pilot={pilot}
              isAdmin={isAdmin}
              isSelf={isSelf}
              onPromote={onPromote}
              onKickClick={() => setView("kick-confirm")}
              onVoteProof={onVoteProof}
            />
          </motion.div>
        ) : (
          <motion.div
            key="kick-confirm"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.26, 0.08, 0.25, 1] }}
          >
            <KickConfirmView
              pilot={pilot}
              onCancel={() => setView("profile")}
              onConfirm={() => {
                onKick?.(pilot.id);
                onOpenChange(false);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </VaulDrawer>
  );
}

// =============================================================================
// Profile View
// =============================================================================

interface ProfileViewProps {
  pilot: Pilot;
  isAdmin: boolean;
  isSelf: boolean;
  onPromote?: (pilotId: string) => void;
  onKickClick: () => void;
  onVoteProof?: (activityId: string) => void;
}

function ProfileView({
  pilot,
  isAdmin,
  isSelf,
  onPromote,
  onKickClick,
  onVoteProof,
}: ProfileViewProps) {
  const rarityConfig = RARITY_CONFIG[pilot.favoriteCar.rarity];

  return (
    <div className="pb-6">
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="relative">
            <div className="h-16 w-16 rounded-full bg-gray-100 overflow-hidden ring-2 ring-white shadow-sm">
              <img
                src={pilot.avatarUrl}
                alt={pilot.username}
                className="h-full w-full object-cover"
              />
            </div>
            {pilot.isSeasonWinner && (
              <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-xs shadow-sm">
                🏆
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 pt-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-gray-900 truncate">
                {pilot.username}
              </h2>
              {pilot.seasonsWon > 1 && (
                <span className="text-xs font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                  ×{pilot.seasonsWon}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-0.5">
              Membre depuis {pilot.memberSince}
            </p>
          </div>
        </div>

        {/* Favorite Car */}
        <div className="mt-4 flex items-center gap-3 rounded-xl bg-gray-50 p-3">
          <div className="h-12 w-12 rounded-lg bg-white flex items-center justify-center shadow-sm">
            <img
              src={pilot.favoriteCar.imageUrl}
              alt={pilot.favoriteCar.name}
              className="h-10 w-10 object-contain"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">
              {pilot.favoriteCar.name}
            </p>
            <span
              className={clsx(
                "inline-block text-[11px] font-medium px-1.5 py-0.5 rounded mt-0.5",
                rarityConfig.bgColor,
                rarityConfig.textColor
              )}
            >
              {rarityConfig.label}
            </span>
          </div>
          <Car className="h-4 w-4 text-gray-400" />
        </div>
      </div>

      <DrawerDivider />

      {/* Season Stats */}
      <DrawerSection title="Cette saison">
        <DrawerStatsGrid>
          <DrawerStat
            icon={getPositionEmoji(pilot.seasonStats.position)}
            value={pilot.seasonStats.position}
            label="Position"
          />
          <DrawerStat
            value={pilot.seasonStats.points}
            label="Points"
          />
          <DrawerStat
            value={pilot.seasonStats.coursesParticipated}
            label="Courses"
          />
          <DrawerStat
            value={pilot.seasonStats.victories}
            label="Victoires"
          />
        </DrawerStatsGrid>
      </DrawerSection>

      {/* Face-to-Face */}
      {pilot.faceToFace && !isSelf && (
        <>
          <DrawerDivider />
          <DrawerSection title="Face-à-face">
            <FaceToFaceSection data={pilot.faceToFace} pilotName={pilot.username} />
          </DrawerSection>
        </>
      )}

      {/* Current Course Progress */}
      {pilot.currentCourse && (
        <>
          <DrawerDivider />
          <DrawerSection title="Course en cours">
            <CurrentCourseSection data={pilot.currentCourse} />
          </DrawerSection>
        </>
      )}

      {/* Recent Activity */}
      {pilot.recentActivity.length > 0 && (
        <>
          <DrawerDivider />
          <DrawerSection title="Activité récente">
            <RecentActivitySection
              activities={pilot.recentActivity}
              onVoteProof={onVoteProof}
            />
          </DrawerSection>
        </>
      )}

      {/* Garage */}
      {pilot.garage.length > 0 && (
        <>
          <DrawerDivider />
          <DrawerSection title={`Garage (${pilot.garage.length})`} noPadding>
            <GarageSection cars={pilot.garage} />
          </DrawerSection>
        </>
      )}

      {/* Admin Actions */}
      {isAdmin && !isSelf && (
        <>
          <DrawerDivider />
          <DrawerSection className="space-y-2">
            <DrawerButton
              onClick={() => onPromote?.(pilot.id)}
              className="bg-blue-50 text-blue-600 hover:bg-blue-100"
            >
              <Shield className="h-5 w-5" />
              Promouvoir co-admin
            </DrawerButton>
            <DrawerButton variant="danger" onClick={onKickClick}>
              <UserX className="h-5 w-5" />
              Exclure du salon
            </DrawerButton>
          </DrawerSection>
        </>
      )}
    </div>
  );
}

// =============================================================================
// Face-to-Face Section
// =============================================================================

function FaceToFaceSection({
  data,
  pilotName,
}: {
  data: FaceToFaceData;
  pilotName: string;
}) {
  const total = data.myWins + data.theirWins;
  const myPercent = total > 0 ? (data.myWins / total) * 100 : 50;

  return (
    <div className="space-y-4">
      {/* Win bar */}
      <div>
        <div className="flex justify-between text-xs font-medium mb-2">
          <span className="text-primary-600">Toi</span>
          <span className="text-gray-600">{pilotName}</span>
        </div>
        <div className="flex h-3 rounded-full overflow-hidden bg-gray-100">
          <div
            className="bg-primary-500 transition-all duration-500"
            style={{ width: `${myPercent}%` }}
          />
          <div
            className="bg-gray-400 transition-all duration-500"
            style={{ width: `${100 - myPercent}%` }}
          />
        </div>
        <div className="flex justify-between text-sm font-bold mt-1">
          <span className="text-primary-600">{data.myWins}</span>
          <span className="text-[11px] text-gray-400 font-normal">courses gagnées en commun</span>
          <span className="text-gray-600">{data.theirWins}</span>
        </div>
      </div>

      {/* Comparison stats */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <ComparisonStat
          label="Position moy."
          myValue={data.myAvgPosition.toFixed(1)}
          theirValue={data.theirAvgPosition.toFixed(1)}
          lowerIsBetter
        />
        <ComparisonStat
          label="Tâches/course"
          myValue={data.myTasksPerCourse}
          theirValue={data.theirTasksPerCourse}
        />
        <ComparisonStat
          label="Daily Champ."
          myValue={data.myDailyChampion}
          theirValue={data.theirDailyChampion}
        />
      </div>
    </div>
  );
}

function ComparisonStat({
  label,
  myValue,
  theirValue,
  lowerIsBetter = false,
}: {
  label: string;
  myValue: string | number;
  theirValue: string | number;
  lowerIsBetter?: boolean;
}) {
  const myNum = typeof myValue === "string" ? parseFloat(myValue) : myValue;
  const theirNum = typeof theirValue === "string" ? parseFloat(theirValue) : theirValue;
  
  const isBetter = lowerIsBetter ? myNum < theirNum : myNum > theirNum;
  const isWorse = lowerIsBetter ? myNum > theirNum : myNum < theirNum;

  return (
    <div className="rounded-lg bg-gray-50 p-2">
      <p className="text-[10px] text-gray-500 mb-1">{label}</p>
      <div className="flex items-center justify-center gap-1 text-xs font-semibold">
        <span className={clsx(isBetter && "text-green-600", isWorse && "text-red-500")}>
          {myValue}
        </span>
        <span className="text-gray-300">vs</span>
        <span className={clsx(isWorse && "text-green-600", isBetter && "text-red-500")}>
          {theirValue}
        </span>
      </div>
    </div>
  );
}

// =============================================================================
// Current Course Section
// =============================================================================

function CurrentCourseSection({ data }: { data: CurrentCourseProgress }) {
  return (
    <div className="rounded-xl bg-gray-50 p-3 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{getPositionEmoji(data.position)}</span>
          <span className="font-semibold text-gray-900">
            {data.position === 1 ? "1er" : `${data.position}ème`}
          </span>
          <span className="text-gray-400">•</span>
          <span className="text-sm text-gray-600">{data.progress}%</span>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
        <motion.div
          className="h-full bg-primary-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${data.progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
      
      <p className="text-xs text-gray-500 flex items-center gap-1">
        <Clock className="h-3 w-3" />
        Dernière validation : {data.lastActivity}
      </p>
    </div>
  );
}

// =============================================================================
// Recent Activity Section
// =============================================================================

function RecentActivitySection({
  activities,
  onVoteProof,
}: {
  activities: PilotActivity[];
  onVoteProof?: (id: string) => void;
}) {
  return (
    <div className="space-y-2">
      {activities.slice(0, 5).map((activity) => (
        <div
          key={activity.id}
          className={clsx(
            "flex items-center gap-3 rounded-lg p-2 transition-colors",
            activity.canVote
              ? "bg-primary-50 hover:bg-primary-100 cursor-pointer"
              : "bg-gray-50"
          )}
          onClick={() => activity.canVote && onVoteProof?.(activity.id)}
        >
          {/* Status icon */}
          <div className="flex-shrink-0">
            {activity.status === "validated" && (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            )}
            {activity.status === "pending" && (
              <Circle className="h-4 w-4 text-amber-500" />
            )}
            {activity.status === "rejected" && (
              <Circle className="h-4 w-4 text-red-500" />
            )}
          </div>

          {/* Task info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {activity.parentTitle && (
                <span className="text-gray-500">{activity.parentTitle} › </span>
              )}
              {activity.taskTitle}
            </p>
          </div>

          {/* Action / Time */}
          {activity.canVote ? (
            <span className="text-xs font-medium text-primary-600 flex items-center gap-1">
              Voter <ChevronRight className="h-3 w-3" />
            </span>
          ) : (
            <span className="text-[11px] text-gray-400 flex-shrink-0">
              {activity.timestamp}
            </span>
          )}
        </div>
      ))}

      {activities.length > 5 && (
        <button className="w-full text-center text-xs font-medium text-gray-500 hover:text-gray-700 py-2">
          Voir tout →
        </button>
      )}
    </div>
  );
}

// =============================================================================
// Garage Section
// =============================================================================

function GarageSection({ cars }: { cars: PilotCar[] }) {
  // Sort by rarity: legendary > epic > rare > common
  const sortedCars = useMemo(() => {
    const order = { legendary: 0, epic: 1, rare: 2, common: 3 };
    return [...cars].sort((a, b) => order[a.rarity] - order[b.rarity]);
  }, [cars]);

  return (
    <div className="px-6 py-4">
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
        {sortedCars.slice(0, 6).map((car) => {
          const config = RARITY_CONFIG[car.rarity];
          return (
            <div
              key={car.id}
              className={clsx(
                "flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center border",
                config.bgColor,
                config.borderColor
              )}
              title={`${car.name} (${config.label})`}
            >
              <img
                src={car.imageUrl}
                alt={car.name}
                className="h-10 w-10 object-contain"
              />
            </div>
          );
        })}
        {cars.length > 6 && (
          <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-500">
            +{cars.length - 6}
          </div>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// Kick Confirm View
// =============================================================================

function KickConfirmView({
  pilot,
  onCancel,
  onConfirm,
}: {
  pilot: Pilot;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="p-6">
      <div className="flex flex-col items-center text-center">
        <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <AlertTriangle className="h-6 w-6 text-red-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">
          Exclure {pilot.username} ?
        </h2>
        <p className="mt-3 text-sm text-gray-500 leading-relaxed">
          Cette action est irréversible. {pilot.username} sera retiré du salon
          et perdra accès à toutes les courses en cours.
        </p>
      </div>

      <DrawerActions className="mt-6 px-0">
        <DrawerActionButton variant="cancel" onClick={onCancel}>
          Annuler
        </DrawerActionButton>
        <DrawerActionButton variant="danger" onClick={onConfirm}>
          Exclure
        </DrawerActionButton>
      </DrawerActions>
    </div>
  );
}

// =============================================================================
// Helpers
// =============================================================================

function getPositionEmoji(position: number): string {
  switch (position) {
    case 1:
      return "🥇";
    case 2:
      return "🥈";
    case 3:
      return "🥉";
    default:
      return "";
  }
}

// =============================================================================
// Demo / Example Usage
// =============================================================================

export function PilotProfileDrawerDemo() {
  const [open, setOpen] = useState(false);

  const mockPilot: Pilot = {
    id: "pilot-1",
    username: "Alice",
    avatarUrl: "/avatars/pilot-1.png",
    memberSince: "nov. 2024",
    isSeasonWinner: true,
    seasonsWon: 2,
    favoriteCar: {
      id: "car-1",
      name: "Inferno",
      rarity: "epic",
      imageUrl: "/cars/inferno.png",
    },
    seasonStats: {
      position: 1,
      points: 127,
      coursesParticipated: 5,
      victories: 3,
    },
    faceToFace: {
      myWins: 3,
      theirWins: 5,
      myAvgPosition: 2.4,
      theirAvgPosition: 1.8,
      myTasksPerCourse: 12,
      theirTasksPerCourse: 15,
      myDailyChampion: 2,
      theirDailyChampion: 4,
    },
    currentCourse: {
      position: 2,
      progress: 72,
      lastActivity: "il y a 2h",
    },
    recentActivity: [
      {
        id: "act-1",
        taskTitle: "Login",
        parentTitle: "Module Auth",
        status: "validated",
        timestamp: "il y a 2h",
      },
      {
        id: "act-2",
        taskTitle: "Register",
        parentTitle: "Module Auth",
        status: "validated",
        timestamp: "il y a 3h",
      },
      {
        id: "act-3",
        taskTitle: "CRUD",
        parentTitle: "Module Salons",
        status: "pending",
        timestamp: "en attente",
        canVote: true,
      },
      {
        id: "act-4",
        taskTitle: "Setup projet",
        status: "validated",
        timestamp: "hier",
      },
    ],
    garage: [
      { id: "c1", name: "Inferno", rarity: "epic", imageUrl: "/cars/inferno.png" },
      { id: "c2", name: "Scarlet", rarity: "rare", imageUrl: "/cars/scarlet.png" },
      { id: "c3", name: "Rouge", rarity: "common", imageUrl: "/cars/rouge.png" },
      { id: "c4", name: "Bleu", rarity: "common", imageUrl: "/cars/bleu.png" },
      { id: "c5", name: "Vert", rarity: "common", imageUrl: "/cars/vert.png" },
      { id: "c6", name: "Jaune", rarity: "common", imageUrl: "/cars/jaune.png" },
      { id: "c7", name: "Noir", rarity: "common", imageUrl: "/cars/noir.png" },
      { id: "c8", name: "Blanc", rarity: "common", imageUrl: "/cars/blanc.png" },
    ],
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors"
      >
        Voir profil Alice
      </button>

      <PilotProfileDrawer
        open={open}
        onOpenChange={setOpen}
        pilot={mockPilot}
        isAdmin={true}
        currentUserId="other-user"
        onPromote={(id) => console.log("Promote:", id)}
        onKick={(id) => console.log("Kick:", id)}
        onVoteProof={(id) => console.log("Vote:", id)}
      />
    </>
  );
}