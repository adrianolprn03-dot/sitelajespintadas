import type { Metadata } from "next";
import PreviaHeader from "./_components/PreviaHeader";
import PreviaFooter from "./_components/PreviaFooter";
import { MUNICIPIO } from "@/config/municipio";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: `Prévia Novo Design – ${MUNICIPIO.nomeCompleto}`,
    description: `Ambiente isolado de validação e aprovação do novo Design System da ${MUNICIPIO.nomeCompleto}.`,
};

export default function PreviaLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="previa-root min-h-screen flex flex-col bg-[#F5F7FA] text-[#12304A] antialiased">
            {/* Injeção isolada das fontes Manrope (títulos) e Inter (textos e controles) */}
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link
                href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@600;700;800&display=swap"
                rel="stylesheet"
            />

            <style>{`
                .previa-root {
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    --previa-primary: #1254A3;
                    --previa-primary-hover: #0d4282;
                    --previa-accent: #F39A32;
                    --previa-bg: #F5F7FA;
                    --previa-card: #FFFFFF;
                    --previa-text: #12304A;
                    --previa-muted: #5B738B;
                    --previa-border: #DDE3EA;
                    --previa-radius: 10px;
                }
                .previa-root h1, .previa-root h2, .previa-root h3, .previa-root .font-heading {
                    font-family: 'Manrope', sans-serif;
                }
                .previa-shadow {
                    box-shadow: 0 2px 8px rgba(18, 48, 74, 0.06), 0 1px 2px rgba(18, 48, 74, 0.04);
                }
                .previa-shadow-hover {
                    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .previa-shadow-hover:hover {
                    box-shadow: 0 8px 24px rgba(18, 48, 74, 0.10), 0 2px 6px rgba(18, 48, 74, 0.06);
                    transform: translateY(-2px);
                }
                .tabular-num {
                    font-variant-numeric: tabular-nums;
                }
            `}</style>

            <PreviaHeader />
            <main id="conteudo-principal-previa" className="flex-1 w-full">
                {children}
            </main>
            <PreviaFooter />
        </div>
    );
}

