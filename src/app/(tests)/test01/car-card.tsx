interface CarCardProps {
    name: string;
    position: number;
    progress: number;
    accentColor?: string;
    bgColor?: string;
}

export function CarCard({ name, position, progress, accentColor = "rgb(156 163 175)", bgColor = "rgb(30 41 59 / 0.4)" }: CarCardProps) {
    return (
        <div className="relative w-full transition-all duration-500">
            <div className="flex flex-col items-start gap-1">
                <div
                    className="relative h-14 w-full overflow-hidden rounded-2xl"
                    style={{
                        background: `linear-gradient(to right, 
                            ${bgColor} 0%, 
                            ${bgColor} ${progress}%, 
                            rgb(71 85 105 / 0.2) ${progress}%, 
                            rgb(71 85 105 / 0.2) 100%)`,
                    }}
                >
                    <img
                        src="/car.png"
                        alt={`${name}'s car`}
                        className="absolute top-1/2 w-28 -translate-x-1/2 -translate-y-1/2"
                        style={{ left: `${progress}%` }}
                    />
                </div>
                <div className="flex w-28 justify-between transition-all duration-500" style={{ marginLeft: `calc(${progress}% - 3.5rem)` }}>
                    <span className="text-xs font-bold text-white">{name}</span>
                    <span className="text-xs" style={{ color: accentColor }}>
                        {position}° • {progress}%
                    </span>
                </div>
            </div>
        </div>
    );
}
