"use client";

import { useState, useRef, useEffect, type RefObject } from "react";
import { Check, ChevronDown, Clock, Flag06, Trophy01, Users01, XClose } from "@untitledui/icons";
import { motion, AnimatePresence } from "motion/react";
import { useOnClickOutside } from "usehooks-ts";
import { cx } from "@/utils/cx";


// ============================================================================
// TYPES
// ============================================================================

interface SubTask {
    id: string;
    title: string;
    isCompleted: boolean;
}

interface Task {
    id: string;
    title: string;
    isCompleted: boolean;
    subtasks?: SubTask[];
}

interface Participant {
    id: string;
    username: string;
    progress: number;
    position: number;
    avatar?: string;
    isCurrentUser?: boolean;
    car: {
        name: string;
        imageUrl: string;
        color: string;
    };
}

interface RaceData {
    id: string;
    salonName: string;
    courseName: string;
    isLive: boolean;
    endsAt: string;
    objective: string;
    tasks: Task[];
    participants: Participant[];
    myProgress: number;
    myPosition: number;
    totalParticipants: number;
    tasksCompleted: number;
    totalTasks: number;
    carImageUrl: string;
}

// ============================================================================
// MOCK DATA
// ============================================================================

const MOCK_RACE: RaceData = {
    id: "sprint-s12",
    salonName: "EPITA Piscine",
    courseName: "Sprint S12",
    isLive: true,
    endsAt: "2025-11-30T18:00:00Z",
    objective: "Finir le module Auth avant vendredi",
    myProgress: 65,
    myPosition: 2,
    totalParticipants: 8,
    tasksCompleted: 5,
    totalTasks: 12,
    carImageUrl: "/car.png",
    tasks: [
        {
            id: "task-1",
            title: "Module Auth",
            isCompleted: false,
            subtasks: [
                { id: "sub-1-1", title: "Login endpoint", isCompleted: true },
                { id: "sub-1-2", title: "Register endpoint", isCompleted: true },
                { id: "sub-1-3", title: "Magic link", isCompleted: false },
                { id: "sub-1-4", title: "JWT refresh", isCompleted: false },
            ],
        },
        {
            id: "task-2",
            title: "Module Salons",
            isCompleted: false,
            subtasks: [
                { id: "sub-2-1", title: "CRUD salon", isCompleted: true },
                { id: "sub-2-2", title: "Gestion membres", isCompleted: false },
                { id: "sub-2-3", title: "Invitations", isCompleted: false },
            ],
        },
        { id: "task-3", title: "Tests unitaires", isCompleted: true },
        { id: "task-4", title: "Documentation API", isCompleted: false },
        { id: "task-5", title: "Intégration CI/CD", isCompleted: true },
    ],
    participants: [
        { id: "1", username: "Alice", progress: 78, position: 1, car: { name: "Ferrari SF-24", imageUrl: "/cars/red.png", color: "#ef4444" } },
        { id: "2", username: "Antoine", progress: 65, position: 2, isCurrentUser: true, car: { name: "McLaren P1", imageUrl: "/car.png", color: "#f97316" } },
        { id: "3", username: "Benjamin", progress: 52, position: 3, car: { name: "Mercedes W15", imageUrl: "/cars/silver.png", color: "#94a3b8" } },
        { id: "4", username: "Clara", progress: 45, position: 4, car: { name: "Red Bull RB20", imageUrl: "/cars/blue.png", color: "#3b82f6" } },
        { id: "5", username: "David", progress: 38, position: 5, car: { name: "Aston Martin", imageUrl: "/cars/green.png", color: "#22c55e" } },
        { id: "6", username: "Emma", progress: 32, position: 6, car: { name: "Alpine A524", imageUrl: "/cars/pink.png", color: "#ec4899" } },
        { id: "7", username: "Lucas", progress: 25, position: 7, car: { name: "Williams FW46", imageUrl: "/cars/cyan.png", color: "#06b6d4" } },
        { id: "8", username: "Marie", progress: 18, position: 8, car: { name: "Haas VF-24", imageUrl: "/cars/white.png", color: "#e5e7eb" } },
    ],
};

// ============================================================================
// UTILITIES
// ============================================================================

function getTimeRemaining(endsAt: string) {
    const now = new Date();
    const end = new Date(endsAt);
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) return { display: "Terminé", days: 0, hours: 0, minutes: 0, seconds: 0 };

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    let display = "";
    if (days > 0) display = `${days}j ${hours}h`;
    else if (hours > 0) display = `${hours}h ${minutes}m`;
    else display = `${minutes}m ${seconds}s`;

    return { display, days, hours, minutes, seconds };
}

