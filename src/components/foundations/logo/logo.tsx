"use client";

import React from "react";

interface LogoProps {
    className?: string;
}

const Logo = ({ className = "" }: LogoProps) => {
    return (
        <div 
            className={"cursor-pointer relative w-24 " + className} 
            onClick={() => (window.location.href = "/")}
        >
            {/* Logo pour le mode clair - visible par défaut, caché en dark mode */}
            <img
                src="/logo/dark-logo.svg"
                alt="Logo"
                className="w-24 dark:hidden"
            />
            {/* Logo pour le mode sombre - caché par défaut, visible en dark mode */}
            <img
                src="/logo/light-logo.svg"
                alt="Logo"
                className="w-24 hidden dark:block"
            />
        </div>
    );
};

export default Logo;

