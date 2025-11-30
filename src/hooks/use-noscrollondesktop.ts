import { useEffect } from "react";

export function useNoScrollOnDesktop(breakpoint: number = 1024) {
    useEffect(() => {
        const mediaQuery = window.matchMedia(`(min-width: ${breakpoint}px)`);
        
        const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
            document.body.style.overflow = e.matches ? "hidden" : "";
        };
        
        handleChange(mediaQuery);
        mediaQuery.addEventListener("change", handleChange);
        
        return () => {
            mediaQuery.removeEventListener("change", handleChange);
            document.body.style.overflow = "";
        };
    }, [breakpoint]);
}