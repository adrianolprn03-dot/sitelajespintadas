import type { Metadata } from "next";
import { FaChartLine, FaFileAlt, FaInfoCircle, FaDownload, FaExternalLinkAlt } from "react-icons/fa";
import { BarChart3 } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import BannerPNTP from "@/components/transparencia/BannerPNTP";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Renúncias Fiscais | Portal da Transparência – Prefeitura de Lajes Pintadas",
    description: "Demonstrativo de renúncias de receitas, isenções fiscais e políticas de incentivo tributário do município.",
};

const CATEGORIAS = [
    {
        categoria: "Isenções Tributárias",
        itens: [
            { descricao: "Isenção de IPTU – Imóveis de entidades beneficentes", valorEstimado: 48500, baseLegal: "Lei 312/2018" },
            { descricao: "Isenção de ISS – Profissionais autônomos de baixa renda", valorEstimado: 22800, baseLegal: "LC 28/2017" },
            { descricao: "Isenção de ITBI – Programas habitacionais populares", valorEstimado: 15000, baseLegal: "Lei 298/2016" },
        ],
    },
    {
        categoria: "Reduções de Alíquotas",
        itens: [
            { descricao: "Redução de ISS – Microempreendedores Individuais (MEI)", valorEstimado: 31200, baseLocal: "LC Municipal 28/2017" },
            { descricao: "Desconto de IPTU – Pagamento à vista (5%)", valorEstimado: 18700, baseLocal: "Lei 312/2018" },
        ],
    },
    {
        categoria: "Anistias e Parcelamentos",
        itens: [
            { descricao: "Anistia de multas e juros – REFIS Municipal 2023", valorEstimado: 76400, baseLocal: "Lei 389/2023" },
        ],
    },
];

