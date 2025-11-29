"use client";

import { useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Trophy, Flag, Zap, Calendar, UserPlus, Car, BarChart3, Crown, Medal } from "lucide-react";
import { Drawer } from "vaul";
import useMeasure from "react-use-measure";
import clsx from "clsx";

// =============================================================================
// Types
// =============================================================================

type CarRarity = "common" | "rare" | "epic" | "legendary";

interface Avatar {
  id: string;
  name: string;
  image_url: string;
}

interface CarType {
  id: string;
  name: string;
  rarity: CarRarity;
  image_url: string;
}

interface UserSeasonStats {
  position: number;
  points: number;
  races_participated: number;
  races_won: number;
  seasons_won: number;
}

interface UserProfile {
  id: string;
  username: string;
  avatar: Avatar;
  favorite_car: CarType;
  is_current_leader?: boolean;
  is_season_winner?: boolean;
  seasons_won_count?: number;
  stats?: UserSeasonStats;
  progress?: number;
  course_position?: number;
  daily_progress?: number;
}

interface UserProfileDrawerProps {
  user: UserProfile;
  salonName?: string;
  onAddFriend?: (userId: string) => void;
  isCurrentUser?: boolean;
  /** Liste des participants pour la mini race track */
  raceParticipants?: { id: string; username: string; progress: number }[];
}

// =============================================================================
// Constants - Rarity Themes (Light mode)
// =============================================================================

const RARITY_CONFIG: Record<CarRarity, {
  gradient: string;
  bg: string;
  text: string;
  badge: string;
  badgeText: string;
  border: string;
}> = {
  common: {
    gradient: "from-gray-100 to-gray-200",
    bg: "bg-gray-100",
    text: "text-gray-600",
    badge: "bg-gray-100",
    badgeText: "text-gray-600",
    border: "border-gray-200",
  },
  rare: {
    gradient: "from-blue-50 to-blue-100",
    bg: "bg-blue-50",
    text: "text-blue-600",
    badge: "bg-blue-100",
    badgeText: "text-blue-700",
    border: "border-blue-200",
  },
  epic: {
    gradient: "from-purple-50 to-purple-100",
    bg: "bg-purple-50",
    text: "text-purple-600",
    badge: "bg-purple-100",
    badgeText: "text-purple-700",
    border: "border-purple-200",
  },
  legendary: {
    gradient: "from-amber-50 via-orange-50 to-amber-100",
    bg: "bg-gradient-to-br from-amber-50 to-orange-100",
    text: "text-amber-600",
    badge: "bg-orange-500",
    badgeText: "text-white",
    border: "border-amber-300",
  },
};

const RARITY_LABELS: Record<CarRarity, string> = {
  common: "COMMON",
  rare: "RARE",
  epic: "EPIC",
  legendary: "LEGENDARY",
};

// =============================================================================
// Mini User Card (Trigger)
// =============================================================================

interface MiniUserCardProps {
  user: UserProfile;
  onClick: () => void;
  className?: string;
  compact?: boolean;
}

