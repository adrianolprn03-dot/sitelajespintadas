import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Nossa História | Prefeitura de Lajes Pintadas",
    description: "Conheça a história, origens e o desenvolvimento do município de Lajes Pintadas – RN.",
};

async function getConfig(chave: string, padrao: string) {
    const config = await prisma.configuracao.findUnique({ where: { chave } });
    return config?.valor || padrao;
}

export default async function HistoriaPage() {
    const historiaDb = await getConfig("municipio_historia", "");
    const hinoDb = await getConfig("municipio_hino", "");
    const paragrafos = historiaDb ? historiaDb.split('\n\n').filter(p => p.trim() !== '') : [];

    return (
        <div className="min-h-screen bg-white">
            <PageHeader
                title="História de Lajes Pintadas"
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
                                alt="Vista panorâmica histórica de Lajes Pintadas"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-12">
                                <p className="text-white font-bold text-lg">Um legado de força e tradição no sertão potiguar.</p>
                            </div>
                        </div>

                        <h2>Dados do Município</h2>
                        <ul className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-700 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                            <li><strong>Fundação:</strong> 31/12/1958</li>
                            <li><strong>Emancipação Política:</strong> 31 de Dezembro</li>
                            <li><strong>Gentílico:</strong> Lajes-pintadense</li>
                            <li><strong>Unidade Federativa:</strong> Rio Grande do Norte</li>
                            <li><strong>Mesorregião:</strong> Agreste Potiguar</li>
                            <li><strong>Microrregião:</strong> Borborema Potiguar</li>
                            <li><strong>Distância para a capital:</strong> 136 KM</li>
                            <li><strong>População:</strong> 4.787 (Censo 2022)</li>
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
                                <p>
                                    Mesmo após sua morte em 11 de dezembro de 1895, os cultos religiosos tiveram continuidade através do seu filho Eduardo Borges. A primeira missa da localidade foi celebrada pelo Monsenhor Alfredo Pegado, em 1913, no alpendre da Casa Grande. Após vinte e dois anos de consolidação definitiva, o povoado ganhou a capela de São Francisco de Assis sob a organização dos irmãos Eduardo e Elias Borges, recebendo a bênção litúrgica em 1943.
                                </p>
                                <p>
                                    A religiosidade sempre foi uma constante em Lajes Pintadas, fazendo com que o Padre Benjamim Sampaio, na época vigário de Santa Cruz, agraciasse a comunidade com uma imagem de São Francisco vinda do Orago, do Rio de Janeiro. Através da Lei nº 2.332, no dia 31 de dezembro de 1958, Lajes Pintadas foi desmembrada de Santa Cruz e tornou-se município do Rio Grande do Norte.
                                </p>
                                <p>
                                    <strong>Municípios Limítrofes:</strong> Santa Cruz, Campo Redondo e São Tomé.<br/>
                                    <strong>IDH (PNUD/2010):</strong> 0,625 — médio (Posição RN: 46°)<br/>
                                    <strong>PIB (IBGE/2018):</strong> R$ 41.988,9 mil<br/>
                                    <strong>PIB per capita (IBGE/2018):</strong> R$ 8.830,48
                                </p>

                                <h2>Clima e Vegetação</h2>
                                <p>
                                    <strong>Clima:</strong> Muito quente e semi-árido, com estação chuvosa atrasando-se para o outono. O período chuvoso ocorre de janeiro a abril. Temperaturas Médias Anuais variam com máxima de 33,0 °C e mínima de 21,0 °C. A umidade relativa média anual é de 71% e conta com cerca de 2.400 horas de insolação por ano.
                                </p>
                                <p>
                                    <strong>Vegetação:</strong> Caatinga Hipoxerófila. É uma vegetação de clima semi-árido que apresenta arbustos e árvores com espinhos e de aspecto menos agressivo do que a Caatinga Hiperxerófila. Entre as espécies destacam-se a catingueira, angico, braúna, juazeiro, marmeleiro, mandacaru e aroeira.
                                </p>
                            </>
                        )}
                    </section>

                    {hinoDb ? (
                        <section className="mb-16 p-12 bg-blue-50 rounded-[3rem] border border-blue-100 text-center">
                            <h2 className="text-blue-900 font-black uppercase tracking-widest mb-6">Hino de Lajes Pintadas</h2>
                            <div className="whitespace-pre-line text-blue-800 font-medium italic text-lg leading-relaxed">
                                {hinoDb}
                            </div>
                        </section>
                    ) : (
                        <section className="mb-16 p-12 bg-gray-50 rounded-[3rem] border border-gray-100 italic font-medium text-lg leading-relaxed text-gray-700 text-center">
                            "Lajes Pintadas é mais que um ponto no mapa; é o lar de um povo acolhedor e trabalhador que transformou a paisagem com suor e esperança."
                        </section>
                    )}


                    <section>
                        <h2>Símbolos Municipais</h2>
                        <p>
                            A Bandeira, o Brasão e o Hino de Lajes Pintadas representam o orgulho de pertencer a esta terra. O brasão, em particular, destaca a força da agricultura e a beleza das paisagens naturais, unindo o passado de lutas ao presente de conquistas.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
