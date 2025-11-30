"use client";

import { Award01, Camera01, HomeLine, Settings02 } from "@untitledui/icons";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { Tooltip, TooltipTrigger } from "@/components/base/tooltip/tooltip";

interface LayoutLobbyProps {
    children: React.ReactNode;
}

const navItems = [
    { id: "lobby", path: "/lobbies/lobby/hub", Icon: HomeLine, label: "Général" },
    { id: "ranks", path: "/lobbies/lobby/ranks", Icon: Award01, label: "Classements" },
    { id: "race", path: "/lobbies/lobby/race", Icon: Camera01, label: "Course" },
    { id: "settings", path: "/lobbies/lobby/settings", Icon: Settings02, label: "Paramètres" },
];

const LayoutLobby = ({ children }: LayoutLobbyProps) => {
    const pathname = usePathname();
    const router = useRouter();

    // Trouver l'index de la route active
    const selectedIndex = navItems.findIndex(item => pathname?.startsWith(item.path));
    const currentIndex = selectedIndex >= 0 ? selectedIndex : 0;

    const handleNavigation = (path: string) => {
        router.push(path);
    };

    return (
        <div className="min-w-screen flex min-h-screen">
            {/* Zone réservée pour la navigation */}
            <aside className="w-20 flex-shrink-0 relative">
                <section className="flex flex-col gap-0 absolute left-9 top-1/2 -translate-y-1/2">
                    {navItems.map(({ id, path, Icon, label }, index) => {
                        const distance = Math.abs(index - currentIndex);
                        const offset = (index - currentIndex) * 20;
                        const isSelected = currentIndex === index;

                        const opacity = isSelected ? 1 : Math.max(0, 1 - distance * 0.4);

                        return (
                            <Tooltip key={id} title={label} placement="right">
                                <TooltipTrigger asChild>
                                    <motion.button
                                        onClick={() => handleNavigation(path)}
                                        animate={{
                                            y: offset,
                                            opacity: opacity,
                                        }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 30,
                                        }}
                                        className={`p-2.5 cursor-pointer ${
                                            isSelected ? "bg-gray-100 rounded-2xl" : ""
                                        }`}
                                    >
                                        <motion.div
                                            animate={{
                                                scale: isSelected ? 0.9 : 0.75,
                                            }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 400,
                                                damping: 25,
                                            }}
                                        >
                                            <Icon className="w-6 h-6" />
                                        </motion.div>
                                    </motion.button>
                                </TooltipTrigger>
                            </Tooltip>
                        );
                    })}
                </section>
            </aside>

            {/* Contenu principal - l'animation est gérée par template.tsx */}
            <main className="flex-1 relative overflow-hidden">
                {children}
            </main>
        </div>
    );
};

export default LayoutLobby;