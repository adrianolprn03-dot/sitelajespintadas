"use client";
import { useState, useEffect } from "react";
import { FaFileSignature, FaSpinner, FaCalendarAlt, FaBuilding, FaDownload, FaSearch } from "react-icons/fa";
import PageHeader from "@/components/PageHeader";
import TransparencyFilters from "@/components/transparencia/TransparencyFilters";
import { exportToCSV, exportToJSON, exportToPDF, exportToXLSX } from "@/lib/exportUtils";
import BannerPNTP from "@/components/transparencia/BannerPNTP";

type Ata = {
    id: string;
    numero: string;
    objeto: string;
    fornecedor: string;
    cnpj: string;
    valor: number;
    dataRegistro: string;
    dataVencimento: string;
    secretaria: string;
    status: "vigente" | "vencida" | "cancelada";
};

const statusConfig: Record<string, { label: string; cor: string }> = {
    vigente: { label: "Vigente", cor: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    vencida: { label: "Vencida", cor: "bg-gray-100 text-gray-600 border-gray-200" },
    cancelada: { label: "Cancelada", cor: "bg-red-100 text-red-700 border-red-200" },
};

const MOCK_ATA: Ata[] = [
    {
        id: "1", numero: "001/2026", objeto: "Registro de preços para aquisição de gêneros alimentícios",
        fornecedor: "Distribuidora Alimentos Norte LTDA", cnpj: "12.345.678/0001-99",
        valor: 95000, dataRegistro: "2026-01-10", dataVencimento: "2027-01-10",
        secretaria: "Educação", status: "vigente"
    },
    {
        id: "2", numero: "002/2026", objeto: "Registro de preços para material de limpeza e higienização",
        fornecedor: "Produtos de Limpeza Sul EIRELI", cnpj: "98.765.432/0001-11",
        valor: 38500, dataRegistro: "2026-01-25", dataVencimento: "2027-01-25",
        secretaria: "Administração", status: "vigente"
    },
    {
        id: "3", numero: "005/2025", objeto: "Registro de preços para aquisição de combustíveis",
        fornecedor: "Posto de Combustíveis Central ME", cnpj: "11.222.333/0001-44",
        valor: 180000, dataRegistro: "2025-03-01", dataVencimento: "2026-02-28",
        secretaria: "Obras e Infraestrutura", status: "vencida"
    },
];

function fmt(v: number) {
    return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function AtasRegistroClient() {
    const [atas, setAtas] = useState<Ata[]>([]);
    const [loading, setLoading] = useState(true);
    const [busca, setBusca] = useState("");
    const [ano, setAno] = useState(new Date().getFullYear().toString());
    const [statusFiltro, setStatusFiltro] = useState("");

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setAtas(MOCK_ATA);
            setLoading(false);
        }, 600);
    }, [ano, statusFiltro]);

    const filtradas = atas.filter(a => {
        const b = busca.toLowerCase();
        const matchStatus = !statusFiltro || a.status === statusFiltro;
        const matchBusca = !busca || 
            a.objeto.toLowerCase().includes(b) || 
            a.fornecedor.toLowerCase().includes(b) || 
            a.numero.includes(b);
        return matchStatus && matchBusca;
    });

    const handleClearFilters = () => {
        setBusca("");
        setAno(new Date().getFullYear().toString());
        setStatusFiltro("");
    };

    const handleExport = (format: "pdf" | "csv" | "json" | "xlsx") => {
        const payload = filtradas.map(a => ({
            "Número": a.numero,
            "Objeto": a.objeto,
            "Fornecedor": a.fornecedor,
            "CNPJ": a.cnpj,
            "Secretaria": a.secretaria,
            "Data Registro": new Date(a.dataRegistro).toLocaleDateString("pt-BR"),
            "Data Vencimento": new Date(a.dataVencimento).toLocaleDateString("pt-BR"),
            "Valor Total": fmt(a.valor),
            "Status": statusConfig[a.status]?.label,
        }));

        const filename = `atas_registro_precos_${ano}`;
        const title = `Relatório de Atas de Registro de Preços – Lajes Pintadas/RN (${ano})`;

        if (format === "csv") exportToCSV(payload, filename);
        else if (format === "json") exportToJSON(payload, filename);
        else if (format === "xlsx") exportToXLSX(payload, filename);
        else exportToPDF(payload, filename, title);
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] font-['Montserrat',sans-serif]">
            <PageHeader
                title="Atas de Registro de Preços"
                subtitle="Instrumentos homologados para aquisição de bens e serviços com preços e fornecedores pré-qualificados."
                variant="premium"
                icon={<FaFileSignature />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Atas de Registro de Preços" }
                ]}
            />

            <div className="max-w-[1240px] mx-auto px-6 py-12 -mt-10 relative z-30">
                <TransparencyFilters
                    searchValue={busca}
                    onSearch={setBusca}
                    currentYear={ano}
                    onYearChange={setAno}
                    currentMonth=""
                    onMonthChange={() => {}}
                    onClear={handleClearFilters}
                    onExport={handleExport}
                    availableYears={["2026", "2025", "2024", "2023", "2022"]}
                    placeholder="Buscar por número, objeto ou fornecedor..."
                >
                    <select
                        value={statusFiltro}
                        onChange={(e) => setStatusFiltro(e.target.value)}
                        className="bg-white border border-gray-200 px-4 py-2 rounded-xl text-[11px] font-black text-gray-700 outline-none shadow-sm focus:ring-2 focus:ring-blue-500/20"
                    >
                        <option value="">Todos os Status</option>
                        <option value="vigente">Vigente</option>
                        <option value="vencida">Vencida</option>
                        <option value="cancelada">Cancelada</option>
                    </select>
                </TransparencyFilters>

                {/* Resumo */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 border-l-4 border-l-emerald-500">
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Atas Vigentes</div>
                        <div className="text-xl font-black text-emerald-600">{filtradas.filter(a => a.status === "vigente").length}</div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 border-l-4 border-l-indigo-500">
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total de Atas</div>
                        <div className="text-xl font-black text-indigo-600">{filtradas.length}</div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 border-l-4 border-l-blue-500">
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Valor Registrado</div>
                        <div className="text-xl font-black text-blue-600">{fmt(filtradas.reduce((s, a) => s + a.valor, 0))}</div>
                    </div>
                </div>

                {/* Lista de Atas */}
                <div className="space-y-6">
                    {loading ? (
                        <div className="bg-white rounded-[3rem] p-24 text-center border border-gray-100">
                            <FaSpinner className="animate-spin text-indigo-500 text-4xl mb-4 mx-auto" />
                            <span className="font-black text-xs uppercase tracking-widest text-gray-400">Carregando Atas...</span>
                        </div>
                    ) : filtradas.length === 0 ? (
                        <div className="bg-white rounded-[3rem] p-24 text-center border-2 border-dashed border-gray-100">
                            <h4 className="text-xl font-black text-gray-800 uppercase tracking-tighter mb-4">Nenhuma ata localizada</h4>
                            <p className="text-gray-400 text-sm italic">Ajuste os filtros ou tente outro exercício fiscal.</p>
                        </div>
                    ) : (
                        filtradas.map((a) => (
                            <div key={a.id} className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden group hover:shadow-2xl transition-all duration-500">
                                <div className="p-6">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-sm border border-indigo-100">
                                                <FaFileSignature size={20} />
                                            </div>
                                            <div>
                                                <div className="font-black text-base text-gray-800 uppercase tracking-tight group-hover:text-indigo-600 transition-colors">ARP Nº {a.numero}</div>
                                                <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mt-1">
                                                    <FaBuilding size={9} className="text-gray-300" /> {a.secretaria}
                                                </div>
                                            </div>
                                        </div>
                                        <span className={`inline-flex px-4 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest border ${statusConfig[a.status]?.cor}`}>
                                            {statusConfig[a.status]?.label}
                                        </span>
                                    </div>

                                    <div className="bg-gray-50/40 rounded-2xl p-5 border border-gray-50 mb-5">
                                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Objeto do Registro</p>
                                        <p className="text-gray-600 font-bold italic text-xs leading-relaxed">&ldquo;{a.objeto}&rdquo;</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Fornecedor</p>
                                            <p className="font-black text-gray-800 text-[11px] uppercase tracking-tight">{a.fornecedor}</p>
                                            <p className="text-[9px] font-mono font-bold text-gray-400">{a.cnpj}</p>
                                        </div>
                                        <div>
                                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Vigência</p>
                                            <div className="flex items-center gap-2 text-[11px] font-black text-gray-700">
                                                <FaCalendarAlt size={10} className="text-indigo-400" />
                                                {new Date(a.dataRegistro).toLocaleDateString("pt-BR")} – {new Date(a.dataVencimento).toLocaleDateString("pt-BR")}
                                            </div>
                                        </div>
                                        <div className="md:text-right">
                                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Valor Registrado</p>
                                            <p className="text-lg font-black text-indigo-600 tracking-tighter">{fmt(a.valor)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end gap-3 mt-6 pt-5 border-t border-gray-50">
                                        <button className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-500 hover:text-indigo-600 hover:border-indigo-200 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shadow-sm active:scale-95">
                                            <FaDownload size={10} /> Baixar ARP
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="mt-20">
                    <BannerPNTP />
                </div>
            </div>
        </div>
    );
}
