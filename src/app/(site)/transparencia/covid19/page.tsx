import type { Metadata } from "next";
import { FaVirus, FaHandsWash, FaHospital, FaMoneyBillWave, FaExternalLinkAlt, FaInfoCircle, FaCheckCircle, FaFilePdf } from "react-icons/fa";
import { Shield } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import BannerPNTP from "@/components/transparencia/BannerPNTP";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Covid-19 | Portal da Transparência – Prefeitura de Lajes Pintadas",
    description: "Transparência das ações, gastos e medidas adotadas durante a pandemia de Covid-19 em Lajes Pintadas/RN.",
};

const ACOES = [
    {
        setor: "Saúde",
        icone: FaHospital,
        cor: "from-red-500 to-rose-600",
        total: 384750.00,
        itens: [
            "Aquisição de EPIs e insumos hospitalares",
            "Contratação de profissionais de saúde",
            "Contratação de leitos para UTI e enfermaria",
            "Vacinas e equipamentos de saúde",
            "Serviços de higienização de espaços públicos",
        ],
    },
    {
        setor: "Assistência Social",
        icone: FaHandsWash,
        cor: "from-blue-500 to-indigo-600",
        total: 125000.00,
        itens: [
            "Distribuição de cestas básicas",
            "Auxílio emergencial (parceria federal)",
            "Kit de higiene e proteção para famílias vulneráveis",
            "Apoio a abrigos e albergues temporários",
        ],
    },
    {
        setor: "Educação",
        icone: FaCheckCircle,
        cor: "from-emerald-500 to-teal-600",
        total: 56800.00,
        itens: [
            "Distribuição de máscaras e álcool em gel nas escolas",
            "Merenda escolar emergencial durante suspensão de aulas",
            "Plataformas e recursos digitais para ensino remoto",
        ],
    },
];

