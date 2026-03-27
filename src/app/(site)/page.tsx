import type { Metadata } from "next";
export const dynamic = "force-dynamic";
import VideoHero from "@/components/home/VideoHero";
import HeroSection from "@/components/home/HeroSection";
import ServicosRapidos from "@/components/home/ServicosRapidos";
import RadarTransparencia from "@/components/home/RadarTransparencia";
import AcessoRapido from "@/components/home/AcessoRapido";
import UltimasNoticias from "@/components/home/UltimasNoticias";
import SecretariasSlider from "@/components/home/SecretariasSlider";
import UnidadesAtendimento from "@/components/home/UnidadesAtendimento";

export const metadata: Metadata = {
    title: "Prefeitura Municipal de Lajes Pintadas – RN | Página Inicial",
    description: "Site oficial da Prefeitura Municipal de Lajes Pintadas – RN. Transparência, serviços ao cidadão, notícias e informações institucionais.",
};

export default function Home() {
    return (
        <main>
            <HeroSection />
            <ServicosRapidos />
            <UltimasNoticias />
            <AcessoRapido />
            <UnidadesAtendimento />
            <SecretariasSlider />
            <RadarTransparencia />
        </main>
    );
}
