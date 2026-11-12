"use client";

import { useState } from "react";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { 
    FaCalendarAlt, FaFilePdf, FaFileExcel, FaFileCsv, FaShieldAlt, 
    FaCheckCircle, FaExclamationTriangle, FaExternalLinkAlt, FaBalanceScale,
    FaStamp, FaDownload, FaPrint
} from "react-icons/fa";
import { FaPlane, FaBuildingColumns, FaCheck } from "react-icons/fa6";
import { HISTORICO_DIARIAS, HistoricoTabelaDiaria } from "@/lib/diarias-historico";
import { exportToCSV, exportToJSON, exportToPDF, exportToXLSX } from "@/lib/exportUtils";
import { MUNICIPIO } from "@/config/municipio";

export default function TabelaDiariasPage() {
    const [anoSelecionado, setAnoSelecionado] = useState<number>(2026);
    const [abaAtiva, setAbaAtiva] = useState<"tabela" | "declaracao">("tabela");

    const registroAtual = HISTORICO_DIARIAS.find((h) => h.ano === anoSelecionado) || HISTORICO_DIARIAS[0];

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(val);
    };

    const handleExport = (format: "pdf" | "csv" | "json" | "xlsx") => {
        const payload = registroAtual.valores.map((v) => ({
            "Exercício": registroAtual.ano,
            "Cargo / Função": v.cargo,
            "Natal / Caicó / Mossoró": formatCurrency(v.estadual),
            "Demais Municípios (RN)": formatCurrency(v.interior),
            "Outros Estados": formatCurrency(v.outrosEstados),
            "Brasília / DF": formatCurrency(v.brasilia),
            "Exterior / Internacional": v.internacional,
            "Base Legal": registroAtual.normaLegal,
        }));

        const filename = `tabela_diarias_${registroAtual.ano}_lajes_pintadas`;
        const title = `Tabela de Valores de Diárias – Exercício ${registroAtual.ano} – ${MUNICIPIO.nome}/${MUNICIPIO.uf}`;

        if (format === "csv") exportToCSV(payload, filename);
        else if (format === "json") exportToJSON(payload, filename);
        else if (format === "xlsx") exportToXLSX(payload, filename);
        else exportToPDF(payload, filename, title);
    };

    return (
        <div className="min-h-screen bg-[#F5F7FA] font-['Montserrat',sans-serif]">
            <PageHeader
                title="Tabela de Valores de Diárias"
                subtitle="Valores fixados por cargo e destino, legislação regulamentadora e histórico de exercícios anteriores (2021 a 2026)."
                icon={<FaPlane />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Tabela de Diárias" }
                ]}
            />

            {/* Sub-header de Destaque PNTP */}
            <div className="bg-white border-b border-[#DDE3EA] py-3.5 px-4 sm:px-6 shadow-xs">
                <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 font-bold text-[#12304A]">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Critério 7.2 – Cartilha PNTP 2026 (ATRICON)</span>
                        <span className="hidden sm:inline text-[#5B738B]">· Histórico Integral de 2021 a 2026</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            href="/transparencia/diarias"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F5F7FA] hover:bg-slate-200 text-[#1254A3] rounded-lg font-bold transition-colors"
                        >
                            <span>Consultar Diárias Pagas</span>
                            <FaExternalLinkAlt size={10} />
                        </Link>
                        <Link
                            href="/transparencia/regulamentacao-diarias"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#1254A3] rounded-lg font-bold transition-colors"
                        >
                            <FaBalanceScale size={12} />
                            <span>Regulamentação</span>
                        </Link>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
                
                {/* 1. SELETOR DE ANOS (2021 a 2026) */}
                <div className="bg-white rounded-2xl border border-[#DDE3EA] p-4 sm:p-5 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#5B738B]">
                                Histórico de Vigência por Exercício
                            </div>
                            <div className="text-base sm:text-lg font-black text-[#12304A]">
                                Selecione o ano para consultar a tabela e declarações
                            </div>
                        </div>

                        {/* Botões dos Anos */}
                        <div className="flex flex-wrap items-center gap-2">
                            {HISTORICO_DIARIAS.map((h) => {
                                const isSelected = h.ano === anoSelecionado;
                                return (
                                    <button
                                        key={h.ano}
                                        onClick={() => setAnoSelecionado(h.ano)}
                                        className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                                            isSelected
                                                ? "bg-[#1254A3] text-white shadow-sm ring-2 ring-[#1254A3]/20"
                                                : "bg-[#F5F7FA] text-[#12304A] hover:bg-slate-200 border border-[#DDE3EA]"
                                        }`}
                                    >
                                        <FaCalendarAlt size={11} className={isSelected ? "text-[#F39A32]" : "text-slate-400"} />
                                        <span>{h.ano}</span>
                                        {h.vigente && (
                                            <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-[#F39A32] text-[#12304A]">
                                                VIGENTE
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* 2. CARD DE NORMA REGULAMENTADORA DO ANO */}
                <div className="bg-white rounded-2xl border border-[#DDE3EA] p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-50 text-[#1254A3] border border-blue-100">
                                Legislação do Exercício {registroAtual.ano}
                            </span>
                            <span className="text-xs text-[#5B738B]">Publicado em: {registroAtual.dataPublicacaoNorma}</span>
                        </div>
                        <h3 className="text-base sm:text-lg font-black text-[#12304A]">
                            {registroAtual.normaLegal}
                        </h3>
                        <p className="text-xs text-[#5B738B] max-w-2xl">
                            {registroAtual.ementaNorma}
                        </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <Link
                            href={registroAtual.linkNorma}
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1254A3] hover:bg-[#0d4282] text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                        >
                            <FaBalanceScale size={13} />
                            <span>Ver Ato na Legislação</span>
                        </Link>
                    </div>
                </div>

                {/* 3. DECLARAÇÃO OFICIAL DE NÃO REGULAMENTAÇÃO PARA O EXTERIOR */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-6 shadow-sm">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                                <FaStamp size={22} />
                            </div>
                            <div className="space-y-1.5">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-200 text-amber-900 font-bold">
                                        Declaração Formal de Não Ocorrência & Inexistência de Norma
                                    </span>
                                    <span className="text-xs font-bold text-amber-800">
                                        Protocolo: {registroAtual.declaracaoNaoRegulamentacao.protocolo}
                                    </span>
                                </div>
                                <h4 className="text-base font-black text-[#12304A]">
                                    {registroAtual.declaracaoNaoRegulamentacao.titulo}
                                </h4>
                                <p className="text-xs text-amber-900 leading-relaxed font-medium">
                                    {registroAtual.declaracaoNaoRegulamentacao.texto}
                                </p>
                                <p className="text-xs text-amber-950 font-bold leading-relaxed pt-1">
                                    {registroAtual.declaracaoNaoRegulamentacao.declaracaoNaoOcorrencia}
                                </p>
                                <div className="text-[11px] text-[#5B738B] pt-2 flex flex-wrap items-center gap-3">
                                    <span><strong>Órgão Emissor:</strong> {registroAtual.declaracaoNaoRegulamentacao.orgaoEmissor}</span>
                                    <span>·</span>
                                    <span><strong>Responsável:</strong> {registroAtual.declaracaoNaoRegulamentacao.responsavel} ({registroAtual.declaracaoNaoRegulamentacao.cargoResponsavel})</span>
                                    <span>·</span>
                                    <span><strong>Data de Emissão:</strong> {registroAtual.declaracaoNaoRegulamentacao.dataEmissao}</span>
                                </div>
                            </div>
                        </div>

                        <div className="shrink-0 flex lg:flex-col gap-2">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-black border border-emerald-200 self-start">
                                <FaCheckCircle size={13} className="text-emerald-600" />
                                {registroAtual.declaracaoNaoRegulamentacao.status}
                            </span>
                        </div>
                    </div>
                </div>

                {/* 4. BARRA DE FERRAMENTAS E EXPORTAÇÃO */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#5B738B]">
                            Exibindo valores para o exercício de <strong>{registroAtual.ano}</strong> ({registroAtual.valores.length} categorias de cargos)
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#5B738B] mr-1 hidden sm:inline">Exportar Tabela:</span>
                        <button
                            onClick={() => handleExport("pdf")}
                            className="p-2.5 bg-white hover:bg-red-50 text-red-600 border border-[#DDE3EA] rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                            title="Exportar PDF Oficial"
                        >
                            <FaFilePdf size={13} />
                            <span>PDF</span>
                        </button>
                        <button
                            onClick={() => handleExport("xlsx")}
                            className="p-2.5 bg-white hover:bg-emerald-50 text-emerald-600 border border-[#DDE3EA] rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                            title="Exportar Planilha Excel"
                        >
                            <FaFileExcel size={13} />
                            <span>Excel</span>
                        </button>
                        <button
                            onClick={() => handleExport("csv")}
                            className="p-2.5 bg-white hover:bg-blue-50 text-blue-600 border border-[#DDE3EA] rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                            title="Exportar Dados CSV"
                        >
                            <FaFileCsv size={13} />
                            <span>CSV</span>
                        </button>
                    </div>
                </div>

                {/* 5. TABELA ESTRUTURADA DE VALORES FIXADOS */}
                <div className="bg-white rounded-2xl border border-[#DDE3EA] shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                            <thead>
                                <tr className="bg-[#1254A3] text-white font-extrabold uppercase tracking-wider text-[11px]">
                                    <th className="py-4 px-4 sm:px-6">Cargo ou Função</th>
                                    <th className="py-4 px-3 sm:px-4 text-center">Natal, Caicó ou Mossoró</th>
                                    <th className="py-4 px-3 sm:px-4 text-center">Demais Cidades (RN)</th>
                                    <th className="py-4 px-3 sm:px-4 text-center">Outros Estados</th>
                                    <th className="py-4 px-3 sm:px-4 text-center">Brasília / DF</th>
                                    <th className="py-4 px-3 sm:px-4 text-center bg-[#0d4282]">Exterior / Internacional</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#DDE3EA]">
                                {registroAtual.valores.map((v, idx) => (
                                    <tr 
                                        key={v.cargo} 
                                        className={`hover:bg-blue-50/50 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-[#F8FAFC]"}`}
                                    >
                                        <td className="py-3.5 px-4 sm:px-6 font-bold text-[#12304A]">
                                            {v.cargo}
                                        </td>
                                        <td className="py-3.5 px-3 sm:px-4 text-center font-bold text-[#1254A3]">
                                            {formatCurrency(v.estadual)}
                                        </td>
                                        <td className="py-3.5 px-3 sm:px-4 text-center font-semibold text-[#12304A]">
                                            {formatCurrency(v.interior)}
                                        </td>
                                        <td className="py-3.5 px-3 sm:px-4 text-center font-semibold text-[#12304A]">
                                            {formatCurrency(v.outrosEstados)}
                                        </td>
                                        <td className="py-3.5 px-3 sm:px-4 text-center font-black text-emerald-700 bg-emerald-50/40">
                                            {formatCurrency(v.brasilia)}
                                        </td>
                                        <td className="py-3.5 px-3 sm:px-4 text-center text-[10px] font-bold text-amber-800 bg-amber-50/50">
                                            <span className="inline-block px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
                                                {v.internacional}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 6. NOTAS DE AUDITORIA E CONTROLE INTERNO */}
                <div className="bg-white rounded-2xl border border-[#DDE3EA] p-6 shadow-sm space-y-4">
                    <h4 className="text-sm font-black text-[#12304A] uppercase tracking-wider flex items-center gap-2">
                        <FaBuildingColumns className="text-[#1254A3]" /> Notas Explicativas e Regras de Concessão
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[#5B738B] leading-relaxed">
                        <div className="space-y-2">
                            <p>
                                • <strong>Finalidade:</strong> A concessão de diárias destina-se a indenizar o servidor pelas despesas extraordinárias com alimentação, pousada e locomoção urbana fora da comarca de lotação.
                            </p>
                            <p>
                                • <strong>Pernoite:</strong> A diária é devida pela metade (50%) quando o deslocamento não exigir pernoite fora da sede do município.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <p>
                                • <strong>Prestação de Contas:</strong> É obrigatória a apresentação do relatório de viagem com comprovantes de participação/despesas no prazo máximo de 5 dias úteis após o retorno.
                            </p>
                            <p>
                                • <strong>Viagens Internacionais:</strong> Reafirma-se formalmente que até o momento não há previsão legal nem ocorrência de viagens internacionais com custeio público.
                            </p>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}
