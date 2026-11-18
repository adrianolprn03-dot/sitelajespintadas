"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, FileDown, Calendar, Building2, UserCheck, Scale, ExternalLink } from "lucide-react";
import { obterModeloDeclaracao } from "@/lib/declaracoes-catalogo";
import { exportToPDF } from "@/lib/exportUtils";
import { MUNICIPIO } from "@/config/municipio";

export interface DeclaracaoPublica {
    id: string;
    modulo: string;
    criterioPntp: string | null;
    orgaoResponsavel: string;
    exercicio: number;
    competencia: string | null;
    tipoSituacao: string;
    textoDeclaracao: string;
    fundamentoLegal: string | null;
    responsavelNome: string;
    responsavelCargo: string | null;
    arquivoAssinadoUrl: string | null;
    dataEmissao: string;
    dataConferencia: string;
    ativa: boolean;
}

interface DeclaracaoInexistenciaCardProps {
    modulo: string;
    criterioPntp?: string;
    exercicio?: number | string;
    declaracaoInicial?: DeclaracaoPublica | null;
    tituloFallback?: string;
    textoFallback?: string;
    ocultarSeVazio?: boolean;
    compacto?: boolean;
}

export default function DeclaracaoInexistenciaCard({
    modulo,
    criterioPntp,
    exercicio,
    declaracaoInicial = null,
    tituloFallback,
    textoFallback,
    ocultarSeVazio = false,
    compacto = false,
}: DeclaracaoInexistenciaCardProps) {
    const modelo = obterModeloDeclaracao(modulo || criterioPntp);
    const [declaracao, setDeclaracao] = useState<DeclaracaoPublica | null>(declaracaoInicial);
    const [carregado, setCarregado] = useState<boolean>(Boolean(declaracaoInicial));

    useEffect(() => {
        if (declaracaoInicial) {
            setDeclaracao(declaracaoInicial);
            setCarregado(true);
            return;
        }

        let active = true;
        const fetchDeclaracao = async () => {
            try {
                const params = new URLSearchParams();
                params.set("modulo", modulo);
                params.set("apenasAtivas", "true");
                if (criterioPntp) params.set("criterioPntp", criterioPntp);
                if (exercicio && String(exercicio).trim() !== "") {
                    params.set("exercicio", String(exercicio));
                }

                let res = await fetch(`/api/declaracoes?${params.toString()}`, {
                    cache: "no-store",
                });
                let data = res.ok ? await res.json() : { items: [] };

                if ((!data.items || data.items.length === 0) && exercicio) {
                    const fallbackParams = new URLSearchParams();
                    fallbackParams.set("modulo", modulo);
                    fallbackParams.set("apenasAtivas", "true");
                    if (criterioPntp) fallbackParams.set("criterioPntp", criterioPntp);
                    res = await fetch(`/api/declaracoes?${fallbackParams.toString()}`, {
                        cache: "no-store",
                    });
                    if (res.ok) {
                        data = await res.json();
                    }
                }

                if (active) {
                    setDeclaracao(data.items?.[0] || null);
                }
            } catch {
                if (active) setDeclaracao(null);
            } finally {
                if (active) setCarregado(true);
            }
        };

        fetchDeclaracao();
        return () => {
            active = false;
        };
    }, [modulo, criterioPntp, exercicio, declaracaoInicial]);

    if (!carregado && ocultarSeVazio) {
        return null;
    }

    if (carregado && !declaracao && ocultarSeVazio) {
        return null;
    }

    if (!declaracao && !textoFallback) {
        return null;
    }

    const anoRef = declaracao?.exercicio || Number(exercicio) || new Date().getFullYear();
    const competenciaRef = declaracao?.competencia || "Exercício Anual";
    const criterioEfetivo = declaracao?.criterioPntp || criterioPntp || modelo.criterioPntp;
    const orgaoRef = declaracao?.orgaoResponsavel || modelo.orgaoResponsavelPadrao;
    const responsavelRef = declaracao?.responsavelNome || modelo.responsavelNomePadrao;
    const cargoRef = declaracao?.responsavelCargo || modelo.responsavelCargoPadrao;
    const fundamentoRef = declaracao?.fundamentoLegal || modelo.fundamentoLegalPadrao;
    const textoOficial = declaracao?.textoDeclaracao || textoFallback || "";
    const tipoLabel =
        declaracao?.tipoSituacao === "nao_aplicavel"
            ? "Declaração de Não Aplicabilidade Legal"
            : "Declaração Oficial de Inexistência / Não Ocorrência";

    const dataRef = declaracao?.dataConferencia || declaracao?.dataEmissao;
    const dataFormatada = dataRef
        ? new Date(dataRef).toLocaleDateString("pt-BR")
        : new Date().toLocaleDateString("pt-BR");

    const handleDownloadPDF = () => {
        const rows = [
            {
                "Referência": "Ente Público",
                "Informação Oficial": `${MUNICIPIO.nomeCompleto} (${MUNICIPIO.uf}) — CNPJ ${MUNICIPIO.cnpj}`,
            },
            {
                "Referência": "Tipo de Ato",
                "Informação Oficial": tipoLabel,
            },
            {
                "Referência": "Assunto / Transparência",
                "Informação Oficial": tituloFallback || modelo.titulo,
            },
            {
                "Referência": "Critério PNTP 2026",
                "Informação Oficial": criterioEfetivo ? `Critério ${criterioEfetivo}` : "PNTP 2026",
            },
            {
                "Referência": "Exercício / Competência",
                "Informação Oficial": `${anoRef}${competenciaRef ? ` • ${competenciaRef}` : ""}`,
            },
            {
                "Referência": "Texto Oficial da Declaração",
                "Informação Oficial": textoOficial,
            },
            {
                "Referência": "Fundamento Legal",
                "Informação Oficial": fundamentoRef,
            },
            {
                "Referência": "Órgão Responsável",
                "Informação Oficial": orgaoRef,
            },
            {
                "Referência": "Responsável pela Emissão",
                "Informação Oficial": `${responsavelRef}${cargoRef ? ` — ${cargoRef}` : ""}`,
            },
            {
                "Referência": "Data de Emissão / Conferência",
                "Informação Oficial": dataFormatada,
            },
        ];

        exportToPDF(
            rows,
            `declaracao_inexistencia_${modulo}_${anoRef}_lajes_pintadas`,
            `${tipoLabel} — ${tituloFallback || modelo.titulo}`,
            {
                orgao: orgaoRef,
                periodo: `${anoRef} (${competenciaRef})`,
                fonte: "Portal da Transparência — Certidão de Inexistência PNTP 2026",
            }
        );
    };

    return (
        <section
            aria-label={tipoLabel}
            className="bg-white rounded-3xl border border-blue-200 shadow-sm overflow-hidden"
        >
            <div className="h-1.5 w-full bg-gradient-to-r from-[#0072CE] via-[#1254A3] to-[#FACC15]" />

            <div className={compacto ? "p-5 sm:p-6 space-y-4" : "p-6 sm:p-8 space-y-6"}>
                {/* Cabeçalho Institucional */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0072CE] border border-blue-200 flex items-center justify-center shrink-0">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div className="space-y-1.5">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FACC15] text-[#0F2942] text-[10px] font-black uppercase tracking-wider">
                                    {tipoLabel} • PNTP 2026
                                </span>
                                {criterioEfetivo && (
                                    <span className="px-2.5 py-1 rounded-full bg-blue-50 text-[#0072CE] border border-blue-200 text-[10px] font-black uppercase">
                                        Critério {criterioEfetivo}
                                    </span>
                                )}
                                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                                    Exercício {anoRef}
                                    {competenciaRef && competenciaRef !== String(anoRef)
                                        ? ` • ${competenciaRef}`
                                        : ""}
                                </span>
                            </div>

                            <h3 className="text-lg sm:text-xl font-black text-[#0F2942] tracking-tight">
                                {tituloFallback || modelo.titulo}
                            </h3>
                            <p className="text-xs text-slate-500 font-medium">
                                {MUNICIPIO.nomeCompleto} ({MUNICIPIO.uf}) • CNPJ {MUNICIPIO.cnpj}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                        {declaracao?.arquivoAssinadoUrl && (
                            <a
                                href={declaracao.arquivoAssinadoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2.5 rounded-xl bg-[#FACC15] hover:bg-[#eab308] text-[#0F2942] text-xs font-black flex items-center gap-2 shadow-sm transition cursor-pointer"
                            >
                                <ExternalLink className="w-3.5 h-3.5" />
                                PDF Assinado
                            </a>
                        )}
                        <button
                            type="button"
                            onClick={handleDownloadPDF}
                            className="px-4 py-2.5 rounded-xl bg-[#0072CE] hover:bg-[#005ba6] text-white text-xs font-bold flex items-center gap-2 shadow-sm transition cursor-pointer"
                        >
                            <FileDown className="w-4 h-4" />
                            Baixar Declaração Oficial (PDF)
                        </button>
                    </div>
                </div>

                {/* Corpo da Declaração Oficial */}
                <div className="bg-[#F4F7FB] rounded-2xl p-5 sm:p-6 border border-[#DDE3EA]">
                    <p className="text-sm sm:text-base text-[#0F2942] font-medium leading-relaxed">
                        {textoOficial}
                    </p>
                </div>

                {/* Metadados Auditáveis */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-200/80 flex items-start gap-2.5">
                        <Building2 className="w-4 h-4 text-[#0072CE] shrink-0 mt-0.5" />
                        <div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                                Órgão Responsável
                            </span>
                            <span className="font-bold text-slate-800">{orgaoRef}</span>
                        </div>
                    </div>

                    <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-200/80 flex items-start gap-2.5">
                        <UserCheck className="w-4 h-4 text-[#0072CE] shrink-0 mt-0.5" />
                        <div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                                Emissão e Conferência
                            </span>
                            <span className="font-bold text-slate-800 block">{responsavelRef}</span>
                            <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                                <Calendar className="w-3 h-3" /> Atualizado em {dataFormatada}
                            </span>
                        </div>
                    </div>

                    <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-200/80 flex items-start gap-2.5">
                        <Scale className="w-4 h-4 text-[#0072CE] shrink-0 mt-0.5" />
                        <div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                                Fundamento Legal
                            </span>
                            <span className="font-semibold text-slate-700 leading-snug block">
                                {fundamentoRef}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
