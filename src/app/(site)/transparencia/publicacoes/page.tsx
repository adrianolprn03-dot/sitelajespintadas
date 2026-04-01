"use client";
import { useState, useEffect } from "react";
import { FaNewspaper, FaSpinner, FaDownload, FaSearch, FaCalendarAlt, FaTag, FaFilter } from "react-icons/fa";
import { FileText } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import BannerPNTP from "@/components/transparencia/BannerPNTP";
import { exportToCSV, exportToJSON, exportToPDF } from "@/lib/exportUtils";
import TransparencyFilters from "@/components/transparencia/TransparencyFilters";

type Publicacao = {
    id: string;
    titulo: string;
    tipo: string;
    descricao: string;
    dataPublicacao: string;
    ano: number;
    secretaria: string;
    arquivo: string | null;
};

const TIPOS = [
    "Diário Oficial",
    "Edital",
    "Aviso",
    "Resultado",
    "Extrato de Contrato",
    "Extrato de Convênio",
    "Nota de Esclarecimento",
    "Portaria",
    "Resolução",
];

const TIPO_COR: Record<string, string> = {
    "Diário Oficial": "bg-blue-100 text-blue-700 border-blue-200",
    "Edital": "bg-purple-100 text-purple-700 border-purple-200",
    "Aviso": "bg-amber-100 text-amber-700 border-amber-200",
    "Resultado": "bg-emerald-100 text-emerald-700 border-emerald-200",
    "Extrato de Contrato": "bg-orange-100 text-orange-700 border-orange-200",
    "Extrato de Convênio": "bg-cyan-100 text-cyan-700 border-cyan-200",
    "Nota de Esclarecimento": "bg-gray-100 text-gray-700 border-gray-200",
    "Portaria": "bg-slate-100 text-slate-700 border-slate-200",
    "Resolução": "bg-rose-100 text-rose-700 border-rose-200",
};

const MOCK: Publicacao[] = [
    { id: "1", titulo: "Diário Oficial nº 001 – Janeiro/2026", tipo: "Diário Oficial", descricao: "Publicação oficial dos atos administrativos do mês de Janeiro de 2026.", dataPublicacao: "2026-01-31", ano: 2026, secretaria: "Administração", arquivo: null },
    { id: "2", titulo: "Aviso de Licitação – Pregão Eletrônico nº 006/2026", tipo: "Aviso", descricao: "Aviso de abertura de processo licitatório para aquisição de material de construção.", dataPublicacao: "2026-02-10", ano: 2026, secretaria: "Compras", arquivo: null },
    { id: "3", titulo: "Resultado – Concorrência nº 001/2026", tipo: "Resultado", descricao: "Resultado de julgamento da Concorrência nº 001/2026 – obra de ampliação da escola municipal.", dataPublicacao: "2026-02-20", ano: 2026, secretaria: "Obras", arquivo: null },
    { id: "4", titulo: "Extrato – Contrato nº 015/2026", tipo: "Extrato de Contrato", descricao: "Extrato do contrato firmado com a empresa XYZ para prestação de serviços de limpeza.", dataPublicacao: "2026-03-05", ano: 2026, secretaria: "Administração", arquivo: null },
    { id: "5", titulo: "Portaria nº 024/2026 – Designação de Fiscal", tipo: "Portaria", descricao: "Designa servidor para atuar como fiscal do Contrato nº 015/2026.", dataPublicacao: "2026-03-07", ano: 2026, secretaria: "Administração", arquivo: null },
    { id: "6", titulo: "Diário Oficial nº 002 – Fevereiro/2026", tipo: "Diário Oficial", descricao: "Publicação oficial dos atos administrativos do mês de Fevereiro de 2026.", dataPublicacao: "2026-02-28", ano: 2026, secretaria: "Administração", arquivo: null },
];

