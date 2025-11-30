"use client";

import { Award01, Camera01, HomeLine, Settings02 } from "@untitledui/icons";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { Tooltip, TooltipTrigger } from "@/components/base/tooltip/tooltip";
import { useLobbyNavStore } from "@/stores/lobby-nav-store";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

interface LayoutLobbyProps {
    children: React.ReactNode;
}

const navItems = [
    { id: "hub", Icon: HomeLine, label: "Général" },
    { id: "ranks", Icon: Award01, label: "Classements" },
     { id: "settings", Icon: Settings02, label: "Paramètres" },
];

const LayoutLobby = ({ children }: LayoutLobbyProps) => {
    const selected = useLobbyNavStore((state) => state.selected);
    const setSelected = useLobbyNavStore((state) => state.setSelected);
    const router = useRouter();
    const { id: lobbyId } = useParams();

    const selectedIndex = navItems.findIndex(item => item.id === selected);

    const handleClick = (id: string) => {
        setSelected(id);
        router.push(`/lobbies/${lobbyId}/${id}`);
    };

    const pathname = usePathname();

useEffect(() => {
    if (!pathname || !lobbyId) return;
    
    const segment = pathname.split(`/lobbies/${lobbyId}/`)[1]?.split("/")[0];
    if (segment && navItems.some(item => item.id === segment) && segment !== selected) {
        setSelected(segment);
    }
}, [pathname, lobbyId]);

    return (
        <div className="min-h-screen">
            {/* Navigation fixe */}
            <aside className="fixed left-0 top-0 z-50 h-screen w-20">
                <section className="absolute left-9 top-1/2 flex -translate-y-1/2 flex-col gap-0">
                    {navItems.map(({ id, Icon, label }, index) => {
                        const distance = Math.abs(index - selectedIndex);
                        const offset = (index - selectedIndex) * 20;
                        const isSelected = selected === id;
                        
                        const opacity = isSelected ? 1 : Math.max(0, 1 - distance * 0.4);
                        
                        return (
                            <Tooltip key={id} title={label} placement="right">
                                <TooltipTrigger asChild>
                                    <motion.button
                                        onClick={() => handleClick(id)}
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
            
            {/* Contenu principal avec marge pour la sidebar */}
            <main className="ml-20 min-h-screen">
                {children}
            </main>
        </div>
    );
};

export default LayoutLobby;