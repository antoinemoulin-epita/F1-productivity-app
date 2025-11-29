"use client";

import { ArrowLeft, Mail01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { PinInput } from "@/components/base/pin-input/pin-input";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { BackgroundPattern } from "@/components/foundations/background-patterns";

interface Step2EnterCodeManuallyProps {
    onVerifyEmail: () => void;
    onBackToLogin: () => void;
}

export const Step2EnterCodeManually = ({ onVerifyEmail, onBackToLogin }: Step2EnterCodeManuallyProps) => {
    return (
        <section className="min-h-screen overflow-hidden bg-primary px-4 py-12 md:px-8 md:pt-24">
            <div className="mx-auto flex w-full max-w-90 flex-col gap-8">
                <div className="flex flex-col items-center gap-6 text-center">
                    <div className="relative">
                        <FeaturedIcon color="gray" theme="modern" size="xl" className="relative z-10">
                            <Mail01 className="size-7" />
                        </FeaturedIcon>
                        <BackgroundPattern pattern="grid" size="lg" className="absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:block" />
                        <BackgroundPattern pattern="grid" size="md" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:hidden" />
                    </div>

                    <div className="z-10 flex flex-col gap-2 md:gap-3">
                        <h1 className="text-display-xs font-semibold text-primary md:text-display-sm">Vérifiez votre email</h1>
                        <p className="text-md text-tertiary">
                            Nous avons envoyé un lien de vérification à <span className="font-medium">satoshi@gmail.com</span>
                        </p>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-6 md:gap-8">
                    <div className="md:hidden">
                        <PinInput size="sm">
                            <PinInput.Group maxLength={4}>
                                <PinInput.Slot index={0} />
                                <PinInput.Slot index={1} />
                                <PinInput.Slot index={2} />
                                <PinInput.Slot index={3} />
                            </PinInput.Group>
                        </PinInput>
                    </div>
                    <div className="max-md:hidden">
                        <PinInput size="md">
                            <PinInput.Group maxLength={4}>
                                <PinInput.Slot index={0} />
                                <PinInput.Slot index={1} />
                                <PinInput.Slot index={2} />
                                <PinInput.Slot index={3} />
                            </PinInput.Group>
                        </PinInput>
                    </div>

                    <div className="w-full">
                        <Button type="button" size="lg" className="w-full" onClick={onVerifyEmail}>
                            Vérifier l'email
                        </Button>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-8 text-center">
                    <p className="flex gap-1">
                        <span className="text-sm text-tertiary">Vous n'avez pas reçu l'email ?</span>
                        <Button color="link-color" size="md" href="#">
                            Cliquez pour renvoyer
                        </Button>
                    </p>
                    <Button color="link-gray" size="md" onClick={onBackToLogin} className="mx-auto" iconLeading={ArrowLeft}>
                        Retour à la connexion
                    </Button>
                </div>
            </div>
        </section>
    );
};
