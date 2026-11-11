import type { Metadata } from "next";
export const dynamic = "force-dynamic";
import { MUNICIPIO } from "@/config/municipio";
import { prisma } from "@/lib/prisma";
import HeroSection from "@/components/home/HeroSection";
import TransparenciaHub from "@/components/home/TransparenciaHub";
import AcessoRapido from "@/components/home/AcessoRapido";
import UltimasNoticias from "@/components/home/UltimasNoticias";
import SecretariasSlider from "@/components/home/SecretariasSlider";
import UnidadesAtendimento from "@/components/home/UnidadesAtendimento";
import RadarTransparencia from "@/components/home/RadarTransparencia";
import VideoHero from "@/components/home/VideoHero";

export const metadata: Metadata = {
    title: `${MUNICIPIO.nomeCompleto} – ${MUNICIPIO.uf} | Página Inicial`,
    description: `Site oficial da ${MUNICIPIO.nomeCompleto} – ${MUNICIPIO.uf}. Transparência, serviços ao cidadão, notícias e informações institucionais.`,
    keywords: `${MUNICIPIO.nome}, prefeitura, ${MUNICIPIO.uf}, ${MUNICIPIO.estado}, transparência, serviços públicos`,
    openGraph: {
        title: `${MUNICIPIO.nomeCompleto} – ${MUNICIPIO.uf}`,
        description: `Site oficial da ${MUNICIPIO.nomeCompleto}. Transparência, serviços e informações institucionais.`,
        locale: "pt_BR",
        type: "website",
    },
};

export default async function Home() {
    const linksExternos = await (prisma as any).linkExterno.findMany({
        where: { ativo: true, moduloAlvo: { startsWith: "home-" } },
    });

    return (
        <main>
            <HeroSection linksExternos={linksExternos} />
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

