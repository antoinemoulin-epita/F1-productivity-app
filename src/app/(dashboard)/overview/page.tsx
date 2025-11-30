"use client";

import { ActiveCarCard } from "./active-car-card";
import CurrentLobbyWidget from "./current-lobby-card";
import StorePart from "./store-part";
import { useNoScrollOnDesktop } from "@/hooks/use-noscrollondesktop";

const OverviewPage = () => {
    useNoScrollOnDesktop();
    return (
        <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:h-[calc(100vh-5rem)] lg:overflow-hidden lg:px-8">
            <div className="flex h-full flex-col gap-4 lg:flex-row lg:gap-6">
                {/* Left column - MES SALONS */}
                <div className="min-h-[400px] flex-1 lg:min-h-0 lg:h-full">
                    <CurrentLobbyWidget />
                </div>

                {/* Right column */}
                <div className="flex w-full flex-col gap-4 lg:w-[30%] lg:max-w-xs lg:h-full lg:gap-4">
                    {/* MA VOITURE - 1/3 de la hauteur */}
                    <div className="h-[180px] shrink-0 lg:h-auto lg:flex-[1]">
                        <ActiveCarCard name="McLaren P1" rarity="legendary" imageUrl="/car.png" isFavorite={true} />
                    </div>

                    {/* BOUTIQUE - 2/3 de la hauteur */}
                    <div className="min-h-[300px] lg:min-h-0 lg:flex-[2]">
                        <StorePart isLocked lockedMessage="Disponible en V2" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OverviewPage;