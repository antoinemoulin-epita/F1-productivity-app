"use client";

import { ArrowLeft, CheckCircle } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { BackgroundPattern } from "@/components/shared-assets/background-patterns";

interface Step4SuccessProps {
    onContinue: () => void;
    onBackToLogin: () => void;
}

export const Step4Success = ({ onContinue, onBackToLogin }: Step4SuccessProps) => {
    return (
        <section className="min-h-screen overflow-hidden bg-primary px-4 py-12 md:px-8 md:pt-24">
            <div className="mx-auto flex w-full max-w-90 flex-col gap-8">
                <div className="flex flex-col items-center gap-6 text-center">
                    <div className="relative">
                        <FeaturedIcon color="gray" theme="modern" size="xl" className="relative z-10">
                            <CheckCircle className="size-7" />
                        </FeaturedIcon>
                        <BackgroundPattern pattern="grid" size="lg" className="absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:block" />
                        <BackgroundPattern pattern="grid" size="md" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:hidden" />
                    </div>

                    <div className="z-10 flex flex-col gap-2 md:gap-3">
                        <h1 className="text-display-xs font-semibold text-primary md:text-display-sm">Mot de passe réinitialisé</h1>
                        <p className="text-md text-tertiary">Votre mot de passe a été réinitialisé avec succès. Cliquez ci-dessous pour vous connecter.</p>
                    </div>
                </div>

                <Button type="button" size="lg" className="w-full" onClick={onContinue}>
                    Continuer
                </Button>

                <div className="flex flex-col items-center gap-8 text-center">
                    <Button color="link-gray" size="md" onClick={onBackToLogin} className="mx-auto" iconLeading={ArrowLeft}>
                        Retour à la connexion
                    </Button>
                </div>
            </div>
        </section>
    );
};
