"use client";

import React from "react";
import { useTheme } from "next-themes";

interface LogoProps {
    className?: string;
}

const Logo = ({ className = "" }: LogoProps) => {
    const { theme } = useTheme();
    
    // Afficher le logo dark en mode dark, light en mode light
    const logoSrc = theme === "dark" ? "/logo/dark-logo.svg" : "/logo/light-logo.svg";
    
    return (
        <div className={"cursor-pointer " + className} onClick={() => (window.location.href = "/landing")}>
            <img src={logoSrc} alt="Logo" />
        </div>
    );
};

export default Logo;
