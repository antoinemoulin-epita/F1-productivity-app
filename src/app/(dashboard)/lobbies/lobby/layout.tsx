"use client";

import { Award01, CheckSquare, HomeLine, Settings02 } from "@untitledui/icons";
import { motion } from "framer-motion";
import { useState } from "react";
import { Tooltip, TooltipTrigger } from "@/components/base/tooltip/tooltip";

interface LayoutLobbyProps {
    children: React.ReactNode;
}

const LayoutLobby = ({ children }: LayoutLobbyProps) => {
    const [selected, setSelected] = useState<string>("general");

    const navItems = [
        { id: "general", Icon: HomeLine, label: "Général" },
        { id: "classements", Icon: Award01, label: "Classements" },
        { id: "taches", Icon: CheckSquare, label: "Tâches" },
        { id: "settings", Icon: Settings02, label: "Paramètres" },
    ];

    const selectedIndex = navItems.findIndex(item => item.id === selected);

    return (
        <div className="min-w-screen flex">
            {/* Zone réservée pour la navigation */}
            <aside className="w-20 flex-shrink-0 relative">
                <section className="flex flex-col gap-0 absolute left-9 top-1/2 -translate-y-1/2">
                    {navItems.map(({ id, Icon, label }, index) => {
                        const distance = Math.abs(index - selectedIndex);
                        const offset = (index - selectedIndex) * 20;
                        const isSelected = selected === id;
                        
                        const opacity = isSelected ? 1 : Math.max(0, 1 - distance * 0.4);
                        
                        return (
                            <Tooltip key={id} title={label} placement="right">
                                <TooltipTrigger asChild>
                                    <motion.button
                                        onClick={() => setSelected(id)}
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
            
            {/* Contenu principal */}
            <main className="flex-1">{children}</main>
        </div>
    );
};

export default LayoutLobby;