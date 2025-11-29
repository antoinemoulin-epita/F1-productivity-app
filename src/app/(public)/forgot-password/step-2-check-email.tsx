"use client";

import { ArrowLeft, Mail01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { BackgroundPattern } from "@/components/foundations/background-patterns";

interface Step2CheckEmailProps {
    email: string;
    onContinue: () => void;
    onBackToLogin: () => void;
}

export const Step2CheckEmail = ({ email, onContinue, onBackToLogin }: Step2CheckEmailProps) => {
    return (
        <section className="min-h-screen overflow-hidden bg-primary px-4 py-12 md:gap-24 md:px-8 md:pt-24">
            <div className="mx-auto flex w-full max-w-90 flex-col gap-8">
                <div className="flex flex-col items-center gap-6 text-center">
                    <div className="relative">
                        <FeaturedIcon color="gray" className="z-10" theme="modern" size="xl">
                            <Mail01 className="size-7" />
                        </FeaturedIcon>
                        <BackgroundPattern size="lg" pattern="grid" className="absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:block" />
                        <BackgroundPattern size="md" pattern="grid" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:hidden" />
                    </div>
                    <div className="z-10 flex flex-col gap-2 md:gap-3">
                        <h1 className="text-display-xs font-semibold text-primary md:text-display-sm">Vérifiez votre email</h1>
                        <p className="text-md text-tertiary">
                            Nous avons envoyé un lien de réinitialisation du mot de passe à<span className="text-md font-medium"> {email}</span>
                        </p>
                    </div>
                </div>

                <div>
                    <Button type="button" size="lg" className="w-full" onClick={onContinue}>
                        Ouvrir l&apos;application e-mail
                    </Button>
                </div>

                <div className="flex flex-col items-center gap-8 text-center">
                    <p className="flex gap-1">
                        <span className="text-sm text-tertiary">Vous n&apos;avez pas reçu l&apos;email ?</span>
                        <Button color="link-color" size="md" href="#">
                            Cliquez pour renvoyer
                        </Button>
                    </p>
                    <Button size="md" color="link-gray" onClick={onBackToLogin} className="mx-auto" iconLeading={ArrowLeft}>
                        Retour à la connexion
                    </Button>
                </div>
            </div>
        </section>
    );
};
