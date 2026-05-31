"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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

export default function EditarTransferenciaConselho() {
    const router = useRouter();
    const { id } = useParams<{ id: string }>();
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({
        tipoConselho: "saude",
        nomeConselho: "",
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

    useEffect(() => {
        fetch(`/api/transferencias-conselhos/${id}`)
            .then(r => r.json())
            .then(data => {
                setForm({ ...data, valorRepasse: String(data.valorRepasse) });
                setLoading(false);
            })
            .catch(() => { toast.error("Erro ao carregar"); setLoading(false); });
    }, [id]);

    const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch(`/api/transferencias-conselhos/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, valorRepasse: parseFloat(form.valorRepasse), mes: Number(form.mes), ano: Number(form.ano) }),
            });
            if (res.ok) {
                toast.success("Registro atualizado!");
                router.push("/admin/transferencias-conselhos");
            } else {
                toast.error("Erro ao atualizar");
            }
        } catch {
            toast.error("Erro de conexão");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center py-20">
            <FaSpinner className="animate-spin text-blue-500 text-3xl" />
        </div>
    );

    return (
        <div className="space-y-6 max-w-3xl">
            <div className="flex items-center gap-4">
                <Link href="/admin/transferencias-conselhos" className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">
                    <FaArrowLeft />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <FaExchangeAlt className="text-blue-600" /> Editar Repasse
                    </h1>
                    <p className="text-sm text-gray-500">PNTP 2026 – Conselhos Municipais</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                    <h2 className="font-black text-gray-700 text-sm uppercase tracking-widest border-b border-gray-100 pb-3">Conselho e Período</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Tipo de Conselho *</label>
                            <select value={form.tipoConselho} onChange={e => set("tipoConselho", e.target.value)} required className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="saude">Conselho de Saúde (CMS)</option>
                                <option value="fundeb">Conselho do FUNDEB</option>
                                <option value="assistencia_social">Assistência Social (CMAS)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Nome do Conselho *</label>
                            <input type="text" value={form.nomeConselho} onChange={e => set("nomeConselho", e.target.value)} required className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Mês *</label>
                            <select value={form.mes} onChange={e => set("mes", e.target.value)} required className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500">
                                {MESES.map(m => <option key={m.v} value={m.v}>{m.l}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Ano *</label>
                            <select value={form.ano} onChange={e => set("ano", e.target.value)} required className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500">
                                {[ANO_ATUAL, ANO_ATUAL - 1, ANO_ATUAL - 2].map(a => <option key={a} value={a}>{a}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                    <h2 className="font-black text-gray-700 text-sm uppercase tracking-widest border-b border-gray-100 pb-3">Dados Financeiros</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Valor (R$) *</label>
                            <input type="number" step="0.01" min="0" value={form.valorRepasse} onChange={e => set("valorRepasse", e.target.value)} required className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Natureza *</label>
                            <select value={form.natureza} onChange={e => set("natureza", e.target.value)} required className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="custeio">Custeio</option>
                                <option value="investimento">Investimento</option>
                                <option value="capital">Capital</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Fonte *</label>
                            <select value={form.fonteRecurso} onChange={e => set("fonteRecurso", e.target.value)} required className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="federal">Federal</option>
                                <option value="estadual">Estadual</option>
                                <option value="municipal">Municipal</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Descrição da Aplicação *</label>
                        <textarea value={form.descricaoAplicacao} onChange={e => set("descricaoAplicacao", e.target.value)} required rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                    <h2 className="font-black text-gray-700 text-sm uppercase tracking-widest border-b border-gray-100 pb-3">Documentação e Prestação</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Nº Empenho</label>
                            <input type="text" value={form.numeroEmpenho} onChange={e => set("numeroEmpenho", e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Nº Pagamento</label>
                            <input type="text" value={form.numeroPagamento} onChange={e => set("numeroPagamento", e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Status da Prestação *</label>
                            <select value={form.statusPrestacao} onChange={e => set("statusPrestacao", e.target.value)} required className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="regular">✅ Regular</option>
                                <option value="pendente">⏳ Pendente</option>
                                <option value="irregular">❌ Irregular</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Observações</label>
                            <input type="text" value={form.observacoes} onChange={e => set("observacoes", e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <Link href="/admin/transferencias-conselhos" className="px-6 py-3 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                        Cancelar
                    </Link>
                    <button type="submit" disabled={saving} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors shadow-sm">
                        {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
                        {saving ? "Salvando..." : "Atualizar Registro"}
                    </button>
                </div>
            </form>
        </div>
    );
}
