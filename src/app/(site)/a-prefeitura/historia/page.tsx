import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Image from "next/image";

export const metadata: Metadata = {
    title: "Nossa História | Prefeitura de Lajes Pintadas",
    description: "Conheça a história, origens e o desenvolvimento do município de Lajes Pintadas – RN.",
};

export default function HistoriaPage() {
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
                                src="/images/historia-lajes.webp" // Assumindo que o usuário tenha ou eu gere depois
                                alt="Vista panorâmica histórica de Lajes Pintadas"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-12">
                                <p className="text-white font-bold text-lg">Um legado de força e tradição no sertão potiguar.</p>
                            </div>
                        </div>

                        <h2>Origens e Fundação</h2>
                        <p>
                            O município de Lajes Pintadas, situado na região do Agreste Potiguar, tem suas raízes ligadas ao desbravamento do interior do Rio Grande do Norte. O nome "Lajes Pintadas" remete às formações rochosas características da região, que exibiam marcas e cores peculiares, servindo como ponto de referência para os primeiros viajantes e criadores de gado.
                        </p>
                        <p>
                            O povoamento inicial consolidou-se em torno da atividade agropecuária, base da economia local por décadas. A fé religiosa também desempenhou papel fundamental na união da comunidade, com a construção da primeira capela que se tornou o coração do vilarejo.
                        </p>
                    </section>

                    <section className="mb-16 p-12 bg-gray-50 rounded-[3rem] border border-gray-100 italic font-medium text-lg leading-relaxed text-gray-700">
                        "Lajes Pintadas é mais que um ponto no mapa; é o lar de um povo acolhedor e trabalhador que transformou a paisagem com suor e esperança."
                    </section>

                    <section className="mb-16">
                        <h2>Emancipação Política</h2>
                        <p>
                            Após anos de crescimento e organização social, o anseio pela autonomia política tornou-se realidade. A emancipação foi um marco que permitiu ao município gerir seus próprios recursos e focar nas necessidades específicas de sua população.
                        </p>
                        <p>
                            Desde então, Lajes Pintadas vem trilhando um caminho de desenvolvimento, investindo em infraestrutura, educação e saúde, sem nunca perder de vista a preservação de sua identidade cultural e de seus valores tradicionais.
                        </p>
                    </section>

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
