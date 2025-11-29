"use client";

import { useState } from "react";
import { AlertTriangle, Check, Copy01, Flag03, Flag06, Link01, QrCode02, Users01, X } from "@untitledui/icons";
import { DialogTrigger as AriaDialogTrigger, Heading as AriaHeading } from "react-aria-components";
import { Dialog, Modal, ModalOverlay } from "@/components/application/modals/modal";
import { Button } from "@/components/base/buttons/button";
import { CloseButton } from "@/components/base/buttons/close-button";
import { Input } from "@/components/base/input/input";
import { TextArea } from "@/components/base/textarea/textarea";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { BackgroundPattern } from "@/components/foundations/background-patterns";
import { useClipboard } from "@/hooks/use-clipboard";

type Step = "create" | "share" | "qrcode";

interface CreateLobbyModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    /** L'utilisateur courant a-t-il vérifié son email ? */
    isUserVerified?: boolean;
    /** Called when salon is successfully created */
    onSalonCreated?: (salon: { id: string; name: string; code: string }) => void;
}

// Simule la génération d'un code de salon (en prod, viendrait du backend)
const generateSalonCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
};

// Génère l'URL du QR Code via l'API publique (cf. backend doc section 3.2)
const getQRCodeUrl = (joinUrl: string) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(joinUrl)}`;
};

    export const CreateLobbyModal = ({ isOpen, onOpenChange, isUserVerified = true, onSalonCreated }: CreateLobbyModalProps) => {
    const [step, setStep] = useState<Step>("create");
    const [salonName, setSalonName] = useState("");
    const [description, setDescription] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [createdSalon, setCreatedSalon] = useState<{ id: string; name: string; code: string } | null>(null);

    const { copy: copyCode, copied: codeCopied } = useClipboard();
    const { copy: copyLink, copied: linkCopied } = useClipboard();

    const shareLink = createdSalon ? `https://vroom.app/join/${createdSalon.code}` : "";
    const qrCodeUrl = shareLink ? getQRCodeUrl(shareLink) : "";

    const handleCreate = async () => {
        if (!salonName.trim() || !isUserVerified) return;

        setIsLoading(true);

        // Simulate API call - POST /api/salons
        await new Promise((resolve) => setTimeout(resolve, 800));

        const newSalon = {
            id: crypto.randomUUID(),
            name: salonName.trim(),
            code: generateSalonCode(),
        };

        setCreatedSalon(newSalon);
        setIsLoading(false);
        setStep("share");
        onSalonCreated?.(newSalon);
    };

    const handleClose = () => {
        onOpenChange(false);
        // Reset state after close animation
        setTimeout(() => {
            setStep("create");
            setSalonName("");
            setDescription("");
            setCreatedSalon(null);
        }, 300);
    };

    const handleFinish = () => {
        handleClose();
        // Navigate to the new salon if needed
        // router.push(`/lobbies/${createdSalon?.id}`);
    };

    return (
        <AriaDialogTrigger isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalOverlay isDismissable>
                <Modal>
                    <Dialog>
                        <div className="relative w-full overflow-hidden rounded-2xl bg-primary shadow-xl sm:max-w-md">
                            <CloseButton onClick={handleClose} theme="light" size="lg" className="absolute right-3 top-3 z-20" />

                            {/* ═══════════════════════════════════════════════════════════════
                                STEP 1: CREATE
                            ═══════════════════════════════════════════════════════════════ */}
                            {step === "create" && (
                                <>
                                    {/* Header */}
                                    <div className="flex flex-col gap-4 px-4 pt-5 sm:px-6 sm:pt-6">
                                        <div className="relative w-max">
                                            <FeaturedIcon color="brand" size="lg" theme="modern" icon={Flag06} />
                                            <BackgroundPattern
                                                pattern="circle"
                                                size="sm"
                                                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                                            />
                                        </div>
                                        <div className="z-10 flex flex-col gap-1">
                                            <AriaHeading slot="title" className="text-lg font-semibold text-primary">
                                                Créer un salon
                                            </AriaHeading>
                                            <p className="text-sm text-tertiary">
                                                Crée un espace pour tes amis et lance des courses de productivité.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Alert si compte non vérifié */}
                                    {!isUserVerified && (
                                        <div className="mx-4 mt-5 flex items-start gap-3 rounded-lg border border-warning-300 bg-warning-25 p-3 sm:mx-6">
                                            <AlertTriangle className="h-5 w-5 shrink-0 text-warning-600" />
                                            <div className="flex flex-col gap-0.5">
                                                <p className="text-sm font-medium text-warning-700">Email non vérifié</p>
                                                <p className="text-sm text-warning-600">
                                                    Tu dois vérifier ton email avant de pouvoir créer un salon.
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Form */}
                                    <div className="flex flex-col gap-4 px-4 pt-5 sm:px-6">
                                        <Input
                                            size="md"
                                            label="Nom du salon"
                                            placeholder="Ex: EPITA Piscine 2025"
                                            value={salonName}
                                            onChange={setSalonName}
                                            isDisabled={!isUserVerified}
                                            autoFocus
                                        />
                                        <TextArea
                                            size="md"
                                            label="Description"
                                            labelOptional="(optionnel)"
                                            placeholder="Décris brièvement l'objectif du salon..."
                                            value={description}
                                            onChange={setDescription}
                                            isDisabled={!isUserVerified}
                                            rows={3}
                                        />
                                    </div>

                                    {/* Actions */}
                                    <div className="z-10 flex flex-1 flex-col-reverse gap-3 p-4 pt-6 *:grow sm:grid sm:grid-cols-2 sm:px-6 sm:pb-6 sm:pt-8">
                                        <Button color="secondary" size="lg" onClick={handleClose}>
                                            Annuler
                                        </Button>
                                        <Button
                                            color="primary"
                                            size="lg"
                                            onClick={handleCreate}
                                            isDisabled={!salonName.trim() || !isUserVerified}
                                            isPending={isLoading}
                                        >
                                            Créer le salon
                                        </Button>
                                    </div>
                                </>
                            )}

                            {/* ═══════════════════════════════════════════════════════════════
                                STEP 2: SHARE
                            ═══════════════════════════════════════════════════════════════ */}
                            {step === "share" && createdSalon && (
                                <>
                                    {/* Success Header */}
                                    <div className="flex flex-col items-center gap-4 px-4 pt-5 sm:px-6 sm:pt-6">
                                        <div className="relative">
                                            <FeaturedIcon color="success" size="lg" theme="modern" icon={Flag03} />
                                            <BackgroundPattern
                                                pattern="circle"
                                                size="sm"
                                                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                                            />
                                        </div>
                                        <div className="z-10 flex flex-col items-center gap-1 text-center">
                                            <AriaHeading slot="title" className="text-lg font-semibold text-primary">
                                                Salon créé !
                                            </AriaHeading>
                                            <p className="text-sm text-tertiary">
                                                <span className="font-medium text-secondary">{createdSalon.name}</span> est prêt. Partage le
                                                code ou le lien pour inviter tes amis.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Share Options */}
                                    <div className="flex flex-col gap-4 px-4 pt-5 sm:px-6">
                                        {/* Code */}
                                        <div className="flex flex-col gap-2">
                                            <label className="text-sm font-medium text-secondary">Code d'invitation</label>
                                            <div className="flex items-center gap-2">
                                                <div className="flex flex-1 items-center justify-center rounded-lg border border-primary bg-secondary px-4 py-3">
                                                    <span className="font-mono text-2xl font-bold tracking-[0.3em] text-primary">
                                                        {createdSalon.code}
                                                    </span>
                                                </div>
                                                <Button
                                                    size="md"
                                                    color="secondary"
                                                    onClick={() => copyCode(createdSalon.code)}
                                                    iconLeading={codeCopied ? Check : Copy01}
                                                    className="shrink-0"
                                                >
                                                    {codeCopied ? "Copié" : "Copier"}
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Link */}
                                        <div className="flex flex-row items-end gap-2">
                                            <Input
                                                isReadOnly
                                                size="md"
                                                label="Lien de partage"
                                                value={shareLink}
                                                icon={Link01}
                                                className="flex-1"
                                            />
                                            <Button
                                                size="md"
                                                color="tertiary"
                                                onClick={() => copyLink(shareLink)}
                                                iconLeading={linkCopied ? Check : Copy01}
                                            />
                                        </div>

                                        {/* Member count hint */}
                                        <div className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2.5">
                                            <Users01 className="h-4 w-4 text-tertiary" />
                                            <p className="text-sm text-tertiary">
                                                Tu es le seul membre pour l'instant. Invite des amis pour commencer !
                                            </p>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="z-10 flex flex-1 flex-col-reverse gap-3 p-4 pt-6 *:grow sm:grid sm:grid-cols-2 sm:px-6 sm:pb-6 sm:pt-8">
                                        <Button color="secondary" size="lg" onClick={() => setStep("qrcode")} iconLeading={QrCode02}>
                                            Voir QR Code
                                        </Button>
                                        <Button color="primary" size="lg" onClick={handleFinish}>
                                            C'est parti !
                                        </Button>
                                    </div>
                                </>
                            )}

                            {/* ═══════════════════════════════════════════════════════════════
                                STEP 3: QR CODE
                            ═══════════════════════════════════════════════════════════════ */}
                            {step === "qrcode" && createdSalon && (
                                <>
                                    {/* Header */}
                                    <div className="flex flex-col items-center gap-4 px-4 pt-5 sm:px-6 sm:pt-6">
                                        <div className="relative">
                                            <FeaturedIcon color="brand" size="lg" theme="modern" icon={QrCode02} />
                                            <BackgroundPattern
                                                pattern="circle"
                                                size="sm"
                                                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                                            />
                                        </div>
                                        <div className="z-10 flex flex-col items-center gap-1 text-center">
                                            <AriaHeading slot="title" className="text-lg font-semibold text-primary">
                                                QR Code
                                            </AriaHeading>
                                            <p className="text-sm text-tertiary">Scanne ce code pour rejoindre le salon.</p>
                                        </div>
                                    </div>

                                    {/* QR Code Display */}
                                    <div className="flex flex-col items-center gap-4 px-4 pt-5 sm:px-6">
                                        <div className="rounded-xl border border-primary bg-white p-4 shadow-sm">
                                            <img
                                                src={qrCodeUrl}
                                                alt={`QR Code pour rejoindre ${createdSalon.name}`}
                                                width={200}
                                                height={200}
                                                className="h-[200px] w-[200px]"
                                            />
                                        </div>

                                        {/* Salon info */}
                                        <div className="flex flex-col items-center gap-1">
                                            <p className="text-sm font-medium text-secondary">{createdSalon.name}</p>
                                            <p className="font-mono text-xs text-tertiary">{shareLink}</p>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="z-10 flex flex-1 flex-col-reverse gap-3 p-4 pt-6 *:grow sm:grid sm:grid-cols-2 sm:px-6 sm:pb-6 sm:pt-8">
                                        <Button color="secondary" size="lg" onClick={() => setStep("share")}>
                                            Retour
                                        </Button>
                                        <Button color="primary" size="lg" onClick={handleFinish}>
                                            Terminer
                                        </Button>
                                    </div>
                                </>
                            )}
                        </div>
                    </Dialog>
                </Modal>
            </ModalOverlay>
        </AriaDialogTrigger>
    );
};

// ═══════════════════════════════════════════════════════════════
// DEMO COMPONENT
// ═══════════════════════════════════════════════════════════════
export const CreateLobbyModalDemo = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isVerified, setIsVerified] = useState(true);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex gap-2">
                <Button onClick={() => setIsOpen(true)}>Créer un salon</Button>
                <Button color="secondary" onClick={() => setIsVerified(!isVerified)}>
                    {isVerified ? "Simuler non-vérifié" : "Simuler vérifié"}
                </Button>
            </div>
            <CreateLobbyModal
                isOpen={isOpen}
                onOpenChange={setIsOpen}
                isUserVerified={isVerified}
                onSalonCreated={(salon) => console.log("Salon créé:", salon)}
            />
        </div>
    );
};

export default CreateLobbyModal;