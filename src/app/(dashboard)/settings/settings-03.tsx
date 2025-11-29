"use client";

import { useState } from "react";
import { Mail01, Key01, Trash01, AlertCircle, Check } from "@untitledui/icons";
import { Radio, RadioGroup } from "react-aria-components";
import { Dark, Light, System } from "@/components/application/modals/base-components/appearances";
import { SectionHeader } from "@/components/application/section-headers/section-headers";
import { SectionLabel } from "@/components/application/section-headers/section-label";
import { TabList, Tabs } from "@/components/application/tabs/tabs";
import { Avatar } from "@/components/base/avatar/avatar";
import { Button } from "@/components/base/buttons/button";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { FileTrigger } from "@/components/base/file-upload-trigger/file-upload-trigger";
import { Form } from "@/components/base/form/form";
import { InputBase, TextField } from "@/components/base/input/input";
import { Label } from "@/components/base/input/label";
import { RadioButtonBase } from "@/components/base/radio-buttons/radio-buttons";
import { Select } from "@/components/base/select/select";
import { NativeSelect } from "@/components/base/select/select-native";
import { Toggle } from "@/components/base/toggle/toggle";
import { cx } from "@/utils/cx";

const tabs = [
    { id: "profil", label: "Profil" },
    { id: "compte", label: "Compte" },
    { id: "notifications", label: "Notifications" },
    { id: "confidentialite", label: "Confidentialité" },
];

const themes = [
    {
        value: "system",
        label: "Système",
        component: System,
    },
    {
        value: "light",
        label: "Clair",
        component: Light,
    },
    {
        value: "dark",
        label: "Sombre",
        component: Dark,
    },
];

// Données mockées pour les voitures (basées sur le whitepaper - 19 voitures MVP)
const userCars = [
    { id: "rouge", name: "Rouge", rarity: "common", imageUrl: "/cars/rouge.png" },
    { id: "bleu", name: "Bleu", rarity: "common", imageUrl: "/cars/bleu.png" },
    { id: "vert", name: "Vert", rarity: "common", imageUrl: "/cars/vert.png" },
    { id: "scarlet", name: "Scarlet", rarity: "rare", imageUrl: "/cars/scarlet.png" },
    { id: "inferno", name: "Inferno", rarity: "epic", imageUrl: "/cars/inferno.png" },
];

const rarityLabels: Record<string, string> = {
    common: "Common",
    rare: "Rare",
    epic: "Epic",
    legendary: "Legendary",
};

const rarityColors: Record<string, string> = {
    common: "text-tertiary",
    rare: "text-blue-500",
    epic: "text-purple-500",
    legendary: "text-amber-500",
};

// Configuration des notifications (basée sur UserSettings du backend)
const notificationCategories = [
    {
        id: "course",
        title: "Course",
        description: "Notifications liées aux courses en cours",
        items: [
            {
                id: "notif_overtake",
                label: "Dépassements",
                description: "Quand quelqu'un te dépasse dans une course",
                defaultEnabled: true,
            },
            {
                id: "notif_first_place",
                label: "Changement de leader",
                description: "Quand la première place change de main",
                defaultEnabled: true,
            },
            {
                id: "notif_surge",
                label: "Surge Mode",
                description: "Quand le Surge Mode est sur le point de commencer ou actif",
                defaultEnabled: true,
            },
            {
                id: "notif_course_start",
                label: "Début de course",
                description: "Quand une course à laquelle tu participes commence",
                defaultEnabled: true,
            },
            {
                id: "notif_course_end",
                label: "Fin de course",
                description: "Rappel 2h avant la fin et résultats finaux",
                defaultEnabled: true,
            },
        ],
    },
    {
        id: "validation",
        title: "Validation",
        description: "Notifications liées aux preuves et votes",
        items: [
            {
                id: "notif_vote",
                label: "Preuves à voter",
                description: "Quand une preuve attend ton vote",
                defaultEnabled: true,
            },
        ],
    },
    {
        id: "engagement",
        title: "Engagement",
        description: "Rappels et récompenses",
        items: [
            {
                id: "notif_inactivity",
                label: "Rappels d'inactivité",
                description: "Après 3 jours sans connexion",
                defaultEnabled: true,
            },
            {
                id: "notif_daily_box",
                label: "Box journalière",
                description: "Rappel quand ta box est disponible",
                defaultEnabled: true,
            },
        ],
    },
];

