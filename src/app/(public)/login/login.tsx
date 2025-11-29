"use client";

import { Button } from "@/components/base/buttons/button";
import { SocialButton } from "@/components/base/buttons/social-button";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Form } from "@/components/base/form/form";
import { Input } from "@/components/base/input/input";
import Logo from "@/components/foundations/logo/logo";
import { BackgroundPattern } from "@/components/foundations/background-patterns";

export const Login = () => {
    return (
        <section className="min-h-screen overflow-hidden bg-secondary px-4 py-12 md:px-8 md:pt-24">
            <div className="mx-auto flex w-full flex-col gap-8 sm:max-w-110">
                <div className="flex flex-col items-center gap-6 text-center">
                    <div className="relative">
                        <BackgroundPattern pattern="grid" className="absolute top-1/2 left-1/2 z-0 hidden -translate-x-1/2 -translate-y-1/2 md:block" />
                        <BackgroundPattern pattern="grid" size="md" className="absolute top-1/2 left-1/2 z-0 -translate-x-1/2 -translate-y-1/2 md:hidden" />
                        <Logo className="relative z-10 size-10 md:hidden" />
                    </div>
                    <div className="z-10 flex flex-col gap-2 md:gap-3">
                        <h1 className="text-display-xs font-semibold text-primary md:text-display-sm">Se connecter à [GAMENAME]</h1>
                        <p className="text-md text-tertiary">Bienvenue! Entrez vos identifiants pour continuer.</p>
                    </div>
                </div>

                <div className="flex justify-center gap-1 text-center md:hidden">
                    <span className="text-sm text-tertiary">Pas encore de compte?</span>
                    <Button color="link-color" size="md" href="/signup">
                        S'inscrire
                    </Button>
                </div>

                <Form
                    onSubmit={(e) => {
                        e.preventDefault();
                        const data = Object.fromEntries(new FormData(e.currentTarget));
                        console.log("Form data:", data);
                    }}
                    className="z-10 -mx-4 flex flex-col gap-6 bg-primary px-4 py-8 sm:mx-0 sm:rounded-2xl sm:px-8 sm:shadow-sm"
                >
                    <div className="flex flex-col gap-5">
                        <Input isRequired hideRequiredIndicator label="Email" type="email" name="email" placeholder="votre@email.com" size="md" />
                        <Input isRequired hideRequiredIndicator label="Mot de passe" type="password" name="password" size="md" placeholder="••••••••" />
                    </div>

                    <div className="flex items-center">
                        <Checkbox label="Se souvenir de moi" name="remember" />

                        <Button color="link-color" size="md" href="/forgot-password" className="ml-auto">
                            Mot de passe oublié?
                        </Button>
                    </div>

                    <div className="flex flex-col gap-4">
                        <Button type="submit" size="lg">
                            Se connecter
                        </Button>
                        <SocialButton social="google" theme="color">
                            Se connecter avec Google
                        </SocialButton>
                    </div>
                </Form>

                <div className="hidden justify-center gap-1 text-center md:flex">
                    <span className="text-sm text-tertiary">Pas encore de compte?</span>
                    <Button color="link-color" size="md" href="/signup">
                        S'inscrire
                    </Button>
                </div>
            </div>
        </section>
    );
};
