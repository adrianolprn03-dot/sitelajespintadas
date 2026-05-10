"use client";

import { useEffect } from "react";

export default function VLibras() {
    useEffect(() => {
        // Prevent adding multiple scripts
        if (document.querySelector('script[src="https://vlibras.gov.br/app/vlibras-plugin.js"]')) {
            return;
        }

        // Create the VLibras widget container
        const container = document.createElement("div");
        container.setAttribute("vw", "");
        container.className = "enabled";

        const accessButton = document.createElement("div");
        accessButton.setAttribute("vw-access-button", "");
        accessButton.className = "active";
        container.appendChild(accessButton);

        const pluginWrapper = document.createElement("div");
        pluginWrapper.setAttribute("vw-plugin-wrapper", "");

        const topWrapper = document.createElement("div");
        topWrapper.className = "vw-plugin-top-wrapper";
        pluginWrapper.appendChild(topWrapper);
        container.appendChild(pluginWrapper);

        document.body.appendChild(container);

        // Load the VLibras script
        const script = document.createElement("script");
        script.src = "https://vlibras.gov.br/app/vlibras-plugin.js";
        script.async = true;
        script.onload = () => {
            // @ts-ignore
            if (window.VLibras) {
                // @ts-ignore
                new window.VLibras.Widget("https://vlibras.gov.br/app");
            }
        };
        document.body.appendChild(script);

        return () => {
            // Cleanup on unmount (unlikely in layout, but good practice)
            try {
                document.body.removeChild(container);
                document.body.removeChild(script);
            } catch { /* ignore */ }
        };
    }, []);

    // No JSX output — everything is injected via DOM to avoid TypeScript issues with custom attributes
    return null;
}
