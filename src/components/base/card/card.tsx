"use client";

import { createContext, forwardRef, useContext, type ReactNode, type CSSProperties } from "react";
import { Link, Button, type PressEvent } from "react-aria-components";
import { motion, type MotionProps } from "motion/react";
import { clsx } from "clsx";

// ============================================================================
// TYPES
// ============================================================================

type CardVariant = "default" | "elevated" | "outlined" | "ghost";
type CardSize = "sm" | "md" | "lg";
type CardLayout = "stack" | "inset";

interface CardContextValue {
    variant: CardVariant;
    size: CardSize;
    layout: CardLayout;
    isInteractive: boolean;
    isDisabled: boolean;
    layoutId?: string;
}

interface CardRootProps {
    children: ReactNode;
    className?: string;
    style?: CSSProperties;
    variant?: CardVariant;
    size?: CardSize;
    /** 
     * Layout mode:
     * - "stack": Visual zone stacked above content (default, like SalonCard, F1Card)
     * - "inset": Visual zone is inset with padding (like ActiveCarCard)
     */
    layout?: CardLayout;
    /** Makes the card a link */
    href?: string;
    /** Makes the card a button */
    onPress?: (e: PressEvent) => void;
    /** For Framer Motion shared layout animations */
    layoutId?: string;
    /** Framer Motion props */
    motionProps?: Omit<MotionProps, "children">;
    isDisabled?: boolean;
}

interface CardVisualProps {
    children?: ReactNode;
    className?: string;
    style?: CSSProperties;
    /** Gradient background - can be a preset name or custom CSS */
    gradient?: string;
    /** Background image URL */
    backgroundImage?: string;
    /** Solid background color class (e.g., "bg-white dark:bg-neutral-800") */
    backgroundColor?: string;
    /** Height - defaults to 140, can be number (px) or string (css value like "auto") */
    height?: string | number;
    /** Apply grayscale filter (for locked states) */
    isLocked?: boolean;
    /** For Framer Motion shared layout */
    layoutId?: string;
}

interface CardBadgeProps {
    children: ReactNode;
    className?: string;
    position?: "top-left" | "top-right" | "top-center" | "bottom-left" | "bottom-right" | "bottom-center";
}

interface CardContentProps {
    children: ReactNode;
    className?: string;
}

interface CardTitleProps {
    children: ReactNode;
    className?: string;
    /** For Framer Motion shared layout */
    layoutId?: string;
}

interface CardDescriptionProps {
    children: ReactNode;
    className?: string;
}

interface CardFooterProps {
    children: ReactNode;
    className?: string;
}

interface CardOverlayProps {
    children: ReactNode;
    className?: string;
    /** Show overlay with backdrop blur */
    blur?: boolean;
}

// ============================================================================
// CONTEXT
// ============================================================================

const CardContext = createContext<CardContextValue | null>(null);

function useCardContext() {
    const context = useContext(CardContext);
    if (!context) {
        throw new Error("Card compound components must be used within Card.Root");
    }
    return context;
}

// ============================================================================
// STYLE HELPERS
// ============================================================================

const variantStyles: Record<CardVariant, string> = {
    default: clsx(
        "bg-gray-100 dark:bg-neutral-900",
        "ring-1 ring-primary/10",
        "hover:ring-primary/20 hover:shadow-xs hover:shadow-black/20",
        "dark:hover:shadow-xl dark:hover:shadow-black/50"
    ),
    elevated: clsx(
        "bg-white dark:bg-neutral-900",
        "shadow-lg dark:shadow-2xl",
        "ring-1 ring-gray-200 dark:ring-neutral-700",
        "hover:shadow-xl hover:-translate-y-1"
    ),
    outlined: clsx(
        "bg-transparent",
        "border border-gray-200 dark:border-neutral-700",
        "hover:border-gray-300 dark:hover:border-neutral-600"
    ),
    ghost: clsx("bg-transparent", "hover:bg-gray-100 dark:hover:bg-neutral-800"),
};

const sizeStyles: Record<CardSize, { root: string; padding: string; insetPadding: string }> = {
    sm: { root: "rounded-xl", padding: "p-3", insetPadding: "p-2" },
    md: { root: "rounded-2xl", padding: "p-4", insetPadding: "p-3" },
    lg: { root: "rounded-3xl", padding: "p-6", insetPadding: "p-4" },
};