function fmt(v: number) {
    return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const allItens = CATEGORIAS.flatMap(c => c.itens);
const totalGeral = allItens.reduce((s, i) => s + i.valorEstimado, 0);

export default function RenunciasFiscaisPage() {
    return (
        <div className="min-h-screen bg-[#f8fafc] font-['Montserrat',sans-serif]">
            <PageHeader
                title="Renúncias de Receitas"
                subtitle="Demonstrativo de renúncias de receitas, isenções, reduções de alíquotas e parcelamentos especiais conforme art. 14 da LRF."
                variant="premium"
                icon={<BarChart3 />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Renúncias Fiscais" }
                ]}
            />

            <div className="max-w-[1240px] mx-auto px-6 py-12">
                {/* Base Legal */}
                <div className="bg-orange-50 border border-orange-100 rounded-[2rem] p-6 mb-10 flex items-start gap-4">
                    <FaInfoCircle className="text-orange-500 mt-1 shrink-0" size={20} />
                    <div>
                        <p className="font-black text-orange-800 text-sm uppercase tracking-wide mb-1">
                            Obrigação Legal – Art. 14 da LRF e PNTP 2025
                        </p>
                        <p className="text-orange-700 text-sm font-medium leading-relaxed">
                            A concessão ou ampliação de incentivo ou benefício de natureza tributária da qual decorra renúncia de receita 
                            deverá estar acompanhada de estimativa de impacto orçamentário-financeiro no exercício em que deva iniciar sua 
                            vigência e nos dois seguintes (art. 14, Lei de Responsabilidade Fiscal – LC 101/2000).
                        </p>
                    </div>
                </div>

                {/* Totalizadores */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-14">
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-orange-100/50 border-l-4 border-l-orange-500">
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Total de Renúncias</div>
                        <div className="text-2xl font-black text-orange-600">{fmt(totalGeral)}</div>
                        <div className="text-[10px] font-bold text-gray-400 mt-1">Exercício {new Date().getFullYear()}</div>
                    </div>
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-red-100/50 border-l-4 border-l-red-500">
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Categorias</div>
                        <div className="text-2xl font-black text-red-600">{CATEGORIAS.length}</div>
                        <div className="text-[10px] font-bold text-gray-400 mt-1">Tipos de renúncia</div>
                    </div>
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 border-l-4 border-l-gray-500">
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Registros</div>
                        <div className="text-2xl font-black text-gray-700">{allItens.length}</div>
                        <div className="text-[10px] font-bold text-gray-400 mt-1">Benefícios cadastrados</div>
                    </div>
                </div>

                {/* Tabela por Categoria */}
                <div className="space-y-8 mb-16">
                    {CATEGORIAS.map((cat, ci) => (
                        <div key={ci} className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
                            <div className="px-10 py-6 bg-orange-50/50 border-b border-orange-100/50 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <FaChartLine className="text-orange-500" size={18} />
                                    <h2 className="font-black text-gray-800 text-sm uppercase tracking-tighter">{cat.categoria}</h2>
                                </div>
                                <span className="text-[10px] font-black text-orange-600 bg-orange-100 px-4 py-1.5 rounded-full border border-orange-200">
                                    {fmt(cat.itens.reduce((s, i) => s + i.valorEstimado, 0))}
                                </span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-gray-50 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                            <th className="px-10 py-4">Descrição do Benefício</th>
                                            <th className="px-10 py-4">Base Legal</th>
                                            <th className="px-10 py-4 text-right">Valor Estimado de Renúncia</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {cat.itens.map((item, ii) => (
                                            <tr key={ii} className="hover:bg-orange-50/20 transition-colors group">
                                                <td className="px-10 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-2 h-2 bg-orange-400 rounded-full shrink-0" />
                                                        <span className="text-sm font-medium text-gray-700 group-hover:text-orange-700 transition-colors">
                                                            {item.descricao}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-5">
                                                    <span className="inline-flex items-center gap-1.5 text-[9px] font-mono font-black text-gray-500 bg-gray-50 border border-gray-100 px-3 py-1 rounded-lg">
                                                        <FaFileAlt size={9} className="text-gray-400" />
                                                        {item.baseLocal ?? item.baseLocal}
                                                    </span>
                                                </td>
                                                <td className="px-10 py-5 text-right">
                                                    <span className="font-black text-orange-600 text-sm">{fmt(item.valorEstimado)}</span>
                                                </td>
                                            </tr>
                                        ))}
                                        <tr className="bg-orange-50/30">
                                            <td colSpan={2} className="px-10 py-4 text-[10px] font-black text-orange-700 uppercase tracking-widest">
                                                Subtotal – {cat.categoria}
                                            </td>
                                            <td className="px-10 py-4 text-right font-black text-orange-600">
                                                {fmt(cat.itens.reduce((s, i) => s + i.valorEstimado, 0))}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Total Geral + Links */}
                <div className="bg-gradient-to-br from-orange-600 to-red-700 rounded-[2.5rem] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 mb-16 shadow-2xl shadow-orange-900/20">
                    <div>
                        <div className="text-[10px] font-black text-orange-200 uppercase tracking-widest mb-2">Total Geral de Renúncias de Receita</div>
                        <div className="text-5xl font-black tracking-tighter">{fmt(totalGeral)}</div>
                        <div className="text-orange-200 text-sm font-medium mt-2">Exercício Fiscal {new Date().getFullYear()}</div>
                    </div>
                    <div className="flex flex-col gap-3 w-full md:w-auto">
                        <Link
                            href="/transparencia/lrf"
                            className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-black uppercase text-[9px] tracking-widest py-4 px-8 rounded-2xl transition-all"
                        >
                            <FaExternalLinkAlt size={10} /> Ver Relatórios LRF
                        </Link>
                        <button className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-black uppercase text-[9px] tracking-widest py-4 px-8 rounded-2xl transition-all">
                            <FaDownload size={10} /> Exportar Relatório
                        </button>
                    </div>
                </div>

                <BannerPNTP />
            </div>
        </div>
    );
}
