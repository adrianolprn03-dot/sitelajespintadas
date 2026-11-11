"use client";

import { useState, useEffect, useMemo } from "react";
import {
    FaPlaneDeparture, FaSpinner, FaUserTie, FaMapMarker,
    FaCalendar, FaMoneyBillWave, FaBuilding, FaArrowRight,
    FaInfoCircle, FaDownload, FaTable
} from "react-icons/fa";
import {
    FaMagnifyingGlass, FaSuitcaseRolling,
    FaCircleCheck, FaFilter, FaBuildingColumns,
    FaFileSignature, FaChartLine
} from "react-icons/fa6";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    Legend
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import PageHeader from "@/components/PageHeader";
import TransparencyFilters from "@/components/transparencia/TransparencyFilters";
import { exportToCSV, exportToJSON, exportToPDF, exportToXLSX } from "@/lib/exportUtils";
import BannerPNTP from "@/components/transparencia/BannerPNTP";
import LegislacaoClient from "../legislacao/_LegislacaoClient";

const CHART_COLORS = ["#1254A3", "#F39A32", "#10B981", "#0284C7", "#8B5CF6", "#EC4899", "#F59E0B", "#64748B"];

type Diaria = {
    id: string;
    servidor: string;
    cargo: string;
    destino: string;
    motivo: string;
    dataInicio: string;
    dataFim: string;
    valor: number;
    valorUnitario: number;
    quantidadeDias: number;
    secretaria: string;
    mes: number;
    ano: number;
    portariaUrl?: string;
};

const mesesLabels = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const mesesAbrev = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

function fmt(v: number) {
    return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
};

const SECRETARIAS = [
    "Assistência Social",
    "Educação",
    "Gabinete do Prefeito",
    "Turismo, Esporte e Cultura",
    "Saúde",
    "Finanças e Controle",
    "Agricultura e Meio Ambiente",
    "Obras e Infraestrutura",
    "Comunicação e Imprensa",
    "Administração",
    "Procuradoria Jurídica",
];

const PER_PAGE = 20;

