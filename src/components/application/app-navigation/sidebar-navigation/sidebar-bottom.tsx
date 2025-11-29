"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { Link } from "react-aria-components";

interface BottomBarItem {
    label: string;
    href: string;
    icon: React.ReactNode;
    badge?: string;
}

interface BottomBarProps {
    items: BottomBarItem[];
}

export const BottomBar = ({ items }: BottomBarProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const pathname = usePathname();

    // Normalise les paths pour la comparaison (retire les doubles slashes)
    const normalizePath = (path: string) => path.replace(/\/+/g, "/");
    const currentPath = normalizePath(pathname);

    return (
        <>
            {/* Zone d'activation invisible */}
            <div
                className="fixed bottom-0 left-1/2 z-40 h-20 w-80 -translate-x-1/2"
                onMouseEnter={() => setIsVisible(true)}
                onMouseLeave={() => setIsVisible(false)}
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
                        onMouseEnter={() => setIsVisible(true)}
                        onMouseLeave={() => setIsVisible(false)}
                        className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-4xl border border-gray-100 bg-gray-50 px-4 py-2 shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:shadow-xl"
                    >
                        <ul className="flex items-center gap-5">
                            {items.map((item, index) => {
                                const normalizedHref = normalizePath(item.href);
                                const isActive = currentPath === normalizedHref || currentPath.startsWith(normalizedHref + "/");

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
                                            {/* Background animé avec layoutId */}
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

                                            {/* Contenu au-dessus du background */}
                                            <div className="relative z-10 flex flex-col items-center gap-1">
                                                <div className="relative">
                                                    {item.icon}
                                                    {item.badge && (
                                                        <span className="absolute -top-2 -right-2 rounded-full bg-red-600 px-1.5 py-0.5 text-[8px] font-semibold text-white uppercase">
                                                            {item.badge}
                                                        </span>
                                                    )}
                                                </div>
                                                <span className={`text-xs ${isActive ? "text-black dark:text-white" : "text-gray-800 dark:text-gray-400"}`}>
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