const badgePositionStyles: Record<NonNullable<CardBadgeProps["position"]>, string> = {
    "top-left": "top-0 left-0",
    "top-right": "top-2 right-2",
    "top-center": "top-0 left-1/2 -translate-x-1/2",
    "bottom-left": "bottom-2 left-2",
    "bottom-right": "bottom-2 right-2",
    "bottom-center": "bottom-2 left-1/2 -translate-x-1/2",
};

// ============================================================================
// COMPONENTS
// ============================================================================

/**
 * Card.Root - The main container component
 * Can be static, a link, or a button
 */
const CardRoot = forwardRef<HTMLDivElement, CardRootProps>(
    (
        {
            children,
            className,
            style,
            variant = "default",
            size = "md",
            layout = "stack",
            href,
            onPress,
            layoutId,
            motionProps,
            isDisabled = false,
        },
        ref
    ) => {
        const isInteractive = Boolean(href || onPress);

        const contextValue: CardContextValue = {
            variant,
            size,
            layout,
            isInteractive,
            isDisabled,
            layoutId,
        };

        const baseStyles = clsx(
            "group relative flex flex-col overflow-hidden transition-all duration-300",
            sizeStyles[size].root,
            variantStyles[variant],
            // For inset layout, add padding to root
            layout === "inset" && sizeStyles[size].insetPadding,
            isInteractive && !isDisabled && "cursor-pointer hover:-translate-y-1",
            isDisabled && "opacity-60 cursor-not-allowed",
            className
        );

        // Wrapper component - either motion.div or regular div
        const MotionWrapper = layoutId || motionProps ? motion.div : "div";
        const wrapperProps = layoutId || motionProps ? { layoutId, ...motionProps } : {};

        const content = (
            <CardContext.Provider value={contextValue}>
                {children}
            </CardContext.Provider>
        );

        // Link variant
        if (href && !isDisabled) {
            return (
                <MotionWrapper {...wrapperProps}>
                    <Link
                        ref={ref as any}
                        href={href}
                        className={baseStyles}
                        style={style}
                    >
                        {content}
                    </Link>
                </MotionWrapper>
            );
        }

        // Button variant
        if (onPress) {
            return (
                <MotionWrapper {...wrapperProps}>
                    <Button
                        ref={ref as any}
                        onPress={onPress}
                        isDisabled={isDisabled}
                        className={baseStyles}
                        style={style}
                    >
                        {content}
                    </Button>
                </MotionWrapper>
            );
        }

        // Static variant
        if (layoutId || motionProps) {
            return (
                <motion.div
                    ref={ref}
                    layoutId={layoutId}
                    className={baseStyles}
                    style={style}
                    {...motionProps}
                >
                    {content}
                </motion.div>
            );
        }

        return (
            <div ref={ref} className={baseStyles} style={style}>
                {content}
            </div>
        );
    }
);
CardRoot.displayName = "Card.Root";

/**
 * Card.Visual - The visual/header zone (gradient, image, solid bg, etc.)
 */
const CardVisual = forwardRef<HTMLDivElement, CardVisualProps>(
    ({ children, className, style, gradient, backgroundImage, backgroundColor, height = 140, isLocked = false, layoutId }, ref) => {
        const { layout } = useCardContext();
        
        const computedStyle: CSSProperties = {
            height: typeof height === "number" ? `${height}px` : height,
            ...(gradient && { background: gradient }),
            ...(backgroundImage && {
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }),
            ...style,
        };

        const content = (
            <div
                ref={ref}
                className={clsx(
                    "relative w-full overflow-hidden transition-all duration-300",
                    // Rounded corners: always rounded-2xl for visual zone
                    "rounded-2xl",
                    // Background color for inset mode (solid bg like ActiveCarCard)
                    backgroundColor,
                    // Only add default bg if no gradient/image/backgroundColor specified
                    !gradient && !backgroundImage && !backgroundColor && "bg-white dark:bg-neutral-800",
                    isLocked && "grayscale-[30%]",
                    className
                )}
                style={computedStyle}
            >
                {/* Decorative overlay for depth - only if using gradient */}
                {gradient && (
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(0,0,0,0.15),transparent)]" />
                )}
                {children}
            </div>
        );

        if (layoutId) {
            return (
                <motion.div layoutId={layoutId} className="w-full">
                    {content}
                </motion.div>
            );
        }

        return content;
    }
);
CardVisual.displayName = "Card.Visual";

/**
 * Card.Badge - Positioned badge overlay
 */