// ============================================================================
// HERO WIDGET - Clickable
// ============================================================================

interface HeroWidgetProps {
    race: RaceData;
    onClick: () => void;
}

function HeroWidget({ race, onClick }: HeroWidgetProps) {
    const { display: timeRemaining } = getTimeRemaining(race.endsAt);
    const visualProgress = Math.max(5, Math.min(95, race.myProgress));

    return (
        <motion.div
            layoutId={`race-card-${race.id}`}
            onClick={onClick}
            className="relative cursor-pointer overflow-hidden rounded-3xl bg-gray-950 p-5 shadow-2xl transition-shadow hover:shadow-brand-500/20"
            whileHover={{ scale: 1.005 }}
            whileTap={{ scale: 0.995 }}
        >
            {/* Subtle gradient overlay */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-600/5 via-transparent to-purple-600/5" />
            
            {/* Content */}
            <div className="relative flex flex-col gap-4">
                {/* Header row */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <motion.h1 
                            layoutId={`race-title-${race.id}`}
                            className="text-lg font-bold text-white"
                        >
                            {race.courseName}
                        </motion.h1>
                        {race.isLive && (
                            <motion.div 
                                layoutId={`race-live-${race.id}`}
                                className="flex items-center gap-1.5 rounded-full bg-green-500/20 px-2 py-0.5"
                            >
                                <span className="relative flex size-1.5">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                                    <span className="relative inline-flex size-1.5 rounded-full bg-green-500" />
                                </span>
                                <span className="text-xs font-semibold text-green-400">Live</span>
                            </motion.div>
                        )}
                        <motion.span 
                            layoutId={`race-salon-${race.id}`}
                            className="text-sm text-gray-500"
                        >
                            {race.salonName}
                        </motion.span>
                    </div>

                    {/* Timer */}
                    <motion.div 
                        layoutId={`race-timer-${race.id}`}
                        className="flex items-center gap-2 rounded-xl bg-white/5 px-2.5 py-1.5"
                    >
                        <Clock className="size-3.5 text-gray-400" />
                        <span className="font-mono text-sm font-medium text-white">
                            {timeRemaining}
                        </span>
                    </motion.div>
                </div>

                {/* Race Track with % on the right */}
                <div className="flex items-center gap-4">
                    {/* Track container */}
                    <motion.div layoutId={`race-track-${race.id}`} className="relative flex-1">
                        {/* Start line - green */}
                        <div className="absolute -left-0.5 top-0 z-10 h-full w-1 rounded-full bg-green-500" />
                        
                        {/* Finish line - red */}
                        <div className="absolute -right-0.5 top-0 z-10 h-full w-1 rounded-full bg-red-500" />
                        
                        {/* Track */}
                        <div className="relative mx-1 h-12 overflow-hidden rounded-xl bg-gray-800/60">
                            {/* Progress fill */}
                            <motion.div
                                className="absolute inset-y-0 left-0 bg-brand-600/40"
                                initial={{ width: 0 }}
                                animate={{ width: `${visualProgress}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                            />

                            {/* Car */}
                            <motion.div
                                className="absolute top-1/2 z-10"
                                initial={{ left: "0%", opacity: 0 }}
                                animate={{ left: `${visualProgress}%`, opacity: 1 }}
                                transition={{ duration: 1, ease: "easeOut" }}
                             >
                                <motion.img
                                    layoutId={`race-mycar-${race.id}`}
                                    src={race.carImageUrl}
                                    alt="Ma voiture"
                                    className="h-24 w-auto drop-shadow-lg"
                                />
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Progress % */}
                    <motion.div layoutId={`race-progress-${race.id}`} className="flex items-baseline gap-0.5">
                        <span className="font-mono text-3xl font-bold text-white">
                            {race.myProgress}
                        </span>
                        <span className="text-sm text-gray-500">%</span>
                    </motion.div>
                </div>

                
            </div>
        </motion.div>
    );
}

// ============================================================================
// RACE MODAL - Full Screen Immersive View
// ============================================================================

interface RaceModalProps {
    race: RaceData;
    onClose: () => void;
}

function RaceModal({ race, onClose }: RaceModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const [timeLeft, setTimeLeft] = useState(getTimeRemaining(race.endsAt));
    
    useOnClickOutside(modalRef as RefObject<HTMLElement>, onClose);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(getTimeRemaining(race.endsAt));
        }, 1000);
        return () => clearInterval(interval);
    }, [race.endsAt]);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [onClose]);

    const sortedParticipants = [...race.participants].sort((a, b) => b.progress - a.progress);
    const leader = sortedParticipants[0];

    return (
        <motion.div
            ref={modalRef}
            layoutId={`race-card-${race.id}`}
            className="fixed inset-4 z-50 flex flex-col overflow-hidden rounded-[2rem] bg-gray-950 lg:inset-8"
            style={{
                // Ombre externe façon Apple - plusieurs couches
                boxShadow: `
                    0 0 0 1px rgba(255,255,255,0.03),
                    0 4px 6px -1px rgba(0,0,0,0.4),
                    0 20px 25px -5px rgba(0,0,0,0.5),
                    0 40px 60px -12px rgba(0,0,0,0.6)
                `
            }}
        >
            {/* Background - subtil, pas de gradients criards */}
            <div className="pointer-events-none absolute inset-0">
                {/* Noise texture très légère pour profondeur */}
                <div 
                    className="absolute inset-0 opacity-[0.015]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                    }}
                />
                
                {/* Glow subtil en haut - simule éclairage ambiant */}
                <div 
                    className="absolute -top-1/2 left-1/2 h-full w-[200%] -translate-x-1/2"
                    style={{
                        background: 'radial-gradient(ellipse at center top, rgba(255,255,255,0.02) 0%, transparent 60%)'
                    }}
                />
            </div>

            {/* Header - plus compact, style widget iOS */}
            <div className="relative z-10 flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-3">
                    <motion.h1 
                        layoutId={`race-title-${race.id}`}
                        className="text-lg font-semibold tracking-tight text-white"
                    >
                        {race.courseName}
                    </motion.h1>
                    
                    {race.isLive && (
                        <motion.div 
                            layoutId={`race-live-${race.id}`}
                            className="flex items-center gap-1.5"
                        >
                            <span className="relative flex size-1.5">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex size-1.5 rounded-full bg-emerald-400" />
                            </span>
                            <span className="text-xs font-medium text-emerald-400">Live</span>
                        </motion.div>
                    )}
                    
                    <motion.span 
                        layoutId={`race-salon-${race.id}`}
                        className="text-sm text-white/40"
                    >
                        {race.salonName}
                    </motion.span>
                </div>

                <div className="flex items-center gap-3">
                    {/* Countdown - style compact widget */}
                    <motion.div 
                        layoutId={`race-timer-${race.id}`}
                        className="flex items-center gap-2 rounded-full bg-white/[0.04] px-3 py-1.5"
                    >
                        <Clock className="size-3.5 text-white/40" />
                        <span className="font-mono text-sm tabular-nums text-white/80">
                            {timeLeft.days > 0 && `${timeLeft.days}j `}
                            {String(timeLeft.hours).padStart(2, '0')}:
                            {String(timeLeft.minutes).padStart(2, '0')}
                            {timeLeft.days === 0 && `:${String(timeLeft.seconds).padStart(2, '0')}`}
                        </span>
                    </motion.div>

                    {/* Close - plus discret */}
                    <button
                        onClick={onClose}
                        className="flex size-8 items-center justify-center rounded-full text-white/40 transition-colors hover:bg-white/[0.04] hover:text-white/60"
                    >
                        <XClose className="size-4" />
                    </button>
                </div>
            </div>

            {/* Séparateur subtil */}
            <div className="mx-6 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

            {/* Main Content */}
            <div className="relative z-10 flex flex-1 flex-col gap-4 overflow-auto p-6">
                
                {/* Leader badge - flottant, style Dynamic Island */}
                <div className="flex justify-center">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/[0.04] px-4 py-2">
                        <div className="flex size-5 items-center justify-center rounded-full bg-amber-500/20">
                            <Trophy01 className="size-3 text-amber-400" />
                        </div>
                        <span className="text-sm font-medium text-white/80">{leader.username}</span>
                        <span className="text-sm tabular-nums text-white/40">{leader.progress}%</span>
                    </div>
                </div>

                {/* Race Track */}
                <motion.div 
                    layoutId={`race-track-${race.id}`}
                    className="relative flex-1"
                >
                    {/* Track container - style glassmorphism subtil */}
                    <div 
                        className="relative h-full rounded-2xl bg-white/[0.02] p-5"
                        style={{
                            boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.03)'
                        }}
                    >
                        {/* Track markers - Départ/Arrivée */}
                        <div className="mb-4 flex items-center justify-between px-1">
                            <div className="flex items-center gap-2">
                                <div className="size-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                                <span className="text-[10px] font-medium uppercase tracking-widest text-white/30">Start</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-medium uppercase tracking-widest text-white/30">Finish</span>
                                <div className="size-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.2)]" />
                            </div>
                        </div>

                        {/* Lanes container */}
                        <div className="relative">
                            {/* Track line - très subtile */}
                            <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-white/[0.03]" />
                            
                            {/* Start/Finish vertical lines */}
                            <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-emerald-500/40 via-emerald-500/20 to-emerald-500/40" />
                            <div className="absolute right-0 top-0 h-full w-px bg-gradient-to-b from-white/20 via-white/10 to-white/20" />

                            {/* Lanes */}
                            <div className="relative flex flex-col gap-3 px-2">
                                {sortedParticipants.map((participant, index) => (
                                    <RaceLane
                                        key={participant.id}
                                        participant={participant}
                                        index={index}
                                        isCurrentUser={participant.isCurrentUser ?? false}
                                        raceId={race.id}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}

// Composant RaceLane amélioré
interface RaceLaneProps {
    participant: Participant;
    index: number;
    isCurrentUser: boolean;
    raceId: string;
}

function RaceLane({ participant, index, isCurrentUser = false, raceId }: RaceLaneProps) {
    const isLeader = index === 0;
    
    return (
        <div className="group relative">
            {/* Lane background */}
            <div 
                className={cx(
                    "relative h-12 rounded-xl transition-colors",
                    isCurrentUser ? "bg-white/[0.04]" : "bg-transparent hover:bg-white/[0.02]"
                )}
            >
                {/* Progress track (background) */}
                <div className="absolute inset-x-3 inset-y-2 rounded-lg bg-white/[0.03]" />
                
                {/* Progress fill */}
                <motion.div 
                    className="absolute inset-y-2 left-3 rounded-lg"
                    initial={{ width: 0 }}
                    animate={{ width: `calc(${participant.progress}% - 24px)` }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    style={{
                        background: isLeader 
                            ? 'linear-gradient(90deg, rgba(251,191,36,0.15) 0%, rgba(251,191,36,0.05) 100%)'
                            : isCurrentUser
                            ? 'linear-gradient(90deg, rgba(99,102,241,0.15) 0%, rgba(99,102,241,0.05) 100%)'
                            : 'linear-gradient(90deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)'
                    }}
                />

                {/* Car icon - positioned on progress */}
                <motion.div
                    className="absolute top-1/2 -translate-y-1/2"
                    initial={{ left: '12px' }}
                    animate={{ left: `calc(${participant.progress}% - 12px)` }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                >
                    <div 
                        className={cx(
                            "flex size-8 items-center justify-center rounded-lg",
                            isLeader && "bg-amber-500/20",
                            isCurrentUser && !isLeader && "bg-indigo-500/20",
                            !isLeader && !isCurrentUser && "bg-white/[0.06]"
                        )}
                    >
                        {/* Car SVG ou emoji selon tes assets */}
                        <span className="text-base">🏎️</span>
                    </div>
                </motion.div>

                {/* Position badge */}
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <span 
                        className={cx(
                            "text-xs font-bold tabular-nums",
                            isLeader ? "text-amber-400" : "text-white/30"
                        )}
                    >
                        {index + 1}
                    </span>
                </div>

                {/* User info - right side */}
                <div className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center gap-3">
                    <span 
                        className={cx(
                            "text-sm font-medium",
                            isLeader ? "text-amber-400" : isCurrentUser ? "text-white" : "text-white/60"
                        )}
                    >
                        {participant.username}
                    </span>
                    <span className="min-w-[3ch] text-right font-mono text-sm tabular-nums text-white/40">
                        {participant.progress}%
                    </span>
                </div>
            </div>
        </div>
    );
}



// ============================================================================
// TIME BLOCK COMPONENT
// ============================================================================

function TimeBlock({ value, label }: { value: number; label: string }) {
    return (
        <div className="flex items-baseline">
            <span className="text-lg font-bold text-white">{value.toString().padStart(2, "0")}</span>
            <span className="text-xs text-gray-500">{label}</span>
        </div>
    );
}

// ============================================================================
// CHECKBOX COMPONENT
// ============================================================================

interface CheckboxProps {
    checked: boolean;
    onChange: () => void;
    disabled?: boolean;
}

function Checkbox({ checked, onChange, disabled }: CheckboxProps) {
    return (
        <button
            type="button"
            onClick={onChange}
            disabled={disabled}
            className={cx(
                "flex size-5 shrink-0 items-center justify-center rounded-md border-2 transition-all",
                checked
                    ? "border-brand-600 bg-brand-600"
                    : "border-gray-300 bg-white hover:border-brand-400 dark:border-gray-600 dark:bg-gray-800",
                disabled && "cursor-not-allowed opacity-50",
            )}
        >
            {checked && <Check className="size-3.5 text-white" strokeWidth={3} />}
        </button>
    );
}

// ============================================================================
// TASK ITEM COMPONENT
// ============================================================================

interface TaskItemProps {
    task: Task;
    onToggle: (taskId: string) => void;
    onToggleSubtask: (taskId: string, subtaskId: string) => void;
}

function TaskItem({ task, onToggle, onToggleSubtask }: TaskItemProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const hasSubtasks = task.subtasks && task.subtasks.length > 0;
    const completedSubtasks = task.subtasks?.filter((s) => s.isCompleted).length || 0;
    const totalSubtasks = task.subtasks?.length || 0;

    const isParentCompleted = hasSubtasks 
        ? completedSubtasks === totalSubtasks 
        : task.isCompleted;

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
            <div
                className={cx(
                    "flex items-center gap-3 px-4 py-3",
                    hasSubtasks && "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50",
                )}
                onClick={() => hasSubtasks && setIsExpanded(!isExpanded)}
            >
                <Checkbox
                    checked={isParentCompleted}
                    onChange={() => !hasSubtasks && onToggle(task.id)}
                    disabled={hasSubtasks}
                />

                <span
                    className={cx(
                        "flex-1 text-sm font-medium",
                        isParentCompleted ? "text-tertiary line-through" : "text-primary",
                    )}
                >
                    {task.title}
                </span>

                {hasSubtasks && (
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-tertiary">
                            {completedSubtasks}/{totalSubtasks}
                        </span>
                        <motion.div
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <ChevronDown className="size-4 text-quaternary" />
                        </motion.div>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {hasSubtasks && isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="border-t border-gray-100 bg-gray-50 px-4 py-2 dark:border-gray-700 dark:bg-gray-900/50">
                            <div className="flex flex-col gap-2">
                                {task.subtasks?.map((subtask) => (
                                    <div
                                        key={subtask.id}
                                        className="flex items-center gap-3 rounded-lg py-1.5"
                                    >
                                        <Checkbox
                                            checked={subtask.isCompleted}
                                            onChange={() => onToggleSubtask(task.id, subtask.id)}
                                        />
                                        <span
                                            className={cx(
                                                "text-sm",
                                                subtask.isCompleted
                                                    ? "text-tertiary line-through"
                                                    : "text-secondary",
                                            )}
                                        >
                                            {subtask.title}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ============================================================================
// TASKS LIST COMPONENT
// ============================================================================

interface TasksListProps {
    tasks: Task[];
    onToggleTask: (taskId: string) => void;
    onToggleSubtask: (taskId: string, subtaskId: string) => void;
}

function TasksList({ tasks, onToggleTask, onToggleSubtask }: TasksListProps) {
    const completedCount = tasks.filter(
        (t) => t.isCompleted || (t.subtasks && t.subtasks.every((s) => s.isCompleted))
    ).length;

    return (
        <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-gray-100 p-3 ring-1 ring-primary/10 dark:bg-gray-900">
            <div className="flex h-full flex-col overflow-hidden rounded-xl bg-white dark:bg-gray-800">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-700/50">
                    <div className="flex items-center gap-2">
                        <Flag06 className="size-5 text-brand-600" />
                        <h2 className="text-base font-semibold text-primary">Tâches</h2>
                    </div>
                    <span className="text-sm text-tertiary">
                        {completedCount}/{tasks.length} terminées
                    </span>
                </div>

                {/* Tasks list */}
                <div className="flex-1 overflow-y-auto p-4">
                    <div className="flex flex-col gap-2">
                        {tasks.map((task) => (
                            <TaskItem
                                key={task.id}
                                task={task}
                                onToggle={onToggleTask}
                                onToggleSubtask={onToggleSubtask}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// LEADERBOARD COMPONENT
// ============================================================================

interface LeaderboardProps {
    participants: Participant[];
}

function Leaderboard({ participants }: LeaderboardProps) {
    return (
        <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-gray-100 p-3 ring-1 ring-primary/10 dark:bg-gray-900">
            <div className="flex h-full flex-col overflow-hidden rounded-xl bg-white dark:bg-gray-800">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-700/50">
                    <div className="flex items-center gap-2">
                        <Trophy01 className="size-5 text-amber-500" />
                        <h2 className="text-base font-semibold text-primary">Classement</h2>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-tertiary">
                        <Users01 className="size-4" />
                        <span>{participants.length}</span>
                    </div>
                </div>

                {/* Participants list */}
                <div className="flex-1 overflow-y-auto">
                    <div className="flex flex-col">
                        {participants.map((participant, index) => (
                            <motion.div
                                key={participant.id}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className={cx(
                                    "flex items-center gap-3 border-b border-gray-50 px-4 py-3 last:border-0 dark:border-gray-700/30",
                                    participant.isCurrentUser && "bg-brand-50/50 dark:bg-brand-950/20",
                                )}
                            >
                                {/* Position badge */}
                                <div
                                    className={cx(
                                        "flex size-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold",
                                        participant.position === 1
                                            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400"
                                            : participant.position === 2
                                              ? "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                                              : participant.position === 3
                                                ? "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-400"
                                                : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
                                    )}
                                >
                                    {participant.position}
                                </div>

                                {/* Name */}
                                <span
                                    className={cx(
                                        "flex-1 truncate text-sm font-medium",
                                        participant.isCurrentUser
                                            ? "text-brand-700 dark:text-brand-400"
                                            : participant.position === 1
                                              ? "text-amber-700 dark:text-amber-400"
                                              : "text-primary",
                                    )}
                                >
                                    {participant.isCurrentUser ? "Toi" : participant.username}
                                </span>

                                {/* Progress bar mini */}
                                <div className="flex w-16 items-center gap-2">
                                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${participant.progress}%` }}
                                            transition={{ delay: 0.2 + index * 0.05, duration: 0.5 }}
                                            className={cx(
                                                "h-full rounded-full",
                                                participant.isCurrentUser
                                                    ? "bg-brand-500"
                                                    : participant.position === 1
                                                      ? "bg-amber-500"
                                                      : "bg-gray-400 dark:bg-gray-500",
                                            )}
                                        />
                                    </div>
                                </div>

                                {/* Progress percentage */}
                                <span
                                    className={cx(
                                        "w-10 text-right font-mono text-xs",
                                        participant.isCurrentUser
                                            ? "text-brand-600 dark:text-brand-400"
                                            : "text-tertiary",
                                    )}
                                >
                                    {participant.progress}%
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function RacePage() {
    const [race, setRace] = useState(MOCK_RACE);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleToggleTask = (taskId: string) => {
        setRace((prev) => ({
            ...prev,
            tasks: prev.tasks.map((task) =>
                task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
            ),
        }));
    };

    const handleToggleSubtask = (taskId: string, subtaskId: string) => {
        setRace((prev) => ({
            ...prev,
            tasks: prev.tasks.map((task) =>
                task.id === taskId && task.subtasks
                    ? {
                          ...task,
                          subtasks: task.subtasks.map((sub) =>
                              sub.id === subtaskId
                                  ? { ...sub, isCompleted: !sub.isCompleted }
                                  : sub
                          ),
                      }
                    : task
            ),
        }));
    };

    return (
        <>
            <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-8">
                <div className="flex flex-col gap-5">
                    {/* Hero Widget - Clickable */}
                    <HeroWidget race={race} onClick={() => setIsModalOpen(true)} />

                    {/* Bottom section */}
                    <div className="flex flex-col gap-5 lg:flex-row">
                        {/* Tasks List */}
                        <div className="min-h-[400px] flex-1 lg:min-h-[calc(100vh-20rem)]">
                            <TasksList
                                tasks={race.tasks}
                                onToggleTask={handleToggleTask}
                                onToggleSubtask={handleToggleSubtask}
                            />
                        </div>

                        {/* Leaderboard */}
                        <div className="min-h-[400px] w-full lg:w-72 lg:min-h-[calc(100vh-20rem)]">
                            <Leaderboard participants={race.participants} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Overlay */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm"
                        onClick={() => setIsModalOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Race Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <RaceModal race={race} onClose={() => setIsModalOpen(false)} />
                )}
            </AnimatePresence>
        </>
    );
}