"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { FaSave, FaArrowLeft, FaSpinner, FaPlus, FaTrash, FaShieldAlt } from "react-icons/fa";
import Link from "next/link";
import toast from "react-hot-toast";

type FaseDoc = {
    fase: "interna" | "externa";
    tipo: string;
    titulo: string;
    url: string;
    data: string;
};

export default function EditarLicitacaoPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        numero: "",
        numeroProcesso: "",
        ano: 2026,
        modalidade: "",
        objeto: "",
        secretaria: "",
        status: "",
        dataAbertura: "",
        valorEstimado: "",
        valorHomologado: "",
        amparoLegal: "",
        codigoPermanente: "",
        editalUrl: "",
        ataRegistroPreco: false,
        adesaoArp: false,
    });

    const [fasesDocs, setFasesDocs] = useState<FaseDoc[]>([]);
    const [novoDoc, setNovoDoc] = useState<FaseDoc>({
        fase: "interna",
        tipo: "Termo de Referência",
        titulo: "",
        url: "",
        data: new Date().toISOString().split("T")[0]
    });

    const [secretarias, setSecretarias] = useState<{ id: string; nome: string }[]>([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [res, secRes] = await Promise.all([
                    fetch(`/api/licitacoes/${id}`),
                    fetch("/api/secretarias")
                ]);
                const data = await res.json();
                const secData = await secRes.json();

                let parsedDocs: FaseDoc[] = [];
                if (data.fasesDocumentos) {
                    try {
                        parsedDocs = typeof data.fasesDocumentos === "string"
                            ? JSON.parse(data.fasesDocumentos)
                            : data.fasesDocumentos;
                    } catch {}
                }

                setForm({
                    numero: data.numero || "",
                    numeroProcesso: data.numeroProcesso || "",
                    ano: data.ano || 2026,
                    modalidade: data.modalidade || "Pregão Eletrônico",
                    objeto: data.objeto || "",
                    secretaria: data.secretaria || "",
                    status: data.status || "aberta",
                    dataAbertura: data.dataAbertura ? data.dataAbertura.split("T")[0] : "",
                    valorEstimado: data.valorEstimado ? String(data.valorEstimado) : "",
                    valorHomologado: data.valorHomologado ? String(data.valorHomologado) : "",
                    amparoLegal: data.amparoLegal || "Lei nº 14.133/2021",
                    codigoPermanente: data.codigoPermanente || "",
                    editalUrl: data.editalUrl || "",
                    ataRegistroPreco: Boolean(data.ataRegistroPreco),
                    adesaoArp: Boolean(data.adesaoArp),
                });
                setFasesDocs(parsedDocs);
                setSecretarias(Array.isArray(secData) ? secData : []);
            } catch {
                toast.error("Erro ao carregar dados da licitação");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id]);

    const handleAddDoc = () => {
        if (!novoDoc.titulo || !novoDoc.url) {
            toast.error("Informe o título e a URL do documento.");
            return;
        }
        setFasesDocs([...fasesDocs, novoDoc]);
        setNovoDoc({
            fase: "interna",
            tipo: "Termo de Referência",
            titulo: "",
            url: "",
            data: new Date().toISOString().split("T")[0]
        });
        toast.success("Documento adicionado!");
    };

    const handleRemoveDoc = (index: number) => {
        setFasesDocs(fasesDocs.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = {
                ...form,
                valorEstimado: form.valorEstimado ? parseFloat(form.valorEstimado) : null,
                valorHomologado: form.valorHomologado ? parseFloat(form.valorHomologado) : null,
                dataAbertura: form.dataAbertura ? new Date(form.dataAbertura) : null,
                fasesDocumentos: JSON.stringify(fasesDocs),
            };

            const res = await fetch(`/api/licitacoes/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                toast.success("Licitação atualizada com sucesso!");
                router.push("/admin/licitacoes");
            } else {
                toast.error("Erro ao salvar alterações");
            }
        } catch {
            toast.error("Erro ao atualizar licitação");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="py-20 text-center">
                <FaSpinner className="animate-spin inline-block text-4xl text-[#1254A3]" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-12">
            <div className="flex items-center justify-between">
                <Link
                    href="/admin/licitacoes"
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors text-sm font-semibold"
                >
                    <FaArrowLeft /> Voltar para Licitações
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">Editar Licitação: {form.numero}</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                            Número da Licitação / Contratação *
                        </label>
                        <input
                            type="text"
                            required
                            className="input-field"
                            value={form.numero}
                            onChange={(e) => setForm({ ...form, numero: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                            Nº Processo Administrativo
                        </label>
                        <input
                            type="text"
                            className="input-field"
                            value={form.numeroProcesso}
                            onChange={(e) => setForm({ ...form, numeroProcesso: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                            Modalidade de Contratação (PNTP 8.4) *
                        </label>
                        <select
                            required
                            className="input-field"
                            value={form.modalidade}
                            onChange={(e) => setForm({ ...form, modalidade: e.target.value })}
                        >
                            <option value="Pregão Eletrônico">Pregão Eletrônico</option>
                            <option value="Dispensa de Licitação">Dispensa de Licitação (Art. 75)</option>
                            <option value="Inexigibilidade">Inexigibilidade (Art. 74)</option>
                            <option value="Concorrência">Concorrência</option>
                            <option value="Adesão a Registro de Preços">Adesão a Registro de Preços (Carona)</option>
                            <option value="Leilão Eletrônico">Leilão Eletrônico</option>
                            <option value="Credenciamento">Credenciamento</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                            Ano / Exercício *
                        </label>
                        <input
                            type="number"
                            required
                            className="input-field"
                            value={form.ano}
                            onChange={(e) => setForm({ ...form, ano: parseInt(e.target.value, 10) })}
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                            Objeto Detalhado *
                        </label>
                        <textarea
                            required
                            rows={3}
                            className="input-field resize-none"
                            value={form.objeto}
                            onChange={(e) => setForm({ ...form, objeto: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                            Secretaria Demandante
                        </label>
                        <input
                            type="text"
                            className="input-field"
                            value={form.secretaria}
                            onChange={(e) => setForm({ ...form, secretaria: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                            Data de Abertura / Sessão
                        </label>
                        <input
                            type="date"
                            className="input-field"
                            value={form.dataAbertura}
                            onChange={(e) => setForm({ ...form, dataAbertura: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                            Valor Total Estimado (R$)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            className="input-field"
                            value={form.valorEstimado}
                            onChange={(e) => setForm({ ...form, valorEstimado: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                            Valor Total Homologado (R$)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            className="input-field"
                            value={form.valorHomologado}
                            onChange={(e) => setForm({ ...form, valorHomologado: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                            Amparo Legal
                        </label>
                        <input
                            type="text"
                            className="input-field"
                            value={form.amparoLegal}
                            onChange={(e) => setForm({ ...form, amparoLegal: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                            Código PNCP
                        </label>
                        <input
                            type="text"
                            className="input-field font-mono"
                            value={form.codigoPermanente}
                            onChange={(e) => setForm({ ...form, codigoPermanente: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                            Status do Processo
                        </label>
                        <select
                            className="input-field"
                            value={form.status}
                            onChange={(e) => setForm({ ...form, status: e.target.value })}
                        >
                            <option value="aberta">Aberta</option>
                            <option value="em-andamento">Em Andamento</option>
                            <option value="concluida">Concluída / Homologada</option>
                            <option value="deserta">Deserta</option>
                            <option value="cancelada">Cancelada</option>
                        </select>
                    </div>

                    {/* Flags Registro de Preços & Adesão */}
                    <div className="md:col-span-2 bg-blue-50/50 p-4 rounded-2xl border border-blue-100 flex flex-wrap gap-6">
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-800">
                            <input
                                type="checkbox"
                                checked={form.ataRegistroPreco}
                                onChange={(e) => setForm({ ...form, ataRegistroPreco: e.target.checked })}
                                className="w-4 h-4 rounded text-[#1254A3]"
                            />
                            <span>Gera Ata de Registro de Preços (ARP Própria)</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-800">
                            <input
                                type="checkbox"
                                checked={form.adesaoArp}
                                onChange={(e) => setForm({ ...form, adesaoArp: e.target.checked })}
                                className="w-4 h-4 rounded text-amber-600"
                            />
                            <span>Ata de Adesão / Carona (Critério 8.5)</span>
                        </label>
                    </div>

                    {/* Edital Integral (Critério 8.2) */}
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                            URL do Edital Integral (Critério PNTP 8.2)
                        </label>
                        <input
                            type="text"
                            className="input-field"
                            placeholder="https://... ou caminho do arquivo"
                            value={form.editalUrl}
                            onChange={(e) => setForm({ ...form, editalUrl: e.target.value })}
                        />
                    </div>
                </div>

                {/* Documentos das Fases Interna e Externa */}
                <div className="border-t border-gray-100 pt-6 space-y-4">
                    <div>
                        <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
                            <FaShieldAlt className="text-[#1254A3]" /> Documentos das Fases Interna e Externa (PNTP 8.3 e 8.4)
                        </h3>
                        <p className="text-xs text-gray-500">
                            Classifique os anexos por fase e tipo para consulta pública.
                        </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                        <div>
                            <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Fase</label>
                            <select
                                value={novoDoc.fase}
                                onChange={(e) => setNovoDoc({ ...novoDoc, fase: e.target.value as any })}
                                className="input-field text-xs"
                            >
                                <option value="interna">Fase Interna</option>
                                <option value="externa">Fase Externa</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Tipo de Documento</label>
                            <select
                                value={novoDoc.tipo}
                                onChange={(e) => setNovoDoc({ ...novoDoc, tipo: e.target.value })}
                                className="input-field text-xs"
                            >
                                <option value="Estudo Técnico Preliminar (ETP)">Estudo Técnico Preliminar (ETP)</option>
                                <option value="Termo de Referência">Termo de Referência</option>
                                <option value="Pesquisa de Preços">Pesquisa de Preços</option>
                                <option value="Parecer Jurídico">Parecer Jurídico</option>
                                <option value="Parecer Técnico / Contábil">Parecer Técnico / Contábil</option>
                                <option value="Edital de Licitação">Edital de Licitação</option>
                                <option value="Ata de Sessão Pública">Ata de Sessão Pública</option>
                                <option value="Documentos de Habilitação">Documentos de Habilitação</option>
                                <option value="Termo de Homologação / Adjudicação">Termo de Homologação / Adjudicação</option>
                                <option value="Ata de Registro de Preços">Ata de Registro de Preços</option>
                                <option value="Ato de Ratificação da Dispensa">Ato de Ratificação da Dispensa</option>
                                <option value="Outros Anexos">Outros Anexos</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Título / Descrição</label>
                            <input
                                type="text"
                                placeholder="Ex: Termo de Homologação"
                                value={novoDoc.titulo}
                                onChange={(e) => setNovoDoc({ ...novoDoc, titulo: e.target.value })}
                                className="input-field text-xs"
                            />
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">URL do Documento (PDF)</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="https://... ou caminho"
                                    value={novoDoc.url}
                                    onChange={(e) => setNovoDoc({ ...novoDoc, url: e.target.value })}
                                    className="input-field text-xs"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddDoc}
                                    className="px-3 py-2 bg-[#1254A3] text-white rounded-xl text-xs font-bold hover:bg-blue-800 shrink-0"
                                >
                                    <FaPlus />
                                </button>
                            </div>
                        </div>
                    </div>

                    {fasesDocs.length > 0 && (
                        <div className="space-y-2">
                            {fasesDocs.map((doc, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center justify-between p-3 rounded-xl border border-gray-200 bg-white text-xs shadow-xs"
                                >
                                    <div className="flex items-center gap-3">
                                        <span
                                            className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                                doc.fase === "interna"
                                                    ? "bg-purple-100 text-purple-800"
                                                    : "bg-blue-100 text-blue-800"
                                            }`}
                                        >
                                            {doc.fase === "interna" ? "Fase Interna" : "Fase Externa"}
                                        </span>
                                        <span className="font-bold text-gray-800">{doc.tipo}:</span>
                                        <span className="text-gray-600">{doc.titulo}</span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <a
                                            href={doc.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline font-semibold"
                                        >
                                            Ver PDF
                                        </a>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveDoc(idx)}
                                            className="text-rose-500 hover:text-rose-700 p-1"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                    <Link
                        href="/admin/licitacoes"
                        className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-semibold"
                    >
                        Cancelar
                    </Link>
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 bg-[#1254A3] text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-800 transition-all shadow-sm disabled:opacity-50"
                    >
                        {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
                        <span>Salvar Alterações</span>
                    </button>
                </div>
            </form>
        </div>
    );
}
