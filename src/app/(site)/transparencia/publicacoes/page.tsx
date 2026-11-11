"use client";
import { useState, useEffect } from "react";
import { FaNewspaper, FaSpinner, FaDownload, FaSearch, FaCalendar, FaTag, FaFilter } from "react-icons/fa";
import { FileText } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import BannerPNTP from "@/components/transparencia/BannerPNTP";
import { exportToCSV, exportToJSON, exportToPDF, exportToXLSX } from "@/lib/exportUtils";
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
    documentUrl: string | null;
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
    "Decreto Municipal",
    "Resolução",
    "Lei Municipal",
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
    "Decreto Municipal": "bg-amber-50 text-amber-600 border-amber-100",
    "Resolução": "bg-rose-100 text-rose-700 border-rose-200",
    "Lei Municipal": "bg-blue-50 text-blue-600 border-blue-100",
};

const MOCK: Publicacao[] = [
    { id: "1", titulo: "Diário Oficial nº 001 – Janeiro/2026", tipo: "Diário Oficial", descricao: "Publicação oficial dos atos administrativos do mês de Janeiro de 2026.", dataPublicacao: "2026-01-31", ano: 2026, secretaria: "Administração", arquivo: null, documentUrl: null },
    { id: "2", titulo: "Aviso de Licitação – Pregão Eletrônico nº 006/2026", tipo: "Aviso", descricao: "Aviso de abertura de processo licitatório para aquisição de material de construção.", dataPublicacao: "2026-02-10", ano: 2026, secretaria: "Compras", arquivo: null, documentUrl: null },
    { id: "3", titulo: "Resultado – Concorrência nº 001/2026", tipo: "Resultado", descricao: "Resultado de julgamento da Concorrência nº 001/2026 – obra de ampliação da escola municipal.", dataPublicacao: "2026-02-20", ano: 2026, secretaria: "Obras", arquivo: null, documentUrl: null },
    { id: "4", titulo: "Extrato – Contrato nº 015/2026", tipo: "Extrato de Contrato", descricao: "Extrato do contrato firmado com a empresa XYZ para prestação de serviços de limpeza.", dataPublicacao: "2026-03-05", ano: 2026, secretaria: "Administração", arquivo: null, documentUrl: null },
    { id: "5", titulo: "Portaria nº 024/2026 – Designação de Fiscal", tipo: "Portaria", descricao: "Designa servidor para atuar como fiscal do Contrato nº 015/2026.", dataPublicacao: "2026-03-07", ano: 2026, secretaria: "Administração", arquivo: null, documentUrl: null },
    { id: "6", titulo: "Diário Oficial nº 002 – Fevereiro/2026", tipo: "Diário Oficial", descricao: "Publicação oficial dos atos administrativos do mês de Fevereiro de 2026.", dataPublicacao: "2026-02-28", ano: 2026, secretaria: "Administração", arquivo: null, documentUrl: null },
];

