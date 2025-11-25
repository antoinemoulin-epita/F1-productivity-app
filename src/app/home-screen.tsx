"use client";

import { BookOpen01, Check, Copy01, Cube01, HelpCircle } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { ButtonUtility } from "@/components/base/buttons/button-utility";
import { UntitledLogoMinimal } from "@/components/foundations/logo/untitledui-logo-minimal";
import { useClipboard } from "@/hooks/use-clipboard";

export const HomeScreen = () => {
    const clipboard = useClipboard();

    return (
        <div className="flex h-dvh flex-col">
            <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-4 md:px-8">
                <div className="relative flex size-28 items-center justify-center">
                    <h1>LOGO</h1>
                </div>

                <h1 className="max-w-3xl text-center text-display-sm font-semibold text-primary">Developer page</h1>

                <p className="mt-2 max-w-xl text-center text-lg text-tertiary">You can access to all the pages from here</p>

                <div className="relative mt-6 flex h-10 items-center rounded-lg border border-secondary bg-secondary">
                    <code className="px-3 font-mono text-secondary">npx untitledui@latest add</code>

                    <hr className="h-10 w-px bg-border-secondary" />
                </div>

                <div className="mt-6 flex items-center gap-3">
                    <p>LOGOS</p>
                </div>
            </div>
        </div>
    );
};
