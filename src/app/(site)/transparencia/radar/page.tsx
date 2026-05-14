import type { Metadata } from "next";
import { FaChartBar, FaExternalLinkAlt, FaShieldAlt, FaCheckCircle, FaStar, FaInfoCircle, FaArrowRight } from "react-icons/fa";
import { Activity } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import BannerPNTP from "@/components/transparencia/BannerPNTP";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Radar da Transparência | Portal da Transparência – Prefeitura de Lajes Pintadas",
    description: "Informações sobre a avaliação do município no Radar Nacional de Transparência Pública (ATRICON/PNTP).",
};

const DIMENSOES = [
    {
        nome: "Transparência de Receitas e Despesas",
        descricao: "Publicação de receitas, despesas, empenhos, liquidações e pagamentos em tempo real.",
        criterios: ["Receitas por categoria", "Despesas por secretaria", "Fornecedor identificado", "Exportação em formato aberto"],
        cor: "from-emerald-500 to-teal-600",
    },
    {
        nome: "Licitações e Contratos",
        descricao: "Acesso a editais, resultados, contratos e aditivos de forma padronizada.",
        criterios: ["Editais publicados", "Resultado de julgamento", "Contratos vigentes", "Dispensa e inexigibilidade"],
        cor: "from-blue-500 to-indigo-600",
    },
    {
        nome: "Servidores e Folha de Pagamento",
        descricao: "Divulgação da relação de servidores, cargos e remunerações individualizadas.",
        criterios: ["Nome e cargo", "Remuneração bruta", "Estagiários e terceirizados", "Agentes políticos"],
        cor: "from-purple-500 to-violet-600",
    },
    {
        nome: "Acesso à Informação (LAI / e-SIC)",
        descricao: "Canal de solicitação de informações, prazos de resposta e estatísticas.",
        criterios: ["Formulário eletrônico", "Protocolo automático", "Prazo legal 20 dias", "Relatório estatístico anual"],
        cor: "from-amber-500 to-orange-600",
    },
    {
        nome: "Instrumentos de Planejamento",
        descricao: "Publicação do PPA, LDO e LOA de forma completa e acessível.",
        criterios: ["PPA vigente", "LDO vigente", "LOA aprovada", "Relatórios RREO e RGF"],
        cor: "from-rose-500 to-pink-600",
    },
    {
        nome: "Acessibilidade e Usabilidade",
        descricao: "Portal adaptado para todos os cidadãos, incluindo pessoas com deficiência.",
        criterios: ["WCAG 2.1 AA", "Alto contraste", "Libras / acessibilidade", "Responsivo mobile"],
        cor: "from-slate-600 to-gray-800",
    },
];

