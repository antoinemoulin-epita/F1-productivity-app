"use client";

import { ArrowLeft, Key01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Form } from "@/components/base/form/form";
import { Input } from "@/components/base/input/input";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { BackgroundPattern } from "@/components/foundations/background-patterns";

interface Step1ForgotPasswordProps {
    onResetPassword: (email: string) => void;
    onBackToLogin: () => void;
}

export const Step1ForgotPassword = ({ onResetPassword, onBackToLogin }: Step1ForgotPasswordProps) => {
    return (
        <section className="min-h-screen overflow-hidden bg-primary px-4 py-12 md:px-8 md:pt-24">
            <div className="mx-auto flex w-full max-w-90 flex-col gap-8">
                <div className="flex flex-col items-center gap-6 text-center">
                    <div className="relative">
                        <FeaturedIcon color="gray" theme="modern" size="xl" className="z-10">
                            <Key01 className="size-7" />
                        </FeaturedIcon>
                        <BackgroundPattern size="lg" pattern="grid" className="absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:block" />
                        <BackgroundPattern size="md" pattern="grid" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:hidden" />
                    </div>

                    <div className="z-10 flex flex-col gap-2 md:gap-3">
                        <h1 className="text-display-xs font-semibold text-primary md:text-display-sm">Mot de passe oublié ?</h1>
                        <p className="self-stretch text-md text-tertiary">Pas de problème, nous vous enverrons les instructions de réinitialisation.</p>
                    </div>
                </div>

                <Form
                    onSubmit={(e) => {
                        e.preventDefault();
                        const data = Object.fromEntries(new FormData(e.currentTarget));
                        onResetPassword(data.email as string);
                    }}
                    className="z-10 flex flex-col gap-6"
                >
                    <Input isRequired hideRequiredIndicator label="Email" type="email" name="email" placeholder="Entrez votre email" size="md" />

                    <div className="flex flex-col gap-4">
                        <Button type="submit" size="lg">
                            Réinitialiser le mot de passe
                        </Button>
                    </div>
                </Form>

                <div className="z-10 flex justify-center gap-1 text-center">
                    <Button size="md" color="link-gray" onClick={onBackToLogin} className="mx-auto" iconLeading={ArrowLeft}>
                        Retour à la connexion
                    </Button>
                </div>
            </div>
        </section>
    );
};
