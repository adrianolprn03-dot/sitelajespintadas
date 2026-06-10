import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { MUNICIPIO } from "@/config/municipio";

export const metadata: Metadata = {
    title: `Nossa História | ${MUNICIPIO.nomeCompleto}`,
    description: `Conheça a história, origens e o desenvolvimento do município de ${MUNICIPIO.nome} – ${MUNICIPIO.uf}.`,
};

async function getConfig(chave: string, padrao: string) {
    const config = await prisma.configuracao.findUnique({ where: { chave } });
    return config?.valor || padrao;
}

export default async function HistoriaPage() {
    const historiaDb = await getConfig("municipio_historia", "");
    const hinoDb = await getConfig("municipio_hino", "");
    const populacaoDb = await getConfig("municipio_populacao", MUNICIPIO.estatisticas.populacao);
    const gentilicoDb = await getConfig("municipio_gentilico", MUNICIPIO.gentilico);
    const distanciaDb = await getConfig("municipio_distancia_capital", MUNICIPIO.nome === "São Tomé" ? "112 KM" : "136 KM");
    const aniversarioDb = await getConfig("municipio_aniversario", MUNICIPIO.nome === "São Tomé" ? "29 de Outubro" : "31 de Dezembro");
    const fundacaoDb = await getConfig("municipio_fundacao", MUNICIPIO.estatisticas.fundacao);
    
    const paragrafos = historiaDb ? historiaDb.split('\n\n').filter(p => p.trim() !== '') : [];

    return (
        <div className="min-h-screen bg-white">
            <PageHeader
                title={`História de ${MUNICIPIO.nome}`}
                subtitle="Um mergulho nas raízes e no desenvolvimento de nossa amada terra."
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "A Prefeitura", href: "/a-prefeitura" },
                    { label: "História" }
                ]}
            />

            <div className="max-w-[900px] mx-auto px-6 py-20">
                <div className="prose prose-blue max-w-none prose-p:text-gray-600 prose-p:leading-relaxed prose-headings:text-gray-800 prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter">
                    <section className="mb-16">
                        <div className="relative w-full h-[400px] rounded-[3rem] overflow-hidden mb-12 shadow-2xl shadow-blue-900/10">
                            <Image
                                src="/images/historia-panoramica.jpg"
                                alt={`Vista panorâmica histórica de ${MUNICIPIO.nome}`}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-12">
                                <p className="text-white font-bold text-lg">Um legado de força e tradição no sertão potiguar.</p>
                            </div>
                        </div>

                        <h2>Dados do Município</h2>
                        <ul className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-700 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                            <li><strong>Fundação:</strong> {fundacaoDb}</li>
                            <li><strong>Emancipação Política / Aniversário:</strong> {aniversarioDb}</li>
                            <li><strong>Gentílico:</strong> {gentilicoDb}</li>
                            <li><strong>Unidade Federativa:</strong> {MUNICIPIO.estado}</li>
                            <li><strong>Mesorregião:</strong> {MUNICIPIO.nome === "São Tomé" ? "Agreste Potiguar" : "Agreste Potiguar"}</li>
                            <li><strong>Microrregião:</strong> {MUNICIPIO.nome === "São Tomé" ? "Borborema Potiguar" : "Borborema Potiguar"}</li>
                            <li><strong>Distância para a capital:</strong> {distanciaDb}</li>
                            <li><strong>População:</strong> {populacaoDb}</li>
                        </ul>

                        <h2>História e Fundação</h2>
                        {paragrafos.length > 0 ? (
                            paragrafos.map((p, idx) => (
                                <p key={idx}>{p}</p>
                            ))
                        ) : (
                            <>
                                <p>
                                    Município brasileiro do estado do Rio Grande do Norte. Conforme estimativa realizada pelo IBGE (Instituto Brasileiro de Geografia e Estatística) no ano 2022, sua população era de 4.787 habitantes, distribuídos em 130,211 km² de área territorial.
                                </p>
                                <p>
                                    O Riacho de Lajes Pintadas foi assim denominado por causa da existência de uma pedra com desenhos rupestres, localizada no seu caminho. As figuras humanas e as inscrições gráficas, ainda não definidas, foram feitas na pedra com tinta permanente e de cor vermelha. Foi na propriedade rural do Sr. João Francisco, localizada na área do Riacho das Lajes Pintadas que teve início um povoamento. O proprietário tinha por costume promover cultos religiosos a São Francisco de Assis, santo que tinha vindo do Canindé, no Ceará.
                                </p>
                            </>
                        )}
                    </section>

                    {hinoDb ? (
                        <section className="mb-16 p-12 bg-blue-50 rounded-[3rem] border border-blue-100 text-center">
                            <h2 className="text-blue-900 font-black uppercase tracking-widest mb-6">Hino de {MUNICIPIO.nome}</h2>
                            <div className="whitespace-pre-line text-blue-800 font-medium italic text-lg leading-relaxed">
                                {hinoDb}
                            </div>
                        </section>
                    ) : (
                        <section className="mb-16 p-12 bg-gray-50 rounded-[3rem] border border-gray-100 italic font-medium text-lg leading-relaxed text-gray-700 text-center">
                            "{MUNICIPIO.nome} é mais que um ponto no mapa; é o lar de um povo acolhedor e trabalhador que transformou a paisagem com suor e esperança."
                        </section>
                    )}

                    <section>
                        <h2>Símbolos Municipais</h2>
                        <p>
                            A Bandeira, o Brasão e o Hino de {MUNICIPIO.nome} representam o orgulho de pertencer a esta terra. O brasão, em particular, destaca a força da agricultura e a beleza das paisagens naturais, unindo o passado de lutas ao presente de conquistas.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
