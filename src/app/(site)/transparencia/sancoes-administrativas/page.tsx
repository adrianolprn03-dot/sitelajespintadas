"use client";

import React, { useState, useEffect } from "react";
import PageHeader from "@/components/PageHeader";
import BannerPNTP from "@/components/transparencia/BannerPNTP";
import { 
    FaGavel, FaCheckCircle, FaFilePdf, FaExternalLinkAlt, 
    FaDownload, FaSearch, FaCalendar, FaShieldAlt, FaInfoCircle
} from "react-icons/fa";
import { exportToCSV, exportToJSON, exportToPDF, exportToXLSX } from "@/lib/exportUtils";
import { MUNICIPIO } from "@/config/municipio";

export default function SancoesAdministrativasPage() {
    const [ano, setAno] = useState("2026");
    const [busca, setBusca] = useState("");
    const [loading, setLoading] = useState(false);

    const handleExport = (format: "pdf" | "csv" | "json" | "xlsx") => {
        const payload = [
            {
                "Exercício": ano,
                "Município": MUNICIPIO.nomeCompleto,
                "CNPJ": MUNICIPIO.cnpj,
                "Situação": "SEM SANÇÕES APLICADAS VIGENTES",
                "Declaração": "Declaração de Inexistência de Sanções Administrativas Aplicadas a Fornecedores (Lei 14.133/21)",
                "Data": new Date().toLocaleDateString("pt-BR")
            }
        ];

        const filename = `declaracao_sancoes_${ano}_lajes_pintadas`;
        const title = `Declaração de Sanções Administrativas – Exercício ${ano} – Lajes Pintadas/RN (Critério PNTP)`;

        if (format === "csv") exportToCSV(payload, filename);
        else if (format === "json") exportToJSON(payload, filename);
        else if (format === "xlsx") exportToXLSX(payload, filename);
        else exportToPDF(payload, filename, title);
    };

    return (
        <div className="min-h-screen bg-[#F5F7FA]">
            <PageHeader
                title="Sanções Administrativas a Fornecedores"
                subtitle="Consulta pública de sanções administrativas, advertências, multas, impedimentos de licitar e declarações de inidoneidade aplicadas pela Administração Municipal (Art. 156 da Lei nº 14.133/2021 e Critério PNTP)."
                icon={<FaGavel />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Sanções Administrativas" }
                ]}
            />

            <main className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 space-y-8">
                {/* Ações e Exportações */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <label className="text-xs font-bold text-slate-600 uppercase">Exercício:</label>
                        <select
                            value={ano}
                            onChange={(e) => setAno(e.target.value)}
                            className="bg-white border border-[#DDE3EA] rounded-xl px-4 py-2 text-xs font-bold text-[#12304A] shadow-sm outline-none"
                        >
                            <option value="2026">2026</option>
                            <option value="2025">2025</option>
                            <option value="2024">2024</option>
                            <option value="2023">2023</option>
                            <option value="2022">2022</option>
                            <option value="2021">2021</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handleExport("pdf")}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#DDE3EA] text-[#12304A] rounded-lg text-xs font-bold hover:border-[#1254A3] transition-all shadow-sm cursor-pointer"
                        >
                            <FaDownload size={10} /> Exportar Declaração PDF
                        </button>
                        <button
                            onClick={() => handleExport("xlsx")}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#DDE3EA] text-[#12304A] rounded-lg text-xs font-bold hover:border-[#1254A3] transition-all shadow-sm cursor-pointer"
                        >
                            <FaDownload size={10} /> Excel
                        </button>
                    </div>
                </div>

                {/* Card Oficial de Declaração de Inexistência / Regularidade (Critério PNTP) */}
                <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#DDE3EA] shadow-sm space-y-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl shrink-0">
                                <FaCheckCircle />
                            </div>
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-0.5 rounded-full">
                                    Critério PNTP • Transparência Ativa
                                </span>
                                <h3 className="text-xl font-black text-[#12304A] mt-1">
                                    Declaração Oficial de Inexistência de Sanções Administrativas Vigentes
                                </h3>
                                <p className="text-xs text-[#5B738B] font-medium">
                                    {MUNICIPIO.nomeCompleto} • CNPJ {MUNICIPIO.cnpj} • Exercício {ano}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => handleExport("pdf")}
                            className="bg-[#1254A3] hover:bg-[#0d4282] text-white text-xs font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                        >
                            <FaFilePdf /> Baixar Certidão / Declaração
                        </button>
                    </div>

                    <div className="bg-[#F5F7FA] rounded-2xl p-6 border border-[#DDE3EA] space-y-4">
                        <p className="text-sm text-[#12304A] leading-relaxed font-medium">
                            A <strong>{MUNICIPIO.nomeCompleto}</strong>, no uso de suas atribuições legais e em cumprimento ao disposto no <strong>art. 156 da Lei Federal nº 14.133/2021 (Nova Lei de Licitações)</strong> e às diretrizes da <strong>Matriz de Fiscalização PNTP 2026 (Critério PNTP)</strong>, declara para os devidos fins de direito e controle público que:
                        </p>
                        <blockquote className="bg-white p-5 rounded-xl border-l-4 border-emerald-500 text-sm font-semibold text-slate-800 italic shadow-xs">
                            "No exercício de {ano}, não constam sanções administrativas vigentes (advertência, multa rescisória, impedimento de licitar ou contratar, ou declaração de inidoneidade) aplicadas pela Administração Direta a fornecedores, pessoas físicas ou jurídicas licitantes."
                        </blockquote>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
                            <div className="bg-white p-3.5 rounded-xl border border-[#DDE3EA]">
                                <span className="text-[10px] font-bold text-[#5B738B] uppercase block mb-0.5">Órgão Emissor:</span>
                                <span className="font-bold text-[#12304A]">Setor de Licitações e Contratos / Gabinete</span>
                            </div>
                            <div className="bg-white p-3.5 rounded-xl border border-[#DDE3EA]">
                                <span className="text-[10px] font-bold text-[#5B738B] uppercase block mb-0.5">Fundamentação:</span>
                                <span className="font-bold text-[#12304A]">Art. 156 da Lei nº 14.133/21 • Critério PNTP</span>
                            </div>
                            <div className="bg-white p-3.5 rounded-xl border border-[#DDE3EA]">
                                <span className="text-[10px] font-bold text-[#5B738B] uppercase block mb-0.5">Atualização:</span>
                                <span className="font-bold text-emerald-700">Verificação Periódica Concluída</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Consultas Públicas Oficiais aos Cadastros Nacionais de Sanções */}
                <div className="bg-white rounded-3xl p-8 border border-[#DDE3EA] shadow-sm space-y-6">
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1254A3] flex items-center justify-center text-lg">
                            <FaShieldAlt />
                        </div>
                        <div>
                            <h4 className="text-base font-black text-[#12304A]">
                                Consultas Integradas aos Bancos Nacionais de Sanções
                            </h4>
                            <p className="text-xs text-[#5B738B]">
                                Verifique a idoneidade de licitantes e empresas nos cadastros unificados do Governo Federal e Tribunais de Contas
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <a
                            href="https://portaldatransparencia.gov.br/sancoes/ceis"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#F5F7FA] hover:bg-blue-50 p-5 rounded-2xl border border-[#DDE3EA] hover:border-[#1254A3] transition-all flex flex-col justify-between group"
                        >
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-wider text-[#1254A3] bg-blue-50 px-2 py-0.5 rounded">
                                    CGU • Portal da Transparência
                                </span>
                                <h5 className="text-sm font-bold text-[#12304A] mt-2 group-hover:text-[#1254A3]">
                                    CEIS - Empresas Inidôneas e Suspensas
                                </h5>
                                <p className="text-xs text-[#5B738B] mt-1">
                                    Relação nacional de empresas e pessoas físicas impedidas de licitar com a administração pública.
                                </p>
                            </div>
                            <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold text-[#1254A3]">
                                <span>Consultar CEIS</span>
                                <FaExternalLinkAlt size={10} />
                            </div>
                        </a>

                        <a
                            href="https://portaldatransparencia.gov.br/sancoes/cnep"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#F5F7FA] hover:bg-blue-50 p-5 rounded-2xl border border-[#DDE3EA] hover:border-[#1254A3] transition-all flex flex-col justify-between group"
                        >
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                                    Lei Anticorrupção (Lei 12.846)
                                </span>
                                <h5 className="text-sm font-bold text-[#12304A] mt-2 group-hover:text-[#1254A3]">
                                    CNEP - Empresas Punidas
                                </h5>
                                <p className="text-xs text-[#5B738B] mt-1">
                                    Sanções aplicadas com fundamento na Lei Anticorrupção em todas as esferas governamentais.
                                </p>
                            </div>
                            <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold text-[#1254A3]">
                                <span>Consultar CNEP</span>
                                <FaExternalLinkAlt size={10} />
                            </div>
                        </a>

                        <a
                            href="https://contas.tcu.gov.br/ords/f?p=INABILITADO:INIDONEOS"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#F5F7FA] hover:bg-blue-50 p-5 rounded-2xl border border-[#DDE3EA] hover:border-[#1254A3] transition-all flex flex-col justify-between group"
                        >
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                                    TCU Oficial
                                </span>
                                <h5 className="text-sm font-bold text-[#12304A] mt-2 group-hover:text-[#1254A3]">
                                    Licitantes Inidôneos do TCU
                                </h5>
                                <p className="text-xs text-[#5B738B] mt-1">
                                    Pessoas e empresas declaradas inidôneas pelo Tribunal de Contas da União para licitar no país.
                                </p>
                            </div>
                            <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold text-[#1254A3]">
                                <span>Consultar TCU</span>
                                <FaExternalLinkAlt size={10} />
                            </div>
                        </a>
                    </div>
                </div>

                <BannerPNTP />
            </main>
        </div>
    );
}

