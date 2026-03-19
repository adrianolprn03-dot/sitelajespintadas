import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { FaUserTie, FaUsers, FaBuilding } from "react-icons/fa";

export const metadata: Metadata = {
    title: "Estrutura Administrativa (Organograma) | Lajes Pintadas – RN",
    description: "Conheça o organograma e a estrutura de governança da Prefeitura Municipal de Lajes Pintadas.",
};

const secretarias = [
    { nome: "Gabinete do Prefeito", icone: <FaBuilding /> },
    { nome: "Administração e Planejamento", icone: <FaUsers /> },
    { nome: "Tributação, Finanças e Arrecadação", icone: <FaUsers /> },
    { nome: "Educação, Cultura e Desporto", icone: <FaUsers /> },
    { nome: "Saúde e Saneamento", icone: <FaUsers /> },
    { nome: "Trabalho, Habitação e Assistência Social", icone: <FaUsers /> },
    { nome: "Obras, Viação e Urbanismo", icone: <FaUsers /> },
    { nome: "Agricultura, Meio Ambiente e Recursos Hídricos", icone: <FaUsers /> },
];

export default function EstruturaPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <PageHeader
                title="Estrutura Administrativa"
                subtitle="Organograma hierárquico e distribuição das pastas que compõem a gestão do município."
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "O Município", href: "/a-prefeitura" },
                    { label: "Estrutura Administrativa" }
                ]}
            />

            <div className="max-w-[1000px] mx-auto px-6 py-16">
                
                {/* Chefe do Executivo */}
                <div className="flex flex-col items-center mb-12">
                    <div className="bg-gradient-to-b from-[#0088b9] to-[#006b94] text-white rounded-2xl p-8 shadow-xl w-full max-w-sm text-center relative border-b-4 border-[#FDB913]">
                        <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white/20">
                            <FaUserTie size={36} className="text-white" />
                        </div>
                        <h2 className="text-2xl font-black uppercase tracking-widest mb-1">Prefeito Municipal</h2>
                        <p className="text-blue-100 font-medium text-sm">Chefe do Poder Executivo</p>
                    </div>

                    {/* Linha Vertical Conectora */}
                    <div className="w-1 h-12 bg-gray-300 rounded-full"></div>
                    
                    {/* Vice Prefeito e Procuradoria */}
                    <div className="flex flex-col md:flex-row gap-6 md:gap-16 items-center lg:items-start w-full justify-center">
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 w-full max-w-[280px] text-center relative">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-gray-200 rounded-full border-4 border-gray-50 flex items-center justify-center"></div>
                            <h3 className="text-[#0088b9] font-bold uppercase tracking-wider mb-1">Vice-Prefeito</h3>
                            <p className="text-sm text-gray-500">Apoio ao Executivo</p>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 w-full max-w-[280px] text-center relative">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-gray-200 rounded-full border-4 border-gray-50 flex items-center justify-center"></div>
                            <h3 className="text-[#0088b9] font-bold uppercase tracking-wider mb-1">Procuradoria Geral</h3>
                            <p className="text-sm text-gray-500">Assessoria Jurídica</p>
                        </div>
                    </div>
                    
                    <div className="w-1 h-16 bg-gray-300 rounded-full"></div>
                    <div className="w-full h-1 bg-gray-300 rounded-full md:max-w-2xl relative">
                        <div className="absolute left-1/2 -top-1 w-3 h-3 bg-gray-400 rounded-full -translate-x-1/2"></div>
                    </div>
                </div>

                {/* Secretarias */}
                <div className="mt-12">
                    <h3 className="text-center font-black text-2xl text-gray-800 mb-10 w-full relative after:content-[''] after:block after:w-16 after:h-1 after:bg-[#FDB913] after:mx-auto after:mt-3">
                        Secretarias Municipais
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {secretarias.map((sec, i) => (
                            <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:-translate-y-1 transition-transform group flex items-start gap-4">
                                <div className="p-3 bg-blue-50 text-blue-500 rounded-lg group-hover:bg-[#01b0ef] group-hover:text-white transition-colors shrink-0">
                                    {sec.icone}
                                </div>
                                <h4 className="font-bold text-gray-700 text-sm leading-tight flex-1">
                                    {sec.nome}
                                </h4>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Aviso Final */}
                <div className="mt-16 text-center">
                    <a href="/secretarias" className="inline-flex py-3 px-8 bg-gray-800 text-white rounded-full font-bold uppercase tracking-wider text-xs hover:bg-gray-900 transition-colors shadow-lg">
                        Ver Lista de Contatos dos Secretários
                    </a>
                </div>

            </div>
        </div>
    );
}
