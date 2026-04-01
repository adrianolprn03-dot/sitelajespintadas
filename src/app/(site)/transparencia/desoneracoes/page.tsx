import type { Metadata } from "next";
import { FaPercentage, FaChartBar, FaInfoCircle, FaFileAlt, FaBuilding } from "react-icons/fa";
import { TrendingDown } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import BannerPNTP from "@/components/transparencia/BannerPNTP";

export const metadata: Metadata = {
    title: "Desonerações Fiscais | Portal da Transparência – Prefeitura de Lajes Pintadas",
    description: "Transparência sobre incentivos fiscais, isenções, anistias e outros benefícios tributários concedidos pelo município.",
};

const desonerações = [
    {
        tipo: "Isenção de IPTU",
        beneficiario: "Imóveis de Entidades Filantrópicas",
        fundamentoLegal: "Lei Municipal nº 312/2018, Art. 12",
        valorRenunciado: 48500.00,
        vigencia: "Anual – Renovável",
        beneficiadosCount: 23,
    },
    {
        tipo: "Redução de ISS",
        beneficiario: "Microempreendedores Individuais (MEI)",
        fundamentoLegal: "LC Municipal nº 028/2017, Art. 7º",
        valorRenunciado: 31200.00,
        vigencia: "Permanente",
        beneficiadosCount: 87,
    },
    {
        tipo: "Isenção de Taxas",
        beneficiario: "Associações Comunitárias e ONG's",
        fundamentoLegal: "Lei Municipal nº 356/2021, Art. 5º",
        valorRenunciado: 12800.00,
        vigencia: "Anual – Renovável",
        beneficiadosCount: 14,
    },
    {
        tipo: "Anistia de Multas e Juros",
        beneficiario: "Contribuintes em Débito – REFIS Municipal",
        fundamentoLegal: "Lei Municipal nº 389/2023",
        valorRenunciado: 76400.00,
        vigencia: "01/01/2023 a 31/12/2023",
        beneficiadosCount: 134,
    },
];

function fmt(v: number) {
    return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const totalRenunciado = desonerações.reduce((s, d) => s + d.valorRenunciado, 0);

export default function DesoneracoesPage() {
    return (
        <div className="min-h-screen bg-[#f8fafc] font-['Montserrat',sans-serif]">
            <PageHeader
                title="Desonerações e Incentivos Fiscais"
                subtitle="Transparência sobre isenções, anistias, reduções de alíquotas e demais renúncias tributárias concedidas pelo município."
                variant="premium"
                icon={<TrendingDown />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Desonerações Fiscais" }
                ]}
            />

            <div className="max-w-[1240px] mx-auto px-6 py-12">
                {/* Aviso Legal */}
                <div className="bg-teal-50 border border-teal-100 rounded-[2rem] p-6 mb-10 flex items-start gap-4">
                    <FaInfoCircle className="text-teal-500 mt-1 shrink-0" size={20} />
                    <div>
                        <p className="font-black text-teal-800 text-sm uppercase tracking-wide mb-1">Base Legal – LRF / LAI / PNTP</p>
                        <p className="text-teal-700 text-sm font-medium leading-relaxed">
                            A publicação das renúncias de receita é exigida pelo art. 14 da Lei de Responsabilidade Fiscal (LRF – LC 101/2000) 
                            e pelo art. 48, § 1º, inciso III da mesma lei. Toda renúncia de receita deve ser acompanhada de estimativa de impacto 
                            orçamentário-financeiro e medidas de compensação.
                        </p>
                    </div>
                </div>

                {/* Totalizadores */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-teal-100/50 border-l-4 border-l-teal-500">
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Total de Renúncia Estimada</div>
                        <div className="text-2xl font-black text-teal-600">{fmt(totalRenunciado)}</div>
                        <div className="text-[10px] font-bold text-gray-400 mt-2">Exercício {new Date().getFullYear()}</div>
                    </div>
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-blue-100/50 border-l-4 border-l-blue-500">
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Beneficiários Totais</div>
                        <div className="text-2xl font-black text-blue-600">{desonerações.reduce((s, d) => s + d.beneficiadosCount, 0)}</div>
                        <div className="text-[10px] font-bold text-gray-400 mt-2">Pessoas / Entidades</div>
                    </div>
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-purple-100/50 border-l-4 border-l-purple-500">
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Modalidades de Benefício</div>
                        <div className="text-2xl font-black text-purple-600">{desonerações.length}</div>
                        <div className="text-[10px] font-bold text-gray-400 mt-2">Tipos de desoneração</div>
                    </div>
                </div>

                {/* Tabela de Desonerações */}
                <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden mb-12">
                    <div className="px-10 py-8 border-b border-gray-100 flex items-center gap-3">
                        <FaPercentage className="text-teal-500" size={20} />
                        <h2 className="text-lg font-black text-gray-800 uppercase tracking-tighter">Relação de Benefícios Tributários</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    <th className="px-8 py-5">Tipo de Benefício</th>
                                    <th className="px-8 py-5">Beneficiários</th>
                                    <th className="px-8 py-5">Fundamento Legal</th>
                                    <th className="px-8 py-5">Vigência</th>
                                    <th className="px-8 py-5 text-right">Renúncia Estimada</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {desonerações.map((d, i) => (
                                    <tr key={i} className="hover:bg-teal-50/20 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center shrink-0">
                                                    <FaPercentage size={12} />
                                                </div>
                                                <span className="font-black text-gray-800 text-sm group-hover:text-teal-700 transition-colors">{d.tipo}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="text-sm text-gray-600 font-medium">{d.beneficiario}</div>
                                            <div className="text-[10px] font-bold text-gray-400 mt-1">{d.beneficiadosCount} beneficiados</div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-xl text-[10px] font-mono text-gray-700">
                                                <FaFileAlt size={10} className="text-gray-400" /> {d.fundamentoLegal}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-xs font-bold text-gray-500">{d.vigencia}</td>
                                        <td className="px-8 py-5 text-right">
                                            <span className="font-black text-teal-600 text-sm">{fmt(d.valorRenunciado)}</span>
                                        </td>
                                    </tr>
                                ))}
                                <tr className="bg-teal-50/50">
                                    <td colSpan={4} className="px-8 py-5 font-black text-teal-800 text-[10px] uppercase tracking-widest">Total de Renúncias</td>
                                    <td className="px-8 py-5 text-right font-black text-teal-700 text-lg">{fmt(totalRenunciado)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <BannerPNTP />
            </div>
        </div>
    );
}
