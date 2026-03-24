import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
    title: "Brasão, Hino e Bandeira | Prefeitura de Lajes Pintadas",
    description: "Símbolos oficiais da cidade de Lajes Pintadas – RN.",
};

export default function SimbolosPage() {
    return (
        <div className="min-h-screen bg-gray-50 font-['Montserrat',sans-serif]">
            <PageHeader
                title="Brasão, Hino e Bandeira"
                subtitle="Identidade, história e Símbolos Oficiais do Município"
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Símbolos Oficiais" }
                ]}
            />

            <div className="max-w-[1000px] mx-auto px-6 py-20 space-y-20">
                {/* Brasão */}
                <section className="bg-white rounded-[3rem] p-12 md:p-20 shadow-xl shadow-gray-200/50 border border-white flex flex-col md:flex-row items-center gap-12">
                    <div className="w-48 h-48 bg-gray-50 rounded-full flex justify-center items-center shrink-0 border-4 border-gray-100 overflow-hidden p-6 relative">
                        {/* Placeholder para a imagem real. Como não sei a URL exata do brasão, uso estilo elegante. */}
                        <div className="absolute inset-0 bg-[url('/brasao.png')] bg-contain bg-center bg-no-repeat opacity-90" />
                        <span className="text-xs text-gray-300 font-bold uppercase tracking-widest text-center">Brasão Oficial</span>
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-gray-800 mb-4 uppercase tracking-tighter">Brasão de Armas</h2>
                        <p className="text-gray-500 font-medium leading-relaxed">
                            O brasão de Lajes Pintadas é o símbolo que engloba as riquezas, a cultura e o desenvolvimento do nosso povo. Ele é utilizado exaustivamente em documentos oficiais, papelada timbrada, selos institucionais e prédios públicos como representação máxima do poder executivo municipal.
                        </p>
                    </div>
                </section>

                {/* Bandeira */}
                <section className="bg-white rounded-[3rem] p-12 md:p-20 shadow-xl shadow-gray-200/50 border border-white flex flex-col md:flex-row-reverse items-center gap-12">
                    <div className="w-full md:w-64 h-40 bg-gray-50 rounded-2xl flex justify-center items-center shrink-0 border border-gray-100 overflow-hidden p-4 relative shadow-sm">
                        <div className="absolute inset-0 bg-[url('/bandeira.png')] bg-cover bg-center opacity-90" />
                        <span className="text-xs text-gray-300 font-bold uppercase tracking-widest">Bandeira Municipal</span>
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-gray-800 mb-4 uppercase tracking-tighter">Bandeira Municipal</h2>
                        <p className="text-gray-500 font-medium leading-relaxed mb-6">
                            A bandeira de Lajes Pintadas remete ao orgulho cívico e é hasteada em repartições públicas, escolas e cerimônias oficiais. Suas cores e geometria honram os fundadores da cidade e as características geográficas da região.
                        </p>
                    </div>
                </section>

                {/* Hino */}
                <section className="bg-white rounded-[3rem] p-12 md:p-20 shadow-xl shadow-gray-200/50 border border-white">
                    <h2 className="text-3xl font-black text-gray-800 mb-10 uppercase tracking-tighter text-center">Hino de Lajes Pintadas</h2>
                    <div className="bg-blue-50/50 rounded-3xl p-10 font-medium text-gray-600 text-center leading-loose border border-blue-100 italic space-y-6">
                        <p>
                            (Letra e música: Arquivo Histórico Municipal)<br/>
                        </p>
                        <p>
                            O arquivo da letra do Hino Municipal está em processo de estruturação para versão digital nesta página.
                            <br/>
                            O hino é cantado em cerimônias de emancipação política, escolas e desfiles cívicos.
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
}
