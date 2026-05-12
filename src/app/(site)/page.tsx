import type { Metadata } from "next";
export const dynamic = "force-dynamic";
import HeroSection from "@/components/home/HeroSection";
import ServicosRapidos from "@/components/home/ServicosRapidos";
import TransparenciaHub from "@/components/home/TransparenciaHub";
import AcessoRapido from "@/components/home/AcessoRapido";
import UltimasNoticias from "@/components/home/UltimasNoticias";
import SecretariasSlider from "@/components/home/SecretariasSlider";
import UnidadesAtendimento from "@/components/home/UnidadesAtendimento";
import RadarTransparencia from "@/components/home/RadarTransparencia";
import VideoHero from "@/components/home/VideoHero";

export const metadata: Metadata = {
    title: "Prefeitura Municipal de Lajes Pintadas – RN | Página Inicial",
    description: "Site oficial da Prefeitura Municipal de Lajes Pintadas – RN. Transparência, serviços ao cidadão, notícias e informações institucionais.",
    keywords: "Lajes Pintadas, prefeitura, RN, Rio Grande do Norte, transparência, serviços públicos",
    openGraph: {
        title: "Prefeitura Municipal de Lajes Pintadas – RN",
        description: "Site oficial da Prefeitura Municipal de Lajes Pintadas. Transparência, serviços e informações institucionais.",
        locale: "pt_BR",
        type: "website",
    },
};

export default function Home() {
    return (
        <main>
            <HeroSection />
            <ServicosRapidos />
            <UltimasNoticias />
            <TransparenciaHub />
            <AcessoRapido />
            <UnidadesAtendimento />
            <VideoHero />
            <RadarTransparencia />
            <SecretariasSlider />
        </main>
    );
}
