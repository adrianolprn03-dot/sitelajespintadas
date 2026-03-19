"use client";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import AccessibilityProvider from "./AccessibilityProvider";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <AccessibilityProvider>
                {children}
                <Toaster position="top-right" />
            </AccessibilityProvider>
        </SessionProvider>
    );
}
