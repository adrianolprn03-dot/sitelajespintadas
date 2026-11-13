"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaSave, FaArrowLeft, FaSpinner, FaMoneyBillWave, FaLandmark } from "react-icons/fa";
import Link from "next/link";
import toast from "react-hot-toast";

export default function NovaEmendaPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        codigoEmenda: "",
        numeroEmenda: "",
        anoEmenda: new Date().getFullYear(),
        autorNome: "",
        esfera: "Federal", // Federal, Estadual ou Municipal (Critério 17.1)
        formaRepasse: "Transferência Especial (PIX)", // Transferência Especial, Convênio, Fundo a Fundo (Critério 17.1)
        tipoEmenda: "Individual", // Individual, Bancada, Comissão
        funcaoGoverno: "Saúde", // Critério 17.1
        subfuncaoGoverno: "Atenção Básica",
        objeto: "",
        valorPrevisto: "",
        valorRecebido: "",
        valorEmpenhado: "", // Critério 17.2
        valorLiquidado: "", // Critério 17.2
        valorPago: "", // Critério 17.2
        situacaoExecucao: "Pago",
        orgaoConcedente: "Ministério da Saúde",
        instrumentoNumero: "",
        favorecidoNome: "Prefeitura Municipal de Lajes Pintadas",
        favorecidoCnpjCpf: "08.159.394/0001-37",
        urlFonteOficial: "https://portaldatransparencia.gov.br",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.codigoEmenda || !form.autorNome || !form.valorPrevisto) {
            toast.error("Preencha os campos obrigatórios (Código, Autor e Valor).");
            return;
        }

        setLoading(true);
        try {
            const payload = {
                ...form,
                anoEmenda: parseInt(String(form.anoEmenda)) || new Date().getFullYear(),
                valorPrevisto: parseFloat(String(form.valorPrevisto)) || 0,
                valorRecebido: parseFloat(String(form.valorRecebido)) || 0,
                valorEmpenhado: parseFloat(String(form.valorEmpenhado)) || 0,
                valorLiquidado: parseFloat(String(form.valorLiquidado)) || 0,
                valorPago: parseFloat(String(form.valorPago)) || 0,
            };

            const res = await fetch("/api/admin/emendas", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                toast.success("Emenda cadastrada com sucesso!");
                router.push("/admin/emendas");
            } else {
                const err = await res.json();
                toast.error(err.error || "Erro ao cadastrar emenda.");
            }
        } catch {
            toast.error("Erro de conexão com o servidor.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
            <div className="flex items-center justify-between">
                <Link
                    href="/admin/emendas"
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors font-bold text-xs uppercase tracking-widest"
                >
                    <FaArrowLeft /> Voltar para Emendas
                </Link>
                <div className="text-right">
                    <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                        PNTP Critérios 17.1 a 17.3
                    </span>
                    <h1 className="text-2xl font-black text-gray-800 uppercase tracking-tight mt-1">
                        Cadastrar Emenda Parlamentar
                    </h1>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8 space-y-8">
                {/* 1. CLASSIFICAÇÃO E AUTORIA (Critério 17.1) */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <FaLandmark />
                        </div>
                        <h2 className="text-sm font-black text-gray-800 uppercase">1. Identificação, Autoria e Esfera (Critério 17.1)</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Código Único / Identificador *</label>
                            <input
                                type="text"
                                required
                                placeholder="Ex: 2026RN001-HEALTH ou EMPIX-2026-01"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-mono font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
                                value={form.codigoEmenda}
                                onChange={e => setForm({ ...form, codigoEmenda: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Número Oficial da Emenda</label>
                            <input
                                type="text"
                                placeholder="Ex: 2026-001 ou Nº 4120005"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                                value={form.numeroEmenda}
                                onChange={e => setForm({ ...form, numeroEmenda: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Exercício / Ano *</label>
                            <input
                                type="number"
                                required
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
                                value={form.anoEmenda}
                                onChange={e => setForm({ ...form, anoEmenda: parseInt(e.target.value) || 2026 })}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Autor da Emenda Parlamentar *</label>
                            <input
                                type="text"
                                required
                                placeholder="Ex: Deputado Benes Leocádio (UNIÃO/RN) ou Senador Rogério Marinho"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
                                value={form.autorNome}
                                onChange={e => setForm({ ...form, autorNome: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Esfera da Emenda (17.1) *</label>
                            <select
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
                                value={form.esfera}
                                onChange={e => setForm({ ...form, esfera: e.target.value })}
                            >
                                <option value="Federal">Federal (Congresso Nacional)</option>
                                <option value="Estadual">Estadual (ALRN)</option>
                                <option value="Municipal">Municipal (Câmara Municipal)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Forma de Repasse (17.1) *</label>
                            <select
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
                                value={form.formaRepasse}
                                onChange={e => setForm({ ...form, formaRepasse: e.target.value })}
                            >
                                <option value="Transferência Especial (PIX)">Transferência Especial (Emenda PIX)</option>
                                <option value="Convênio / Contrato de Repasse">Convênio / Contrato de Repasse</option>
                                <option value="Fundo a Fundo">Fundo a Fundo (SUS / SUAS)</option>
                                <option value="Transferência com Finalidade Definida">Transferência com Finalidade Definida</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Tipo de Emenda *</label>
                            <select
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
                                value={form.tipoEmenda}
                                onChange={e => setForm({ ...form, tipoEmenda: e.target.value })}
                            >
                                <option value="Individual">Individual</option>
                                <option value="Bancada">Bancada Estadual</option>
                                <option value="Comissão">Comissão Temática</option>
                                <option value="Transferência Especial">Transferência Especial</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Função de Governo (17.1) *</label>
                            <select
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
                                value={form.funcaoGoverno}
                                onChange={e => setForm({ ...form, funcaoGoverno: e.target.value })}
                            >
                                <option value="Saúde">10 - Saúde</option>
                                <option value="Educação">12 - Educação</option>
                                <option value="Infraestrutura Urbana">15 - Urbanismo / Infraestrutura</option>
                                <option value="Assistência Social">08 - Assistência Social</option>
                                <option value="Agricultura">20 - Agricultura</option>
                                <option value="Esporte e Lazer">27 - Desporto e Lazer</option>
                                <option value="Administração">04 - Administração Geral</option>
                            </select>
                        </div>

                        <div className="md:col-span-3">
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Objeto / Finalidade da Destinação (17.1) *</label>
                            <textarea
                                required
                                rows={2}
                                placeholder="Descreva o objeto, destinação pública e metas da emenda parlamentar..."
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                                value={form.objeto}
                                onChange={e => setForm({ ...form, objeto: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                {/* 2. EXECUÇÃO ORÇAMENTÁRIA E FINANCEIRA (Critério 17.2 e 17.3) */}
                <div className="space-y-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                <FaMoneyBillWave />
                            </div>
                            <div>
                                <h2 className="text-sm font-black text-gray-800 uppercase">2. Execução Orçamentária e Conciliação Contábil (17.2 e 17.3)</h2>
                                <p className="text-[11px] text-gray-500">Valores previstos, empenhados, liquidados e pagos com vínculo contábil</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Valor Previsto / Indicado (R$) *</label>
                            <input
                                type="number"
                                step="0.01"
                                required
                                placeholder="0.00"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-mono font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
                                value={form.valorPrevisto}
                                onChange={e => setForm({ ...form, valorPrevisto: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Valor Recebido / Creditado (R$)</label>
                            <input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-mono font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
                                value={form.valorRecebido}
                                onChange={e => setForm({ ...form, valorRecebido: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Valor Empenhado (R$) - 17.2</label>
                            <input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-mono font-bold text-blue-700 focus:ring-2 focus:ring-emerald-500 outline-none"
                                value={form.valorEmpenhado}
                                onChange={e => setForm({ ...form, valorEmpenhado: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Valor Pago (R$) - 17.2</label>
                            <input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-mono font-bold text-emerald-700 focus:ring-2 focus:ring-emerald-500 outline-none"
                                value={form.valorPago}
                                onChange={e => setForm({ ...form, valorPago: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Situação da Execução *</label>
                            <select
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
                                value={form.situacaoExecucao}
                                onChange={e => setForm({ ...form, situacaoExecucao: e.target.value })}
                            >
                                <option value="Pago">Pago / Concluído</option>
                                <option value="Em Execução">Em Execução Orçamentária</option>
                                <option value="Convênio Celebrado">Convênio Celebrado</option>
                                <option value="Em Processamento">Em Processamento</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Órgão Concedente Oficial</label>
                            <input
                                type="text"
                                placeholder="Ex: Ministério da Saúde / FNS"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                                value={form.orgaoConcedente}
                                onChange={e => setForm({ ...form, orgaoConcedente: e.target.value })}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Link da Fonte Oficial / Transferegov</label>
                            <input
                                type="url"
                                placeholder="https://portaldatransparencia.gov.br ou https://transferegov.sistema.gov.br"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                                value={form.urlFonteOficial}
                                onChange={e => setForm({ ...form, urlFonteOficial: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                    <Link
                        href="/admin/emendas"
                        className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 text-xs font-bold uppercase tracking-wider hover:bg-gray-50 transition-colors"
                    >
                        Cancelar
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
                    >
                        {loading ? <FaSpinner className="animate-spin" /> : <FaSave />}
                        Salvar Emenda
                    </button>
                </div>
            </form>
        </div>
    );
}

