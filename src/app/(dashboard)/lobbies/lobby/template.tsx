"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// Ordre des routes pour déterminer la direction
const routeOrder = [
    "/lobbies/lobby/hub",
    "/lobbies/lobby/ranks", 
    "/lobbies/lobby/race",
    "/lobbies/lobby/settings",
];

const getRouteIndex = (pathname: string | null): number => {
    if (!pathname) return 0;
    const index = routeOrder.findIndex(route => pathname.startsWith(route));
    return index >= 0 ? index : 0;
};

interface TemplateProps {
    children: React.ReactNode;
}

export default function Template({ children }: TemplateProps) {
    const pathname = usePathname();
    const prevIndexRef = useRef<number>(getRouteIndex(pathname));
    const [direction, setDirection] = useState(0);

    useEffect(() => {
        const currentIndex = getRouteIndex(pathname);
        const newDirection = currentIndex > prevIndexRef.current ? 1 : -1;
        setDirection(newDirection);
        prevIndexRef.current = currentIndex;
    }, [pathname]);

    const variants = {
        initial: {
            y: direction >= 0 ? 50 : -50,
            opacity: 0,
        },
        animate: {
            y: 0,
            opacity: 1,
        },
        exit: {
            y: direction >= 0 ? -50 : 50,
            opacity: 0,
        },
    };

    return (
        <motion.div
            key={pathname}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
            }}
            className="w-full h-full"
        >
            {children}
        </motion.div>
    );
}