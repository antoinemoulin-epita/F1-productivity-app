"use client";

import { useState } from "react";
import { ArrowLeft, Lock01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Form } from "@/components/base/form/form";
import { Input } from "@/components/base/input/input";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { BackgroundPattern } from "@/components/foundations/background-patterns";
import { cx } from "@/utils/cx";

interface Step3SetNewPasswordProps {
    onResetSuccess: () => void;
    onBackToLogin: () => void;
}

export const Step3SetNewPassword = ({ onResetSuccess, onBackToLogin }: Step3SetNewPasswordProps) => {
    const [password, setPassword] = useState("");

    return (
        <section className="min-h-screen overflow-hidden bg-primary px-4 py-12 md:gap-24 md:px-8 md:pt-24">
            <div className="mx-auto flex w-full max-w-90 flex-col gap-8">
                <div className="flex flex-col items-center gap-6 text-center">
                    <div className="relative">
                        <FeaturedIcon color="gray" className="z-10" theme="modern" size="xl">
                            <Lock01 className="size-7" />
                        </FeaturedIcon>
                        <BackgroundPattern size="lg" pattern="grid" className="absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:block" />
                        <BackgroundPattern size="md" pattern="grid" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:hidden" />
                    </div>

                    <div className="z-10 flex flex-col gap-2 md:gap-3">
                        <h1 className="text-display-xs font-semibold text-primary md:text-display-sm">Définir un nouveau mot de passe</h1>
                        <p className="text-md text-tertiary">Votre nouveau mot de passe doit être différent des mots de passe précédemment utilisés.</p>
                    </div>
                </div>

                <Form
                    onSubmit={(e) => {
                        e.preventDefault();
                        const data = Object.fromEntries(new FormData(e.currentTarget));
                        console.log("Form data:", data);
                        onResetSuccess();
                    }}
                    className="z-10 flex flex-col gap-6"
                >
                    <div className="flex flex-col gap-5">
                        <Input
                            isRequired
                            hideRequiredIndicator
                            label="Mot de passe"
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            size="md"
                            onChange={setPassword}
                            minLength={8}
                            pattern='.*[!@#$%^&*(),.?\":{}|<>].*'
                        />
                        <Input
                            isRequired
                            hideRequiredIndicator
                            label="Confirmer le mot de passe"
                            type="password"
                            name="password_confirm"
                            placeholder="••••••••"
                            size="md"
                            validate={(value) => value === password || "Les mots de passe ne correspondent pas"}
                        />
                        <div className="flex flex-col gap-3">
                            <span className="flex gap-2">
                                <div
                                    className={cx(
                                        "flex size-5 items-center justify-center rounded-full bg-fg-disabled_subtle text-fg-white transition duration-150 ease-in-out",
                                        password.length >= 8 ? "bg-fg-success-primary" : "",
                                    )}
                                >
                                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                        <path
                                            d="M1.25 4L3.75 6.5L8.75 1.5"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                                <p className="text-sm text-tertiary">Doit contenir au moins 8 caractères</p>
                            </span>
                            <span className="flex gap-2">
                                <div
                                    className={cx(
                                        "flex size-5 items-center justify-center rounded-full bg-fg-disabled_subtle text-fg-white transition duration-150 ease-in-out",
                                        password.match(/[!@#$%^&*(),.?":{}|<>]/) ? "bg-fg-success-primary" : "",
                                    )}
                                >
                                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                        <path
                                            d="M1.25 4L3.75 6.5L8.75 1.5"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                                <p className="text-sm text-tertiary">Doit contenir un caractère spécial</p>
                            </span>
                        </div>
                    </div>

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
