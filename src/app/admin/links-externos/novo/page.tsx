"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import {
    CATEGORIAS_LINKS_EXTERNOS,
    MODULOS_ALVO_OPTIONS,
    ICONES_OPTIONS,
    getIconComponent,
} from "@/lib/links-externos-config";

export default function NovoLinkExternoPage() {
    const router = useRouter();
    const [salvando, setSalvando] = useState(false);
    const [form, setForm] = useState({
        titulo: "",
        url: "",
        descricao: "",
        categoria: "transparencia",
        icone: "FaLink",
        ativo: true,
        ordem: 0,
        moduloAlvo: "",
    });

    const SelectedIcon = getIconComponent(form.icone);

    // Agrupa módulos por grupo para renderização em optgroups
    const gruposModulos = Array.from(new Set(MODULOS_ALVO_OPTIONS.map((m) => m.grupo)));

    // Agrupa ícones por grupo
    const gruposIcones = Array.from(new Set(ICONES_OPTIONS.map((i) => i.grupo)));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.titulo || !form.url || !form.categoria) {
            toast.error("Preencha os campos obrigatórios.");
            return;
        }

        // Normalização da URL
        let urlFinal = form.url.trim();
        if (urlFinal && !urlFinal.startsWith("http://") && !urlFinal.startsWith("https://")) {
            urlFinal = `https://${urlFinal}`;
        }

        setSalvando(true);
        try {
            const res = await fetch("/api/admin/links-externos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, url: urlFinal }),
            });
            if (res.ok) {
                toast.success("Link externo salvo com sucesso!");
                router.push("/admin/links-externos");
            } else {
                toast.error("Erro ao salvar link.");
            }
        } catch {
            toast.error("Erro de conexão.");
        } finally {
            setSalvando(false);
        }
    };

    return (
        <div className="p-6 max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/links-externos"
                    className="p-2.5 text-gray-400 hover:text-[#1254A3] hover:bg-blue-50 rounded-xl transition-colors border border-gray-200"
                >
                    <FaArrowLeft />
                </Link>
                <div>
                    <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1254A3] text-[10px] font-bold uppercase tracking-wider mb-1">
                        Portal Institucional • Administração
                    </div>
                    <h1 className="text-2xl font-black text-[#12304A] font-heading tracking-tight">
                        Novo Link Externo
                    </h1>
                    <p className="text-xs text-[#5B738B]">
                        Cadastre links oficiais, sistemas externos ou vincule redirecionamentos a cards da página inicial e do Portal da Transparência.
                    </p>
                </div>
            </div>

            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl border border-[#DDE3EA] shadow-sm p-6 sm:p-8 space-y-6"
            >
                {/* 1. TÍTULO */}
                <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#12304A] mb-1.5">
                        Título do Link *
                    </label>
                    <input
                        type="text"
                        required
                        value={form.titulo}
                        onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                        placeholder="Ex: Sistema do PNCP, Consulta de Diárias no TCE, Folha Betha..."
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#12304A] focus:ring-2 focus:ring-[#1254A3] focus:border-transparent outline-none transition-all"
                    />
                </div>

                {/* 2. URL */}
                <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#12304A] mb-1.5">
                        URL de Destino (Link Externo) *
                    </label>
                    <input
                        type="url"
                        required
                        value={form.url}
                        onChange={(e) => setForm({ ...form, url: e.target.value })}
                        placeholder="https://..."
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#12304A] focus:ring-2 focus:ring-[#1254A3] focus:border-transparent outline-none transition-all"
                    />
                    <p className="text-[11px] text-[#5B738B] mt-1">
                        Insira o endereço completo com <span className="font-mono text-xs">https://</span>. O usuário será direcionado em uma nova aba com segurança.
                    </p>
                </div>

                {/* 3. DESCRIÇÃO */}
                <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#12304A] mb-1.5">
                        Descrição / Resumo (Opcional)
                    </label>
                    <input
                        type="text"
                        value={form.descricao}
                        onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                        placeholder="Breve resumo sobre este link ou orientações para o cidadão..."
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#12304A] focus:ring-2 focus:ring-[#1254A3] focus:border-transparent outline-none transition-all"
                    />
                </div>

                {/* 4. CATEGORIA E ÍCONE */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#12304A] mb-1.5">
                            Categoria do Link *
                        </label>
                        <select
                            required
                            value={form.categoria}
                            onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#12304A] focus:ring-2 focus:ring-[#1254A3] focus:border-transparent outline-none bg-white transition-all font-medium"
                        >
                            {CATEGORIAS_LINKS_EXTERNOS.map((c) => (
                                <option key={c.value} value={c.value}>
                                    {c.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#12304A] mb-1.5">
                            Ícone Representativo
                        </label>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-[#1254A3] flex items-center justify-center text-lg shrink-0 shadow-sm">
                                <SelectedIcon />
                            </div>
                            <select
                                value={form.icone}
                                onChange={(e) => setForm({ ...form, icone: e.target.value })}
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#12304A] focus:ring-2 focus:ring-[#1254A3] focus:border-transparent outline-none bg-white transition-all font-medium"
                            >
                                {gruposIcones.map((grupo) => (
                                    <optgroup key={grupo} label={grupo}>
                                        {ICONES_OPTIONS.filter((i) => i.grupo === grupo).map((i) => (
                                            <option key={i.value} value={i.value}>
                                                {i.label}
                                            </option>
                                        ))}
                                    </optgroup>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* 5. VÍNCULO A CARD/MÓDULO EXISTENTE (DESTAQUE PRINCIPAL) */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#F5F8FC] border border-blue-200/70 space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#1254A3]">
                            Vincular a um Card ou Módulo Existente
                        </label>
                        <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-blue-100 text-[#1254A3]">
                            Redirecionamento Automático
                        </span>
                    </div>

                    <select
                        value={form.moduloAlvo}
                        onChange={(e) => setForm({ ...form, moduloAlvo: e.target.value })}
                        className="w-full border border-blue-200 rounded-xl px-4 py-2.5 text-sm text-[#12304A] font-semibold focus:ring-2 focus:ring-[#1254A3] focus:border-transparent outline-none bg-white shadow-sm transition-all"
                    >
                        {gruposModulos.map((grupo) => (
                            <optgroup key={grupo} label={grupo}>
                                {MODULOS_ALVO_OPTIONS.filter((m) => m.grupo === grupo).map((m) => (
                                    <option key={m.value} value={m.value}>
                                        {m.label}
                                    </option>
                                ))}
                            </optgroup>
                        ))}
                    </select>

                    <p className="text-[11px] text-[#5B738B] leading-relaxed pt-1">
                        💡 <strong>Como funciona:</strong> Ao selecionar um card (ex: <em>Obras Paralisadas</em>, <em>Fiscais de Contratos</em>, <em>Sanções</em>, <em>PAS</em>, <em>RAG</em> ou atalhos da Home), o clique no card no site público passará a abrir diretamente o link externo configurado acima com selo de link externo.
                    </p>
                </div>

                {/* 6. ORDEM E ATIVO */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-center">
                    <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#12304A] mb-1.5">
                            Ordem de Exibição
                        </label>
                        <input
                            type="number"
                            min={0}
                            value={form.ordem}
                            onChange={(e) => setForm({ ...form, ordem: parseInt(e.target.value) || 0 })}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm text-[#12304A] focus:ring-2 focus:ring-[#1254A3] focus:border-transparent outline-none transition-all"
                        />
                        <p className="text-[10px] text-[#5B738B] mt-1">
                            Ordem numérica (menor número = maior prioridade).
                        </p>
                    </div>

                    <div className="flex items-center gap-3 pt-2 sm:pt-4">
                        <input
                            type="checkbox"
                            id="ativo"
                            checked={form.ativo}
                            onChange={(e) => setForm({ ...form, ativo: e.target.checked })}
                            className="w-5 h-5 text-[#1254A3] rounded border-gray-300 focus:ring-[#1254A3] cursor-pointer"
                        />
                        <label htmlFor="ativo" className="text-sm font-bold text-[#12304A] cursor-pointer">
                            Link Ativo (Visível no portal público)
                        </label>
                    </div>
                </div>

                {/* BOTÕES DE AÇÃO */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                    <button
                        type="submit"
                        disabled={salvando}
                        className="flex items-center gap-2 bg-[#1254A3] hover:bg-[#0d4282] text-white font-bold text-xs px-6 py-3 rounded-xl shadow-sm transition-all disabled:opacity-50"
                    >
                        <FaSave />
                        <span>{salvando ? "Salvando Link..." : "Salvar Link Externo"}</span>
                    </button>
                    <Link
                        href="/admin/links-externos"
                        className="px-5 py-3 border border-gray-200 text-[#5B738B] hover:text-[#12304A] font-bold text-xs rounded-xl hover:bg-gray-50 transition-colors"
                    >
                        Cancelar
                    </Link>
                </div>
            </form>
        </div>
    );
}
