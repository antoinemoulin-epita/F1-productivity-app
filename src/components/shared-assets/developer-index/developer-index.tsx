"use client";

import { ArrowRight } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Header } from "@/components/marketing/header-navigation/header";

const pages = [
    {
        name: "Landing",
        description: "Page d'accueil avec présentation et appel à l'action",
        path: "/landing",
        category: "Public",
    },
    {
        name: "Signup",
        description: "Formulaire d'inscription avec carousel de features",
        path: "/signup",
        category: "Authentification",
    },
    {
        name: "Login",
        description: "Page de connexion utilisateur",
        path: "/login",
        category: "Authentification",
    },
    {
        name: "Email Verification",
        description: "Vérification d'email en 3 étapes",
        path: "/verification",
        category: "Authentification",
    },
    {
        name: "Forgot Password",
        description: "Réinitialisation du mot de passe en 4 étapes",
        path: "/forgot-password",
        category: "Authentification",
    },
    {
        name: "404 Not Found",
        description: "Page d'erreur 404 personnalisée",
        path: "/404",
        category: "Erreurs",
    },
];

const categories = ["Public", "Authentification", "Erreurs"];

export const DeveloperIndex = () => {
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

            <section className="relative overflow-hidden py-16 md:py-24">
                <div className="mx-auto max-w-container px-4 md:px-8">
                    {/* Header section */}
                    <div className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
                        <span className="text-sm font-semibold text-brand-secondary md:text-md">Developer Hub</span>
                        <h1 className="mt-3 text-display-sm font-semibold text-primary md:text-display-md">Pages du site</h1>
                        <p className="mt-4 text-lg text-tertiary md:mt-5 md:text-xl">
                            Accédez à toutes les pages de l'application. Chaque page est complètement fonctionnelle et stylisée selon le design system.
                        </p>
                    </div>

                    {/* Pages grid by category */}
                    <div className="mt-12 md:mt-16">
                        {categories.map((category) => {
                            const categoryPages = pages.filter((page) => page.category === category);
                            return (
                                <div key={category} className="mb-12 md:mb-16">
                                    <h2 className="mb-6 text-lg font-semibold text-primary">{category}</h2>
                                    <div className="grid w-full gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                        {categoryPages.map((page) => (
                                            <a
                                                key={page.path}
                                                href={page.path}
                                                className="group flex flex-col justify-between rounded-xl border border-utility-gray-200 bg-secondary p-6 transition duration-200 ease-in-out hover:border-utility-gray-300 hover:shadow-md dark:border-utility-gray-800 dark:hover:border-utility-gray-700"
                                            >
                                                <div>
                                                    <h3 className="text-lg font-semibold text-primary">{page.name}</h3>
                                                    <p className="mt-2 text-sm text-tertiary">{page.description}</p>
                                                </div>
                                                <div className="mt-4 flex items-center text-brand-secondary transition duration-200 ease-in-out group-hover:text-brand-primary">
                                                    <span className="text-sm font-medium">Accéder</span>
                                                    <ArrowRight className="ml-2 size-4 transition duration-200 ease-in-out group-hover:translate-x-1" />
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Info section */}
                    <div className="mt-16 rounded-xl border border-utility-gray-200 bg-secondary p-8 md:p-12 dark:border-utility-gray-800">
                        <h3 className="text-lg font-semibold text-primary">À propos de ce hub</h3>
                        <p className="mt-3 text-tertiary">
                            Cette page de navigation centralisée facilite l'accès à toutes les pages de l'application pendant le développement. Chaque page est
                            entièrement fonctionnelle et utilise les composants du design system.
                        </p>
                        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                            <Button href="/landing" size="lg">
                                Retour à l&apos;accueil
                            </Button>
                            <Button href="/signup" color="secondary" size="lg">
                                Créer un compte
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