export function MiniUserCard({ user, onClick, className, compact = false }: MiniUserCardProps) {
  const rarity = user.favorite_car?.rarity || "common";
  const config = RARITY_CONFIG[rarity];

  return (
    <button
      onClick={onClick}
      className={clsx(
        "group relative flex items-center gap-3 rounded-xl bg-white",
        "border border-gray-200 shadow-sm transition-all duration-200",
        "hover:shadow-md hover:border-gray-300",
        "focus:outline-none focus:ring-2 focus:ring-gray-200",
        compact ? "p-2 pr-3" : "p-3 pr-4",
        className
      )}
    >
      {/* Avatar */}
      <div className={clsx(
        "relative flex-shrink-0 rounded-full overflow-hidden bg-gray-100",
        compact ? "w-9 h-9" : "w-11 h-11"
      )}>
        <img
          src={user.avatar.image_url}
          alt={user.username}
          className="w-full h-full object-cover"
        />
        {user.is_current_leader && (
          <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center shadow-sm">
            <Crown className="w-2.5 h-2.5 text-white" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-center gap-1.5">
          <span className={clsx(
            "font-semibold truncate text-gray-900",
            compact ? "text-sm" : "text-base"
          )}>
            {user.username}
          </span>
          {user.is_season_winner && (
            <Trophy className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
          )}
        </div>

        {/* Progress bar */}
        {user.progress !== undefined && (
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-orange-500"
                initial={{ width: 0 }}
                animate={{ width: `${user.progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
            <span className="text-xs text-gray-400 tabular-nums">{user.progress.toFixed(0)}%</span>
          </div>
        )}

        {/* Stats if no progress */}
        {user.progress === undefined && user.stats && (
          <span className="text-xs text-gray-400">
            #{user.stats.position} · {user.stats.points} pts
          </span>
        )}
      </div>

      {/* Mini car */}
      <div className={clsx(
        "relative flex-shrink-0 rounded-lg overflow-hidden p-1.5",
        config.bg,
        compact ? "w-9 h-9" : "w-11 h-11"
      )}>
        <img
          src={user.favorite_car.image_url}
          alt={user.favorite_car.name}
          className="w-full h-full object-contain"
        />
      </div>

      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-400 transition-colors" />
    </button>
  );
}

// =============================================================================
// Mini Race Track Component
// =============================================================================

interface MiniRaceTrackProps {
  participants: { id: string; username: string; progress: number }[];
  currentUserId: string;
  className?: string;
}

function MiniRaceTrack({ participants, currentUserId, className }: MiniRaceTrackProps) {
  const sorted = [...participants].sort((a, b) => b.progress - a.progress);
  const totalSegments = 20;

  return (
    <div className={clsx("space-y-3", className)}>
      {/* Track visualization */}
      <div className="flex gap-0.5">
        {[...Array(totalSegments)].map((_, i) => {
          const segmentProgress = (i / totalSegments) * 100;
          const currentUser = participants.find(p => p.id === currentUserId);
          const isCompleted = currentUser && currentUser.progress > segmentProgress;
          const isCurrentPosition = currentUser && 
            currentUser.progress > segmentProgress && 
            currentUser.progress <= ((i + 1) / totalSegments) * 100;

          return (
            <div
              key={i}
              className={clsx(
                "flex-1 h-2 rounded-full transition-colors",
                isCurrentPosition ? "bg-orange-500 ring-2 ring-orange-200" :
                isCompleted ? "bg-orange-500" : "bg-gray-200"
              )}
            />
          );
        })}
      </div>

      {/* Leaderboard preview */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {sorted.slice(0, 5).map((participant, index) => {
          const isCurrentUser = participant.id === currentUserId;
          return (
            <div
              key={participant.id}
              className={clsx(
                "flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs whitespace-nowrap",
                isCurrentUser 
                  ? "bg-orange-100 text-orange-700 font-medium" 
                  : "bg-gray-50 text-gray-600"
              )}
            >
              <span className={clsx(
                "w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold",
                index === 0 ? "bg-amber-400 text-white" :
                index === 1 ? "bg-gray-300 text-gray-700" :
                index === 2 ? "bg-orange-300 text-orange-800" :
                "bg-gray-200 text-gray-500"
              )}>
                {index + 1}
              </span>
              <span className="truncate max-w-[60px]">
                {isCurrentUser ? "Toi" : participant.username}
              </span>
              <span className="text-gray-400">{participant.progress}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// =============================================================================
// User Profile Drawer
// =============================================================================

type DrawerView = "menu" | "car" | "stats";

export function UserProfileDrawer({
  user,
  salonName,
  onAddFriend,
  isCurrentUser = false,
  raceParticipants,
}: UserProfileDrawerProps) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<DrawerView>("menu");
  const [contentRef, bounds] = useMeasure();

  const rarity = user.favorite_car?.rarity || "common";
  const config = RARITY_CONFIG[rarity];

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => setView("menu"), 300);
  };

  return (
    <>
      <MiniUserCard user={user} onClick={() => setOpen(true)} />

      <Drawer.Root open={open} onOpenChange={setOpen}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 z-50 bg-black/40" />
          <Drawer.Content
            asChild
            className="fixed inset-x-4 bottom-4 z-50 mx-auto overflow-hidden rounded-2xl outline-none md:mx-auto md:w-full"
            style={{ maxWidth: 420 }}
          >
            <motion.div
              animate={{
                height: bounds.height || "auto",
                transition: { duration: 0.27, ease: [0.32, 0.72, 0, 1] },
              }}
              className="bg-white shadow-xl"
            >
              <div ref={contentRef}>
                <AnimatePresence mode="popLayout" initial={false}>
                  {view === "menu" && (
                    <MenuView
                      key="menu"
                      user={user}
                      salonName={salonName}
                      config={config}
                      rarity={rarity}
                      isCurrentUser={isCurrentUser}
                      raceParticipants={raceParticipants}
                      onClose={handleClose}
                      onViewCar={() => setView("car")}
                      onViewStats={() => setView("stats")}
                      onAddFriend={onAddFriend}
                    />
                  )}
                  {view === "car" && (
                    <CarView
                      key="car"
                      car={user.favorite_car}
                      config={config}
                      rarity={rarity}
                      onBack={() => setView("menu")}
                      onClose={handleClose}
                    />
                  )}
                  {view === "stats" && (
                    <StatsView
                      key="stats"
                      user={user}
                      salonName={salonName}
                      onBack={() => setView("menu")}
                      onClose={handleClose}
                    />
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </>
  );
}

// =============================================================================
// View Components
// =============================================================================

interface MenuViewProps {
  user: UserProfile;
  salonName?: string;
  config: typeof RARITY_CONFIG.common;
  rarity: CarRarity;
  isCurrentUser: boolean;
  raceParticipants?: { id: string; username: string; progress: number }[];
  onClose: () => void;
  onViewCar: () => void;
  onViewStats: () => void;
  onAddFriend?: (userId: string) => void;
}

function MenuView({
  user,
  salonName,
  config,
  rarity,
  isCurrentUser,
  raceParticipants,
  onClose,
  onViewCar,
  onViewStats,
  onAddFriend,
}: MenuViewProps) {
  const stats = user.stats;

  return (
    <ViewWrapper>
      <CloseButton onClick={onClose} />

      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 ring-1 ring-gray-200">
              <img
                src={user.avatar.image_url}
                alt={user.username}
                className="w-full h-full object-cover"
              />
            </div>
            {user.is_current_leader && (
              <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center shadow-md">
                <Crown className="w-3.5 h-3.5 text-white" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 pt-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-gray-900 truncate">
                {user.username}
              </h2>
              {user.is_season_winner && (
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100">
                  <Trophy className="w-3 h-3 text-amber-600" />
                  {(user.seasons_won_count ?? 0) > 1 && (
                    <span className="text-xs font-semibold text-amber-600">×{user.seasons_won_count}</span>
                  )}
                </div>
              )}
            </div>
            {salonName && (
              <p className="text-sm text-gray-500 mt-0.5">{salonName}</p>
            )}
            {/* Position badge */}
            {user.course_position && (
              <div className="flex items-center gap-2 mt-2">
                <span className={clsx(
                  "inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold",
                  user.course_position === 1 ? "bg-amber-100 text-amber-700" :
                  user.course_position === 2 ? "bg-gray-100 text-gray-700" :
                  user.course_position === 3 ? "bg-orange-100 text-orange-700" :
                  "bg-gray-50 text-gray-600"
                )}>
                  #{user.course_position}
                </span>
                {user.progress !== undefined && (
                  <span className="text-sm text-gray-500">
                    {user.progress.toFixed(1)}% complété
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Race Track */}
      {raceParticipants && raceParticipants.length > 0 && (
        <div className="px-6 pb-4">
          <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Course en cours</span>
              <span className="text-xs text-gray-400">
                {user.daily_progress !== undefined && user.daily_progress > 0 && (
                  <span className="text-emerald-600 font-medium">+{user.daily_progress.toFixed(1)}% aujourd'hui</span>
                )}
              </span>
            </div>
            <MiniRaceTrack
              participants={raceParticipants}
              currentUserId={user.id}
            />
          </div>
        </div>
      )}

      {/* Stats Grid */}
      {stats && (
        <div className="px-6 pb-4">
          <div className="grid grid-cols-4 gap-2">
            <StatBox
              icon={<Medal className="w-4 h-4" />}
              value={`#${stats.position}`}
              label="Position"
              highlight={stats.position <= 3}
            />
            <StatBox
              icon={<Zap className="w-4 h-4" />}
              value={stats.points}
              label="Points"
            />
            <StatBox
              icon={<Flag className="w-4 h-4" />}
              value={stats.races_won}
              label="Victoires"
              highlight={stats.races_won > 0}
            />
            <StatBox
              icon={<Calendar className="w-4 h-4" />}
              value={stats.races_participated}
              label="Courses"
            />
          </div>
        </div>
      )}

      {/* Divider */}
      <div className="mx-6 border-t border-gray-100" />

      {/* Actions */}
      <div className="p-4 space-y-2">
        <ActionButton
          icon={<Car className="w-5 h-5" />}
          onClick={onViewCar}
          badge={
            <span className={clsx(
              "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide",
              config.badge,
              config.badgeText
            )}>
              {RARITY_LABELS[rarity]}
            </span>
          }
        >
          Voir la voiture
        </ActionButton>

        <ActionButton
          icon={<BarChart3 className="w-5 h-5" />}
          onClick={onViewStats}
        >
          Statistiques détaillées
        </ActionButton>

        {!isCurrentUser && onAddFriend && (
          <ActionButton
            icon={<UserPlus className="w-5 h-5" />}
            onClick={() => onAddFriend(user.id)}
            variant="primary"
          >
            Ajouter en ami
          </ActionButton>
        )}
      </div>

      <div className="h-2" />
    </ViewWrapper>
  );
}

// -----------------------------------------------------------------------------
// Car View
// -----------------------------------------------------------------------------

interface CarViewProps {
  car: CarType;
  config: typeof RARITY_CONFIG.common;
  rarity: CarRarity;
  onBack: () => void;
  onClose: () => void;
}

function CarView({ car, config, rarity, onBack, onClose }: CarViewProps) {
  return (
    <ViewWrapper>
      <div className="flex items-center justify-between px-4 pt-4">
        <BackButton onClick={onBack} />
        <CloseButton onClick={onClose} position="relative" />
      </div>

      {/* Car Display */}
      <div className="relative px-6 pt-4 pb-8">
        {/* Background */}
        <div className={clsx(
          "absolute inset-x-6 top-4 bottom-8 rounded-2xl bg-gradient-to-br",
          config.gradient,
          config.border,
          "border"
        )} />

        {/* Rarity badge */}
        <div className="relative flex justify-center mb-2">
          <span className={clsx(
            "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide",
            config.badge,
            config.badgeText
          )}>
            {RARITY_LABELS[rarity]}
          </span>
        </div>

        {/* Car image */}
        <div className="relative aspect-[4/3] flex items-center justify-center">
          <motion.img
            src={car.image_url}
            alt={car.name}
            className="w-3/4 h-3/4 object-contain drop-shadow-lg"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
          />
        </div>

        {/* Car name */}
        <div className="relative text-center mt-2">
          <h3 className="text-xl font-bold text-gray-900">{car.name}</h3>
        </div>
      </div>
    </ViewWrapper>
  );
}

// -----------------------------------------------------------------------------
// Stats View
// -----------------------------------------------------------------------------

interface StatsViewProps {
  user: UserProfile;
  salonName?: string;
  onBack: () => void;
  onClose: () => void;
}

function StatsView({ user, salonName, onBack, onClose }: StatsViewProps) {
  const stats = user.stats;

  return (
    <ViewWrapper>
      <div className="flex items-center justify-between px-4 pt-4">
        <BackButton onClick={onBack} />
        <CloseButton onClick={onClose} position="relative" />
      </div>

      {/* Header */}
      <div className="px-6 pt-2 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Statistiques</h3>
            {salonName && (
              <p className="text-sm text-gray-500">{salonName}</p>
            )}
          </div>
        </div>
      </div>

      {/* Stats list */}
      <div className="px-6 pb-6 space-y-1">
        <StatRow
          icon={<Trophy className="w-5 h-5 text-amber-500" />}
          label="Saisons gagnées"
          value={user.seasons_won_count ?? 0}
          highlight={!!user.seasons_won_count}
        />
        <StatRow
          icon={<Medal className="w-5 h-5 text-gray-400" />}
          label="Position actuelle"
          value={`#${stats?.position ?? "—"}`}
          highlight={stats?.position === 1}
        />
        <StatRow
          icon={<Zap className="w-5 h-5 text-blue-500" />}
          label="Points saison"
          value={stats?.points ?? 0}
        />
        <StatRow
          icon={<Flag className="w-5 h-5 text-emerald-500" />}
          label="Courses gagnées"
          value={stats?.races_won ?? 0}
          highlight={(stats?.races_won ?? 0) > 0}
        />
        <StatRow
          icon={<Calendar className="w-5 h-5 text-purple-500" />}
          label="Courses participées"
          value={stats?.races_participated ?? 0}
        />

        {stats && stats.races_participated > 0 && (
          <div className="pt-3 mt-3 border-t border-gray-100">
            <StatRow
              icon={<BarChart3 className="w-5 h-5 text-orange-500" />}
              label="Taux de victoire"
              value={`${((stats.races_won / stats.races_participated) * 100).toFixed(0)}%`}
            />
          </div>
        )}
      </div>
    </ViewWrapper>
  );
}

// =============================================================================
// Sub-components
// =============================================================================

function ViewWrapper({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
    >
      {children}
    </motion.div>
  );
}

function CloseButton({ onClick, position = "absolute" }: { onClick: () => void; position?: "absolute" | "relative" }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "z-10 flex h-8 w-8 items-center justify-center rounded-full",
        "bg-gray-100 text-gray-500 transition-all",
        "hover:bg-gray-200 hover:text-gray-700",
        "focus:outline-none focus:ring-2 focus:ring-gray-200",
        "active:scale-95",
        position === "absolute" && "absolute right-4 top-4"
      )}
    >
      <X className="h-4 w-4" />
    </button>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "flex items-center gap-1 px-3 py-1.5 rounded-full",
        "bg-gray-100 text-gray-600 text-sm font-medium transition-all",
        "hover:bg-gray-200 hover:text-gray-800",
        "focus:outline-none focus:ring-2 focus:ring-gray-200",
        "active:scale-95"
      )}
    >
      <ChevronLeft className="w-4 h-4" />
      Retour
    </button>
  );
}

