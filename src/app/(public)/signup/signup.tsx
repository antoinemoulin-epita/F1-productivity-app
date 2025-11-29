"use client";

import { ChevronLeft, ChevronRight, Mail01 } from "@untitledui/icons";
import { Carousel } from "@/components/application/carousel/carousel-base";
import { CarouselIndicator } from "@/components/application/carousel/carousel.demo";
import { Button } from "@/components/base/buttons/button";
import { SocialButton } from "@/components/base/buttons/social-button";
import { Form } from "@/components/base/form/form";
import { Input } from "@/components/base/input/input";
import Logo from "@/components/foundations/logo/logo";
import { StatsCardMockupCarousel } from "@/app/signup/stats-card-mockup-carousel";

export const Signup = () => {
    return (
        <section className="grid min-h-screen grid-cols-1 bg-primary lg:grid-cols-2">
            <div className="flex flex-col bg-primary">
                <header className="hidden p-8 md:block">
                    <Logo />
                </header>
                <div className="flex flex-1 justify-center px-4 py-12 md:items-center md:px-8 md:py-0">
                    <div className="flex w-full flex-col gap-8 sm:max-w-90">
                        <div className="flex flex-col gap-6">
                            <Logo className="size-10 lg:hidden" />

                            <div className="flex flex-col gap-2 md:gap-3">
                                <h1 className="text-display-xs font-semibold text-primary md:text-display-md">Créer un compte</h1>
                                <p className="text-md text-tertiary">Rejoignez [GAMENAME] et commencez à jouer</p>
                            </div>
                        </div>

                        <Form
                            onSubmit={(e) => {
                                e.preventDefault();
                                const data = Object.fromEntries(new FormData(e.currentTarget));
                                console.log("Form data:", data);
                            }}
                            className="flex flex-col gap-6"
                        >
                            <div className="flex flex-col gap-5">
                                <Input isRequired hideRequiredIndicator label="Nom d'utilisateur" name="username" placeholder="Votre pseudo unique" size="md" />
                                <Input isRequired hideRequiredIndicator label="Email" type="email" name="email" placeholder="votre@email.com" size="md" />
                                <Input
                                    isRequired
                                    hideRequiredIndicator
                                    label="Mot de passe"
                                    type="password"
                                    name="password"
                                    size="md"
                                    placeholder="Créez un mot de passe sécurisé"
                                    hint="Minimum 8 caractères"
                                    minLength={8}
                                />
                                <Input
                                    isRequired
                                    hideRequiredIndicator
                                    label="Confirmer le mot de passe"
                                    type="password"
                                    name="password_confirm"
                                    size="md"
                                    placeholder="Confirmez votre mot de passe"
                                />
                            </div>

                            <div className="flex flex-col gap-4">
                                <Button type="submit" size="lg">
                                    S'inscrire
                                </Button>
                                <SocialButton social="google" theme="color">
                                    S'inscrire avec Google
                                </SocialButton>
                            </div>
                        </Form>

                        <div className="flex justify-center gap-1 text-center">
                            <span className="text-sm text-tertiary">Vous avez déjà un compte?</span>
                            <Button href="/login" color="link-color" size="md">
                                Se connecter
                            </Button>
                        </div>
                    </div>
                </div>

                <footer className="hidden justify-between p-8 pt-11 lg:flex">
                    <p className="text-sm text-tertiary">© [GAMENAME] 2025</p>

                    <a href="mailto:support@[yourapp.com]" className="flex items-center gap-2 text-sm text-tertiary">
                        <Mail01 className="size-4 text-fg-quaternary" />
                        support@[yourapp.com]
                    </a>
                </footer>
            </div>

            <div className="hidden h-full bg-primary py-4 pr-4 lg:block">
                <Carousel.Root className="relative h-full w-full items-center justify-center overflow-hidden rounded-[20px] bg-brand-section lg:flex">
                    <div className="flex w-full flex-col items-center gap-8">
                        <Carousel.Content overflowHidden={false}>
                            {[
                                {
                                    imageIndex: 1,
                                    title: "Salons Permanents",
                                    description: "Créez des ligues avec vos amis et accumulez des points semaine après semaine",
                                },
                                {
                                    imageIndex: 2,
                                    title: "Courses Hebdomadaires",
                                    description: "Des tâches communes, une piste virtuelle, des voitures qui avancent en temps réel",
                                },
                                {
                                    imageIndex: 3,
                                    title: "Classements Dynamiques",
                                    description: "Journalier, hebdomadaire, salon global - voyez qui domine à tout moment",
                                },
                                {
                                    imageIndex: 4,
                                    title: "Mode Solo ou Équipe",
                                    description: "Jouez seul ou en équipe de 2, avec classements constructeur séparé",
                                },
                            ].map((feature, i) => (
                                <Carousel.Item key={i} className="flex flex-col items-center gap-20">
                                    <StatsCardMockupCarousel imageIndex={feature.imageIndex} className="transition lg:scale-75 xl:scale-100" />
                                    <div className="flex max-w-114 flex-col gap-2 text-center">
                                        <p className="text-display-xs font-semibold text-primary_on-brand">{feature.title}</p>
                                        <p className="text-md font-medium text-tertiary_on-brand">{feature.description}</p>
                                    </div>
                                </Carousel.Item>
                            ))}
                        </Carousel.Content>
                        <div className="flex items-center justify-center gap-16">
                            <Carousel.PrevTrigger className="cursor-pointer rounded-full p-2 outline-focus-ring transition duration-100 ease-linear focus-visible:outline-2 focus-visible:outline-offset-2">
                                <ChevronLeft className="size-5 text-fg-white" />
                            </Carousel.PrevTrigger>

                            <CarouselIndicator size="lg" />

                            <Carousel.NextTrigger className="cursor-pointer rounded-full p-2 outline-focus-ring transition duration-100 ease-linear focus-visible:outline-2 focus-visible:outline-offset-2">
                                <ChevronRight className="size-5 text-fg-white" />
                            </Carousel.NextTrigger>
                        </div>
                    </div>
                </Carousel.Root>
            </div>
        </section>
    );
};