export const Settings03 = () => {
    const [selectedTab, setSelectedTab] = useState<string>("profil");
    const [uploadedAvatar, setUploadedAvatar] = useState<string | null>("/pilote2.png");
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [notificationSettings, setNotificationSettings] = useState<Record<string, boolean>>(() => {
        const initial: Record<string, boolean> = {};
        notificationCategories.forEach((category) => {
            category.items.forEach((item) => {
                initial[item.id] = item.defaultEnabled;
            });
        });
        return initial;
    });

    const handleAvatarUpload = (files: FileList | null) => {
        const file = files?.[0];
        if (!file) return;
        setUploadedAvatar(URL.createObjectURL(file));
    };

    const handleNotificationToggle = (id: string, enabled: boolean) => {
        setNotificationSettings((prev) => ({ ...prev, [id]: enabled }));
    };

    const renderProfilTab = () => (
        <div className="flex flex-col gap-6">
            <SectionHeader.Root>
                <SectionHeader.Group>
                    <div className="flex flex-1 flex-col justify-center gap-0.5 self-stretch">
                        <SectionHeader.Heading>Profil pilote</SectionHeader.Heading>
                        <SectionHeader.Subheading>Personnalise ton profil visible par les autres pilotes.</SectionHeader.Subheading>
                    </div>
                </SectionHeader.Group>
            </SectionHeader.Root>

            <div className="flex flex-col gap-5">
                {/* Pseudo */}
                <div className="grid grid-cols-1 lg:grid-cols-[minmax(200px,280px)_minmax(400px,512px)] lg:gap-8">
                    <SectionLabel.Root isRequired size="sm" title="Pseudo" className="max-lg:hidden" />
                    <TextField name="pseudo" defaultValue="Antoine">
                        <Label className="lg:hidden">Pseudo</Label>
                        <InputBase size="md" placeholder="Ton pseudo de pilote" />
                    </TextField>
                </div>

                <hr className="h-px w-full border-none bg-border-secondary" />
 

               

                {/* Langue */}
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(200px,280px)_1fr] lg:gap-8">
                    <SectionLabel.Root size="sm" title="Langue" description="Langue d'affichage de l'application." />
                    <div className="w-max min-w-50">
                        <Select
                            name="langue"
                            aria-label="Langue"
                            size="sm"
                            defaultSelectedKey="fr"
                            items={[
                                { id: "fr", label: "Français", flag: "FR" },
                                { id: "en", label: "English", flag: "US" },
                            ]}
                        >
                            {(item) => (
                                <Select.Item id={item.id} icon={<img aria-hidden src={`https://www.untitledui.com/images/flags/${item.flag}.svg`} alt="" className="size-5" />}>
                                    {item.label}
                                </Select.Item>
                            )}
                        </Select>
                    </div>
                </div>

                <hr className="h-px w-full border-none bg-border-secondary" />

                {/* Thème */}
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(200px,280px)_1fr] lg:gap-8">
                    <SectionLabel.Root size="sm" title="Thème" description="Choisis entre le mode clair et sombre." />
                    <div className="-m-4 w-screen overflow-auto p-4 lg:w-[calc(100%+48px)]">
                        <RadioGroup aria-label="Thème" defaultValue="dark" name="theme" className="flex gap-5">
                            {themes.map((theme) => (
                                <Radio key={theme.value} value={theme.value} className="flex cursor-pointer flex-col gap-3">
                                    {({ isSelected, isFocusVisible }) => (
                                        <>
                                            <section
                                                className={cx(
                                                    "relative h-33 w-50 rounded-[10px] bg-utility-gray-100",
                                                    isSelected && "outline-2 outline-offset-2 outline-focus-ring",
                                                )}
                                            >
                                                <theme.component className="size-full" />
                                                {isSelected && (
                                                    <RadioButtonBase size="md" isSelected={isSelected} isFocusVisible={isFocusVisible} className="absolute bottom-2 left-2" />
                                                )}
                                            </section>
                                            <section className="w-full">
                                                <p className="text-sm font-semibold text-primary">{theme.label}</p>
                                            </section>
                                        </>
                                    )}
                                </Radio>
                            ))}
                        </RadioGroup>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderCompteTab = () => (
        <div className="flex flex-col gap-6">
            <SectionHeader.Root>
                <SectionHeader.Group>
                    <div className="flex flex-1 flex-col justify-center gap-0.5 self-stretch">
                        <SectionHeader.Heading>Compte</SectionHeader.Heading>
                        <SectionHeader.Subheading>Gère les informations de connexion et la sécurité de ton compte.</SectionHeader.Subheading>
                    </div>
                </SectionHeader.Group>
            </SectionHeader.Root>

            <div className="flex flex-col gap-5">
                {/* Email */}
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(200px,280px)_minmax(400px,512px)] lg:gap-8">
                    <SectionLabel.Root size="sm" title="Adresse email" description="Utilisée pour les notifications et la récupération de compte." />
                    <div className="flex flex-col gap-2">
                        <TextField aria-label="Adresse email" name="email" type="email" defaultValue="antoine.moulin@gmail.com">
                            <InputBase size="md" placeholder="ton@email.com" icon={Mail01} />
                        </TextField>
                        <div className="flex items-center gap-1.5 text-sm text-success-600">
                            <Check className="size-4" />
                            <span>Email vérifié</span>
                        </div>
                    </div>
                </div>

                <hr className="h-px w-full border-none bg-border-secondary" />

                {/* Mot de passe */}
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(200px,280px)_minmax(400px,512px)] lg:gap-8">
                    <SectionLabel.Root size="sm" title="Mot de passe" description="Minimum 8 caractères recommandé." />
                    <div className="flex flex-col gap-4">
                        <TextField aria-label="Mot de passe actuel" name="current_password" type="password">
                            <Label>Mot de passe actuel</Label>
                            <InputBase size="md" placeholder="••••••••" icon={Key01} />
                        </TextField>
                        <TextField aria-label="Nouveau mot de passe" name="new_password" type="password">
                            <Label>Nouveau mot de passe</Label>
                            <InputBase size="md" placeholder="••••••••" icon={Key01} />
                        </TextField>
                        <TextField aria-label="Confirmer le mot de passe" name="confirm_password" type="password">
                            <Label>Confirmer le nouveau mot de passe</Label>
                            <InputBase size="md" placeholder="••••••••" icon={Key01} />
                        </TextField>
                        <Button color="secondary" size="sm" className="w-fit">
                            Mettre à jour le mot de passe
                        </Button>
                    </div>
                </div>

                <hr className="h-px w-full border-none bg-border-secondary" />

                {/* Connexion Magic Link */}
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(200px,280px)_minmax(400px,512px)] lg:gap-8">
                    <SectionLabel.Root size="sm" title="Magic Link" description="Reçois un lien de connexion par email sans mot de passe." />
                    <div className="flex items-center gap-4">
                        <Button color="secondary" size="sm">
                            Envoyer un Magic Link
                        </Button>
                        <span className="text-sm text-tertiary">Valide 15 minutes</span>
                    </div>
                </div>

                <hr className="h-px w-full border-none bg-border-secondary" />

                {/* Zone danger */}
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(200px,280px)_minmax(400px,512px)] lg:gap-8">
                    <SectionLabel.Root size="sm" title="Zone danger" description="Actions irréversibles sur ton compte." />
                    <div className="flex flex-col gap-4">
                        {!showDeleteConfirm ? (
                            <Button color="secondary" size="sm" className="w-fit text-error-700 hover:text-error-800" onClick={() => setShowDeleteConfirm(true)}>
                                <Trash01 className="size-4" />
                                Supprimer mon compte
                            </Button>
                        ) : (
                            <div className="rounded-lg border border-error-300 bg-error-25 p-4">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="mt-0.5 size-5 shrink-0 text-error-600" />
                                    <div className="flex flex-col gap-3">
                                        <div>
                                            <p className="font-medium text-error-700">Supprimer définitivement ton compte ?</p>
                                            <p className="mt-1 text-sm text-error-600">
                                                Cette action est irréversible. Toutes tes données seront supprimées : salons, voitures, Race Coins, historique.
                                            </p>
                                        </div>
                                        <div className="flex gap-3">
                                            <Button color="primary" size="sm" className="bg-error-600 hover:bg-error-700">
                                                Confirmer la suppression
                                            </Button>
                                            <Button color="secondary" size="sm" onClick={() => setShowDeleteConfirm(false)}>
                                                Annuler
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderNotificationsTab = () => (
        <div className="flex flex-col gap-6">
            <SectionHeader.Root>
                <SectionHeader.Group>
                    <div className="flex flex-1 flex-col justify-center gap-0.5 self-stretch">
                        <SectionHeader.Heading>Notifications</SectionHeader.Heading>
                        <SectionHeader.Subheading>Configure les notifications que tu souhaites recevoir par email.</SectionHeader.Subheading>
                    </div>
                </SectionHeader.Group>
            </SectionHeader.Root>

            <div className="flex flex-col gap-6">
                {notificationCategories.map((category, categoryIndex) => (
                    <div key={category.id}>
                        {categoryIndex > 0 && <hr className="mb-6 h-px w-full border-none bg-border-secondary" />}

                        <div className="flex flex-col gap-4">
                            <div>
                                <h3 className="text-sm font-semibold text-primary">{category.title}</h3>
                                <p className="text-sm text-tertiary">{category.description}</p>
                            </div>

                            <div className="flex flex-col gap-4">
                                {category.items.map((item) => (
                                    <div key={item.id} className="flex items-start justify-between gap-4 rounded-lg border border-secondary bg-primary p-4">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-sm font-medium text-primary">{item.label}</span>
                                            <span className="text-sm text-tertiary">{item.description}</span>
                                        </div>
                                        <Toggle
                                            aria-label={item.label}
                                            name={item.id}
                                            isSelected={notificationSettings[item.id]}
                                            onChange={(enabled) => handleNotificationToggle(item.id, enabled)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}

                <hr className="h-px w-full border-none bg-border-secondary" />

                {/* Actions rapides */}
                <div className="flex gap-3">
                    <Button
                        color="link-gray"
                        size="sm"
                        onClick={() => {
                            const allEnabled: Record<string, boolean> = {};
                            notificationCategories.forEach((cat) => cat.items.forEach((item) => (allEnabled[item.id] = true)));
                            setNotificationSettings(allEnabled);
                        }}
                    >
                        Tout activer
                    </Button>
                    <Button
                        color="link-gray"
                        size="sm"
                        onClick={() => {
                            const allDisabled: Record<string, boolean> = {};
                            notificationCategories.forEach((cat) => cat.items.forEach((item) => (allDisabled[item.id] = false)));
                            setNotificationSettings(allDisabled);
                        }}
                    >
                        Tout désactiver
                    </Button>
                </div>
            </div>
        </div>
    );

    const renderConfidentialiteTab = () => (
        <div className="flex flex-col gap-6">
            <SectionHeader.Root>
                <SectionHeader.Group>
                    <div className="flex flex-1 flex-col justify-center gap-0.5 self-stretch">
                        <SectionHeader.Heading>Confidentialité</SectionHeader.Heading>
                        <SectionHeader.Subheading>Contrôle ce que les autres pilotes peuvent voir sur ton profil.</SectionHeader.Subheading>
                    </div>
                </SectionHeader.Group>
            </SectionHeader.Root>

            <div className="flex flex-col gap-5">
                {/* Visibilité collection */}
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(200px,280px)_1fr] lg:gap-8">
                    <SectionLabel.Root size="sm" title="Collection de voitures" description="Afficher ou masquer ta collection sur ton profil public." />
                    <div className="flex flex-col gap-4">
                        <div className="flex items-start justify-between gap-4 rounded-lg border border-secondary bg-primary p-4">
                            <div className="flex flex-col gap-0.5">
                                <span className="text-sm font-medium text-primary">Afficher ma collection</span>
                                <span className="text-sm text-tertiary">Les autres pilotes pourront voir les voitures que tu possèdes</span>
                            </div>
                            <Toggle aria-label="Afficher collection" name="show_collection" defaultSelected />
                        </div>
                    </div>
                </div>

                <hr className="h-px w-full border-none bg-border-secondary" />

                {/* Visibilité statistiques */}
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(200px,280px)_1fr] lg:gap-8">
                    <SectionLabel.Root size="sm" title="Statistiques" description="Afficher ou masquer tes stats de course." />
                    <div className="flex flex-col gap-4">
                        <div className="flex items-start justify-between gap-4 rounded-lg border border-secondary bg-primary p-4">
                            <div className="flex flex-col gap-0.5">
                                <span className="text-sm font-medium text-primary">Afficher mes statistiques</span>
                                <span className="text-sm text-tertiary">Courses gagnées, saisons remportées, position moyenne</span>
                            </div>
                            <Toggle aria-label="Afficher statistiques" name="show_stats" defaultSelected />
                        </div>
                    </div>
                </div>

                <hr className="h-px w-full border-none bg-border-secondary" />

                {/* Profil dans les salons */}
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(200px,280px)_1fr] lg:gap-8">
                    <SectionLabel.Root
                        size="sm"
                        title="Visibilité du profil"
                        description="Qui peut voir ton profil en dehors des salons communs."
                    />
                    <div className="flex flex-col gap-2">
                        <Select
                            name="profile_visibility"
                            aria-label="Visibilité du profil"
                            size="sm"
                            defaultSelectedKey="common_salons"
                            items={[
                                { id: "common_salons", label: "Membres de mes salons uniquement" },
                                { id: "all", label: "Tout le monde (profil public)" },
                            ]}
                        >
                            {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
                        </Select>
                        <p className="text-sm text-tertiary">
                            Note : Les membres de tes salons pourront toujours voir ton pseudo, avatar et classement.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderTabContent = () => {
        switch (selectedTab) {
            case "profil":
                return renderProfilTab();
            case "compte":
                return renderCompteTab();
            case "notifications":
                return renderNotificationsTab();
            case "confidentialite":
                return renderConfidentialiteTab();
            default:
                return renderProfilTab();
        }
    };

    return (
        <main className="min-w-0 flex-1 bg-primary py-6 md:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl px-4">
                <Form
                    className="flex flex-col gap-8"
                    onSubmit={(e) => {
                        e.preventDefault();
                        const data = Object.fromEntries(new FormData(e.currentTarget));
                        // Ajouter les états des toggles de notification
                        Object.entries(notificationSettings).forEach(([key, value]) => {
                            data[key] = value.toString();
                        });
                        console.log("Données du formulaire:", data);
                    }}
                >
                    <div className="flex flex-col gap-5">
                        {/* En-tête de page */}
                        <div className="relative flex flex-col gap-5">
                            <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
                                <div className="flex flex-col gap-0.5 lg:gap-1">
                                    <h1 className="text-xl font-semibold text-primary lg:text-display-xs">Paramètres</h1>
                                </div>
                            </div>
                        </div>

                        {/* Mobile: Select + Buttons */}
                        <div className="flex items-center justify-between gap-4 md:hidden">
                            <NativeSelect
                                aria-label="Onglets"
                                className="flex-1"
                                value={selectedTab}
                                onChange={(event) => setSelectedTab(event.target.value)}
                                options={tabs.map((tab) => ({ label: tab.label, value: tab.id }))}
                            />
                            <div className="flex gap-3">
                                <Button color="secondary" size="sm">
                                    Annuler
                                </Button>
                                <Button type="submit" color="primary" size="sm">
                                    Enregistrer
                                </Button>
                            </div>
                        </div>

                        {/* Desktop: Tabs + Buttons */}
                        <div className="scrollbar-hide hidden items-center justify-between gap-5.5 overflow-auto md:flex">
                            <Tabs className="flex-1" selectedKey={selectedTab} onSelectionChange={(value) => setSelectedTab(value as string)}>
                                <TabList type="button-border" items={tabs} />
                            </Tabs>
                            <div className="flex gap-4.5">
                                <Button color="secondary" size="sm" className="h-11">
                                    Annuler
                                </Button>
                                <Button type="submit" color="primary" size="sm" className="h-11">
                                    Enregistrer
                                </Button>
                            </div>
                        </div>
                    </div>

                    {renderTabContent()}
                </Form>
            </div>
        </main>
    );
};

// Helper pour les couleurs de voiture (temporaire, à remplacer par les vraies images)
function getCarColor(id: string): string {
    const colors: Record<string, string> = {
        rouge: "#EF4444",
        bleu: "#3B82F6",
        vert: "#22C55E",
        jaune: "#EAB308",
        noir: "#171717",
        blanc: "#F5F5F5",
        orange: "#F97316",
        violet: "#A855F7",
        rose: "#EC4899",
        gris: "#6B7280",
        scarlet: "#DC2626",
        ocean: "#0EA5E9",
        forest: "#16A34A",
        sunset: "#FB923C",
        storm: "#475569",
        inferno: "#B91C1C",
        aurora: "#8B5CF6",
        phantom: "#1E293B",
        "or-noir": "#CA8A04",
    };
    return colors[id] || "#6B7280";
}