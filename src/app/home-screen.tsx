"use client";

import { DeveloperIndex } from "@/app/developer-index";

const pages = [
    // Public
    {
        name: "Landing",
        description: "Page d'accueil avec présentation et appel à l'action",
        path: "/landing",
        category: "Public",
    },
    // Authentification
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
        path: "/email-verification",
        category: "Authentification",
    },
    {
        name: "Forgot Password",
        description: "Réinitialisation du mot de passe en 4 étapes",
        path: "/forgot-password",
        category: "Authentification",
    },
    // Dashboard
    {
        name: "Overview",
        description: "Vue d'ensemble du tableau de bord",
        path: "/overview",
        category: "Dashboard",
    },
    {
        name: "Lobbies",
        description: "Gestion des salons de jeu",
        path: "/lobbies",
        category: "Dashboard",
    },
    {
        name: "Store",
        description: "Magasin de lootboxes et voitures",
        path: "/store",
        category: "Dashboard",
    },
    {
        name: "Settings",
        description: "Paramètres utilisateur et notifications",
        path: "/settings",
        category: "Dashboard",
    },
    // Tests
    {
        name: "Test 01",
        description: "Page de test composants #1",
        path: "/test01",
        category: "Tests",
    },
    {
        name: "Test 02",
        description: "Page de test composants #2",
        path: "/test02",
        category: "Tests",
    },
    {
        name: "Test 03",
        description: "Page de test composants #3",
        path: "/test03",
        category: "Tests",
    },
    // Erreurs
    {
        name: "404 Not Found",
        description: "Page d'erreur 404 personnalisée",
        path: "/404",
        category: "Erreurs",
    },
];

const categories = ["Public", "Authentification", "Dashboard", "Tests", "Erreurs"];

export const HomeScreen = () => {
    return <DeveloperIndex pages={pages} categories={categories} />;
};
