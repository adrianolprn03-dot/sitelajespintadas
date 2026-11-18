"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
    FaArchive,
    FaCheckCircle,
    FaChevronDown,
    FaChevronUp,
    FaEdit,
    FaExternalLinkAlt,
    FaFilePdf,
    FaFileUpload,
    FaInfoCircle,
    FaMagic,
    FaPlus,
    FaShieldAlt,
    FaSpinner,
    FaStamp,
    FaTrash,
} from "react-icons/fa";
import AdminModal from "@/components/admin/AdminModal";
import { obterModeloDeclaracao } from "@/lib/declaracoes-catalogo";
import { exportToPDF } from "@/lib/exportUtils";
import { MUNICIPIO } from "@/config/municipio";

export interface DeclaracaoRegistro {
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
    situacaoPublicacao: string;
    ativa: boolean;
}

interface DeclaracaoInexistenciaBannerProps {
    modulo: string;
    criterioPntp?: string;
    tituloModulo?: string;
    orgaoPadrao?: string;
    totalRegistrosAtuais?: number;
    onChanged?: () => void;
}

const COMPETENCIAS_PADRAO = [
    "Exercício Anual",
    "1º Semestre",
    "2º Semestre",
    "1º Quadrimestre",
    "2º Quadrimestre",
    "3º Quadrimestre",
    "Janeiro a Junho",
    "Julho a Dezembro",
    "Últimos 12 Meses",
];

export function baixarCertidaoDeclaracaoPDF(dec: DeclaracaoRegistro, tituloModulo?: string) {
    if (dec.arquivoAssinadoUrl && dec.arquivoAssinadoUrl.startsWith("http")) {
        window.open(dec.arquivoAssinadoUrl, "_blank", "noopener,noreferrer");
        return;
    }

    const modelo = obterModeloDeclaracao(dec.modulo || dec.criterioPntp);
    const labelSituacao =
        dec.tipoSituacao === "nao_aplicavel"
            ? "DECLARAÇÃO DE NÃO APLICABILIDADE LEGAL"
            : "DECLARAÇÃO DE INEXISTÊNCIA / NÃO OCORRÊNCIA NO PERÍODO";

    const rows = [
        {
            "Campo Institucional": "Ente Federado",
            "Registro Oficial": `${MUNICIPIO.nomeCompleto} (${MUNICIPIO.uf}) — CNPJ ${MUNICIPIO.cnpj}`,
        },
        {
            "Campo Institucional": "Documento / Natureza",
            "Registro Oficial": labelSituacao,
        },
        {
            "Campo Institucional": "Assunto / Módulo",
            "Registro Oficial": tituloModulo || modelo.titulo,
        },
        {
            "Campo Institucional": "Critério PNTP 2026",
            "Registro Oficial": dec.criterioPntp
                ? `Critério ${dec.criterioPntp}`
                : modelo.criterioPntp
                ? `Critério ${modelo.criterioPntp}`
                : "Transparência Ativa PNTP",
        },
        {
            "Campo Institucional": "Exercício / Competência",
            "Registro Oficial": `${dec.exercicio}${dec.competencia ? ` • ${dec.competencia}` : ""}`,
        },
        {
            "Campo Institucional": "Texto Oficial da Declaração",
            "Registro Oficial": dec.textoDeclaracao,
        },
        {
            "Campo Institucional": "Fundamento Legal",
            "Registro Oficial": dec.fundamentoLegal || modelo.fundamentoLegalPadrao,
        },
        {
            "Campo Institucional": "Órgão / Secretaria Responsável",
            "Registro Oficial": dec.orgaoResponsavel,
        },
        {
            "Campo Institucional": "Autoridade / Responsável",
            "Registro Oficial": `${dec.responsavelNome}${dec.responsavelCargo ? ` (${dec.responsavelCargo})` : ""}`,
        },
        {
            "Campo Institucional": "Data de Emissão / Conferência",
            "Registro Oficial": `${new Date(dec.dataEmissao).toLocaleDateString("pt-BR")} (Conferida em ${new Date(dec.dataConferencia || dec.dataEmissao).toLocaleDateString("pt-BR")})`,
        },
        {
            "Campo Institucional": "Situação no Portal",
            "Registro Oficial": dec.ativa
                ? "ATIVA E PUBLICADA NO PORTAL DA TRANSPARÊNCIA"
                : "ARQUIVADA / HISTÓRICO",
        },
    ];

    exportToPDF(
        rows,
        `declaracao_inexistencia_${dec.modulo}_${dec.exercicio}_lajes_pintadas`,
        `${labelSituacao} — ${tituloModulo || modelo.titulo}`,
        {
            orgao: dec.orgaoResponsavel,
            periodo: `${dec.exercicio}${dec.competencia ? ` (${dec.competencia})` : ""}`,
            fonte: "Portal da Transparência — Controle de Declarações PNTP 2026",
        }
    );
}

