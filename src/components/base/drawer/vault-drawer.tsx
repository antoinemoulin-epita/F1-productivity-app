"use client";

import { useMemo, useRef, ReactNode } from "react";
import { Drawer } from "vaul";
import useMeasure from "react-use-measure";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import clsx from "clsx";

// =============================================================================
// Types
// =============================================================================

interface VaulDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  /** Max width of drawer - default 400px */
  maxWidth?: number;
  /** Show close button - default true */
  showClose?: boolean;
  /** Custom className for content wrapper */
  className?: string;
}

interface DrawerViewProps {
  view: string;
  children: ReactNode;
}

interface DrawerButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "default" | "danger" | "primary" | "secondary";
  className?: string;
  disabled?: boolean;
}

interface DrawerHeaderProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  badge?: ReactNode;
}

interface DrawerSectionProps {
  title?: string;
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
}

// =============================================================================
// Base Drawer Component
// =============================================================================

export function VaulDrawer({
  open,
  onOpenChange,
  children,
  maxWidth = 400,
  showClose = true,
  className,
}: VaulDrawerProps) {
  const [elementRef, bounds] = useMeasure({});
  const previousHeightRef = useRef<number>();

  const opacityDuration = useMemo(() => {
    const currentHeight = bounds.height;
    const previousHeight = previousHeightRef.current;

    const MIN_DURATION = 0.15;
    const MAX_DURATION = 0.27;

    if (!previousHeightRef.current) {
      previousHeightRef.current = currentHeight;
      return MIN_DURATION;
    }

    const heightDifference = Math.abs(currentHeight - (previousHeight || 0));
    previousHeightRef.current = currentHeight;

    const duration = Math.min(
      Math.max(heightDifference / 500, MIN_DURATION),
      MAX_DURATION
    );

    return duration;
  }, [bounds.height]);

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]"
          onClick={() => onOpenChange(false)}
        />
        <Drawer.Content
          asChild
          className={clsx(
            "fixed inset-x-4 bottom-4 z-50 mx-auto overflow-hidden rounded-[28px] bg-white outline-none md:mx-auto md:w-full",
            className
          )}
          style={{ maxWidth }}
        >
          <motion.div
            animate={{
              height: bounds.height,
              transition: {
                duration: 0.27,
                ease: [0.25, 1, 0.5, 1],
              },
            }}
          >
            {showClose && (
              <Drawer.Close asChild>
                <button
                  data-vaul-no-drag=""
                  className="absolute right-5 top-5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-all hover:bg-gray-200 focus:scale-95 active:scale-90"
                >
                  <X className="h-4 w-4" />
                </button>
              </Drawer.Close>
            )}
            <div ref={elementRef} className="antialiased">
              {children}
            </div>
          </motion.div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

// =============================================================================
// Animated View Wrapper (for multi-step drawers)
// =============================================================================

export function DrawerAnimatedView({ view, children }: DrawerViewProps) {
  return (
    <AnimatePresence initial={false} mode="popLayout">
      <motion.div
        key={view}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{
          duration: 0.2,
          ease: [0.26, 0.08, 0.25, 1],
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// =============================================================================
// Drawer Header
// =============================================================================

export function DrawerHeader({ icon, title, description, badge }: DrawerHeaderProps) {
  return (
    <header className="px-6 pt-6 pb-4">
      {icon && <div className="mb-3">{icon}</div>}
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        {badge}
      </div>
      {description && (
        <p className="mt-2 text-sm leading-relaxed text-gray-500">
          {description}
        </p>
      )}
    </header>
  );
}

// =============================================================================
// Drawer Section
// =============================================================================

export function DrawerSection({ title, children, className, noPadding }: DrawerSectionProps) {
  return (
    <section className={clsx(!noPadding && "px-6 py-4", className)}>
      {title && (
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
          {title}
        </h3>
      )}
      {children}
    </section>
  );
}

// =============================================================================
// Drawer Divider
// =============================================================================

export function DrawerDivider() {
  return <div className="mx-6 border-t border-gray-100" />;
}

// =============================================================================
// Drawer Button
// =============================================================================

export function DrawerButton({
  children,
  onClick,
  variant = "default",
  className,
  disabled,
}: DrawerButtonProps) {
  const variants = {
    default: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    danger: "bg-red-50 text-red-600 hover:bg-red-100",
    primary: "bg-primary-500 text-white hover:bg-primary-600",
    secondary: "bg-gray-100 text-gray-600 hover:bg-gray-200",
  };

  return (
    <button
      data-vaul-no-drag=""
      disabled={disabled}
      onClick={onClick}
      className={clsx(
        "flex h-12 w-full items-center gap-3 rounded-2xl px-4 text-[15px] font-medium transition-all",
        "focus:scale-[0.98] active:scale-[0.97]",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        className
      )}
    >
      {children}
    </button>
  );
}

// =============================================================================
// Drawer Action Buttons (for footer)
// =============================================================================

interface DrawerActionsProps {
  children: ReactNode;
  className?: string;
}

export function DrawerActions({ children, className }: DrawerActionsProps) {
  return (
    <div className={clsx("flex gap-3 px-6 pb-6 pt-4", className)}>
      {children}
    </div>
  );
}

interface DrawerActionButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "cancel" | "confirm" | "danger";
  className?: string;
  disabled?: boolean;
  icon?: ReactNode;
}

export function DrawerActionButton({
  children,
  onClick,
  variant = "cancel",
  className,
  disabled,
  icon,
}: DrawerActionButtonProps) {
  const variants = {
    cancel: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    confirm: "bg-primary-500 text-white hover:bg-primary-600",
    danger: "bg-red-500 text-white hover:bg-red-600",
  };

  return (
    <button
      data-vaul-no-drag=""
      disabled={disabled}
      onClick={onClick}
      className={clsx(
        "flex h-12 flex-1 items-center justify-center gap-2 rounded-full text-base font-semibold transition-all",
        "focus:scale-[0.98] active:scale-[0.97]",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        className
      )}
    >
      {icon}
      {children}
    </button>
  );
}

// =============================================================================
// Drawer List Item
// =============================================================================

interface DrawerListItemProps {
  icon?: ReactNode;
  children: ReactNode;
}

export function DrawerListItem({ icon, children }: DrawerListItemProps) {
  return (
    <li className="flex items-center gap-3 text-sm font-medium text-gray-500">
      {icon && <span className="text-gray-400">{icon}</span>}
      {children}
    </li>
  );
}

// =============================================================================
// Drawer Stats Grid
// =============================================================================

interface DrawerStatProps {
  value: string | number;
  label: string;
  icon?: ReactNode;
}

export function DrawerStatsGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {children}
    </div>
  );
}

export function DrawerStat({ value, label, icon }: DrawerStatProps) {
  return (
    <div className="flex flex-col items-center rounded-xl bg-gray-50 p-3">
      {icon && <span className="mb-1 text-lg">{icon}</span>}
      <span className="text-lg font-bold text-gray-900">{value}</span>
      <span className="text-[11px] text-gray-500">{label}</span>
    </div>
  );
}

// =============================================================================
// CSS (add to globals.css)
// =============================================================================

/*
[vaul-drawer] {
  transition: transform 0.2s cubic-bezier(0.165, 0.84, 0.44, 1) !important;
}

[vaul-overlay] {
  transition: opacity 0.2s cubic-bezier(0.165, 0.84, 0.44, 1) !important;
}
*/