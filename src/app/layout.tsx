import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: {
        default: "Prefeitura Municipal de Lajes Pintadas – RN",
        template: "%s | Prefeitura de Lajes Pintadas",
    },
    description: "Site oficial da Prefeitura Municipal de Lajes Pintadas, Rio Grande do Norte. Serviços ao cidadão, Portal da Transparência, notícias e informações institucionais.",
    keywords: ["Lajes Pintadas", "Prefeitura", "Rio Grande do Norte", "Transparência", "Serviços Públicos"],
    authors: [{ name: "Prefeitura Municipal de Lajes Pintadas" }],
    robots: "index, follow",
    openGraph: {
        type: "website",
        locale: "pt_BR",
        siteName: "Prefeitura de Lajes Pintadas – RN",
    },
};

import VLibras from "@/components/VLibras";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="pt-BR">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
            </head>
            <body className="font-sans antialiased bg-white text-gray-900" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                <Providers>
                    <a href="#conteudo-principal" className="skip-link">
                        Ir para o conteúdo principal
                    </a>
                    {children}
                </Providers>

                {/* VLibras Widget */}
                <VLibras />
            </body>
        </html>
    );
}