const CardBadge = forwardRef<HTMLDivElement, CardBadgeProps>(
    ({ children, className, position = "top-left" }, ref) => {
        const positionStyle = badgePositionStyles[position];

        // Special case for top-center (like rarity badges)
        if (position === "top-center") {
            return (
                <div
                    ref={ref}
                    className={clsx("absolute z-20", positionStyle, className)}
                >
                    {children}
                </div>
            );
        }

        return (
            <div ref={ref} className={clsx("absolute z-20", positionStyle, className)}>
                {children}
            </div>
        );
    }
);
CardBadge.displayName = "Card.Badge";

/**
 * Card.Overlay - Full overlay (for locked states, etc.)
 */
const CardOverlay = forwardRef<HTMLDivElement, CardOverlayProps>(
    ({ children, className, blur = false }, ref) => {
        return (
            <div
                ref={ref}
                className={clsx(
                    "absolute inset-0 z-30 flex items-center justify-center",
                    blur && "backdrop-blur-sm",
                    className
                )}
            >
                {children}
            </div>
        );
    }
);
CardOverlay.displayName = "Card.Overlay";

/**
 * Card.Content - The main content area
 */
const CardContent = forwardRef<HTMLDivElement, CardContentProps>(({ children, className }, ref) => {
    const { size } = useCardContext();
    return (
        <div ref={ref} className={clsx("flex flex-col gap-2", sizeStyles[size].padding, className)}>
            {children}
        </div>
    );
});
CardContent.displayName = "Card.Content";

/**
 * Card.Title - The title text
 */
const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(({ children, className, layoutId }, ref) => {
    const { size, isDisabled } = useCardContext();

    const sizeClass = {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
    }[size];

    const content = (
        <h3
            ref={ref}
            className={clsx(
                "font-bold tracking-tight",
                sizeClass,
                isDisabled ? "text-neutral-400 dark:text-neutral-500" : "text-neutral-900 dark:text-white",
                className
            )}
        >
            {children}
        </h3>
    );

    if (layoutId) {
        return <motion.div layoutId={layoutId}>{content}</motion.div>;
    }

    return content;
});
CardTitle.displayName = "Card.Title";

/**
 * Card.Description - Secondary text
 */
const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(({ children, className }, ref) => {
    return (
        <p ref={ref} className={clsx("text-sm text-neutral-500 dark:text-neutral-400", className)}>
            {children}
        </p>
    );
});
CardDescription.displayName = "Card.Description";

/**
 * Card.Footer - Footer area with actions
 */
const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(({ children, className }, ref) => {
    return (
        <div ref={ref} className={clsx("mt-auto flex items-center justify-between pt-2", className)}>
            {children}
        </div>
    );
});
CardFooter.displayName = "Card.Footer";

// ============================================================================
// PRESET GRADIENTS (from existing components)
// ============================================================================

