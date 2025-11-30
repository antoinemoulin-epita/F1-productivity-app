"use client";

import { useState } from "react";
import { Check, ChevronDown, Flag06 } from "@untitledui/icons";
import { motion, AnimatePresence } from "motion/react";
import { cx } from "@/utils/cx";
import type { Task } from "../types";

// ============================================================================
// CHECKBOX
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
                disabled && "cursor-not-allowed opacity-50"
            )}
        >
            {checked && <Check className="size-3.5 text-white" strokeWidth={3} />}
        </button>
    );
}

// ============================================================================
// TASK ITEM
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
                    hasSubtasks && "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50"
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
                        isParentCompleted ? "text-tertiary line-through" : "text-primary"
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
                                                    : "text-secondary"
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
// TASKS LIST
// ============================================================================

interface TasksListProps {
    tasks: Task[];
    onToggleTask: (taskId: string) => void;
    onToggleSubtask: (taskId: string, subtaskId: string) => void;
}

export function TasksList({ tasks, onToggleTask, onToggleSubtask }: TasksListProps) {
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