export default function RadarPage() {
    return (
        <div className="min-h-screen bg-[#f8fafc] font-['Montserrat',sans-serif]">
            <PageHeader
                title="Radar da Transparência Pública"
                subtitle="Acompanhe a avaliação do município no Radar Nacional de Transparência Pública – PNTP 2026 (ATRICON/TCU)."
                variant="premium"
                icon={<Activity />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Radar da Transparência" }
                ]}
            />

            <div className="max-w-[1240px] mx-auto px-6 py-12">
                {/* Banner Principal */}
                <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 p-12 md:p-16 mb-16 shadow-2xl">
                    <div className="absolute inset-0 opacity-5">
                        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
                        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl" />
                    </div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                        <div className="flex-1 text-white">
                            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest mb-6">
                                <FaStar className="text-amber-400" /> PNTP 2026 – Programa Nacional de Transparência Pública
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase mb-4">
                                Avaliação de Conformidade Municipal
                            </h2>
                            <p className="text-blue-100/80 font-medium leading-relaxed mb-8 max-w-xl">
                                O Radar Nacional de Transparência Pública (PNTP) avalia periodicamente municípios brasileiros quanto ao 
                                cumprimento das obrigações de transparência ativa, estabelecidas pela LAI, LRF, LC 131/2009 e 
                                demais normas federais. Nosso município está comprometido em alcançar a <strong className="text-white">Faixa Ouro</strong>.
                            </p>
                            <Link
                                href="https://radardatransparencia.atricon.org.br"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-3 bg-white text-blue-800 px-8 py-4 rounded-[2rem] font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all shadow-xl"
                            >
                                Acessar Radar ATRICON <FaExternalLinkAlt size={12} />
                            </Link>
                        </div>
                        <div className="flex-shrink-0 text-center">
                            <div className="w-48 h-48 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex flex-col items-center justify-center">
                                <FaShieldAlt className="text-amber-400 mb-2" size={40} />
                                <div className="text-[9px] font-black text-blue-200 uppercase tracking-widest">Meta</div>
                                <div className="text-5xl font-black text-white tracking-tighter">OURO</div>
                                <div className="text-[9px] font-black text-blue-300 uppercase tracking-widest">PNTP 2026</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Aviso */}
                <div className="bg-amber-50 border border-amber-200 rounded-[2rem] p-6 mb-12 flex items-start gap-4">
                    <FaInfoCircle className="text-amber-500 mt-1 shrink-0" size={18} />
                    <p className="text-amber-700 text-sm font-medium">
                        A avaliação completa e oficial do município é realizada periodicamente pelos técnicos da ATRICON e TCU por meio de 
                        robôs de verificação automática e análise manual. Acesse o link oficial para verificar a pontuação atual de Lajes Pintadas/RN.
                    </p>
                </div>

                {/* Dimensões */}
                <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter mb-8 flex items-center gap-3">
                    <div className="w-8 h-1 bg-blue-600 rounded-full" />
                    Dimensões Avaliadas pelo PNTP
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {DIMENSOES.map((dim, i) => (
                        <div key={i} className="group bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden hover:shadow-2xl transition-all duration-500">
                            <div className={`h-2 bg-gradient-to-r ${dim.cor}`} />
                            <div className="p-8">
                                <div className={`w-12 h-12 bg-gradient-to-br ${dim.cor} text-white rounded-2xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                                    <FaChartBar size={20} />
                                </div>
                                <h3 className="font-black text-gray-800 text-sm uppercase tracking-tighter mb-3 group-hover:text-blue-600 transition-colors">{dim.nome}</h3>
                                <p className="text-gray-500 text-xs font-medium leading-relaxed mb-5">{dim.descricao}</p>
                                <ul className="space-y-2">
                                    {dim.criterios.map((c, j) => (
                                        <li key={j} className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-wide">
                                            <FaCheckCircle className="text-emerald-400 shrink-0" size={11} /> {c}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-gray-100">
                        <h4 className="text-xl font-black text-gray-800 uppercase tracking-tighter mb-6 flex items-center gap-3">
                            <FaShieldAlt className="text-blue-600" /> Transparência Ativa
                        </h4>
                        <p className="text-gray-500 text-sm font-medium leading-relaxed mb-8">
                            Nossa transparência ativa é composta por informações publicadas espontaneamente, independentemente de solicitações. 
                            Buscamos superar os requisitos mínimos do PNTP 2026, facilitando o controle social.
                        </p>
                        <div className="space-y-4">
                            {["Atualização em tempo real", "Dados abertos (CSV/JSON)", "Linguagem acessível", "Navegação intuitiva"].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 text-xs font-bold text-gray-600 uppercase tracking-widest">
                                    <div className="w-5 h-5 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                                        <FaCheckCircle size={10} />
                                    </div>
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-gray-100">
                        <h4 className="text-xl font-black text-gray-800 uppercase tracking-tighter mb-6 flex items-center gap-3">
                            <FaInfoCircle className="text-indigo-600" /> Transparência Passiva (e-SIC)
                        </h4>
                        <p className="text-gray-500 text-sm font-medium leading-relaxed mb-8">
                            Através do Sistema Eletrônico do Serviço de Informações ao Cidadão (e-SIC), garantimos o direito constitucional 
                            de acesso à informação com protocolos rastreáveis e prazos rigorosos.
                        </p>
                        <div className="space-y-4">
                            {["Protocolo Automático", "Prazo de 20 + 10 dias", "Relatórios Estatísticos", "Recursos em 3 instâncias"].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 text-xs font-bold text-gray-600 uppercase tracking-widest">
                                    <div className="w-5 h-5 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center shrink-0">
                                        <FaCheckCircle size={10} />
                                    </div>
                                    {item}
                                </div>
                            ))}
                        </div>
                        <Link 
                            href="/transparencia/passiva"
                            className="mt-8 inline-flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:translate-x-2 transition-transform"
                        >
                            Acessar e-SIC <FaArrowRight />
                        </Link>
                    </div>
                </div>

                <BannerPNTP />
            </div>
        </div>
    );
}
