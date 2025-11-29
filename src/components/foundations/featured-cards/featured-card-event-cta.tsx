import type { ReactNode } from "react";
import { Avatar } from "@/components/base/avatar/avatar";
import { AvatarAddButton } from "@/components/base/avatar/base-components";
import { BadgeWithDot } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { CloseButton } from "@/components/base/buttons/close-button";

interface FeaturedCardCommonProps {
    title: string;
    description: ReactNode;
    confirmLabel: string;
    className?: string;
    onDismiss: () => void;
    onConfirm: () => void;
}

export const FeaturedCardEventCTA = ({ title, badge, description, confirmLabel, onConfirm, onDismiss }: FeaturedCardCommonProps & { badge?: string }) => {
    return (
        <div className="relative flex flex-col gap-4 rounded-xl bg-primary p-4 ring-1 ring-secondary ring-inset">
            <div className="absolute top-2 right-2">
                <CloseButton size="sm" onClick={onDismiss} />
            </div>

            <div className="flex gap-2">
                <div className="flex -space-x-1">
                    <Avatar
                        className="ring-[1.5px] ring-bg-primary"
                        size="xs"
                        src="https://www.untitledui.com/images/avatars/olivia-rhye?fm=webp&q=80"
                        alt="Olivia Rhye"
                    />
                    <Avatar
                        className="ring-[1.5px] ring-bg-primary"
                        size="xs"
                        src="https://www.untitledui.com/images/avatars/phoenix-baker?fm=webp&q=80"
                        alt="Phoenix Baker"
                    />
                    <Avatar
                        className="ring-[1.5px] ring-bg-primary"
                        size="xs"
                        src="https://www.untitledui.com/images/avatars/lana-steiner?fm=webp&q=80"
                        alt="Lana Steiner"
                    />
                    <Avatar
                        className="ring-[1.5px] ring-bg-primary"
                        size="xs"
                        src="https://www.untitledui.com/images/avatars/demi-wilkinson?fm=webp&q=80"
                        alt="Demi Wilkinson"
                    />

                    <Avatar
                        size="xs"
                        className="ring-[1.5px] ring-bg-primary"
                        placeholder={<span className="flex items-center justify-center text-xs font-semibold text-quaternary">+5</span>}
                    />
                </div>
                <AvatarAddButton size="xs" className="pointer-events-none" />
            </div>

            <div className="flex flex-col gap-1">
                <p className="flex items-center gap-1.5 text-sm font-semibold text-primary">
                    {title}
                    {badge && (
                        <BadgeWithDot color="success" type="modern" size="sm">
                            {badge}
                        </BadgeWithDot>
                    )}
                </p>
                <p className="text-sm text-tertiary">{description}</p>
            </div>

            <div className="flex items-center gap-3">
                <Button color="link-gray" size="sm" onClick={onDismiss}>
                    Dismiss
                </Button>
                <Button color="link-color" size="sm" onClick={onConfirm}>
                    {confirmLabel}
                </Button>
            </div>
        </div>
    );
};
