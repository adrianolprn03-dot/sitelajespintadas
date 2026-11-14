"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import BannerPNTP from "@/components/transparencia/BannerPNTP";
import { exportToCSV, exportToPDF, exportToXLSX } from "@/lib/exportUtils";
import {
    FaHospital,
    FaSearch,
    FaDownload,
    FaClock,
    FaMapPin,
    FaPhone,
    FaCheckCircle,
    FaSpinner,
    FaMapMarkedAlt,
} from "react-icons/fa";

type UnidadeSaude = {
    id: string;
    nome: string;
    tipo: string;
    descricao: string;
    endereco: string;
    telefone: string | null;
    horario: string;
    mapa: string | null;
    ativa: boolean;
};

export default function UnidadesSaudeTransparenciaPage() {
    const [unidades, setUnidades] = useState<UnidadeSaude[]>([]);
    const [loading, setLoading] = useState(true);
    const [busca, setBusca] = useState("");
    const [filtroCategoria, setFiltroCategoria] = useState("todos");

    useEffect(() => {
        async function fetchUnidades() {
            setLoading(true);
            try {
                const res = await fetch("/api/unidades?tipo=saude", { cache: "no-store" });
                if (res.ok) {
                    const data = await res.json();
                    setUnidades(Array.isArray(data) ? data : []);
                }
            } catch (err) {
                console.error("Erro ao carregar unidades de saúde:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchUnidades();
    }, []);

    const filtered = useMemo(() => {
        const term = busca.toLowerCase().trim();
        return unidades.filter((u) => {
            const nomeLower = u.nome.toLowerCase();
            const descLower = (u.descricao || "").toLowerCase();
            const matchesCat =
                filtroCategoria === "todos" ||
                (filtroCategoria === "ubs" && (nomeLower.includes("ubs") || nomeLower.includes("unidade básica") || nomeLower.includes("unidade basica") || descLower.includes("ubs"))) ||
                (filtroCategoria === "hospital" && (nomeLower.includes("hospital") || nomeLower.includes("maternidade") || nomeLower.includes("pronto") || nomeLower.includes("ums")));

            const matchesBusca =
                !term ||
                nomeLower.includes(term) ||
                descLower.includes(term) ||
                (u.endereco || "").toLowerCase().includes(term) ||
                (u.horario || "").toLowerCase().includes(term);

            return matchesCat && matchesBusca;
        });
    }, [unidades, busca, filtroCategoria]);

    const handleExport = (format: "pdf" | "xlsx" | "csv") => {
        const payload = filtered.map((u) => ({
            "Unidade de Saúde": u.nome,
            "Tipo": "Saúde (SUS Municipal)",
            "Descrição / Serviços": u.descricao,
            "Endereço": u.endereco,
            "Telefone": u.telefone || "Não informado",
            "Horário de Atendimento": u.horario,
        }));
        const filename = "unidades_saude_lajes_pintadas";
        if (format === "pdf") exportToPDF(payload, filename, "Unidades de Saúde Municipal");
        else if (format === "xlsx") exportToXLSX(payload, filename);
        else exportToCSV(payload, filename);
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] font-['Montserrat',sans-serif]">
            <PageHeader
                title="Unidades de Saúde"
                subtitle="Endereços, horários de funcionamento, telefones e serviços disponíveis na rede pública municipal de saúde."
                variant="premium"
                icon={<FaHospital />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Unidades de Saúde" },
                ]}
            />

            <main className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 space-y-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-[#1254A3] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                            Critério PNTP • Transparência Ativa da Saúde
                        </span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] font-bold text-[#5B738B] mr-1 hidden md:inline">
                            Exportar Unidades:
                        </span>
                        <button
                            onClick={() => handleExport("pdf")}
                            disabled={filtered.length === 0}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#DDE3EA] text-[#12304A] rounded-lg text-xs font-bold hover:border-[#1254A3] transition-all shadow-sm cursor-pointer disabled:opacity-50"
                        >
                            <FaDownload size={10} /> PDF
                        </button>
                        <button
                            onClick={() => handleExport("xlsx")}
                            disabled={filtered.length === 0}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#DDE3EA] text-[#12304A] rounded-lg text-xs font-bold hover:border-[#1254A3] transition-all shadow-sm cursor-pointer disabled:opacity-50"
                        >
                            <FaDownload size={10} /> Excel
                        </button>
                        <button
                            onClick={() => handleExport("csv")}
                            disabled={filtered.length === 0}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#DDE3EA] text-[#12304A] rounded-lg text-xs font-bold hover:border-[#1254A3] transition-all shadow-sm cursor-pointer disabled:opacity-50"
                        >
                            <FaDownload size={10} /> CSV
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-[#DDE3EA] shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-[#5B738B] uppercase tracking-wider mb-2">
                                Buscar por Unidade, Serviço, Endereço ou Horário
                            </label>
                            <div className="relative">
                                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    value={busca}
                                    onChange={(e) => setBusca(e.target.value)}
                                    placeholder="Ex: UBS, Hospital, Centro, Consulta..."
                                    className="w-full bg-[#F5F7FA] border border-[#DDE3EA] rounded-xl pl-11 pr-4 py-2.5 text-xs font-medium text-[#12304A] focus:border-[#1254A3] focus:bg-white outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-[#5B738B] uppercase tracking-wider mb-2">
                                Tipo de Unidade
                            </label>
                            <select
                                value={filtroCategoria}
                                onChange={(e) => setFiltroCategoria(e.target.value)}
                                className="w-full bg-[#F5F7FA] border border-[#DDE3EA] rounded-xl px-4 py-2.5 text-xs font-bold text-[#12304A] focus:border-[#1254A3] outline-none"
                            >
                                <option value="todos">Todas as Unidades ({unidades.length})</option>
                                <option value="ubs">Unidades Básicas de Saúde (UBS)</option>
                                <option value="hospital">Hospital / Unidade Mista</option>
                            </select>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="bg-white rounded-3xl border border-[#DDE3EA] p-16 text-center text-slate-500 space-y-3">
                        <FaSpinner className="animate-spin text-2xl text-[#1254A3] mx-auto" />
                        <p className="text-xs font-bold uppercase tracking-wider">Carregando unidades de saúde...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-dashed border-[#DDE3EA] p-16 text-center space-y-3">
                        <FaHospital className="text-4xl text-slate-300 mx-auto" />
                        <h3 className="text-lg font-black text-[#12304A] uppercase tracking-tight">
                            Nenhuma unidade de saúde encontrada
                        </h3>
                        <p className="text-xs text-[#5B738B] max-w-md mx-auto">
                            {unidades.length === 0
                                ? "Não há unidades de saúde ativas cadastradas no momento."
                                : "Tente ajustar os termos de busca ou o filtro selecionado."}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {filtered.map((u) => (
                            <div
                                key={u.id}
                                className="bg-white rounded-3xl border border-[#DDE3EA] shadow-sm hover:border-[#1254A3]/50 transition-all overflow-hidden flex flex-col justify-between"
                            >
                                <div>
                                    <div className="p-6 sm:p-8 bg-gradient-to-r from-blue-900 to-[#1254A3] text-white">
                                        <div className="flex items-center justify-between gap-4 mb-3">
                                            <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full border border-white/20">
                                                Saúde • SUS Municipal
                                            </span>
                                            <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                                                <FaClock size={11} /> {u.horario}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-black tracking-tight">{u.nome}</h3>
                                        <p className="text-xs text-blue-100/90 mt-1 leading-relaxed">{u.descricao}</p>
                                    </div>

                                    <div className="p-6 sm:p-8 space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                            <div className="bg-[#F5F7FA] p-3.5 rounded-xl border border-[#DDE3EA]">
                                                <span className="text-[10px] font-bold text-[#5B738B] uppercase block mb-1 flex items-center gap-1">
                                                    <FaMapPin className="text-[#1254A3]" /> Localização / Endereço
                                                </span>
                                                <span className="font-bold text-[#12304A]">{u.endereco}</span>
                                            </div>

                                            <div className="bg-[#F5F7FA] p-3.5 rounded-xl border border-[#DDE3EA]">
                                                <span className="text-[10px] font-bold text-[#5B738B] uppercase block mb-1 flex items-center gap-1">
                                                    <FaPhone className="text-[#1254A3]" /> Telefone de Contato
                                                </span>
                                                <span className="font-bold text-[#12304A]">{u.telefone || "Central Municipal"}</span>
                                            </div>
                                        </div>

                                        {u.mapa && (
                                            <div className="pt-1">
                                                <Link
                                                    href={u.mapa}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 text-xs font-bold text-[#1254A3] hover:underline"
                                                >
                                                    <FaMapMarkedAlt /> Ver localização no mapa
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="p-4 bg-[#F5F7FA] border-t border-[#DDE3EA] flex items-center justify-between text-xs">
                                    <span className="text-[#5B738B] font-medium">SUS Municipal</span>
                                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                                        <FaCheckCircle size={11} /> Unidade Ativa
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <BannerPNTP />
            </main>
        </div>
    );
}
