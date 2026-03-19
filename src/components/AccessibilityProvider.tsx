"use client";
import { createContext, useContext, useEffect, useState } from "react";

type AccessibilityContextType = {
    highContrast: boolean;
    fontSize: "normal" | "large" | "xlarge";
    toggleHighContrast: () => void;
    increaseFontSize: () => void;
    decreaseFontSize: () => void;
    resetFontSize: () => void;
};

const AccessibilityContext = createContext<AccessibilityContextType | null>(null);

export function useAccessibility() {
    const ctx = useContext(AccessibilityContext);
    if (!ctx) throw new Error("useAccessibility must be used within AccessibilityProvider");
    return ctx;
}

export default function AccessibilityProvider({ children }: { children: React.ReactNode }) {
    const [highContrast, setHighContrast] = useState(false);
    const [fontSize, setFontSize] = useState<"normal" | "large" | "xlarge">("normal");

    useEffect(() => {
        const savedContrast = localStorage.getItem("highContrast") === "true";
        const savedFont = (localStorage.getItem("fontSize") as "normal" | "large" | "xlarge") || "normal";
        setHighContrast(savedContrast);
        setFontSize(savedFont);
        document.documentElement.classList.toggle("high-contrast", savedContrast);
        document.documentElement.classList.remove("font-large", "font-xlarge");
        if (savedFont !== "normal") document.documentElement.classList.add(`font-${savedFont}`);
    }, []);

    const toggleHighContrast = () => {
        const next = !highContrast;
        setHighContrast(next);
        localStorage.setItem("highContrast", String(next));
        document.documentElement.classList.toggle("high-contrast", next);
    };

    const increaseFontSize = () => {
        let next: "normal" | "large" | "xlarge" = "normal";
        if (fontSize === "normal") next = "large";
        if (fontSize === "large") next = "xlarge";
        if (fontSize === "xlarge") next = "xlarge";

        setFontSize(next);
        localStorage.setItem("fontSize", next);
        document.documentElement.classList.remove("font-large", "font-xlarge");
        if (next !== "normal") document.documentElement.classList.add(`font-${next}`);
    };

    const decreaseFontSize = () => {
        let next: "normal" | "large" | "xlarge" = "normal";
        if (fontSize === "xlarge") next = "large";
        if (fontSize === "large") next = "normal";

        setFontSize(next);
        localStorage.setItem("fontSize", next);
        document.documentElement.classList.remove("font-large", "font-xlarge");
        if (next !== "normal") document.documentElement.classList.add(`font-${next}`);
    };

    const resetFontSize = () => {
        setFontSize("normal" as const);
        localStorage.setItem("fontSize", "normal");
        document.documentElement.classList.remove("font-large", "font-xlarge");
    };

    return (
        <AccessibilityContext.Provider value={{ highContrast, fontSize, toggleHighContrast, increaseFontSize, decreaseFontSize, resetFontSize }}>
            {children}
        </AccessibilityContext.Provider>
    );
}
