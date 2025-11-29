"use client";

import React from "react";
import { Trophy } from "lucide-react";
import { Button, Heading, OverlayArrow, Text, Tooltip, TooltipTrigger } from "react-aria-components";

// --- Données de la Timeline (Basées sur l'histoire McLaren) ---
const timelineData = [
    { year: 1974, dc: true, cc: true },
    { year: 1984, dc: true, cc: true },
    { year: 1985, dc: true, cc: true },
    { year: 1986, dc: true, cc: false }, // Prost (DC), Williams (CC)
    { year: 1988, dc: true, cc: true },
    { year: 1989, dc: true, cc: true },
    { year: 1990, dc: true, cc: true },
    { year: 1991, dc: true, cc: true },
    { year: 1998, dc: true, cc: true },
    { year: 2008, dc: true, cc: false }, // Hamilton (DC), Ferrari (CC)
    { year: 2024, dc: false, cc: true }, // Projection/Espoir pour l'affiche
];

// --- Composants SVG & Déco ---

const McLarenLogo = () => (
    <div className="flex flex-col items-start gap-1">
        <div className="flex w-full items-center gap-2">
            {/* Simulation simplifiée du logo texte */}
            <span className="font-display text-4xl font-black tracking-tighter text-black uppercase italic">McLaren</span>
            {/* Le petit swoosh du logo */}
            <svg width="40" height="15" viewBox="0 0 50 20" className="fill-mclaren-orange mb-2">
                <path d="M50 0C30 0 10 15 0 20C15 15 35 5 50 0Z" />
            </svg>
        </div>
        <span className="ml-1 text-[10px] font-bold tracking-[0.4em] text-black uppercase">Formula 1 Team</span>
    </div>
);

const BigOrangeSwoosh = () => (
    <div className="pointer-events-none absolute top-[25%] left-0 z-0 h-[400px] w-full overflow-hidden">
        <svg viewBox="0 0 1000 500" preserveAspectRatio="none" className="fill-mclaren-orange h-full w-full">
            {/* Approximation de la courbe McLaren */}
            <path d="M0,200 C200,80 600,0 1000,50 L1000,200 C800,450 600,450 550,500 L530,480 C600,400 700,300 0,220 Z" />
        </svg>
    </div>
);

// --- Composant Principal ---