function fmt(v: number) {
    return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const totalInvestido = ACOES.reduce((s, a) => s + a.total, 0);

const DECRETOS = [
    { numero: "Decreto nº 003/2020", descricao: "Declara situação de emergência em saúde pública no município.", data: "2020-03-18" },
    { numero: "Decreto nº 004/2020", descricao: "Suspende atividades presenciais de serviços não essenciais.", data: "2020-03-20" },
    { numero: "Decreto nº 012/2020", descricao: "Estabelece regras para funcionamento do comércio local.", data: "2020-05-05" },
    { numero: "Decreto nº 018/2021", descricao: "Define calendário de vacinação municipal – Programa Vacina Lajes.", data: "2021-02-15" },
];

export default function Covid19Page() {
    return (
        <div className="min-h-screen bg-[#f8fafc] font-['Montserrat',sans-serif]">
            <PageHeader
                title="Ações de Enfrentamento à Covid-19"
                subtitle="Transparência total sobre os recursos públicos aplicados e as medidas adotadas durante a pandemia no município de Lajes Pintadas."
                variant="premium"
                icon={<Shield />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Covid-19" }
                ]}
            />

            <div className="max-w-[1240px] mx-auto px-6 py-12">
                {/* Aviso */}
                <div className="bg-red-50 border border-red-200 rounded-[2rem] p-6 mb-10 flex items-start gap-4">
                    <FaInfoCircle className="text-red-500 mt-1 shrink-0" size={20} />
                    <div>
                        <p className="font-black text-red-800 text-sm uppercase tracking-wide mb-1">
                            Transparência Emergencial – LAI / LC 173/2020
                        </p>
                        <p className="text-red-700 text-sm font-medium leading-relaxed">
                            Em cumprimento à Lei Complementar nº 173/2020 e aos art. 3º e 4º da Lei 13.979/2020, 
                            o Município de Lajes Pintadas publica todas as contratações e gastos realizados durante 
                            o período de enfrentamento à pandemia de Covid-19. As informações permanecem disponíveis 
                            para consulta pública permanente.
                        </p>
                    </div>
                </div>

                {/* Total Investido */}
                <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-red-700 to-rose-800 p-12 mb-14 shadow-2xl shadow-red-900/20 text-white">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -mr-32 -mt-32" />
                    </div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                        <div className="w-20 h-20 bg-white/10 rounded-[2rem] border border-white/20 flex items-center justify-center shrink-0">
                            <FaVirus size={40} className="text-red-200" />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <div className="text-[9px] font-black text-red-200 uppercase tracking-widest mb-2">Total de Recursos Destinados ao Enfrentamento da Covid-19</div>
                            <div className="text-5xl font-black tracking-tighter mb-1">{fmt(totalInvestido)}</div>
                            <div className="text-red-200 text-sm font-medium">Período: 2020 – 2022 | Fonte: Orçamento Municipal e Transferências Federais</div>
                        </div>
                        <div className="text-center">
                            <div className="text-[9px] font-black text-red-200 uppercase tracking-widest mb-2">Áreas Atendidas</div>
                            <div className="text-5xl font-black">{ACOES.length}</div>
                            <div className="text-red-200 text-sm font-medium">Setores</div>
                        </div>
                    </div>
                </div>

                {/* Ações por Setor */}
                <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter mb-8 flex items-center gap-3">
                    <div className="w-8 h-1 bg-red-600 rounded-full" /> Ações por Setor
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {ACOES.map((acao, i) => (
                        <div key={i} className="group bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden hover:shadow-2xl transition-all duration-500">
                            <div className={`h-2 bg-gradient-to-r ${acao.cor}`} />
                            <div className="p-8">
                                <div className="flex items-start gap-4 mb-6">
                                    <div className={`w-12 h-12 bg-gradient-to-br ${acao.cor} text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform`}>
                                        <acao.icone size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-gray-800 uppercase tracking-tighter group-hover:text-red-600 transition-colors">{acao.setor}</h3>
                                        <div className="text-xl font-black text-red-600 mt-1">{fmt(acao.total)}</div>
                                    </div>
                                </div>
                                <ul className="space-y-2.5">
                                    {acao.itens.map((item, j) => (
                                        <li key={j} className="flex items-start gap-2.5 text-xs font-medium text-gray-500 leading-relaxed">
                                            <FaCheckCircle className="text-emerald-400 mt-0.5 shrink-0" size={11} />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Decretos Covid */}
                <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter mb-8 flex items-center gap-3">
                    <div className="w-8 h-1 bg-orange-500 rounded-full" /> Atos Normativos Emergenciais
                </h2>
                <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden mb-14">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    <th className="px-8 py-5">Ato Normativo</th>
                                    <th className="px-8 py-5">Descrição</th>
                                    <th className="px-8 py-5">Publicação</th>
                                    <th className="px-8 py-5 text-center">Acesso</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {DECRETOS.map((d, i) => (
                                    <tr key={i} className="hover:bg-red-50/20 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-red-50 text-red-500 rounded-xl flex items-center justify-center shrink-0">
                                                    <FaFilePdf size={12} />
                                                </div>
                                                <span className="font-black text-gray-800 text-sm group-hover:text-red-600 transition-colors">{d.numero}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-sm text-gray-500 font-medium max-w-xs">{d.descricao}</td>
                                        <td className="px-8 py-5 text-[10px] font-bold text-gray-400">
                                            {new Date(d.data).toLocaleDateString("pt-BR")}
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <button className="inline-flex items-center gap-1.5 text-red-500 hover:text-red-700 font-black text-[10px] uppercase tracking-widest transition-colors">
                                                <FaFilePdf size={10} /> Abrir
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Links Externos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                    <Link
                        href="https://www.gov.br/saude/pt-br/coronavirus"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm hover:shadow-xl hover:border-red-100 transition-all flex items-center gap-5"
                    >
                        <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-red-600 group-hover:text-white transition-all">
                            <FaExternalLinkAlt size={18} />
                        </div>
                        <div>
                            <h4 className="font-black text-gray-800 text-sm uppercase tracking-tight mb-1 group-hover:text-red-600 transition-colors">Ministério da Saúde – Covid-19</h4>
                            <p className="text-xs text-gray-400 font-medium">Painel nacional de vacinação e epidemiológico.</p>
                        </div>
                    </Link>
                    <Link
                        href="https://covid.saude.gov.br"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm hover:shadow-xl hover:border-red-100 transition-all flex items-center gap-5"
                    >
                        <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all">
                            <FaMoneyBillWave size={18} />
                        </div>
                        <div>
                            <h4 className="font-black text-gray-800 text-sm uppercase tracking-tight mb-1 group-hover:text-blue-600 transition-colors">Painel Covid-19 – Transparência</h4>
                            <p className="text-xs text-gray-400 font-medium">Acompanhe os gastos emergenciais em nível nacional.</p>
                        </div>
                    </Link>
                </div>

                <BannerPNTP />
            </div>
        </div>
    );
}