export default function PublicacoesPage() {
    const [publicacoes, setPublicacoes] = useState<Publicacao[]>([]);
    const [loading, setLoading] = useState(true);
    const [busca, setBusca] = useState("");
    const [ano, setAno] = useState(new Date().getFullYear().toString());
    const [mes, setMes] = useState("");
    const [tipoFiltro, setTipoFiltro] = useState("");

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setPublicacoes(MOCK);
            setLoading(false);
        }, 500);
    }, [ano, mes, tipoFiltro]);

    const filtradas = publicacoes.filter(p => {
        const b = busca.toLowerCase();
        const matchTipo = !tipoFiltro || p.tipo === tipoFiltro;
        const matchBusca = !busca || p.titulo.toLowerCase().includes(b) || p.descricao.toLowerCase().includes(b);
        return matchTipo && matchBusca;
    });

    const handleClear = () => {
        setBusca(""); setAno(new Date().getFullYear().toString()); setMes(""); setTipoFiltro("");
    };

    const handleExport = (format: "pdf" | "csv" | "json") => {
        const payload = filtradas.map(p => ({
            "Título": p.titulo, "Tipo": p.tipo, "Secretaria": p.secretaria,
            "Data": new Date(p.dataPublicacao).toLocaleDateString("pt-BR"),
            "Descrição": p.descricao,
        }));
        const filename = `publicacoes_oficiais_${ano}`;
        const title = `Publicações Oficiais – Lajes Pintadas/RN (${ano})`;
        if (format === "csv") exportToCSV(payload, filename);
        else if (format === "json") exportToJSON(payload, filename);
        else exportToPDF(payload, filename, title);
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] font-['Montserrat',sans-serif]">
            <PageHeader
                title="Publicações Oficiais"
                subtitle="Acesso centralizado a editais, avisos, extratos, resultados e demais atos publicados pela administração municipal."
                variant="premium"
                icon={<FileText />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Publicações" }
                ]}
            />

            <div className="max-w-[1240px] mx-auto px-6 py-12 -mt-10 relative z-30">
                <TransparencyFilters
                    searchValue={busca}
                    onSearch={setBusca}
                    currentYear={ano}
                    onYearChange={setAno}
                    currentMonth={mes}
                    onMonthChange={setMes}
                    onClear={handleClear}
                    onExport={handleExport}
                    placeholder="Buscar por título ou palavras-chave..."
                >
                    <select
                        value={tipoFiltro}
                        onChange={e => setTipoFiltro(e.target.value)}
                        className="bg-white border border-gray-200 px-4 py-2 rounded-xl text-[11px] font-bold text-gray-700 outline-none shadow-sm"
                    >
                        <option value="">Todos os Tipos</option>
                        {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </TransparencyFilters>

                {/* Resumo */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 border-l-4 border-l-slate-500">
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Total de Publicações</div>
                        <div className="text-2xl font-black text-slate-600">{filtradas.length}</div>
                    </div>
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-blue-100 border-l-4 border-l-blue-500">
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Tipos Diferentes</div>
                        <div className="text-2xl font-black text-blue-600">{new Set(filtradas.map(p => p.tipo)).size}</div>
                    </div>
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-emerald-100 border-l-4 border-l-emerald-500">
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Exercício</div>
                        <div className="text-2xl font-black text-emerald-600">{ano}</div>
                    </div>
                </div>

                {/* Lista */}
                <div className="space-y-5">
                    {loading ? (
                        <div className="bg-white rounded-[3rem] p-24 text-center border border-gray-100">
                            <FaSpinner className="animate-spin text-slate-500 text-4xl mb-4 mx-auto" />
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Carregando publicações...</p>
                        </div>
                    ) : filtradas.length === 0 ? (
                        <div className="bg-white rounded-[3rem] p-24 text-center border-2 border-dashed border-gray-100">
                            <FaNewspaper className="text-gray-200 text-5xl mx-auto mb-6" />
                            <h4 className="text-xl font-black text-gray-800 uppercase tracking-tighter mb-3">Nenhuma publicação localizada</h4>
                            <p className="text-gray-400 text-sm italic">Ajuste os filtros para encontrar a publicação desejada.</p>
                        </div>
                    ) : filtradas.map(pub => (
                        <div key={pub.id} className="group bg-white rounded-[2rem] border border-gray-100 shadow-lg shadow-gray-200/30 hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-300 p-8">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                                <div className="flex items-start gap-5 flex-1">
                                    <div className="w-12 h-12 bg-slate-50 text-slate-500 rounded-2xl flex items-center justify-center shrink-0 border border-slate-100 group-hover:bg-slate-700 group-hover:text-white transition-all duration-500">
                                        <FaNewspaper size={18} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-center gap-2 mb-2">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${TIPO_COR[pub.tipo] || "bg-gray-100 text-gray-600 border-gray-200"}`}>
                                                <FaTag size={8} /> {pub.tipo}
                                            </span>
                                            <span className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400">
                                                <FaCalendarAlt size={9} className="text-gray-300" />
                                                {new Date(pub.dataPublicacao).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
                                            </span>
                                        </div>
                                        <h3 className="font-black text-gray-800 text-sm uppercase tracking-tight mb-1 group-hover:text-slate-700 transition-colors">{pub.titulo}</h3>
                                        <p className="text-xs text-gray-400 font-medium leading-relaxed line-clamp-2">{pub.descricao}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
                                        {pub.secretaria}
                                    </span>
                                    <button className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-500 hover:text-slate-700 hover:border-slate-300 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm">
                                        <FaDownload size={10} />
                                        {pub.arquivo ? "Baixar" : "Ver"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-20">
                    <BannerPNTP />
                </div>
            </div>
        </div>
    );
}