interface ActionButtonProps {
  icon: ReactNode;
  children: ReactNode;
  onClick: () => void;
  badge?: ReactNode;
  variant?: "default" | "primary";
}

function ActionButton({ icon, children, onClick, badge, variant = "default" }: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "flex w-full items-center gap-3 px-4 py-3 rounded-xl",
        "border transition-all duration-150",
        "focus:outline-none focus:ring-2 focus:ring-gray-200",
        "active:scale-[0.98]",
        variant === "default" && "bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300",
        variant === "primary" && "bg-orange-500 border-orange-500 text-white hover:bg-orange-600"
      )}
    >
      <span className={clsx(
        variant === "default" ? "text-gray-400" : "text-orange-100"
      )}>
        {icon}
      </span>
      <span className={clsx(
        "flex-1 text-left font-medium",
        variant === "default" ? "text-gray-700" : "text-white"
      )}>
        {children}
      </span>
      {badge}
      <ChevronRight className={clsx(
        "w-4 h-4",
        variant === "default" ? "text-gray-300" : "text-orange-200"
      )} />
    </button>
  );
}

interface StatBoxProps {
  icon: ReactNode;
  value: number | string;
  label: string;
  highlight?: boolean;
}

function StatBox({ icon, value, label, highlight }: StatBoxProps) {
  return (
    <div className={clsx(
      "flex flex-col items-center p-2.5 rounded-xl border",
      highlight ? "bg-amber-50 border-amber-200" : "bg-gray-50 border-gray-100"
    )}>
      <span className={clsx(
        "mb-1",
        highlight ? "text-amber-500" : "text-gray-400"
      )}>
        {icon}
      </span>
      <span className={clsx(
        "text-base font-bold tabular-nums",
        highlight ? "text-amber-700" : "text-gray-900"
      )}>
        {value}
      </span>
      <span className="text-[10px] text-gray-400 uppercase tracking-wide">
        {label}
      </span>
    </div>
  );
}

interface StatRowProps {
  icon: ReactNode;
  label: string;
  value: number | string;
  highlight?: boolean;
}

function StatRow({ icon, label, value, highlight }: StatRowProps) {
  return (
    <div className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-gray-50 transition-colors">
      <span className="flex-shrink-0">{icon}</span>
      <span className="flex-1 text-gray-600">{label}</span>
      <span className={clsx(
        "font-bold tabular-nums",
        highlight ? "text-amber-600" : "text-gray-900"
      )}>
        {value}
      </span>
    </div>
  );
}

export { MiniUserCard };
export type { UserProfile, CarType as Car, Avatar, CarRarity, UserSeasonStats };