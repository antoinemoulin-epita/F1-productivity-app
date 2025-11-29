"use client";

import React from "react";
import { useTheme } from "next-themes";

interface LogoProps {
    className?: string;
}

const Logo = ({ className = "" }: LogoProps) => {
    const { theme } = useTheme();
    
     const logoSrc = theme === "dark" ? "/logo/light-logo.svg" : "/logo/dark-logo.svg";
    
    return (
        <div className={"cursor-pointer " + className} onClick={() => (window.location.href = "/")}>
            <img src={logoSrc} alt="Logo" className="w-24"/>
        </div>
    );
};

export default Logo;

