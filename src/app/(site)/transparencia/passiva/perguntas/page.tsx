"use client";
import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { HelpCircle, ChevronDown, ChevronUp, Landmark, Info, MessageCircle, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
    {
        pergunta: "O que é a Lei de Acesso à Informação (LAI)?",
        resposta: "A Lei nº 12.527/2011, conhecida como Lei de Acesso à Informação (LAI), regulamenta o direito constitucional de acesso dos cidadãos às informações públicas e é aplicável aos três Poderes da União, dos Estados, do Distrito Federal e dos Municípios. Ela estabelece que a transparência é a regra e o sigilo é a exceção."
    },
    {
        pergunta: "Quem pode solicitar informações?",
        resposta: "Qualquer pessoa, física ou jurídica, pode encaminhar pedidos de acesso a informações públicas para órgãos e entidades, sem necessidade de apresentar motivo para o pedido, bastando apenas a identificação do requerente."
    },
    {
        pergunta: "Há algum custo para solicitar informações?",
        resposta: "O serviço de busca e o fornecimento da informação são gratuitos, salvo nas hipóteses de reprodução de documentos pela unidade, quando poderá ser cobrado o valor correspondente ao custo dos serviços e dos materiais utilizados (como fotocópias ou mídias digitais)."
    },
    {
        pergunta: "Qual o prazo para resposta?",
        resposta: "O órgão deve autorizar ou conceder o acesso imediato à informação disponível. Não sendo possível, o órgão tem o prazo de até 20 (vinte) dias para responder, prazo este que poderá ser prorrogado por mais 10 (dez) dias, mediante justificativa expressa ao requerente."
    },
    {
        pergunta: "O que fazer em caso de negativa de acesso?",
        resposta: "No caso de negativa de acesso à informação ou de não fornecimento das razões da negativa do acesso, o requerente poderá apresentar recurso no prazo de 10 (dez) dias, a contar da sua ciência. O recurso será dirigido à autoridade hierarquicamente superior à que proferiu a decisão."
    },
    {
        pergunta: "O que é o e-SIC?",
        resposta: "O e-SIC (Sistema Eletrônico do Serviço de Informações ao Cidadão) é a ferramenta que permite que qualquer pessoa encaminhe pedidos de acesso a informação de forma online, acompanhe o prazo legal e receba a resposta da solicitação sem precisar se deslocar fisicamente à prefeitura."
    }
];

export default function SICPerguntasPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <div className="min-h-screen bg-[#f8fafc] font-['Montserrat',sans-serif]">
            <PageHeader
                title="Perguntas Frequentes (FAQ)"
                subtitle="Dúvidas comuns sobre o acesso à informação e funcionamento do e-SIC."
                variant="premium"
                icon={<HelpCircle />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Transparência Passiva", href: "/transparencia/passiva" },
                    { label: "Perguntas Frequentes" }
                ]}
            />

            <div className="max-w-[1000px] mx-auto px-6 py-20">
                <div className="text-center mb-16">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-3 bg-blue-50 text-blue-600 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-6"
                    >
                        <MessageCircle size={14} /> Dúvidas e Esclarecimentos
                    </motion.div>
                    <h2 className="text-4xl font-black text-gray-800 uppercase tracking-tighter mb-6">Como podemos ajudar?</h2>
                    <p className="text-gray-500 font-medium max-w-2xl mx-auto">
                        Confira abaixo as principais informações sobre como exercer seu direito de acesso à informação pública no município de Lajes Pintadas.
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, idx) => {
                        const isOpen = openIndex === idx;
                        return (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className={`bg-white rounded-[2rem] border overflow-hidden transition-all duration-300 ${isOpen ? 'border-blue-200 shadow-xl shadow-blue-900/5 ring-1 ring-blue-50' : 'border-gray-100 hover:border-blue-100 shadow-sm'}`}
                            >
                                <button 
                                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                                    className="w-full text-left p-8 flex items-center justify-between gap-6 group"
                                >
                                    <div className="flex items-center gap-6">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${isOpen ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-50 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500'}`}>
                                            <span className="font-black text-lg">{idx + 1}</span>
                                        </div>
                                        <h3 className={`font-bold transition-colors ${isOpen ? 'text-blue-900' : 'text-gray-700'}`}>
                                            {faq.pergunta}
                                        </h3>
                                    </div>
                                    <div className={`shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-600' : 'text-gray-300'}`}>
                                        <ChevronDown size={24} />
                                    </div>
                                </button>
                                
                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.div 
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                        >
                                            <div className="px-8 pb-10 pt-2 ml-[4.5rem]">
                                                <div className="h-px bg-gray-50 mb-6" />
                                                <p className="text-gray-500 leading-relaxed font-medium text-sm">
                                                    {faq.resposta}
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Banner de Ajuda Extra */}
                <div className="mt-24 p-12 bg-white rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/40 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full -mr-32 -mt-32 transition-transform group-hover:scale-125 duration-700" />
                    
                    <div className="relative flex flex-col md:flex-row items-center gap-10">
                        <div className="w-20 h-20 bg-blue-600 text-white rounded-[1.8rem] flex items-center justify-center shadow-xl shadow-blue-200">
                            <Info size={36} />
                        </div>
                        <div className="grow text-center md:text-left">
                            <h4 className="text-xl font-black text-gray-800 uppercase tracking-tighter mb-2">Ainda tem dúvidas?</h4>
                            <p className="text-gray-500 font-medium text-sm">
                                Se você não encontrou a resposta que procurava, entre em contato diretamente com o nosso SIC presencial ou utilize os canais digitais.
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <a href="/transparencia/passiva/institucional" className="bg-gray-50 text-gray-700 px-8 py-4 rounded-full font-black uppercase text-[10px] tracking-widest border border-gray-100 hover:bg-white hover:shadow-lg transition-all">
                                Contatos do SIC
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
