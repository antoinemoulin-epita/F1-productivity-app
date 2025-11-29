import MyLobbiesPart from "../lobbies/my-lobbies-part";
import { ActiveCarCard } from "./active-car-card";
import CurrentLobbyWidget from "./current-lobby-card";
import StorePart from "./store-part";

const OverviewPage = () => {
    return (
        <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
                {/* Left column - MES SALONS */}
                <div className="min-h-[300px] flex-1 rounded-2xl lg:min-h-[calc(100vh-12rem)]">
                    <CurrentLobbyWidget />
                </div>

                {/* Right column */}
                <div className="flex w-full flex-col gap-4 lg:w-[30%] lg:max-w-xs lg:gap-6">
                    {/* MA VOITURE */}
                    <ActiveCarCard name="McLaren P1" rarity="legendary" imageUrl="/car.png" isFavorite={true} />

                    {/* BOUTIQUE - 2/3 height */}
                   <StorePart />
                </div>
            </div>
        </div>
    );
};

export default OverviewPage;