export default function DeclaracaoInexistenciaBanner({
    modulo,
    criterioPntp,
    tituloModulo,
    orgaoPadrao,
    totalRegistrosAtuais,
    onChanged,
}: DeclaracaoInexistenciaBannerProps) {
    const modelo = obterModeloDeclaracao(modulo || criterioPntp);

    const [declaracoes, setDeclaracoes] = useState<DeclaracaoRegistro[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandHistorico, setExpandHistorico] = useState(false);

    // Modal de criação/edição
    const [modalOpen, setModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [exercicio, setExercicio] = useState<number>(new Date().getFullYear());
    const [competencia, setCompetencia] = useState<string>("Exercício Anual");
    const [tipoSituacao, setTipoSituacao] = useState<string>("nao_ocorrencia_declarada");
    const [criterioInput, setCriterioInput] = useState<string>(criterioPntp || modelo.criterioPntp);
    const [orgaoResponsavel, setOrgaoResponsavel] = useState<string>(
        orgaoPadrao || modelo.orgaoResponsavelPadrao
    );
    const [responsavelNome, setResponsavelNome] = useState<string>(modelo.responsavelNomePadrao);
    const [responsavelCargo, setResponsavelCargo] = useState<string>(modelo.responsavelCargoPadrao);
    const [fundamentoLegal, setFundamentoLegal] = useState<string>(modelo.fundamentoLegalPadrao);
    const [textoDeclaracao, setTextoDeclaracao] = useState<string>("");
    const [arquivoAssinadoUrl, setArquivoAssinadoUrl] = useState<string>("");
    const [ativa, setAtiva] = useState<boolean>(true);

    const carregarDeclaracoes = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.set("modulo", modulo);
            if (criterioPntp) params.set("criterioPntp", criterioPntp);
            const res = await fetch(`/api/declaracoes?${params.toString()}`, {
                cache: "no-store",
            });
            if (res.ok) {
                const data = await res.json();
                setDeclaracoes(Array.isArray(data.items) ? data.items : []);
            }
        } catch {
            // mantém estado silencioso no banner embutido
        } finally {
            setLoading(false);
        }
    }, [modulo, criterioPntp]);

    useEffect(() => {
        carregarDeclaracoes();
    }, [carregarDeclaracoes]);

    const preencherModeloOficial = (
        anoRef = exercicio,
        compRef = competencia,
        orgRef = orgaoResponsavel
    ) => {
        setOrgaoResponsavel(orgRef || orgaoPadrao || modelo.orgaoResponsavelPadrao);
        setResponsavelNome(modelo.responsavelNomePadrao);
        setResponsavelCargo(modelo.responsavelCargoPadrao);
        setFundamentoLegal(modelo.fundamentoLegalPadrao);
        setCriterioInput(criterioPntp || modelo.criterioPntp);
        setTextoDeclaracao(
            modelo.gerarTextoPadrao(
                anoRef,
                compRef,
                orgRef || orgaoPadrao || modelo.orgaoResponsavelPadrao
            )
        );
    };

    const abrirNovaDeclaracao = () => {
        const anoAtual = new Date().getFullYear();
        const org = orgaoPadrao || modelo.orgaoResponsavelPadrao;
        setEditingId(null);
        setExercicio(anoAtual);
        setCompetencia("Exercício Anual");
        setTipoSituacao("nao_ocorrencia_declarada");
        setCriterioInput(criterioPntp || modelo.criterioPntp);
        setOrgaoResponsavel(org);
        setResponsavelNome(modelo.responsavelNomePadrao);
        setResponsavelCargo(modelo.responsavelCargoPadrao);
        setFundamentoLegal(modelo.fundamentoLegalPadrao);
        setTextoDeclaracao(modelo.gerarTextoPadrao(anoAtual, "Exercício Anual", org));
        setArquivoAssinadoUrl("");
        setAtiva(true);
        setModalOpen(true);
    };

    const abrirEditarDeclaracao = (d: DeclaracaoRegistro) => {
        setEditingId(d.id);
        setExercicio(d.exercicio);
        setCompetencia(d.competencia || "Exercício Anual");
        setTipoSituacao(d.tipoSituacao || "nao_ocorrencia_declarada");
        setCriterioInput(d.criterioPntp || criterioPntp || modelo.criterioPntp);
        setOrgaoResponsavel(d.orgaoResponsavel);
        setResponsavelNome(d.responsavelNome);
        setResponsavelCargo(d.responsavelCargo || modelo.responsavelCargoPadrao);
        setFundamentoLegal(d.fundamentoLegal || modelo.fundamentoLegalPadrao);
        setTextoDeclaracao(d.textoDeclaracao);
        setArquivoAssinadoUrl(d.arquivoAssinadoUrl || "");
        setAtiva(Boolean(d.ativa));
        setModalOpen(true);
    };

    const handleUploadArquivo = async (file: File) => {
        setUploading(true);
        try {
            const fd = new FormData();
            fd.append("file", file);
            const res = await fetch("/api/upload", { method: "POST", body: fd });
            const data = await res.json();
            if (res.ok && data.url) {
                setArquivoAssinadoUrl(data.url);
                toast.success("PDF assinado anexado com sucesso!");
            } else {
                toast.error(data.error || "Não foi possível enviar o arquivo.");
            }
        } catch {
            toast.error("Erro ao enviar arquivo para o servidor.");
        } finally {
            setUploading(false);
        }
    };

    const handleSalvar = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!textoDeclaracao.trim()) {
            toast.error("Informe o texto oficial da declaração.");
            return;
        }
        setSaving(true);
        try {
            const url = editingId ? `/api/declaracoes/${editingId}` : "/api/declaracoes";
            const method = editingId ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    modulo,
                    criterioPntp: criterioInput || null,
                    orgaoResponsavel,
                    exercicio,
                    competencia,
                    tipoSituacao,
                    textoDeclaracao,
                    fundamentoLegal,
                    responsavelNome,
                    responsavelCargo,
                    arquivoAssinadoUrl: arquivoAssinadoUrl || null,
                    ativa,
                    substituirAnteriores: ativa,
                }),
            });

            if (res.ok) {
                toast.success(
                    editingId
                        ? "Declaração atualizada com sucesso!"
                        : "Declaração de Inexistência publicada no Portal!"
                );
                setModalOpen(false);
                await carregarDeclaracoes();
                onChanged?.();
            } else {
                const err = await res.json().catch(() => ({}));
                toast.error(err.error || "Erro ao salvar declaração.");
            }
        } catch {
            toast.error("Erro de conexão com o servidor.");
        } finally {
            setSaving(false);
        }
    };

    const handleAlternarStatus = async (d: DeclaracaoRegistro) => {
        try {
            const res = await fetch(`/api/declaracoes/${d.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ativa: !d.ativa,
                    substituirAnteriores: !d.ativa,
                }),
            });
            if (res.ok) {
                toast.success(
                    !d.ativa
                        ? "Declaração ativada no Portal da Transparência!"
                        : "Declaração arquivada."
                );
                await carregarDeclaracoes();
                onChanged?.();
            } else {
                toast.error("Não foi possível alterar o status.");
            }
        } catch {
            toast.error("Erro de conexão.");
        }
    };

    const handleExcluir = async (id: string) => {
        if (!confirm("Remover esta declaração oficial do registro?")) return;
        try {
            const res = await fetch(`/api/declaracoes/${id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Declaração removida.");
                await carregarDeclaracoes();
                onChanged?.();
            } else {
                toast.error("Erro ao excluir declaração.");
            }
        } catch {
            toast.error("Erro de conexão.");
        }
    };

    const declaracaoAtiva = declaracoes.find((d) => d.ativa);
    const historicoInativas = declaracoes.filter((d) => !d.ativa);
    const semRegistrosSemDeclaracao = totalRegistrosAtuais === 0 && !declaracaoAtiva && !loading;

    return (
        <div className="space-y-3">
            <div
                className={`rounded-2xl border shadow-sm overflow-hidden transition-all ${
                    declaracaoAtiva
                        ? "bg-white border-blue-200"
                        : semRegistrosSemDeclaracao
                        ? "bg-[#fffdf4] border-[#FACC15]"
                        : "bg-white border-slate-200"
                }`}
            >
                <div className="h-1 w-full bg-gradient-to-r from-[#0072CE] via-[#1254A3] to-[#FACC15]" />

                <div className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5 min-w-0 flex-1">
                        <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                declaracaoAtiva
                                    ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                                    : semRegistrosSemDeclaracao
                                    ? "bg-[#FACC15]/25 text-amber-900 border border-[#FACC15]"
                                    : "bg-blue-50 text-[#0072CE] border border-blue-200"
                            }`}
                        >
                            {loading ? (
                                <FaSpinner className="animate-spin" size={16} />
                            ) : declaracaoAtiva ? (
                                <FaCheckCircle size={17} />
                            ) : (
                                <FaStamp size={17} />
                            )}
                        </div>

                        <div className="min-w-0 flex-1 space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-xs font-black text-[#0F2942] uppercase tracking-tight">
                                    Declaração de Inexistência / Não Ocorrência (PNTP)
                                </span>
                                {(criterioPntp || modelo.criterioPntp) && (
                                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-50 text-[#0072CE] border border-blue-200">
                                        Critério {criterioPntp || modelo.criterioPntp}
                                    </span>
                                )}
                                {declaracaoAtiva ? (
                                    <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                                        Ativa no Portal ({declaracaoAtiva.exercicio}
                                        {declaracaoAtiva.competencia ? ` • ${declaracaoAtiva.competencia}` : ""})
                                    </span>
                                ) : (
                                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                                        Sem declaração ativa publicada
                                    </span>
                                )}
                            </div>

                            {declaracaoAtiva ? (
                                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                                    “{declaracaoAtiva.textoDeclaracao}”
                                </p>
                            ) : semRegistrosSemDeclaracao ? (
                                <p className="text-xs text-amber-900 font-medium leading-relaxed flex items-center gap-1.5">
                                    <FaInfoCircle className="shrink-0 text-amber-600" />
                                    Nenhum registro cadastrado nesta seção. Caso não exista informação ou fato gerador no período, emita a Declaração Oficial de Inexistência para conformidade PNTP.
                                </p>
                            ) : (
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    Caso não haja ocorrências ou registros para este módulo em determinado exercício/competência, emita aqui a Declaração Oficial para exibição no Portal da Transparência.
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                        {declaracaoAtiva && (
                            <>
                                <button
                                    type="button"
                                    onClick={() =>
                                        baixarCertidaoDeclaracaoPDF(
                                            declaracaoAtiva,
                                            tituloModulo || modelo.titulo
                                        )
                                    }
                                    className="px-3 py-2 rounded-xl bg-[#F4F7FB] hover:bg-blue-50 text-[#0072CE] border border-blue-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                                    title="Baixar Certidão em PDF"
                                >
                                    <FaFilePdf /> PDF Oficial
                                </button>
                                <button
                                    type="button"
                                    onClick={() => abrirEditarDeclaracao(declaracaoAtiva)}
                                    className="px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                                    title="Editar Declaração Ativa"
                                >
                                    <FaEdit /> Editar
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleAlternarStatus(declaracaoAtiva)}
                                    className="px-3 py-2 rounded-xl bg-white hover:bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                                    title="Desativar / Arquivar Declaração"
                                >
                                    <FaArchive /> Arquivar
                                </button>
                            </>
                        )}

                        <button
                            type="button"
                            onClick={abrirNovaDeclaracao}
                            className="px-4 py-2 rounded-xl bg-[#FACC15] hover:bg-[#eab308] text-[#0F2942] font-black text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                        >
                            <FaPlus /> Emitir Declaração de Inexistência
                        </button>

                        {declaracoes.length > 0 && (
                            <button
                                type="button"
                                onClick={() => setExpandHistorico((v) => !v)}
                                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                                title="Expandir histórico de declarações deste módulo"
                            >
                                Histórico ({declaracoes.length})
                                {expandHistorico ? <FaChevronUp size={10} /> : <FaChevronDown size={10} />}
                            </button>
                        )}
                    </div>
                </div>

                {expandHistorico && declaracoes.length > 0 && (
                    <div className="border-t border-slate-100 bg-[#F4F7FB] px-4 sm:px-5 py-4 space-y-2.5">
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                            <span>Declarações Registradas para {tituloModulo || modelo.titulo}</span>
                            <Link
                                href="/admin/declaracoes"
                                className="text-[#0072CE] hover:underline flex items-center gap-1 normal-case"
                            >
                                Abrir Central de Declarações <FaExternalLinkAlt size={9} />
                            </Link>
                        </div>

                        <div className="space-y-2">
                            {declaracoes.map((d) => (
                                <div
                                    key={d.id}
                                    className="p-3 rounded-xl bg-white border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3"
                                >
                                    <div className="space-y-1 min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="text-xs font-black text-slate-800">
                                                Exercício {d.exercicio}
                                                {d.competencia ? ` • ${d.competencia}` : ""}
                                            </span>
                                            <span
                                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                                    d.ativa
                                                        ? "bg-emerald-100 text-emerald-800"
                                                        : "bg-slate-200 text-slate-600"
                                                }`}
                                            >
                                                {d.ativa ? "Ativa no Portal" : "Arquivada"}
                                            </span>
                                            <span className="text-[10px] text-slate-400">
                                                Emitida em {new Date(d.dataEmissao).toLocaleDateString("pt-BR")} por{" "}
                                                {d.responsavelNome}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-600 line-clamp-2">{d.textoDeclaracao}</p>
                                    </div>
                                    <div className="flex items-center gap-1.5 shrink-0">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                baixarCertidaoDeclaracaoPDF(d, tituloModulo || modelo.titulo)
                                            }
                                            className="p-2 rounded-lg bg-blue-50 text-[#0072CE] hover:bg-[#0072CE] hover:text-white transition cursor-pointer"
                                            title="Baixar PDF"
                                        >
                                            <FaFilePdf size={12} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => abrirEditarDeclaracao(d)}
                                            className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition cursor-pointer"
                                            title="Editar"
                                        >
                                            <FaEdit size={12} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleAlternarStatus(d)}
                                            className="px-2.5 py-1.5 rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100 text-[11px] font-bold transition cursor-pointer"
                                        >
                                            {d.ativa ? "Arquivar" : "Reativar"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleExcluir(d.id)}
                                            className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition cursor-pointer"
                                            title="Excluir"
                                        >
                                            <FaTrash size={12} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {historicoInativas.length > 0 && (
                            <p className="text-[11px] text-slate-400">
                                Dica: declarações arquivadas permanecem salvas para comprovação histórica junto ao TCE/PNTP.
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Modal Emissão / Edição */}
            <AdminModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                subtitle={`PNTP 2026 • ${tituloModulo || modelo.titulo}`}
                title={
                    editingId
                        ? "Editar Declaração Oficial de Inexistência"
                        : "Emitir Declaração Oficial de Inexistência"
                }
                description="O ato formal publicado aparecerá imediatamente na página correspondente do Portal da Transparência com opção de download em PDF."
                icon={
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0072CE] flex items-center justify-center">
                        <FaShieldAlt size={18} />
                    </div>
                }
                maxWidth="2xl"
                footer={
                    <div className="flex flex-wrap items-center justify-between w-full gap-3">
                        <button
                            type="button"
                            onClick={() => {
                                preencherModeloOficial(exercicio, competencia, orgaoResponsavel);
                                toast.success("Modelo jurídico oficial PNTP preenchido!");
                            }}
                            className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-[#FACC15] text-amber-900 font-bold text-xs flex items-center gap-1.5 border border-[#FACC15] transition cursor-pointer"
                        >
                            <FaMagic /> Restaurar Modelo Oficial PNTP
                        </button>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setModalOpen(false)}
                                className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-xs font-bold hover:bg-gray-200 transition cursor-pointer"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                form={`form-dec-${modulo}`}
                                disabled={saving}
                                className="px-5 py-2 rounded-xl bg-[#0072CE] hover:bg-[#005ba6] text-white text-xs font-black flex items-center gap-2 shadow-sm disabled:opacity-60 transition cursor-pointer"
                            >
                                {saving ? <FaSpinner className="animate-spin" /> : <FaCheckCircle />}
                                {editingId ? "Salvar Alterações" : "Publicar Declaração no Portal"}
                            </button>
                        </div>
                    </div>
                }
            >
                <form id={`form-dec-${modulo}`} onSubmit={handleSalvar} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                                Tipo de Situação Formal *
                            </label>
                            <select
                                value={tipoSituacao}
                                onChange={(e) => setTipoSituacao(e.target.value)}
                                className="input-field text-xs font-semibold"
                            >
                                <option value="nao_ocorrencia_declarada">
                                    Declaração de Inexistência / Não Ocorrência no Período
                                </option>
                                <option value="nao_aplicavel">
                                    Declaração de Não Aplicabilidade Legal ao Município
                                </option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                                Exercício (Ano) *
                            </label>
                            <input
                                type="number"
                                required
                                min={2018}
                                max={2035}
                                value={exercicio}
                                onChange={(e) =>
                                    setExercicio(Number(e.target.value) || new Date().getFullYear())
                                }
                                className="input-field text-xs font-bold"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                                Competência / Período de Referência
                            </label>
                            <input
                                type="text"
                                list={`competencias-${modulo}`}
                                value={competencia}
                                onChange={(e) => setCompetencia(e.target.value)}
                                placeholder="Ex: Exercício Anual, 1º Semestre..."
                                className="input-field text-xs"
                            />
                            <datalist id={`competencias-${modulo}`}>
                                {COMPETENCIAS_PADRAO.map((c) => (
                                    <option key={c} value={c} />
                                ))}
                            </datalist>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                                Código do Critério PNTP
                            </label>
                            <input
                                type="text"
                                value={criterioInput}
                                onChange={(e) => setCriterioInput(e.target.value)}
                                placeholder="Ex: 6.6"
                                className="input-field text-xs font-mono"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                            Órgão / Secretaria Responsável *
                        </label>
                        <input
                            type="text"
                            required
                            value={orgaoResponsavel}
                            onChange={(e) => setOrgaoResponsavel(e.target.value)}
                            className="input-field text-xs"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                                Autoridade / Responsável Signatário *
                            </label>
                            <input
                                type="text"
                                required
                                value={responsavelNome}
                                onChange={(e) => setResponsavelNome(e.target.value)}
                                className="input-field text-xs"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                                Cargo / Função
                            </label>
                            <input
                                type="text"
                                value={responsavelCargo}
                                onChange={(e) => setResponsavelCargo(e.target.value)}
                                className="input-field text-xs"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                            Fundamento Legal
                        </label>
                        <input
                            type="text"
                            value={fundamentoLegal}
                            onChange={(e) => setFundamentoLegal(e.target.value)}
                            className="input-field text-xs"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                            Texto Oficial da Declaração (Exibido no Portal e no PDF) *
                        </label>
                        <textarea
                            rows={5}
                            required
                            value={textoDeclaracao}
                            onChange={(e) => setTextoDeclaracao(e.target.value)}
                            className="input-field text-xs leading-relaxed"
                            placeholder="Redija a declaração formal de inexistência..."
                        />
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-[#F4F7FB] p-3.5 space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <label className="text-xs font-bold text-slate-700">
                                Documento PDF Assinado Digitalmente (Opcional)
                            </label>
                            <label className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-[11px] font-bold text-slate-700 flex items-center gap-1.5 cursor-pointer transition">
                                {uploading ? <FaSpinner className="animate-spin" /> : <FaFileUpload />}
                                {uploading ? "Enviando..." : "Anexar PDF Assinado"}
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    className="hidden"
                                    disabled={uploading}
                                    onChange={(e) => {
                                        const f = e.target.files?.[0];
                                        if (f) handleUploadArquivo(f);
                                    }}
                                />
                            </label>
                        </div>
                        <input
                            type="text"
                            value={arquivoAssinadoUrl}
                            onChange={(e) => setArquivoAssinadoUrl(e.target.value)}
                            placeholder="https://... (se vazio, o portal gera o PDF oficial automaticamente)"
                            className="input-field text-xs bg-white"
                        />
                    </div>

                    <label className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={ativa}
                            onChange={(e) => setAtiva(e.target.checked)}
                            className="w-4 h-4 accent-[#0072CE] rounded cursor-pointer"
                        />
                        <span className="text-xs font-bold text-emerald-950">
                            Publicar imediatamente como Declaração Ativa no Portal (arquiva declarações anteriores do mesmo exercício)
                        </span>
                    </label>
                </form>
            </AdminModal>
        </div>
    );
}
