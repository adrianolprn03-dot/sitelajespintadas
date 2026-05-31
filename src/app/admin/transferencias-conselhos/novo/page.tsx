"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaArrowLeft, FaSave, FaSpinner, FaExchangeAlt } from "react-icons/fa";
import toast from "react-hot-toast";

const MESES = [
    { v: 1, l: "Janeiro" }, { v: 2, l: "Fevereiro" }, { v: 3, l: "Março" },
    { v: 4, l: "Abril" }, { v: 5, l: "Maio" }, { v: 6, l: "Junho" },
    { v: 7, l: "Julho" }, { v: 8, l: "Agosto" }, { v: 9, l: "Setembro" },
    { v: 10, l: "Outubro" }, { v: 11, l: "Novembro" }, { v: 12, l: "Dezembro" },
];
const ANO_ATUAL = new Date().getFullYear();

export default function NovaTransferenciaConselho() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        tipoConselho: "saude",
        nomeConselho: "Conselho Municipal de Saúde – CMS",
        mes: new Date().getMonth() + 1,
        ano: ANO_ATUAL,
        valorRepasse: "",
        natureza: "custeio",
        fonteRecurso: "federal",
        descricaoAplicacao: "",
        numeroEmpenho: "",
        numeroPagamento: "",
        statusPrestacao: "regular",
        observacoes: "",
    });

    const nomesConselho: Record<string, string> = {
        saude: "Conselho Municipal de Saúde – CMS",
        fundeb: "Conselho Municipal do FUNDEB",
        assistencia_social: "Conselho Municipal de Assistência Social – CMAS",
    };

    const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));

    const handleTipoChange = (tipo: string) => {
        setForm(f => ({ ...f, tipoConselho: tipo, nomeConselho: nomesConselho[tipo] || "" }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.valorRepasse || parseFloat(form.valorRepasse) <= 0) {
            toast.error("Informe um valor de repasse válido"); return;
        }
        setSaving(true);
        try {
            const res = await fetch("/api/transferencias-conselhos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, valorRepasse: parseFloat(form.valorRepasse), mes: Number(form.mes), ano: Number(form.ano) }),
            });
            if (res.ok) {
                toast.success("Repasse registrado com sucesso!");
                router.push("/admin/transferencias-conselhos");
            } else {
                toast.error("Erro ao salvar registro");
            }
        } catch {
            toast.error("Erro de conexão");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6 max-w-3xl">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/admin/transferencias-conselhos" className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">
                    <FaArrowLeft />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <FaExchangeAlt className="text-blue-600" /> Novo Repasse a Conselho
                    </h1>
                    <p className="text-sm text-gray-500">Conforme PNTP 2026 – Transparência Ativa</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Identificação do Conselho */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                    <h2 className="font-black text-gray-700 text-sm uppercase tracking-widest border-b border-gray-100 pb-3">
                        Identificação do Conselho
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                                Tipo de Conselho *
                            </label>
                            <select
                                value={form.tipoConselho}
                                onChange={e => handleTipoChange(e.target.value)}
                                required
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="saude">Conselho Municipal de Saúde (CMS)</option>
                                <option value="fundeb">Conselho Municipal do FUNDEB</option>
                                <option value="assistencia_social">Conselho Municipal de Assistência Social (CMAS)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                                Nome Completo do Conselho *
                            </label>
                            <input
                                type="text"
                                value={form.nomeConselho}
                                onChange={e => set("nomeConselho", e.target.value)}
                                required
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Período de Referência */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                    <h2 className="font-black text-gray-700 text-sm uppercase tracking-widest border-b border-gray-100 pb-3">
                        Período de Referência
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Mês *</label>
                            <select
                                value={form.mes}
                                onChange={e => set("mes", e.target.value)}
                                required
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {MESES.map(m => <option key={m.v} value={m.v}>{m.l}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Ano *</label>
                            <select
                                value={form.ano}
                                onChange={e => set("ano", e.target.value)}
                                required
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {[ANO_ATUAL, ANO_ATUAL - 1, ANO_ATUAL - 2].map(a => <option key={a} value={a}>{a}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Dados Financeiros */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                    <h2 className="font-black text-gray-700 text-sm uppercase tracking-widest border-b border-gray-100 pb-3">
                        Dados Financeiros
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                                Valor do Repasse (R$) *
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={form.valorRepasse}
                                onChange={e => set("valorRepasse", e.target.value)}
                                required
                                placeholder="Ex: 15000.00"
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                                Natureza *
                            </label>
                            <select
                                value={form.natureza}
                                onChange={e => set("natureza", e.target.value)}
                                required
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="custeio">Custeio</option>
                                <option value="investimento">Investimento</option>
                                <option value="capital">Capital</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                                Fonte de Recurso *
                            </label>
                            <select
                                value={form.fonteRecurso}
                                onChange={e => set("fonteRecurso", e.target.value)}
                                required
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="federal">Federal</option>
                                <option value="estadual">Estadual</option>
                                <option value="municipal">Municipal</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Aplicação dos Recursos */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                    <h2 className="font-black text-gray-700 text-sm uppercase tracking-widest border-b border-gray-100 pb-3">
                        Aplicação dos Recursos <span className="text-blue-500 normal-case">(PNTP 2026)</span>
                    </h2>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                            Descrição da Aplicação *
                        </label>
                        <textarea
                            value={form.descricaoAplicacao}
                            onChange={e => set("descricaoAplicacao", e.target.value)}
                            required
                            rows={3}
                            placeholder="Descreva como os recursos foram ou serão aplicados conforme exigido pela PNTP..."
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                    </div>
                </div>

                {/* Documentação */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                    <h2 className="font-black text-gray-700 text-sm uppercase tracking-widest border-b border-gray-100 pb-3">
                        Documentação
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                                Número do Empenho
                            </label>
                            <input
                                type="text"
                                value={form.numeroEmpenho}
                                onChange={e => set("numeroEmpenho", e.target.value)}
                                placeholder="Ex: 2026NE001234"
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                                Número do Pagamento
                            </label>
                            <input
                                type="text"
                                value={form.numeroPagamento}
                                onChange={e => set("numeroPagamento", e.target.value)}
                                placeholder="Ex: 2026PG001234"
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Prestação de Contas */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                    <h2 className="font-black text-gray-700 text-sm uppercase tracking-widest border-b border-gray-100 pb-3">
                        Prestação de Contas
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                                Status da Prestação *
                            </label>
                            <select
                                value={form.statusPrestacao}
                                onChange={e => set("statusPrestacao", e.target.value)}
                                required
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="regular">✅ Regular</option>
                                <option value="pendente">⏳ Pendente</option>
                                <option value="irregular">❌ Irregular</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                                Observações
                            </label>
                            <input
                                type="text"
                                value={form.observacoes}
                                onChange={e => set("observacoes", e.target.value)}
                                placeholder="Observações adicionais (opcional)"
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Ações */}
                <div className="flex justify-end gap-3">
                    <Link
                        href="/admin/transferencias-conselhos"
                        className="px-6 py-3 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                        Cancelar
                    </Link>
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors shadow-sm"
                    >
                        {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
                        {saving ? "Salvando..." : "Salvar Repasse"}
                    </button>
                </div>
            </form>
        </div>
    );
}