export default function TestPage() {
    return (
        <div className="selection:bg-mclaren-orange relative flex min-h-screen flex-col items-center overflow-hidden bg-[#EAE8DE] py-10 font-sans text-[#1a1a1a] selection:text-white">
            {/* Background Graphic */}
            <BigOrangeSwoosh />

            <main className="relative z-10 flex h-full w-full max-w-4xl flex-col px-6">
                {/* Header Spacer to push content down below the swoosh visual weight */}
                <div className="h-[350px]"></div>

                {/* Logo Section */}
                <div className="mb-12">
                    <McLarenLogo />
                </div>

                {/* Timeline Section */}
                <section className="mb-16 w-full" aria-label="Championship History">
                    {/* Legend */}
                    <div className="mb-8 flex gap-4 text-[9px] font-bold tracking-wide text-gray-500 uppercase">
                        <div className="flex flex-col">
                            <span>First</span>
                            <span>Entry</span>
                            <span className="mt-2 text-black">1966</span>
                        </div>
                        {/* Note: The timeline logic below renders the rest */}
                    </div>

                    {/* Timeline Visual */}
                    <div className="relative mt-6 flex w-full items-center justify-between border-t border-gray-400">
                        {timelineData.map((data, index) => (
                            <TimelineNode key={data.year} data={data} />
                        ))}
                    </div>

                    {/* Legend Footer */}
                    <div className="mt-6 space-y-1 text-[8px] font-medium tracking-wide text-gray-500">
                        <p>* DC = DRIVERS CHAMPIONSHIPS</p>
                        <p>* CC = CONSTRUCTORS CHAMPIONSHIPS</p>
                    </div>
                </section>

                {/* Content Grid */}
                <div className="relative grid grid-cols-1 items-end gap-8 md:grid-cols-2">
                    {/* Left Text Column */}
                    <div className="max-w-xs text-justify text-[10px] leading-relaxed font-medium text-gray-800">
                        <Text>
                            McLaren Racing Limited, known as <strong className="font-bold">McLaren Formula 1 Team</strong> is a British motor racing team based
                            at the McLaren Technology Centre in Woking, Surrey, England.
                        </Text>
                        <Text className="mt-2 block">
                            <strong className="font-bold">Founded in 1963</strong> by New Zealander <span className="italic">Bruce McLaren</span>, the team won
                            its first Grand Prix at the 1968 Belgian Grand Prix, but their greatest initial success was in Can-Am, which they dominated from
                            1967 to 1971.
                        </Text>
                    </div>

                    {/* Right Text Column (2025 Info) */}
                    <div className="relative flex flex-col items-end text-right">
                        {/* The giant '2025' background text */}
                        <h2 className="absolute -top-16 right-0 z-0 text-[140px] leading-none font-bold tracking-tighter text-white opacity-80 mix-blend-overlay select-none">
                            2025
                        </h2>

                        <div className="relative z-10 mt-4 flex flex-col gap-1 text-[9px] font-bold tracking-widest uppercase">
                            <div className="flex items-center justify-end gap-2">
                                <span className="text-gray-500">TEAM PRINCIPAL</span>
                                <span className="text-black">ANDREA STELLA</span>
                            </div>
                            <div className="flex items-start justify-end gap-2 text-gray-500">
                                <span>ZAK BROWN</span>
                            </div>
                            <div className="mt-2 flex items-center justify-end gap-2">
                                <span className="text-gray-500">RACE DRIVERS</span>
                                <div className="flex flex-col text-right text-black">
                                    <span>
                                        4 <span className="ml-1">LANDO NORRIS</span>
                                    </span>
                                    <span>
                                        81 <span className="ml-1">OSCAR PIASTRI</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Car Image Area */}
                <div className="relative mt-2 flex h-48 w-full items-center justify-center md:h-64">
                    {/* Placeholder for the car - using a semantic figure */}
                    <figure className="relative h-full w-full">
                        <img
                            src="https://media.formula1.com/image/upload/f_auto,c_limit,w_1440,q_auto/f_auto/q_auto/content/dam/fom-website/2018-redesign-assets/team%20logos/mclaren"
                            alt="McLaren Formula 1 Car Livery"
                            className="h-full w-full object-contain drop-shadow-xl"
                        />
                        {/* Note: In a real project, use the exact cutout PNG of the MCL38 */}
                    </figure>
                </div>

                {/* Footer Watermark */}
                <div className="mt-4 w-full text-center">
                    <span className="text-[10px] tracking-widest text-gray-400 lowercase">@disasterous_lit</span>
                </div>
            </main>

            {/* Tailwind Custom Colors injection for this snippet */}
            <style>{`
        .font-display { font-family: 'Inter', sans-serif; }
        .bg-mclaren-cream { background-color: #EAE8DE; }
        .text-mclaren-orange { color: #FF8700; }
        .fill-mclaren-orange { fill: #FF8700; }
        .border-mclaren-orange { border-color: #FF8700; }
      `}</style>
        </div>
    );
}

// --- Composant Node de la Timeline (React Aria) ---
function TimelineNode({ data }) {
    return (
        <div className="group relative flex flex-col items-center">
            {/* Top Labels (DC/CC) */}
            <div className="absolute -top-10 flex flex-col items-center gap-1 opacity-100 transition-opacity">
                {data.dc && <span className="text-[8px] font-bold tracking-wider text-black uppercase">DC</span>}
                {data.cc && <span className="text-[8px] font-bold tracking-wider text-black uppercase">CC</span>}
            </div>

            {/* The Dot (Interactive for A11y) */}
            <TooltipTrigger delay={0}>
                <Button
                    className={`z-10 h-3 w-3 rounded-full border-[3px] border-[#333] bg-[#EAE8DE] ring-orange-500 ring-offset-2 transition-all outline-none hover:scale-125 hover:bg-black focus:ring-2 ${data.dc && data.cc ? "ring-1 ring-black" : ""} `}
                    aria-label={`Year ${data.year} - ${data.dc ? "Drivers Champion" : ""} ${data.cc ? "Constructors Champion" : ""}`}
                >
                    {/* Inner dot for double wins */}
                    {data.dc && data.cc && <div className="h-full w-full rounded-full bg-transparent" />}
                </Button>
                <Tooltip className="rounded bg-black px-2 py-1 text-xs text-white shadow-lg">
                    <OverlayArrow>
                        <svg width={8} height={8} viewBox="0 0 8 8" className="fill-black">
                            <path d="M0 0 L4 4 L8 0" />
                        </svg>
                    </OverlayArrow>
                    {data.year}: {data.dc ? "Drivers" : ""} {data.dc && data.cc ? "&" : ""} {data.cc ? "Constructors" : ""} Win
                </Tooltip>
            </TooltipTrigger>

            {/* Year Label */}
            <span className="absolute -bottom-6 text-[9px] font-bold tracking-tighter text-black">{data.year}</span>

            {/* Vertical connector line (visual only) */}
            <div className="absolute top-3 -z-10 h-2 w-[1px] bg-gray-300" />
        </div>
    );
}
