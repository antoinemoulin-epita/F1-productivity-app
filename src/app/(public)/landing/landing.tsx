"use client";

import { Button } from "@/components/base/buttons/button";
import { Form } from "@/components/base/form/form";
import { Input } from "@/components/base/input/input";
import { Header } from "@/components/marketing/header-navigation/header";

export const Landing = () => {
    return (
        <div className="relative overflow-hidden bg-primary">
            {/* Background pattern */}
            <img
                alt="Grid of dots"
                aria-hidden="true"
                loading="lazy"
                src="https://www.untitledui.com/patterns/light/grid-sm-desktop.svg"
                className="pointer-events-none absolute top-0 left-1/2 z-0 hidden max-w-none -translate-x-1/2 md:block dark:brightness-[0.2]"
            />

            <img
                alt="Grid of dots"
                aria-hidden="true"
                loading="lazy"
                src="https://www.untitledui.com/patterns/light/grid-sm-mobile.svg"
                className="pointer-events-none absolute top-0 left-1/2 z-0 max-w-none -translate-x-1/2 md:hidden dark:brightness-[0.2]"
            />

            <Header />

            <section className="relative overflow-hidden pt-16 md:pb-24">
                <div className="mx-auto flex max-w-container flex-col gap-16 px-4 md:px-8 lg:flex-row lg:items-center lg:gap-8">
                    <div className="flex w-full max-w-3xl flex-1 flex-col">
                        {/* Badge */}
                        <div className="mb-4 flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700 dark:bg-brand-950/50 dark:text-brand-300">
                                <span className="size-1.5 animate-pulse rounded-full bg-brand-500" />
                                Bêta ouverte
                            </span>
                        </div>

                        <h1 className="text-display-md font-semibold text-primary md:text-display-lg lg:text-display-xl">
                            Complétez vos tâches.
                            <br />
                            <span className="text-brand-500">Gagnez la course.</span>
                        </h1>

                        <p className="mt-4 max-w-120 text-lg text-balance text-tertiary md:mt-6 md:text-xl">
                            Rejoignez vos amis dans des courses de productivité. Chaque tâche validée fait avancer votre voiture. 
                            Premier à la ligne d'arrivée, premier au classement.
                        </p>

                        {/* Join with code - Primary CTA */}
                        <Form
                            onSubmit={(e) => {
                                e.preventDefault();
                                const data = Object.fromEntries(new FormData(e.currentTarget));
                                console.log("Joining salon with code:", data.code);
                            }}
                            className="mt-8 flex w-full flex-col items-stretch gap-3 md:mt-10 md:max-w-md"
                        >
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                                <Input
                                    isRequired
                                    size="md"
                                    name="code"
                                    type="text"
                                    placeholder="Code salon (ex: ABC123)"
                                    wrapperClassName="md:py-0.5 flex-1"
                                    className="uppercase tracking-widest"
                                    maxLength={6}
                                />
                                <Button type="submit" size="xl" className="shrink-0">
                                    Rejoindre
                                </Button>
                            </div>
                            <p className="text-sm text-tertiary">
                                Rejoignez en 5 secondes, sans compte requis.
                            </p>
                        </Form>

                        {/* Secondary CTA */}
                        <div className="mt-6 flex items-center gap-4">
                            <span className="text-sm text-quaternary">ou</span>
                            <a
                                href="/signup"
                                className="group inline-flex items-center gap-1.5 text-sm font-medium text-secondary transition-colors hover:text-primary"
                            >
                                Créer un salon
                                <svg
                                    className="size-4 transition-transform group-hover:translate-x-0.5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </a>
                        </div>

                        {/* Social proof */}
                        <div className="mt-10 flex items-center gap-6 border-t border-secondary pt-6">
                            <div className="flex flex-col">
                                <span className="text-2xl font-bold text-primary">500+</span>
                                <span className="text-sm text-tertiary">Pilotes actifs</span>
                            </div>
                            <div className="h-8 w-px bg-secondary" />
                            <div className="flex flex-col">
                                <span className="text-2xl font-bold text-primary">2K+</span>
                                <span className="text-sm text-tertiary">Tâches validées</span>
                            </div>
                            <div className="h-8 w-px bg-secondary" />
                            <div className="flex flex-col">
                                <span className="text-2xl font-bold text-primary">50+</span>
                                <span className="text-sm text-tertiary">Salons créés</span>
                            </div>
                        </div>
                    </div>

                    <div className="relative flex h-90 w-full items-start justify-center lg:h-128 lg:flex-1 lg:items-center">
                        {/* Desktop mockup */}
                        <div className="absolute top-0 left-16 max-lg:hidden">
                            <div className="rounded-[9.03px] bg-primary p-[0.9px] shadow-lg ring-[0.56px] ring-utility-gray-300 ring-inset md:rounded-[26.91px] md:p-[3px] md:ring-[1.68px]">
                                <div className="rounded-[7.9px] bg-primary p-0.5 shadow-modern-mockup-inner-md md:rounded-[23.58px] md:p-1 md:shadow-modern-mockup-inner-lg">
                                    <div className="relative overflow-hidden rounded-[6.77px] bg-utility-gray-50 ring-[0.56px] ring-utility-gray-200 md:rounded-[20.21px] md:ring-[1.68px]">
                                        {/* Light mode image (hidden in dark mode) */}
                                        <img
                                            alt="Dashboard VROOM montrant une course en direct"
                                            src="/example02.png"
                                            className="max-w-5xl object-cover dark:hidden"
                                        />
                                        {/* Dark mode image (hidden in light mode) */}
                                        <img
                                            alt="Dashboard VROOM montrant une course en direct"
                                            src="/example02.png"
                                            className="max-w-5xl object-cover not-dark:hidden"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Mockup */}
                        <div className="top-26 left-0 lg:absolute">
                            <div className="max-w-70 rounded-[23.89px] bg-primary p-[3px] shadow-lg ring-[1.5px] ring-utility-gray-300 ring-inset">
                                <div className="size-full rounded-[20.91px] bg-primary p-1 shadow-modern-mockup-inner-md md:shadow-modern-mockup-inner-lg">
                                    <div className="relative size-full overflow-hidden rounded-[17.92px] bg-utility-gray-50 ring-[1.5px] ring-utility-gray-200">
                                        {/* Light mode image (hidden in dark mode) */}
                                        <img alt="Interface mobile VROOM" src="/img06-alt.png" className="size-full object-cover dark:hidden" />
                                        {/* Dark mode image (hidden in light mode) */}
                                        <img alt="Interface mobile VROOM" src="/img06-alt.png" className="size-full object-cover not-dark:hidden" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};