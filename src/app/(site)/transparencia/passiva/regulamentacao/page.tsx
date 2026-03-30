import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { ScrollText, Gavel, FileText, ExternalLink, Scale, CheckCircle, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
    title: "Regulamentação do SIC | Portal da Transparência",
    description: "Conheça as leis e decretos que garantem a transparência e o acesso à informação no município.",
};

const leis = [
    {
        titulo: "Lei Federal nº 12.527 / 2011",
        alias: "Lei de Acesso à Informação (LAI)",
        desc: "Dispõe sobre os procedimentos a serem observados pela União, Estados, Municípios e Distrito Federal para garantir o acesso a informações previsto na Constituição Federal.",
        importancia: "É a norma fundamental que estabelece prazos, ritos e deveres de transparência para toda a administração pública.",
        link: "https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2011/lei/l12527.htm"
    },
    {
        titulo: "Constituição Federal de 1988",
        alias: "Artigo 5º, Inciso XXXIII",
        desc: "Estabelece que todos têm direito a receber dos órgãos públicos informações de seu interesse particular, ou de interesse coletivo ou geral.",
        importancia: "Garante o acesso à informação como um direito fundamental do cidadão brasileiro.",
        link: "https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm"
    },
    {
        titulo: "Lei Federal nº 13.460 / 2017",
        alias: "Código de Defesa do Usuário do Serviço Público",
        desc: "Dispõe sobre participação, proteção e defesa dos direitos do usuário dos serviços públicos da administração pública.",
        importancia: "Complementa a transparência ao focar na qualidade e no respeito ao cidadão usuário de serviços.",
        link: "http://www.planalto.gov.br/ccivil_03/_ato2015-2018/2017/lei/l13460.htm"
    },
    {
        titulo: "Lei Complementar nº 131 / 2009",
        alias: "Lei da Transparência",
        desc: "Acrescenta dispositivos à Lei de Responsabilidade Fiscal, a fim de determinar a disponibilização, em tempo real, de informações detalhadas sobre a execução orçamentária.",
        importancia: "Obrigou os municípios a criarem portais da transparência na internet.",
        link: "https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp131.htm"
    }
];

export default function SICRegulamentacaoPage() {
    return (
        <div className="min-h-screen bg-[#f8fafc] font-['Montserrat',sans-serif]">
            <PageHeader
                title="Regulamentação e Leis"
                subtitle="O arcabouço jurídico que sustenta o seu direito à transparência pública."
                variant="premium"
                icon={<ScrollText />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Transparência Passiva", href: "/transparencia/passiva" },
                    { label: "Regulamentação" }
                ]}
            />

            <div className="max-w-[1240px] mx-auto px-6 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    
                    {/* Intro / Contexto */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/40 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full -mr-12 -mt-12" />
                            
                            <div className="w-16 h-16 bg-blue-600 text-white rounded-3xl flex items-center justify-center mb-8 shadow-xl shadow-blue-200">
                                <Scale size={32} />
                            </div>

                            <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter mb-6 leading-tight">
                                Transparência <br /> como Regra.
                            </h2>
                            <p className="text-gray-500 font-medium text-sm leading-relaxed mb-8">
                                O acesso à informação é um direito humano fundamental e uma ferramenta essencial para o combate à corrupção e o fortalecimento da democracia.
                            </p>
                            <div className="pt-8 border-t border-gray-50 space-y-4">
                               <div className="flex items-center gap-3">
                                  <CheckCircle className="text-emerald-500" size={18} />
                                  <span className="text-xs font-bold text-gray-700">Publicidade é a regra</span>
                               </div>
                               <div className="flex items-center gap-3">
                                  <CheckCircle className="text-emerald-500" size={18} />
                                  <span className="text-xs font-bold text-gray-700">Sigilo é a exceção</span>
                               </div>
                               <div className="flex items-center gap-3">
                                  <CheckCircle className="text-emerald-500" size={18} />
                                  <span className="text-xs font-bold text-gray-700">Gratuidade do serviço</span>
                               </div>
                            </div>
                        </div>

                        <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white">
                             <div className="flex items-center gap-3 mb-4">
                                <Gavel size={18} className="text-blue-400" />
                                <h3 className="font-black uppercase text-[10px] tracking-widest text-blue-400">Poder de Império</h3>
                             </div>
                             <p className="text-xs text-gray-400 leading-relaxed font-medium">
                                Toda autoridade pública que descumprir as normas da LAI poderá ser responsabilizada por crime de improbidade administrativa.
                             </p>
                        </div>
                    </div>

                    {/* Listagem de Normas */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-10 h-1 bg-blue-600 rounded-full"></div>
                            <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter">Legislação Aplicável</h2>
                        </div>

                        {leis.map((lei, idx) => (
                            <section key={idx} className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-lg shadow-gray-200/40 relative group hover:shadow-2xl transition-all duration-500">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                                   <div>
                                       <h3 className="text-xl font-black text-gray-800 uppercase tracking-tighter mb-1">{lei.titulo}</h3>
                                       <p className="text-xs font-bold text-blue-600 uppercase tracking-[0.2em]">{lei.alias}</p>
                                   </div>
                                   <a 
                                      href={lei.link} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-2 bg-gray-50 text-gray-500 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest border border-gray-100 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm"
                                    >
                                       Ler Texto Integral <ExternalLink size={12} />
                                   </a>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-gray-50">
                                   <div>
                                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                         <FileText size={12} /> Descrição do Objeto
                                      </p>
                                      <p className="text-sm text-gray-500 font-medium leading-relaxed italic">
                                         "{lei.desc}"
                                      </p>
                                   </div>
                                   <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-50">
                                      <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-3">Impacto na Transparência</p>
                                      <p className="text-sm text-blue-900/70 font-bold leading-relaxed">
                                         {lei.importancia}
                                      </p>
                                   </div>
                                </div>
                            </section>
                        ))}

                        {/* Banner Rodapé Regulamentação */}
                        <div className="bg-blue-600 rounded-[3.5rem] p-12 text-white text-center relative overflow-hidden">
                             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                             <h4 className="text-2xl font-black uppercase tracking-tighter mb-4 relative z-10">Ficou com alguma dúvida jurídica?</h4>
                             <p className="text-blue-100/80 font-medium text-sm mb-10 relative z-10 max-w-xl mx-auto">
                                Nossos canais de atendimento estão preparados para orientar sobre os procedimentos legais de acesso à informação.
                             </p>
                             <div className="flex justify-center relative z-10">
                                <a href="/transparencia/passiva/perguntas" className="bg-white text-blue-600 px-10 py-4 rounded-full font-black uppercase text-xs tracking-widest hover:bg-blue-50 transition-all shadow-xl flex items-center gap-3">
                                   Ver Perguntas Frequentes <ArrowRight size={16} />
                                </a>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
