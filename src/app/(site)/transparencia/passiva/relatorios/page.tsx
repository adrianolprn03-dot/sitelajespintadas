export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { prisma } from "@/lib/prisma";
import {
    FileText,
    Shield,
    ShieldOff,
    BarChart3,
    ChevronRight,
    FileSpreadsheet,
    CheckCircle2,
    XCircle,
} from "lucide-react";

export const metadata: Metadata = {
    title: "Relatórios e-SIC | Transparência Passiva",
    description:
        "Relatório anual estatístico, lista de documentos classificados em grau de sigilo e informações desclassificadas nos últimos 12 meses.",
};

export default async function SICRelatoriosPage() {
    let total = 0;
    let atendidos = 0;
    let indeferidos = 0;
    let comSigilo = 0;
    let desclassificados12m = 0;

    try {
        const ha12Meses = new Date();
        ha12Meses.setMonth(ha12Meses.getMonth() - 12);

        const [todosPedidos, totalComSigilo, totalDesclassificados] = await Promise.all([
            prisma.esic.findMany({
                where: { NOT: { protocolo: { startsWith: "CIDIC-" } } },
                select: { status: true, respondidoEm: true },
            }),
            prisma.esic.count({
                where: {
                    NOT: { grauSigilo: "Sem Sigilo" },
                    dataDesclassificacao: null,
                },
            }),
            prisma.esic.count({
                where: {
                    dataDesclassificacao: { gte: ha12Meses },
                },
            }),
        ]);

        const statusIndeferido = new Set(["indeferido", "negado", "rejeitado"]);
        const statusAtendido = new Set(["concluido", "encerrado", "deferido", "atendido"]);

        total = todosPedidos.length;
        indeferidos = todosPedidos.filter((p) =>
            statusIndeferido.has((p.status || "").trim().toLowerCase())
        ).length;
        atendidos = todosPedidos.filter((p) => {
            const st = (p.status || "").trim().toLowerCase();
            if (statusIndeferido.has(st)) return false;
            return statusAtendido.has(st) || p.respondidoEm !== null;
        }).length;

        comSigilo = totalComSigilo;
        desclassificados12m = totalDesclassificados;
    } catch {
        // Fallback seguro caso o banco esteja temporariamente inacessível
    }

    const opcoes = [
        {
            titulo: "Relatório Anual Estatístico (e-SIC)",
            desc: "Quantidade de pedidos de acesso recebidos, atendidos, indeferidos, tempo médio de resposta e informações genéricas sobre os solicitantes.",
            href: "/transparencia/passiva/relatorios/estatisticas",
            icon: BarChart3,
            color: "bg-blue-50 text-blue-700",
            count: `${total} pedidos`,
        },
        {
            titulo: "Lista de Documentos Classificados (Sigilo)",
            desc: "Documentos classificados nos graus Reservado, Secreto e Ultrassecreto, contendo assunto, categoria, dispositivo legal e respectivo prazo.",
            href: "/transparencia/passiva/relatorios/com-sigilo",
            icon: Shield,
            color: "bg-rose-50 text-rose-700",
            count: `${comSigilo} registros`,
        },
        {
            titulo: "Informações Desclassificadas (Últimos 12 Meses)",
            desc: "Divulgação das informações e documentos que foram desclassificados nos últimos 12 (doze) meses, ou declaração formal de não ocorrência.",
            href: "/transparencia/passiva/relatorios/sem-sigilo",
            icon: ShieldOff,
            color: "bg-emerald-50 text-emerald-700",
            count: `${desclassificados12m} últimos 12 meses`,
        },
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] font-['Montserrat',sans-serif]">
            <PageHeader
                title="Relatórios do Serviço de Informação (e-SIC)"
                subtitle="Relatório estatístico anual, rol de informações classificadas em grau de sigilo e lista de informações desclassificadas (Lei nº 12.527/2011 - Art. 30)."
                variant="premium"
                icon={<FileText />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Transparência Passiva", href: "/transparencia/passiva" },
                    { label: "Relatórios e-SIC" },
                ]}
            />

            <div className="max-w-[1240px] mx-auto px-6 py-16">
                {/* Resumo Numérico em Tempo Real */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-14">
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1">
                            Pedidos Recebidos
                        </span>
                        <span className="text-3xl font-black text-gray-900">{total}</span>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm text-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 flex items-center justify-center gap-1 mb-1">
                            <CheckCircle2 size={12} /> Atendidos
                        </span>
                        <span className="text-3xl font-black text-emerald-700">{atendidos}</span>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-rose-100 shadow-sm text-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-rose-600 flex items-center justify-center gap-1 mb-1">
                            <XCircle size={12} /> Indeferidos
                        </span>
                        <span className="text-3xl font-black text-rose-700">{indeferidos}</span>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-amber-100 shadow-sm text-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 block mb-1">
                            Com Sigilo Ativo
                        </span>
                        <span className="text-3xl font-black text-amber-700">{comSigilo}</span>
                    </div>
                    <div className="col-span-2 lg:col-span-1 bg-white p-6 rounded-3xl border border-blue-100 shadow-sm text-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#1254A3] block mb-1">
                            Desclassif. (12m)
                        </span>
                        <span className="text-3xl font-black text-[#1254A3]">{desclassificados12m}</span>
                    </div>
                </div>

                {/* Os 3 Relatórios Obrigatórios da LAI */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-14">
                    {opcoes.map((opt) => (
                        <Link
                            key={opt.titulo}
                            href={opt.href}
                            className="bg-white p-8 rounded-[2.25rem] border border-gray-100 shadow-lg shadow-gray-200/40 hover:border-blue-400 hover:-translate-y-1 transition-all group flex flex-col justify-between gap-6"
                        >
                            <div>
                                <div className="flex items-start justify-between gap-4 mb-6">
                                    <div
                                        className={`w-14 h-14 rounded-2xl ${opt.color} flex items-center justify-center group-hover:scale-105 transition-transform`}
                                    >
                                        <opt.icon size={28} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-gray-100 text-gray-600">
                                        {opt.count}
                                    </span>
                                </div>
                                <h2 className="text-xl font-black text-gray-800 tracking-tight mb-3 group-hover:text-[#1254A3] transition-colors">
                                    {opt.titulo}
                                </h2>
                                <p className="text-gray-500 font-medium text-sm leading-relaxed">
                                    {opt.desc}
                                </p>
                            </div>
                            <div className="inline-flex items-center gap-2 text-xs font-black uppercase text-[#1254A3] tracking-widest">
                                Consultar Relatório Completo{" "}
                                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Painel Consolidado e Dados Abertos */}
                <div className="bg-slate-900 rounded-[2.5rem] p-8 sm:p-12 text-white relative overflow-hidden">
                    <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                        <div className="max-w-2xl">
                            <div className="flex items-center gap-3 mb-4">
                                <FileSpreadsheet className="text-blue-400" size={24} />
                                <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">
                                    Lei nº 12.527/2011 • Art. 30 • Dados Abertos
                                </span>
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-black tracking-tight mb-3">
                                Exportação de Séries Históricas (2021–{new Date().getFullYear()})
                            </h3>
                            <p className="text-gray-400 text-sm font-medium leading-relaxed">
                                Todos os relatórios do e-SIC estão disponíveis para consulta online por exercício e exportação em formatos abertos e legíveis por máquina (PDF, XLSX, CSV e JSON).
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3 shrink-0">
                            <Link
                                href="/transparencia/passiva/relatorios/estatisticas"
                                className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-[#1254A3] hover:bg-blue-600 text-white font-black text-xs uppercase tracking-wider shadow-lg transition-all"
                            >
                                <BarChart3 size={16} /> Abrir Relatório Estatístico & Exportar
                            </Link>
                            <Link
                                href="/servicos/esic"
                                className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-black text-xs uppercase tracking-wider border border-white/10 transition-all"
                            >
                                Protocolar Pedido no e-SIC
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
