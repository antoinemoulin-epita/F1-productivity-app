"use client";

import { useState } from "react";
import { ChevronDown, Coins01, LogOut01, Settings01, User01 } from "@untitledui/icons";
import Image from "next/image";
import { Button } from "@/components/base/buttons/button";
import { ThemeToggle } from "@/components/base/buttons/theme-toggle";
import { Popover } from "@/components/base/select/popover";
import Logo from "@/components/foundations/logo/logo";
import { cx } from "@/utils/cx";
import { Dialog, DialogTrigger } from "../modals/modal";

interface AuthenticatedHeaderProps {
    user?: {
        username: string;
        avatarUrl?: string;
        vroomCoins: number;
    };
    className?: string;
}

export const AuthenticatedHeader = ({ user, className }: AuthenticatedHeaderProps) => {
    return (
        <header className={cx("sticky top-0 z-10 flex h-18 w-full items-center bg-primary", className)}>
            <div className="flex size-full max-w-full items-center px-4 md:px-6">
                <div className="flex w-full items-center justify-between gap-4">
                    {/* Logo - Gauche */}
                    <div className="flex items-center">
                        <a href="/" className="flex items-center gap-2 rounded-lg p-2 transition hover:bg-primary_hover">
                            <Logo />
                        </a>
                    </div>

                    {/* Droite - Coins + Profil */}
                    <div className="flex items-center gap-3">
                        {/* VROOM Coins - Cliquable vers shop */}
                        <a
                            href="/shop"
                            className="hidden items-center gap-2 rounded-lg bg-gray-100 px-3 py-1.5 transition hover:bg-gray-200 md:flex dark:bg-gray-800 dark:hover:bg-gray-700"
                        >
                            <Coins01 className="size-4 text-yellow-600 dark:text-yellow-500" />
                            <span className="text-sm font-semibold text-primary">{user?.vroomCoins ?? 0}</span>
                        </a>

                        {/* Theme Toggle */}
                        <ThemeToggle />

                        {/* Profil Dropdown */}
                        <DialogTrigger>
                            <a href="/profil" className="justify-star flex h-14 w-14 items-start overflow-hidden rounded-2xl bg-gray-200">
                                <img src="/pilote2.png" alt="Avatar" className="-mt-1 ml-0.5 h-18 object-cover" />
                            </a>

                            <Popover
                                placement="bottom end"
                                offset={8}
                                className={({ isEntering, isExiting }) =>
                                    cx(
                                        "min-w-[200px] rounded-lg bg-primary shadow-lg ring-1 ring-secondary_alt",
                                        isEntering && "duration-200 ease-out animate-in fade-in slide-in-from-top-1",
                                        isExiting && "duration-150 ease-in animate-out fade-out slide-out-to-top-1",
                                    )
                                }
                            >
                                <Dialog className="outline-hidden">
                                    <div className="flex flex-col py-2">
                                        {/* User info header */}
                                        <div className="border-b border-secondary px-3 py-2">
                                            <p className="text-sm font-semibold text-primary">{user?.username ?? "User"}</p>
                                            <p className="text-xs text-secondary">{user?.vroomCoins ?? 0} VROOM Coins</p>
                                        </div>

                                        {/* Menu items */}
                                        <div className="flex flex-col gap-0.5 px-2 py-2">
                                            <a
                                                href={`/profile/${user?.username}`}
                                                className="flex items-center gap-2 rounded-md px-2 py-2 text-sm font-medium text-secondary transition hover:bg-primary_hover"
                                            >
                                                <User01 className="size-4" />
                                                Mon Profil
                                            </a>
                                            <a
                                                href="/settings"
                                                className="flex items-center gap-2 rounded-md px-2 py-2 text-sm font-medium text-secondary transition hover:bg-primary_hover"
                                            >
                                                <Settings01 className="size-4" />
                                                Paramètres
                                            </a>
                                        </div>

                                        {/* Logout */}
                                        <div className="border-t border-secondary px-2 py-2">
                                            <button
                                                onClick={() => {
                                                    // Logique logout
                                                    console.log("Logout");
                                                }}
                                                className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm font-medium text-error-600 transition hover:bg-error-50 dark:hover:bg-error-950"
                                            >
                                                <LogOut01 className="size-4" />
                                                Se déconnecter
                                            </button>
                                        </div>
                                    </div>
                                </Dialog>
                            </Popover>
                        </DialogTrigger>
                    </div>
                </div>
            </div>
        </header>
    );
};
