"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaSave, FaArrowLeft, FaSpinner, FaHandshake, FaFileAlt } from "react-icons/fa";
import Link from "next/link";
import toast from "react-hot-toast";

export default function NovoConvenioPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        tipoConvenio: "recebido", // "recebido" ou "concedido" (Critério 5.2)
        numero: "",
        ano: new Date().getFullYear(),
        concedente: "",
        beneficiario: "",
        cnpjParticipe: "",
        objeto: "",
        valor: "",
        contrapartida: "0",
        valorLiberado: "",
        dataInicio: "",
        dataFim: "",
        status: "vigente",
        secretaria: "Gabinete do Prefeito / Controle Interno",
        arquivoInteiroTeor: "",
        obrigacoes: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.numero || !form.objeto || !form.valor || !form.dataInicio || !form.dataFim) {
            toast.error("Preencha todos os campos obrigatórios (*).");
            return;
        }

        setLoading(true);
        try {
            const payload = {
                ...form,
                ano: parseInt(String(form.ano)) || new Date().getFullYear(),
                concedente: form.tipoConvenio === "concedido" ? "Prefeitura Municipal de Lajes Pintadas/RN" : form.concedente,
                valor: parseFloat(String(form.valor)) || 0,
                contrapartida: parseFloat(String(form.contrapartida)) || 0,
                valorLiberado: parseFloat(String(form.valorLiberado)) || 0,
            };

            const res = await fetch("/api/convenios", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                toast.success(
                    form.tipoConvenio === "concedido"
                        ? "Transferência Concedida cadastrada com sucesso (Critério 5.2)!"
                        : "Convênio Recebido cadastrado com sucesso!"
                );
                router.push("/admin/convenios");
            } else {
                toast.error("Erro ao salvar instrumento.");
            }
        } catch {
            toast.error("Erro de conexão ao salvar.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
            <div className="flex items-center justify-between">
                <Link
                    href="/admin/convenios"
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors font-bold text-xs uppercase tracking-widest"
                >
                    <FaArrowLeft /> Voltar para Convênios
                </Link>
                <div className="text-right">
                    <span className="text-[11px] font-black uppercase tracking-wider text-pink-700 bg-pink-50 px-3 py-1 rounded-full border border-pink-200">
                        PNTP Critério 5.2
                    </span>
                    <h1 className="text-2xl font-black text-gray-800 uppercase tracking-tight mt-1">
                        Novo Convênio / Transferência
                    </h1>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8 space-y-6">
                {/* Tipo de Instrumento (Critério 5.2) */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                    <label className="block text-xs font-black uppercase tracking-wider text-gray-700 mb-2">
                        Tipo de Operação * (Critério PNTP 5.2)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <label className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                            form.tipoConvenio === "recebido"
                                ? "bg-white border-blue-600 ring-2 ring-blue-500/10 shadow-sm"
                                : "bg-white/60 border-gray-200 hover:border-gray-300"
                        }`}>
                            <input
                                type="radio"
                                name="tipoConvenio"
                                value="recebido"
                                checked={form.tipoConvenio === "recebido"}
                                onChange={() => setForm({ ...form, tipoConvenio: "recebido" })}
                                className="accent-blue-600"
                            />
                            <div>
                                <span className="block text-xs font-bold text-gray-900">Transferência Recebida (União / Estado)</span>
                                <span className="block text-[11px] text-gray-500">Recursos externos aportados no município</span>
                            </div>
                        </label>

                        <label className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                            form.tipoConvenio === "concedido"
                                ? "bg-white border-pink-600 ring-2 ring-pink-500/10 shadow-sm"
                                : "bg-white/60 border-gray-200 hover:border-gray-300"
                        }`}>
                            <input
                                type="radio"
                                name="tipoConvenio"
                                value="concedido"
                                checked={form.tipoConvenio === "concedido"}
                                onChange={() => setForm({ ...form, tipoConvenio: "concedido" })}
                                className="accent-pink-600"
                            />
                            <div>
                                <span className="block text-xs font-bold text-gray-900">Transferência Concedida (Critério 5.2)</span>
                                <span className="block text-[11px] text-gray-500">Repasses da Prefeitura a OSCs, consórcios e parceiros</span>
                            </div>
                        </label>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                            Número / Ano do Instrumento *
                        </label>
                        <input
                            type="text"
                            required
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Ex: Termo nº 005/2026"
                            value={form.numero}
                            onChange={e => setForm({ ...form, numero: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                            Exercício / Ano *
                        </label>
                        <input
                            type="number"
                            required
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                            value={form.ano}
                            onChange={e => setForm({ ...form, ano: parseInt(e.target.value) || 2026 })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                            Status do Instrumento *
                        </label>
                        <select
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                            value={form.status}
                            onChange={e => setForm({ ...form, status: e.target.value })}
                        >
                            <option value="vigente">Vigente / Em Execução</option>
                            <option value="concluido">Concluído</option>
                            <option value="prestacao_contas">Em Prestação de Contas</option>
                            <option value="encerrado">Encerrado</option>
                            <option value="cancelado">Cancelado</option>
                        </select>
                    </div>

                    {form.tipoConvenio === "recebido" ? (
                        <div className="md:col-span-3">
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                                Ente Concedente (Quem repassou para Lajes Pintadas) *
                            </label>
                            <input
                                type="text"
                                required={form.tipoConvenio === "recebido"}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Ex: Ministério da Saúde / Governo Federal ou Governo do Estado do RN"
                                value={form.concedente}
                                onChange={e => setForm({ ...form, concedente: e.target.value })}
                            />
                        </div>
                    ) : (
                        <>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                                    Beneficiário do Repasse (Critério 5.2) *
                                </label>
                                <input
                                    type="text"
                                    required={form.tipoConvenio === "concedido"}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Ex: Associação Comunitária Riacho Fechado ou Consórcio Intermunicipal"
                                    value={form.beneficiario}
                                    onChange={e => setForm({ ...form, beneficiario: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                                    CNPJ do Beneficiário
                                </label>
                                <input
                                    type="text"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-mono focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="00.000.000/0000-00"
                                    value={form.cnpjParticipe}
                                    onChange={e => setForm({ ...form, cnpjParticipe: e.target.value })}
                                />
                            </div>
                        </>
                    )}

                    <div className="md:col-span-3">
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                            Objeto e Finalidade da Parceria (Critério 5.2) *
                        </label>
                        <textarea
                            required
                            rows={3}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                            placeholder="Descrição completa do objeto, metas e finalidade de interesse público..."
                            value={form.objeto}
                            onChange={e => setForm({ ...form, objeto: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                            {form.tipoConvenio === "concedido" ? "Valor Total Previsto Concedido (R$) *" : "Valor do Repasse (R$) *"}
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            required
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-mono font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="0.00"
                            value={form.valor}
                            onChange={e => setForm({ ...form, valor: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                            {form.tipoConvenio === "concedido" ? "Valor Efetivamente Concedido / Liberado (R$)" : "Contrapartida Municipal (R$)"}
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-mono font-bold text-emerald-700 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="0.00"
                            value={form.tipoConvenio === "concedido" ? form.valorLiberado : form.contrapartida}
                            onChange={e => setForm({
                                ...form,
                                ...(form.tipoConvenio === "concedido" ? { valorLiberado: e.target.value } : { contrapartida: e.target.value })
                            })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                            Secretaria Responsável
                        </label>
                        <input
                            type="text"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                            value={form.secretaria}
                            onChange={e => setForm({ ...form, secretaria: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                            Início da Vigência *
                        </label>
                        <input
                            type="date"
                            required
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                            value={form.dataInicio}
                            onChange={e => setForm({ ...form, dataInicio: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                            Término da Vigência *
                        </label>
                        <input
                            type="date"
                            required
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                            value={form.dataFim}
                            onChange={e => setForm({ ...form, dataFim: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                            Inteiro Teor do Instrumento (Link / PDF) - Critério 5.2
                        </label>
                        <input
                            type="text"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Link para o arquivo PDF assinado"
                            value={form.arquivoInteiroTeor}
                            onChange={e => setForm({ ...form, arquivoInteiroTeor: e.target.value })}
                        />
                    </div>
                </div>

                <div className="pt-6 border-t border-gray-100 flex items-center justify-end gap-3">
                    <Link
                        href="/admin/convenios"
                        className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 text-xs font-bold uppercase tracking-wider hover:bg-gray-50 transition-colors"
                    >
                        Cancelar
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all cursor-pointer"
                    >
                        {loading ? <FaSpinner className="animate-spin" /> : <FaSave />}
                        Salvar Instrumento
                    </button>
                </div>
            </form>
        </div>
    );
}