export const GRADIENT_PRESETS = {
    // Rarity gradients (from f1-card)
    common: `
        radial-gradient(ellipse at 30% 20%, #94a3b8 0%, transparent 40%),
        radial-gradient(ellipse at 70% 80%, #334155 0%, transparent 50%),
        linear-gradient(150deg, #64748b 0%, #475569 40%, #334155 80%, #1e293b 100%)
    `,
    rare: `
        radial-gradient(ellipse at 70% 20%, #60a5fa 0%, transparent 40%),
        radial-gradient(ellipse at 20% 80%, #1e3a8a 0%, transparent 50%),
        linear-gradient(150deg, #3b82f6 0%, #2563eb 35%, #1d4ed8 65%, #1e40af 100%)
    `,
    epic: `
        radial-gradient(ellipse at 25% 25%, #c084fc 0%, transparent 40%),
        radial-gradient(ellipse at 75% 75%, #3b0764 0%, transparent 50%),
        linear-gradient(160deg, #a855f7 0%, #9333ea 35%, #7c3aed 70%, #6d28d9 100%)
    `,
    legendary: `
        radial-gradient(ellipse at 30% 10%, #fcd34d 0%, transparent 40%),
        radial-gradient(ellipse at 70% 90%, #92400e 0%, transparent 50%),
        linear-gradient(150deg, #fbbf24 0%, #f59e0b 35%, #d97706 65%, #b45309 100%)
    `,
    // Salon gradients (from my-lobbies)
    jade: `
        radial-gradient(ellipse at 20% 0%, #86efac 0%, transparent 50%),
        radial-gradient(ellipse at 80% 100%, #065f46 0%, transparent 50%),
        linear-gradient(160deg, #4ade80 0%, #16a34a 40%, #166534 100%)
    `,
    arctic: `
        radial-gradient(ellipse at 30% 20%, #22d3ee 0%, transparent 45%),
        radial-gradient(ellipse at 70% 80%, #0c4a6e 0%, transparent 50%),
        linear-gradient(165deg, #06b6d4 0%, #0e7490 35%, #164e63 65%, #0f172a 100%)
    `,
    aurora: `
        radial-gradient(ellipse at 70% 20%, #f472b6 0%, transparent 40%),
        radial-gradient(ellipse at 20% 80%, #1e3a8a 0%, transparent 50%),
        linear-gradient(150deg, #1e3a5f 0%, #4c1d95 40%, #be185d 80%, #f472b6 100%)
    `,
    ember: `
        radial-gradient(ellipse at 30% 10%, #fcd34d 0%, transparent 40%),
        radial-gradient(ellipse at 70% 90%, #7c2d12 0%, transparent 50%),
        linear-gradient(150deg, #fbbf24 0%, #f97316 35%, #ea580c 65%, #9a3412 100%)
    `,
    ocean: `
        radial-gradient(ellipse at 25% 15%, #5eead4 0%, transparent 45%),
        radial-gradient(ellipse at 75% 85%, #134e4a 0%, transparent 50%),
        linear-gradient(155deg, #2dd4bf 0%, #14b8a6 35%, #0f766e 70%, #115e59 100%)
    `,
    midnight: `
        radial-gradient(ellipse at 25% 25%, #a78bfa 0%, transparent 40%),
        radial-gradient(ellipse at 75% 75%, #1e1b4b 0%, transparent 50%),
        linear-gradient(160deg, #8b5cf6 0%, #6d28d9 35%, #4c1d95 70%, #2e1065 100%)
    `,
    // Lootbox gradients
    bronze: `
        radial-gradient(ellipse at 30% 20%, #fdba74 0%, transparent 40%),
        radial-gradient(ellipse at 70% 80%, #7c2d12 0%, transparent 50%),
        linear-gradient(150deg, #fb923c 0%, #ea580c 40%, #c2410c 70%, #9a3412 100%)
    `,
    silver: `
        radial-gradient(ellipse at 30% 20%, #cbd5e1 0%, transparent 40%),
        radial-gradient(ellipse at 70% 80%, #1e293b 0%, transparent 50%),
        linear-gradient(150deg, #94a3b8 0%, #64748b 40%, #475569 70%, #334155 100%)
    `,
    gold: `
        radial-gradient(ellipse at 30% 10%, #fde047 0%, transparent 40%),
        radial-gradient(ellipse at 70% 90%, #92400e 0%, transparent 50%),
        linear-gradient(150deg, #facc15 0%, #eab308 35%, #ca8a04 65%, #a16207 100%)
    `,
} as const;

export type GradientPreset = keyof typeof GRADIENT_PRESETS;

// ============================================================================
// RARITY CONFIG (badge colors)
// ============================================================================

export const RARITY_CONFIG = {
    common: {
        badgeBg: "bg-slate-500",
        label: "Common",
        glow: "",
    },
    rare: {
        badgeBg: "bg-blue-600",
        label: "Rare",
        glow: "shadow-[0_0_30px_rgba(59,130,246,0.3)]",
    },
    epic: {
        badgeBg: "bg-purple-600",
        label: "Epic",
        glow: "shadow-[0_0_30px_rgba(147,51,234,0.4)]",
    },
    legendary: {
        badgeBg: "bg-amber-600",
        label: "Legendary",
        glow: "shadow-[0_0_40px_rgba(245,158,11,0.5)]",
    },
} as const;

export type Rarity = keyof typeof RARITY_CONFIG;

// ============================================================================
// COMPOUND EXPORT
// ============================================================================

export const Card = {
    Root: CardRoot,
    Visual: CardVisual,
    Badge: CardBadge,
    Overlay: CardOverlay,
    Content: CardContent,
    Title: CardTitle,
    Description: CardDescription,
    Footer: CardFooter,
};

export type {
    CardRootProps,
    CardVisualProps,
    CardBadgeProps,
    CardOverlayProps,
    CardContentProps,
    CardTitleProps,
    CardDescriptionProps,
    CardFooterProps,
    CardVariant,
    CardSize,
};