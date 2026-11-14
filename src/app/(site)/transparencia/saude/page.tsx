import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import {
    FaClock,
    FaCapsules,
    FaNotesMedical,
    FaArrowRight,
    FaHospitalAlt,
    FaHeartbeat,
    FaFileMedical,
    FaUsers,
} from "react-icons/fa";
import { prisma } from "@/lib/prisma";
import SaudeMedicamentosTable from "@/components/transparencia/SaudeMedicamentosTable";

export const metadata: Metadata = {
    title: "Saúde e Medicamentos | Portal da Transparência",
    description:
        "Relação Municipal de Medicamentos Essenciais (REMUME), disponibilidade atualizada e orientações para medicamentos básicos e de alto custo.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function SaudeTransparencyPage() {
    const medicamentosRaw = await prisma.medicamento.findMany({
        where: { ativo: true },
        orderBy: { nome: "asc" },
    });
    const medicamentos = JSON.parse(JSON.stringify(medicamentosRaw));

    return (
        <div className="min-h-screen bg-gray-50 font-['Montserrat',sans-serif]">
            <PageHeader
                title="Saúde e Medicamentos"
                subtitle="Consulta à relação e disponibilidade de medicamentos na rede SUS (REMUME) e orientações de obtenção."
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Saúde e Medicamentos" },
                ]}
            />

            <div className="max-w-[1240px] mx-auto px-6 py-16 space-y-8">
                {/* Hub Completo da Saúde Pública - PNTP 2026 (Itens 18.1 a 18.6) */}
                <section className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-5">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
                        <div>
                            <span className="text-[11px] font-black uppercase tracking-widest text-[#1254A3] block">
                                Cartilha PNTP 2026 • Dimensão 18 - Saúde Pública
                            </span>
                            <h2 className="text-xl font-black text-slate-900">
                                Acesso Direto a Todos os Critérios da Saúde Municipal
                            </h2>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        <Link
                            href="/transparencia/plano-saude"
                            className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-blue-50/60 hover:border-blue-300 transition space-y-2"
                        >
                            <div className="flex items-center justify-between text-[#1254A3]">
                                <FaFileMedical size={18} />
                                <span className="text-[10px] font-black bg-white px-2 py-0.5 rounded-full border border-blue-200">
                                    18.1
                                </span>
                            </div>
                            <h3 className="font-bold text-slate-900 text-sm">PMS, PAS e RAG</h3>
                            <p className="text-xs text-slate-500">
                                Plano Municipal de Saúde, Programação Anual e Relatório de Gestão.
                            </p>
                        </Link>

                        <Link
                            href="/transparencia/unidades-saude"
                            className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100/70 transition space-y-2"
                        >
                            <div className="flex items-center justify-between text-emerald-700">
                                <FaHospitalAlt size={18} />
                                <span className="text-[10px] font-black bg-white px-2 py-0.5 rounded-full border border-emerald-200">
                                    18.2
                                </span>
                            </div>
                            <h3 className="font-bold text-slate-900 text-sm">Unidades, Médicos e Horários</h3>
                            <p className="text-xs text-slate-600">
                                Serviços, especialidades, médicos, enfermeiros, locais e escalas.
                            </p>
                        </Link>

                        <Link
                            href="/transparencia/central-regulacao"
                            className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-rose-50/60 hover:border-rose-300 transition space-y-2"
                        >
                            <div className="flex items-center justify-between text-rose-600">
                                <FaHeartbeat size={18} />
                                <span className="text-[10px] font-black bg-white px-2 py-0.5 rounded-full border border-rose-200">
                                    18.3
                                </span>
                            </div>
                            <h3 className="font-bold text-slate-900 text-sm">Central de Regulação</h3>
                            <p className="text-xs text-slate-500">
                                Lista de espera para consultas especializadas, exames e cirurgias.
                            </p>
                        </Link>

                        <Link
                            href="/transparencia/medicamentos-sus"
                            className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-cyan-50/60 hover:border-cyan-300 transition space-y-2"
                        >
                            <div className="flex items-center justify-between text-cyan-700">
                                <FaCapsules size={18} />
                                <span className="text-[10px] font-black bg-white px-2 py-0.5 rounded-full border border-cyan-200">
                                    18.4 / 18.5
                                </span>
                            </div>
                            <h3 className="font-bold text-slate-900 text-sm">Medicamentos & Estoques</h3>
                            <p className="text-xs text-slate-500">
                                Lista REMUME, como obter alto custo (CEAF) e estoques públicos.
                            </p>
                        </Link>

                        <Link
                            href="/transparencia/conselhos"
                            className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-indigo-50/60 hover:border-indigo-300 transition space-y-2"
                        >
                            <div className="flex items-center justify-between text-indigo-700">
                                <FaUsers size={18} />
                                <span className="text-[10px] font-black bg-white px-2 py-0.5 rounded-full border border-indigo-200">
                                    18.6
                                </span>
                            </div>
                            <h3 className="font-bold text-slate-900 text-sm">Conselho de Saúde (CMS)</h3>
                            <p className="text-xs text-slate-500">
                                Composição, presidência, atas e funcionamento do Conselho Municipal.
                            </p>
                        </Link>
                    </div>
                </section>
                <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center shrink-0 shadow-lg">
                            <FaClock size={18} />
                        </div>
                        <div>
                            <h4 className="text-emerald-900 font-black uppercase text-xs tracking-tight mb-1">
                                Relação Oficial de Medicamentos do SUS (REMUME)
                            </h4>
                            <p className="text-emerald-700/80 text-sm font-medium">
                                Lista sincronizada com a Secretaria Municipal de Saúde abrangendo medicamentos da Atenção Básica (CBAF), Alto Custo (CEAF) e Estratégicos (CESAF).
                            </p>
                        </div>
                    </div>
                </div>

                {/* Guias Rápidos de Acesso (Básicos e Alto Custo) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Link
                        href="/transparencia/medicamentos-sus?aba=como-obter"
                        className="bg-white hover:bg-blue-50/40 border border-blue-100 rounded-3xl p-7 shadow-sm flex items-center justify-between gap-4 transition-all group"
                    >
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#003366] flex items-center justify-center shrink-0">
                                <FaCapsules size={20} />
                            </div>
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-[#003366]">
                                    Atenção Básica (CBAF / REMUME)
                                </span>
                                <h3 className="text-base font-black text-gray-900 uppercase tracking-tight mt-0.5">
                                    Como Obter Medicamentos Básicos
                                </h3>
                                <p className="text-xs text-gray-500 font-medium mt-1">
                                    Documentos exigidos, locais de retirada nas UBS / CAF e horários de dispensação gratuita.
                                </p>
                            </div>
                        </div>
                        <FaArrowRight className="text-[#003366] shrink-0 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <Link
                        href="/transparencia/medicamentos-sus?aba=especializado"
                        className="bg-white hover:bg-indigo-50/40 border border-indigo-100 rounded-3xl p-7 shadow-sm flex items-center justify-between gap-4 transition-all group"
                    >
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
                                <FaNotesMedical size={20} />
                            </div>
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-700">
                                    Componente Especializado (CEAF)
                                </span>
                                <h3 className="text-base font-black text-gray-900 uppercase tracking-tight mt-0.5">
                                    Medicamentos de Alto Custo (LME / PCDT)
                                </h3>
                                <p className="text-xs text-gray-500 font-medium mt-1">
                                    Passo a passo para abertura e renovação de processo via Secretaria de Saúde / UNICAT-SESAP.
                                </p>
                            </div>
                        </div>
                        <FaArrowRight className="text-indigo-700 shrink-0 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <SaudeMedicamentosTable medicamentos={medicamentos} />
            </div>
        </div>
    );
}