export default function DiariasPage() {
    const [diarias, setDiarias] = useState<Diaria[]>([]);
    const [total, setTotal] = useState(0);
    const [totalValorAPI, setTotalValorAPI] = useState(0);
    const [loading, setLoading] = useState(true);
    const [busca, setBusca] = useState("");
    const [ano, setAno] = useState(new Date().getFullYear().toString());
    const [mes, setMes] = useState(""); // vazio = todos os meses
    const [secretaria, setSecretaria] = useState("");
    const [pagina, setPagina] = useState(1);
    const [abaVisual, setAbaVisual] = useState<"lista" | "graficos">("lista");

    useEffect(() => {
        setPagina(1); // resetar paginação ao mudar filtros
    }, [ano, mes, secretaria, busca]);

    useEffect(() => {
        const fetchDiarias = async () => {
            setLoading(true);
            try {
                const params: Record<string, string> = { ano, query: busca };
                if (mes) params.mes = mes;
                if (secretaria) params.secretaria = secretaria;
                const res = await fetch(`/api/diarias?${new URLSearchParams(params)}`);
                const data = await res.json();
                setDiarias(data.items || []);
                setTotal(data.total || 0);
                setTotalValorAPI(data.totalValor || 0);
            } catch (error) {
                console.error("Erro ao buscar diárias:", error);
            } finally {
                setLoading(false);
            }
        };
        const timer = setTimeout(fetchDiarias, 300);
        return () => clearTimeout(timer);
    }, [ano, mes, secretaria, busca]);

    const handleClearFilters = () => {
        setBusca("");
        setAno(new Date().getFullYear().toString());
        setMes("");
        setSecretaria("");
        setPagina(1);
    };

    // Paginação client-side
    const totalPaginas = Math.ceil(diarias.length / PER_PAGE);
    const diariasPaginadas = diarias.slice((pagina - 1) * PER_PAGE, pagina * PER_PAGE);

    const handleExport = (format: "pdf" | "csv" | "json" | "xlsx") => {
        const payload = diarias.map(d => ({
            "Servidor": d.servidor,
            "Cargo": d.cargo,
            "Destino": d.destino,
            "Motivo": d.motivo,
            "Período": `${new Date(d.dataInicio).toLocaleDateString("pt-BR")} a ${new Date(d.dataFim).toLocaleDateString("pt-BR")}`,
            "Qtd": d.quantidadeDias,
            "Valor": fmt(d.valor)
        }));

        const filename = `diarias_lajespintadas_${mes}_${ano}`;
        const title = `Relatório de Concessão de Diárias – Lajes Pintadas/RN (${mesesLabels[Number(mes) - 1]} / ${ano})`;

        if (format === "csv") exportToCSV(payload, filename);
        else if (format === "json") exportToJSON(payload, filename);
        else if (format === "xlsx") exportToXLSX(payload, filename);
        else exportToPDF(payload, filename, title);
    };

    const totalValor = diarias.reduce((acc, curr) => acc + curr.valor, 0);

    // Agrupamento para gráficos
    const dadosPorMes = useMemo(() => {
        const mesesArr = Array.from({ length: 12 }, (_, i) => ({
            name: mesesAbrev[i],
            valor: 0,
            quantidade: 0,
        }));
        diarias.forEach((d) => {
            if (d.mes >= 1 && d.mes <= 12) {
                mesesArr[d.mes - 1].valor += d.valor || 0;
                mesesArr[d.mes - 1].quantidade += 1;
            }
        });
        return mesesArr;
    }, [diarias]);

    const dadosPorSecretaria = useMemo(() => {
        const map: Record<string, number> = {};
        diarias.forEach((d) => {
            const sec = d.secretaria || "Geral";
            map[sec] = (map[sec] || 0) + (d.valor || 0);
        });
        return Object.entries(map)
            .map(([name, valor]) => ({ name, valor }))
            .sort((a, b) => b.valor - a.valor)
            .slice(0, 6);
    }, [diarias]);

    return (
        <div className="min-h-screen bg-[#F5F7FA] font-['Montserrat',sans-serif]">
            <PageHeader
                title="Diárias de Viagem"
                subtitle="Transparência sobre valores pagos para cobertura de despesas em missões oficiais."
                variant="premium"
                icon={<FaPlaneDeparture />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Diárias" }
                ]}
            />

            <motion.main
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="max-w-[1240px] mx-auto px-6 py-10 relative z-30"
            >
                {/* Summary Section - Padrão Novo Modelo */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10 items-stretch">

                    {/* Primary Highlight Card */}
                    <div className="lg:col-span-2 bg-white rounded-2xl p-7 sm:p-8 shadow-sm border border-[#DDE3EA] relative overflow-hidden flex flex-col justify-between">
                        <div>
                            <div className="flex flex-wrap items-center gap-3 mb-6">
                                <span className="flex items-center gap-1.5 px-3 py-1 bg-[#EEF4FB] text-[#1254A3] rounded-lg text-[11px] font-black uppercase tracking-wider border border-[#DDE3EA]">
                                    <div className="w-2 h-2 rounded-full bg-[#1254A3] animate-pulse" />
                                    Missões Autorizadas
                                </span>
                                <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[11px] font-black uppercase tracking-wider border border-emerald-100">
                                    <FaCircleCheck size={11} /> LAI · PNTP 7.1
                                </span>
                            </div>

                            <p className="text-xs font-bold uppercase tracking-widest text-[#5B738B] mb-1">
                                Volume de Desembolso com Diárias
                            </p>
                            <div className="text-4xl sm:text-5xl font-black text-[#12304A] tracking-tight">
                                {loading ? <FaSpinner className="animate-spin text-3xl text-[#1254A3]" /> : fmt(totalValor)}
                            </div>
                        </div>

                        <div className="mt-8 flex flex-wrap gap-8 items-center border-t border-[#DDE3EA] pt-6">
                            <div className="flex flex-col">
                                <span className="text-[11px] font-bold uppercase text-[#5B738B] mb-0.5">Ano base</span>
                                <span className="text-xl font-black text-[#12304A]">{mes ? `${mesesAbrev[Number(mes) - 1]} / ` : ''}{ano}</span>
                            </div>
                            <div className="w-px h-8 bg-[#DDE3EA] hidden md:block" />
                            <div className="flex flex-col">
                                <span className="text-[11px] font-bold uppercase text-[#5B738B] mb-0.5">Concessões no Período</span>
                                <span className="text-xl font-black text-[#1254A3]">{diarias.length} <span className="text-sm font-bold text-[#5B738B]">diárias</span></span>
                            </div>
                        </div>
                    </div>

                    {/* Secondary Context Card */}
                    <div className="bg-white rounded-2xl p-7 sm:p-8 shadow-sm border border-[#DDE3EA] flex flex-col justify-between">
                        <div>
                            <div className="w-14 h-14 bg-[#EEF4FB] text-[#1254A3] rounded-xl flex items-center justify-center text-2xl mb-5 border border-[#DDE3EA]">
                                <FaSuitcaseRolling />
                            </div>
                            <h4 className="text-lg font-black text-[#12304A] tracking-tight mb-2">
                                Missões Oficiais
                            </h4>
                            <p className="text-xs text-[#5B738B] leading-relaxed">
                                Controle de diárias pagas para cobertura de alimentação e hospedagem em deslocamentos a serviço do município.
                            </p>
                        </div>
                        <div className="pt-5 border-t border-[#DDE3EA] flex items-center justify-between text-xs font-bold text-[#5B738B]">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-[#1254A3] animate-pulse" />
                                <span>Base Integrada SIAFIC</span>
                            </div>
                            <FaCircleCheck className="text-emerald-500" />
                        </div>
                    </div>
                </motion.div>

                {/* PNTP Requirements Section - Regulation & Values Table */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Regulation Card */}
                    <a
                        href="/uploads/diarias/regulamentacao.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white rounded-2xl p-6 border border-[#DDE3EA] shadow-sm hover:shadow-md transition-all flex items-center justify-between group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-[#EEF4FB] text-[#1254A3] rounded-xl flex items-center justify-center text-xl border border-[#DDE3EA]">
                                <FaBuildingColumns />
                            </div>
                            <div>
                                <h4 className="text-sm font-black text-[#12304A]">Regulamentação Municipal</h4>
                                <p className="text-xs text-[#5B738B]">Normativa e Decretos de Concessão</p>
                            </div>
                        </div>
                        <span className="text-xs font-bold text-[#1254A3] group-hover:underline flex items-center gap-1">
                            Acessar <FaArrowRight size={10} />
                        </span>
                    </a>

                    {/* Values Table Card */}
                    <a
                        href="/transparencia/tabela-diarias"
                        className="bg-white rounded-2xl p-6 border border-[#DDE3EA] shadow-sm hover:shadow-md transition-all flex items-center justify-between group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-xl border border-emerald-100">
                                <FaMoneyBillWave />
                            </div>
                            <div>
                                <h4 className="text-sm font-black text-[#12304A]">Tabela de Valores</h4>
                                <p className="text-xs text-[#5B738B]">Valores por Cargo e Destino</p>
                            </div>
                        </div>
                        <span className="text-xs font-bold text-emerald-600 group-hover:underline flex items-center gap-1">
                            Acessar <FaArrowRight size={10} />
                        </span>
                    </a>
                </motion.div>

                {/* Declaração Oficial Banner */}
                <motion.div variants={itemVariants} className="bg-amber-50 border-l-4 border-[#F39A32] rounded-xl p-5 flex items-center gap-4 mb-8">
                    <FaInfoCircle className="text-[#F39A32] text-2xl shrink-0" />
                    <div>
                        <h4 className="text-xs font-black uppercase text-[#12304A] tracking-wider mb-0.5">Declaração Oficial de Não Ocorrência</h4>
                        <p className="text-xs text-[#5B738B]">
                            Declaração de inexistência de regulamentação ou realização de despesas com Diárias Internacionais no exercício.
                        </p>
                    </div>
                </motion.div>

                {/* Filters Section */}
                <motion.div variants={itemVariants} className="mb-8">
                    <TransparencyFilters
                        searchValue={busca}
                        onSearch={setBusca}
                        currentYear={ano}
                        onYearChange={setAno}
                        currentMonth={mes}
                        onMonthChange={setMes}
                        onClear={handleClearFilters}
                        onExport={handleExport}
                        placeholder="Pesquisar por servidor, destino ou motivo da missão..."
                    >
                        <div className="flex flex-wrap gap-3 items-center">
                            <div className="relative">
                                <select
                                    value={secretaria}
                                    onChange={(e) => setSecretaria(e.target.value)}
                                    className="px-4 py-2.5 bg-[#F5F7FA] border border-[#DDE3EA] rounded-xl text-xs font-bold text-[#12304A] outline-none focus:border-[#1254A3]"
                                >
                                    <option value="">Todas as Secretarias</option>
                                    {SECRETARIAS.map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </TransparencyFilters>
                </motion.div>

                {/* View Switcher: Lista vs Gráficos */}
                <div className="flex bg-white p-1 rounded-xl border border-[#DDE3EA] w-fit mb-8 shadow-sm">
                    <button
                        onClick={() => setAbaVisual("lista")}
                        className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                            abaVisual === "lista"
                                ? "bg-[#1254A3] text-white shadow-sm"
                                : "text-[#5B738B] hover:text-[#1254A3]"
                        }`}
                    >
                        <FaTable size={13} /> Lista de Concessões ({diarias.length})
                    </button>
                    <button
                        onClick={() => setAbaVisual("graficos")}
                        className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                            abaVisual === "graficos"
                                ? "bg-[#1254A3] text-white shadow-sm"
                                : "text-[#5B738B] hover:text-[#1254A3]"
                        }`}
                    >
                        <FaChartLine size={13} /> Gráficos nos Resultados
                    </button>
                </div>

                {abaVisual === "graficos" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12"
                    >
                        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#DDE3EA] shadow-sm">
                            <h3 className="text-base font-black text-[#12304A] mb-1">
                                Evolução Mensal do Pagamento de Diárias
                            </h3>
                            <p className="text-xs text-[#5B738B] mb-4">
                                Desembolsos autorizados mês a mês no exercício de {ano}.
                            </p>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={dadosPorMes}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                        <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#5B738B" }} />
                                        <YAxis tick={{ fontSize: 11, fill: "#5B738B" }} tickFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}k`} />
                                        <Tooltip formatter={(v: number) => [fmt(v), "Total em Diárias"]} />
                                        <Bar dataKey="valor" fill="#1254A3" radius={[6, 6, 0, 0]}>
                                            {dadosPorMes.map((_, i) => (
                                                <Cell key={`cell-dmes-${i}`} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#DDE3EA] shadow-sm">
                            <h3 className="text-base font-black text-[#12304A] mb-1">
                                Diárias por Secretaria / Órgão
                            </h3>
                            <p className="text-xs text-[#5B738B] mb-4">
                                Maiores volumes de diárias concedidas por secretaria.
                            </p>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={dadosPorSecretaria} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                                        <XAxis type="number" tick={{ fontSize: 10, fill: "#5B738B" }} tickFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}k`} />
                                        <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 10, fill: "#12304A" }} />
                                        <Tooltip formatter={(v: number) => [fmt(v), "Total Gasto"]} />
                                        <Bar dataKey="valor" fill="#F39A32" radius={[0, 6, 6, 0]}>
                                            {dadosPorSecretaria.map((_, i) => (
                                                <Cell key={`cell-dsec-${i}`} fill={CHART_COLORS[(i + 1) % CHART_COLORS.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Main Content Area */}
                <div className="space-y-12">
                    <AnimatePresence mode="wait">
                        {loading ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="bg-white rounded-[3rem] p-32 text-center border border-slate-100 shadow-2xl shadow-slate-200/30"
                            >
                                <div className="relative inline-block mb-8">
                                    <div className="w-24 h-24 border-8 border-slate-100 rounded-full" />
                                    <div className="absolute inset-0 border-8 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                    <FaPlaneDeparture className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-100" size={40} />
                                </div>
                                <p className="text-[12px] font-black text-slate-300 uppercase tracking-[0.5em] animate-pulse">Sincronizando Atos de Concessão</p>
                            </motion.div>
                        ) : diarias.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white rounded-2xl p-16 text-center border border-[#DDE3EA] shadow-sm"
                            >
                                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                                    <FaMagnifyingGlass className="text-slate-400 text-2xl" />
                                </div>
                                <h4 className="text-xl font-bold text-[#12304A] mb-2">Nenhuma diária localizada</h4>
                                <p className="text-[#5B738B] text-sm mb-6">Verifique os filtros aplicados ou consulte outro período fiscal.</p>
                                <button onClick={handleClearFilters} className="px-6 py-2.5 bg-[#1254A3] text-white rounded-xl text-xs font-bold hover:bg-[#0d3f7c] transition-all shadow-sm active:scale-95">Resetar Filtros</button>
                            </motion.div>
                        ) : (
                            <motion.div
                                variants={containerVariants}
                                className="bg-white rounded-2xl border border-[#DDE3EA] shadow-sm overflow-hidden"
                            >
                                {/* Cabeçalho da Tabela */}
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-[#F5F7FA] border-b border-[#DDE3EA]">
                                                <th className="px-6 py-4 text-xs font-bold text-[#5B738B] uppercase tracking-wider">Servidor / Cargo / Unidade</th>
                                                <th className="px-6 py-4 text-xs font-bold text-[#5B738B] uppercase tracking-wider">Destino / Motivo</th>
                                                <th className="px-6 py-4 text-xs font-bold text-[#5B738B] uppercase tracking-wider">Período</th>
                                                <th className="px-6 py-4 text-xs font-bold text-[#5B738B] uppercase tracking-wider text-center">Qtd</th>
                                                <th className="px-6 py-4 text-xs font-bold text-[#5B738B] uppercase tracking-wider text-right">Vlr. Unitário</th>
                                                <th className="px-6 py-4 text-xs font-bold text-[#5B738B] uppercase tracking-wider text-right">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {diariasPaginadas.map((d, idx) => (
                                                <motion.tr
                                                    key={d.id}
                                                    variants={itemVariants}
                                                    className="group hover:bg-[#EEF4FB] transition-all duration-200 border-b border-[#DDE3EA] last:border-0"
                                                >
                                                    <td className="px-8 py-8">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm">
                                                                <FaUserTie size={18} />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-black text-slate-900 uppercase tracking-tight leading-tight mb-1">{d.servidor}</p>
                                                                <div className="flex flex-col gap-1">
                                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{d.cargo}</span>
                                                                    <span className="inline-flex w-fit px-2 py-0.5 bg-blue-50 text-blue-600 text-[8px] font-black uppercase tracking-widest rounded-md border border-blue-100">
                                                                        {d.secretaria}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-8 max-w-[250px]">
                                                        <p className="text-[11px] font-black text-slate-800 uppercase tracking-tight mb-1 truncate">{d.destino}</p>
                                                        <p className="text-[10px] text-slate-400 font-bold italic line-clamp-2 leading-relaxed mb-3">"{d.motivo}"</p>
                                                        <a
                                                            href={d.portariaUrl || `/transparencia/diarias/portaria-${d.id}.pdf`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all border border-slate-200 hover:border-blue-200"
                                                        >
                                                            <FaFileSignature size={10} /> Ver Portaria
                                                        </a>
                                                    </td>
                                                    <td className="px-8 py-8">
                                                        <div className="flex flex-col">
                                                            <span className="text-[10px] font-black text-slate-900 tracking-tight">{new Date(d.dataInicio).toLocaleDateString("pt-BR")}</span>
                                                            <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-0.5">até {new Date(d.dataFim).toLocaleDateString("pt-BR")}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-8 text-center">
                                                        <span className="inline-flex items-center justify-center px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-black rounded-lg">
                                                            {d.quantidadeDias}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-8 text-right">
                                                        <span className="text-[11px] font-bold text-slate-400 tracking-tight">
                                                            {fmt(d.valorUnitario || 0)}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-8 text-right">
                                                        <span className="text-sm font-black text-emerald-600 tracking-tight">
                                                            {fmt(d.valor)}
                                                        </span>
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Rodapé da Tabela / Paginação */}
                                <div className="px-8 py-8 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-6">
                                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                                        Exibindo <span className="text-slate-800">{(pagina - 1) * PER_PAGE + 1}–{Math.min(pagina * PER_PAGE, diarias.length)}</span> de <span className="text-blue-600">{diarias.length}</span> resultados
                                    </p>

                                    {totalPaginas > 1 && (
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setPagina(p => Math.max(1, p - 1))}
                                                disabled={pagina === 1}
                                                className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-xl text-slate-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 disabled:opacity-30 transition-all shadow-sm"
                                            >
                                                &larr;
                                            </button>

                                            {/* Paginação Inteligente (Simplificada para o exemplo) */}
                                            {Array.from({ length: Math.min(5, totalPaginas) }, (_, i) => {
                                                const p = i + 1;
                                                return (
                                                    <button
                                                        key={p}
                                                        onClick={() => setPagina(p)}
                                                        className={`w-10 h-10 rounded-xl text-[10px] font-black transition-all border ${p === pagina ? 'bg-blue-600 text-white border-blue-600 shadow-blue-500/20 shadow-lg' : 'bg-white border-slate-200 text-slate-500 hover:border-blue-400'}`}
                                                    >
                                                        {p}
                                                    </button>
                                                );
                                            })}

                                            <button
                                                onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))}
                                                disabled={pagina === totalPaginas}
                                                className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-xl text-slate-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 disabled:opacity-30 transition-all shadow-sm"
                                            >
                                                &rarr;
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Regulation Section */}
                <motion.div variants={itemVariants} className="mt-16 pt-12 border-t border-[#DDE3EA]">
                    <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
                        <div className="w-14 h-14 bg-[#1254A3] text-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
                            <FaCalendar size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-[#12304A]">Atos Oficiais <span className="text-[#1254A3]">de Concessão</span></h2>
                            <p className="text-xs text-[#5B738B] font-bold uppercase tracking-wider flex items-center gap-2 mt-1">
                                <span className="w-6 h-1 bg-[#F39A32] rounded-full" /> Base Legal e Normativas de Missões Oficiais
                            </p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-[#DDE3EA] shadow-sm">
                        <LegislacaoClient initialTipo="portaria_diaria" hideTipoFilter={true} />
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="mt-24">
                    <BannerPNTP />
                    <div className="mt-20 text-center">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em] leading-[2] max-w-2xl mx-auto">
                            GESTÃO DE DIÁRIAS E PASSAGENS • PREFEITURA DE LAJES PINTADAS/RN <br />
                            <span className="opacity-40 font-bold italic">Processamento eletrônico em conformidade com as recomendações do Ministério Público Estadual.</span>
                        </p>
                    </div>
                </motion.div>
            </motion.main>
        </div>
    );
}
