"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { Link } from "react-aria-components";
import { Lock01 } from "@untitledui/icons";

interface BottomBarItem {
    label: string;
    href: string;
    icon: React.ReactNode;
    iconActive?: React.ReactNode;
    badge?: string;
    isLocked?: boolean;
    lockedLabel?: string;
}

interface BottomBarProps {
    items: BottomBarItem[];
}

export const BottomBar = ({ items }: BottomBarProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 640);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const isVisible = isMobile || isHovered;

    const normalizePath = (path: string) => path.replace(/\/+/g, "/");
    const currentPath = normalizePath(pathname);

    // Mobile: Full-width fixed bottom bar
    if (isMobile) {
        return (
            <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white pb-[env(safe-area-inset-bottom)] dark:border-gray-800 dark:bg-gray-950">
                <ul className="flex h-16 items-center justify-around">
                    {items.map((item) => {
                        const normalizedHref = normalizePath(item.href);
                        const isActive = !item.isLocked && (currentPath === normalizedHref || currentPath.startsWith(normalizedHref + "/"));

                        // Locked item
                        if (item.isLocked) {
                            return (
                                <li key={item.href} className="flex-1">
                                    <div className="flex h-full w-full cursor-not-allowed flex-col items-center justify-center gap-1 opacity-40">
                                        <div className="relative">
                                            <div className="text-gray-300 dark:text-gray-600">
                                                {item.icon}
                                            </div>
                                            {/* Mini lock badge */}
                                            <div className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
                                                <Lock01 className="h-2 w-2 text-gray-400 dark:text-gray-500" />
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-medium text-gray-300 dark:text-gray-600">
                                            {item.lockedLabel || "Bientôt"}
                                        </span>
                                    </div>
                                </li>
                            );
                        }

                        return (
                            <li key={item.href} className="flex-1">
                                <Link
                                    href={item.href}
                                    className="flex h-full w-full flex-col items-center justify-center gap-1 active:scale-95 active:opacity-70"
                                >
                                    <div className="relative">
                                        <div
                                            className={`transition-all duration-150 ${
                                                isActive
                                                    ? "scale-110 text-gray-900 dark:text-white"
                                                    : "text-gray-400 dark:text-gray-500"
                                            }`}
                                        >
                                            {isActive && item.iconActive ? item.iconActive : item.icon}
                                        </div>
                                        {item.badge && (
                                            <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                                                {item.badge}
                                            </span>
                                        )}
                                    </div>
                                    <span
                                        className={`text-[10px] transition-all duration-150 ${
                                            isActive
                                                ? "font-semibold text-gray-900 dark:text-white"
                                                : "font-medium text-gray-400 dark:text-gray-500"
                                        }`}
                                    >
                                        {item.label}
                                    </span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        );
    }

    // Desktop: Floating pill with hover reveal
    return (
        <>
            <div
                className="fixed bottom-0 left-1/2 z-40 h-20 w-80 -translate-x-1/2"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            />

            <AnimatePresence>
                {isVisible && (
                    <motion.nav
                        initial={{ y: 100, opacity: 0, scale: 0.9 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: 100, opacity: 0, scale: 0.9 }}
                        transition={{
                            type: "spring",
                            damping: 25,
                            stiffness: 300,
                            opacity: { duration: 0.15 },
                        }}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-4xl border border-gray-100 bg-gray-50 px-4 py-2 shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:shadow-xl"
                    >
                        <ul className="flex items-center gap-5">
                            {items.map((item, index) => {
                                const normalizedHref = normalizePath(item.href);
                                const isActive = !item.isLocked && (currentPath === normalizedHref || currentPath.startsWith(normalizedHref + "/"));

                                // Locked item
                                if (item.isLocked) {
                                    return (
                                        <motion.li
                                            key={item.href}
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{
                                                delay: 0.03 * index,
                                                type: "spring",
                                                damping: 20,
                                                stiffness: 300,
                                            }}
                                        >
                                            <div
                                                className="group relative flex min-w-[60px] cursor-not-allowed flex-col items-center gap-1 rounded-3xl px-3.5 py-2.5 opacity-40"
                                                title={item.lockedLabel || "Bientôt disponible"}
                                            >
                                                <div className="relative z-10 flex flex-col items-center gap-1">
                                                    <div className="relative">
                                                        <div className="text-gray-300 dark:text-gray-600">
                                                            {item.icon}
                                                        </div>
                                                        {/* Mini lock badge */}
                                                        <div className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
                                                            <Lock01 className="h-2.5 w-2.5 text-gray-400 dark:text-gray-500" />
                                                        </div>
                                                    </div>
                                                    <span className="text-xs text-gray-300 dark:text-gray-600">
                                                        {item.lockedLabel || "Bientôt"}
                                                    </span>
                                                </div>
                                            </div>
                                        </motion.li>
                                    );
                                }

                                return (
                                    <motion.li
                                        key={item.href}
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{
                                            delay: 0.03 * index,
                                            type: "spring",
                                            damping: 20,
                                            stiffness: 300,
                                        }}
                                    >
                                        <Link
                                            href={item.href}
                                            className={`group relative flex min-w-[60px] flex-col items-center gap-1 rounded-3xl px-3.5 py-2.5 ${
                                                isActive ? "opacity-100" : "opacity-60 hover:opacity-100"
                                            }`}
                                        >
                                            {isActive && (
                                                <motion.div
                                                    layoutId="bottombar-indicator"
                                                    className="absolute inset-0 rounded-3xl bg-gray-200 dark:bg-gray-800"
                                                    transition={{
                                                        type: "spring",
                                                        stiffness: 500,
                                                        damping: 35,
                                                    }}
                                                />
                                            )}

                                            <div className="relative z-10 flex flex-col items-center gap-1">
                                                <div className="relative">
                                                    {isActive && item.iconActive ? item.iconActive : item.icon}
                                                    {item.badge && (
                                                        <span className="absolute -top-2 -right-2 rounded-full bg-red-600 px-1.5 py-0.5 text-[8px] font-semibold text-white uppercase">
                                                            {item.badge}
                                                        </span>
                                                    )}
                                                </div>
                                                <span
                                                    className={`text-xs ${
                                                        isActive ? "text-black dark:text-white" : "text-gray-800 dark:text-gray-400"
                                                    }`}
                                                >
                                                    {item.label}
                                                </span>
                                            </div>
                                        </Link>
                                    </motion.li>
                                );
                            })}
                        </ul>
                    </motion.nav>
                )}
            </AnimatePresence>
        </>
    );
};