import type { SVGProps } from "react";
import Image from "next/image";
import { cx } from "@/utils/cx";

interface StatsCardMockupCarouselProps extends SVGProps<SVGSVGElement> {
    imageIndex?: number; // 1-10 pour choisir l'image
}

export const StatsCardMockupCarousel = ({ className, imageIndex = 1, ...svgProps }: StatsCardMockupCarouselProps) => {
    // Assurer que imageIndex est entre 1 et 10
    const validIndex = Math.min(Math.max(imageIndex, 1), 10);

    // Map des images avec leurs extensions
    const imageMap: Record<number, string> = {
        1: "/img01.jpg",
        2: "/img02.jpg",
        3: "/img03.jpg",
        4: "/img04.jpg",
        5: "/img05.jpg",
        6: "/img06.jpg", // ou img06-alt.png si préféré
        7: "/img07.jpg",
        8: "/img08.jpg",
        9: "/img09.png", // PNG
        10: "/img10.jpg",
    };

    const imagePath = imageMap[validIndex];

    return (
        <div className={cx("relative", className)}>
            {/* Card with padding around image */}
            <div className="relative h-full overflow-hidden rounded-[40px] border border-alpha-white/20 bg-alpha-white/10 p-4">
                {/* Image container */}
                <div className="relative h-full w-full overflow-hidden rounded-[32px] bg-bg-primary">
                    <Image src={imagePath} alt={`Feature showcase ${validIndex}`} width={456} height={296} className="h-full w-full object-cover" priority />
                </div>
            </div>

            {/* Decorative background elements */}
            <svg width="80" height="88" viewBox="0 0 80 88" fill="none" className="absolute -top-[19px] -right-11 z-0 opacity-20">
                <g filter="url(#filter0)">
                    <rect width="72" height="72" className="fill-alpha-white/20" />
                    <rect x="0.5" y="0.5" width="71" height="71" className="stroke-alpha-white/30" />
                </g>
                <defs>
                    <filter id="filter0" filterUnits="userSpaceOnUse">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="12" />
                    </filter>
                </defs>
            </svg>

            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="absolute -bottom-6 -left-10 z-0 opacity-20">
                <g filter="url(#filter1)">
                    <rect width="80" height="80" className="fill-alpha-white/20" />
                    <rect x="0.5" y="0.5" width="79" height="79" className="stroke-alpha-white/30" />
                </g>
                <defs>
                    <filter id="filter1" filterUnits="userSpaceOnUse">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="12" />
                    </filter>
                </defs>
            </svg>
        </div>
    );
};