export default function PublicacoesPage() {
    const [publicacoes, setPublicacoes] = useState<Publicacao[]>([]);
    const [loading, setLoading] = useState(true);
    const [busca, setBusca] = useState("");
    const [ano, setAno] = useState(new Date().getFullYear().toString());
    const [mes, setMes] = useState("");
    const [tipoFiltro, setTipoFiltro] = useState("");

    const fetchData = async () => {
        setLoading(true);
        try {
            const query = new URLSearchParams();
            if (ano) query.append("ano", ano);
            // If no specific type filter, we fetch common publication types
            if (tipoFiltro) {
                query.append("tipo", tipoFiltro);
            } else {
                // Fetch all relevant transparency types for this page
                query.append("tipo", "Diário Oficial,Edital,Aviso,Resultado,Extrato de Contrato,Extrato de Convênio,Nota de Esclarecimento,Portaria,Decreto Municipal,Resolução,Lei Municipal,Outros");
            }
            
            const res = await fetch(`/api/documentos?${query.toString()}`);
            if (res.ok) {
                const data = await res.json();
                // Map API data to the component's expected structure
                const formatted = data.map((d: any) => ({
                    id: d.id,
                    titulo: d.titulo,
                    tipo: d.tipo,
                    descricao: d.titulo, // API doesn't have description yet, use title
                    dataPublicacao: d.criadoEm,
                    ano: d.ano || new Date(d.criadoEm).getFullYear(),
                    secretaria: "Prefeitura Municipal", // Placeholder
                    arquivo: d.arquivo,
                    documentUrl: d.documentUrl
                }));
                setPublicacoes(formatted);
            }
        } catch (error) {
            console.error("Erro ao carregar publicações:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [ano, mes, tipoFiltro]);

    const filtradas = publicacoes.filter(p => {
        const b = busca.toLowerCase();
        const matchBusca = !busca || p.titulo.toLowerCase().includes(b) || (p.descricao && p.descricao.toLowerCase().includes(b));
        const matchMes = !mes || (p.dataPublicacao && (new Date(p.dataPublicacao).getMonth() + 1).toString() === mes);
        const matchAno = !ano || (p.ano && p.ano.toString() === ano);
        return matchBusca && matchMes && matchAno;
    });

    const handleClear = () => {
        setBusca(""); setAno(new Date().getFullYear().toString()); setMes(""); setTipoFiltro("");
    };

    const handleExport = (format: "pdf" | "csv" | "json" | "xlsx") => {
        const payload = filtradas.map(p => ({
            "Título": p.titulo, "Tipo": p.tipo, "Secretaria": p.secretaria,
            "Data": new Date(p.dataPublicacao).toLocaleDateString("pt-BR"),
            "Descrição": p.descricao,
        }));
        const filename = `publicacoes_oficiais_${ano}${mes ? `_mes_${mes}` : ""}`;
        const title = `Publicações Oficiais – Lajes Pintadas/RN (${ano}${mes ? ` - Mês ${mes}` : ""})`;
        if (format === "csv") exportToCSV(payload, filename);
        else if (format === "json") exportToJSON(payload, filename);
        else if (format === "xlsx") exportToXLSX(payload, filename);
        else exportToPDF(payload, filename, title);
    };

    return (
        <div className="min-h-screen bg-[#F5F7FA]">
            <PageHeader
                title="Publicações e Atos Oficiais"
                subtitle="Acesso centralizado a editais, avisos, decretos, portarias, extratos e demais atos da administração municipal."
                icon={<FileText />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Atos e Publicações Oficiais" }
                ]}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
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
                        className="bg-[#F5F7FA] border border-[#DDE3EA] px-4 py-2.5 rounded-xl text-xs font-bold text-[#12304A] outline-none shadow-sm cursor-pointer"
                    >
                        <option value="">Todos os Tipos de Atos</option>
                        {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </TransparencyFilters>

                {/* Resumo */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#DDE3EA]">
                        <div className="text-xs font-bold text-[#5B738B] uppercase tracking-wider mb-2">Total de Atos e Publicações</div>
                        <div className="text-2xl font-black text-[#12304A]">{filtradas.length}</div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#DDE3EA]">
                        <div className="text-xs font-bold text-[#5B738B] uppercase tracking-wider mb-2">Categorias Ativas</div>
                        <div className="text-2xl font-black text-[#1254A3]">{new Set(filtradas.map(p => p.tipo)).size}</div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#DDE3EA]">
                        <div className="text-xs font-bold text-[#5B738B] uppercase tracking-wider mb-2">Exercício / Período</div>
                        <div className="text-2xl font-black text-emerald-600">{ano || "Todos"}{mes ? ` (Mês ${mes})` : ""}</div>
                    </div>
                </div>

                {/* Lista */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="bg-white rounded-2xl p-16 text-center border border-[#DDE3EA] shadow-sm">
                            <FaSpinner className="animate-spin text-[#1254A3] text-3xl mb-3 mx-auto" />
                            <p className="text-xs font-bold text-[#5B738B] uppercase tracking-wider">Carregando atos oficiais...</p>
                        </div>
                    ) : filtradas.length === 0 ? (
                        <div className="bg-white rounded-2xl p-16 text-center border border-[#DDE3EA] shadow-sm">
                            <FaNewspaper className="text-slate-300 text-4xl mx-auto mb-4" />
                            <h4 className="text-lg font-bold text-[#12304A] mb-2">Nenhum ato localizado</h4>
                            <p className="text-xs text-[#5B738B]">Ajuste os filtros de ano, mês ou texto para encontrar a publicação desejada.</p>
                        </div>
                    ) : (
                        filtradas.map(pub => (
                            <div key={pub.id} className="group bg-white rounded-2xl border border-[#DDE3EA] shadow-sm hover:border-[#1254A3]/50 transition-all duration-200 p-5">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-start gap-4 flex-1">
                                        <div className="w-10 h-10 bg-blue-50 text-[#1254A3] rounded-xl flex items-center justify-center shrink-0 border border-blue-100">
                                            <FaNewspaper size={16} />
                                        </div>
                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider border ${TIPO_COR[pub.tipo] || "bg-gray-100 text-gray-600 border-gray-200"}`}>
                                                <FaTag size={7} /> {pub.tipo}
                                            </span>
                                            <span className="flex items-center gap-1 text-xs text-[#5B738B]">
                                                <FaCalendar size={9} className="text-slate-400" />
                                                {new Date(pub.dataPublicacao).toLocaleDateString("pt-BR")}
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-[#12304A] text-sm leading-snug mb-1 group-hover:text-[#1254A3] transition-colors">{pub.titulo}</h3>
                                        <p className="text-xs text-[#5B738B] leading-relaxed line-clamp-2">"{pub.descricao}"</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <span className="text-[10px] font-bold text-[#5B738B] bg-[#F5F7FA] px-2.5 py-1 rounded-lg border border-[#DDE3EA]">
                                        {pub.secretaria}
                                    </span>
                                    <a 
                                        href={pub.arquivo || pub.documentUrl || "#"} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 bg-[#1254A3] text-white hover:bg-[#0d3f7c] px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
                                    >
                                        <FaDownload size={10} />
                                        {pub.arquivo ? "Baixar PDF" : "Ver Ato"}
                                    </a>
                                </div>
                            </div>
                        </div>
                        ))
                    )}
                </div>

                <div className="mt-12">
                    <BannerPNTP />
                </div>
            </div>
        </div>
    );
}
