"use client";
import { useState, useEffect } from "react";
import { FaSpinner, FaBuilding, FaCheckCircle, FaWallet, FaUserGraduate } from "react-icons/fa";
import { exportToCSV, exportToJSON, exportToPDF, exportToXLSX } from "@/lib/exportUtils";
import TransparencyFilters from "@/components/transparencia/TransparencyFilters";
import PageHeader from "@/components/PageHeader";
import BannerPNTP from "@/components/transparencia/BannerPNTP";

type Servidor = {
    id: string;
    nome: string;
    cargo: string;
    vinculo: string;
    secretaria: string;
    salarioBase: number;
    totalBruto: number;
    totalLiquido: number;
    mes: number;
    ano: number;
};

const mesesLabels = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

function fmt(v: number) {
    return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function EstagiariosPage() {
    const [servidores, setServidores] = useState<Servidor[]>([]);
    const [loading, setLoading] = useState(true);
    const [ano, setAno] = useState(new Date().getFullYear().toString());
    const [mes, setMes] = useState((new Date().getMonth() + 1).toString());
    const [busca, setBusca] = useState("");
    const [secretariaFiltro, setSecretariaFiltro] = useState("");

    useEffect(() => {
        fetchServidores();
    }, [ano, mes, secretariaFiltro]);

    const fetchServidores = async () => {
        setLoading(true);
        try {
            const query = new URLSearchParams({
                ano,
                mes,
                vinculo: "estagiario", // fixo para estagiarios
                secretaria: secretariaFiltro
            });
            const res = await fetch(`/api/servidores?${query.toString()}`);
            const data = await res.json();
            setServidores(data.items || []);
        } catch (error) {
            console.error("Erro ao carregar estagiarios:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleClearFilters = () => {
        setBusca("");
        setAno(new Date().getFullYear().toString());
        setMes((new Date().getMonth() + 1).toString());
        setSecretariaFiltro("");
    };

    const handleExport = (format: "pdf" | "csv" | "json" | "xlsx") => {
        const payload = filtrados.map((s: Servidor) => ({
            "Nome": s.nome,
            "Função/Estágio": s.cargo,
            "Secretaria": s.secretaria,
            "Bolsa Bruta": fmt(s.totalBruto),
            "Bolsa Líquida": fmt(s.totalLiquido)
        }));

        const filename = `estagiarios_${mes}_${ano}`;
        const title = `Relação de Estagiários - Lajes Pintadas/RN (${mesesLabels[Number(mes)-1]} / ${ano})`;

        if (format === "csv") exportToCSV(payload, filename);
        else if (format === "json") exportToJSON(payload, filename);
        else if (format === "xlsx") exportToXLSX(payload, filename);
        else exportToPDF(payload, filename, title);
    };

    const filtrados = servidores.filter((s: Servidor) => {
        const b = busca.toLowerCase();
        return !busca || 
            s.nome.toLowerCase().includes(b) || 
            s.cargo.toLowerCase().includes(b) || 
            s.secretaria.toLowerCase().includes(b);
    });

    const totalBruto = filtrados.reduce((acc: number, curr: Servidor) => acc + curr.totalBruto, 0);
    const totalLiquido = filtrados.reduce((acc: number, curr: Servidor) => acc + curr.totalLiquido, 0);

    return (
        <div className="min-h-screen bg-[#f8fafc] font-['Montserrat',sans-serif]">
            <PageHeader
                title="Estagiários"
                subtitle="Relação de estudantes em regime de estágio na administração pública municipal."
                variant="premium"
                icon={<FaUserGraduate />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Quadro de Pessoal", href: "/transparencia/servidores" },
                    { label: "Estagiários" }
                ]}
            />

            <div className="max-w-7xl mx-auto px-6 py-12 -mt-10 relative z-30">
                <TransparencyFilters
                    searchValue={busca}
                    onSearch={setBusca}
                    currentYear={ano}
                    onYearChange={setAno}
                    currentMonth={mes}
                    onMonthChange={setMes}
                    onClear={handleClearFilters}
                    onExport={handleExport}
                    placeholder="Pesquisar por nome..."
                >
                    <div className="flex flex-wrap gap-3">
                        <select 
                            value={secretariaFiltro} 
                            onChange={(e) => setSecretariaFiltro(e.target.value)}
                            className="bg-white border border-gray-200 px-4 py-2 rounded-xl text-[11px] font-bold text-gray-700 outline-none hover:border-pink-400 transition-colors shadow-sm"
                        >
                            <option value="">Todas as Secretarias</option>
                            <option value="educacao">Educação</option>
                            <option value="saude">Saúde</option>
                            <option value="assistencia social">Assistência Social</option>
                            <option value="administracao">Administração</option>
                            <option value="obras">Obras e Serviços Públicos</option>
                        </select>
                    </div>
                </TransparencyFilters>

                {/* Cards de TOTAIS ESTILIZADOS */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 border-l-4 border-l-pink-500 hover:shadow-xl hover:shadow-pink-500/5 transition-all group">
                        <div className="flex justify-between items-start mb-3">
                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Bolsas Auxílio (Bruto)</div>
                            <FaWallet className="text-pink-100 group-hover:text-pink-500 transition-colors" size={20} />
                        </div>
                        <div className="text-xl font-black text-gray-800">{loading ? "..." : fmt(totalBruto)}</div>
                        <div className="mt-2 text-[9px] font-bold text-pink-500 uppercase tracking-tighter">Período Selecionado</div>
                    </div>
                    
                    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 border-l-4 border-l-emerald-500 hover:shadow-xl hover:shadow-emerald-500/5 transition-all group">
                        <div className="flex justify-between items-start mb-3">
                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Bolsas Auxílio (Líquido)</div>
                            <FaCheckCircle className="text-emerald-100 group-hover:text-emerald-500 transition-colors" size={20} />
                        </div>
                        <div className="text-xl font-black text-emerald-600">{loading ? "..." : fmt(totalLiquido)}</div>
                        <div className="mt-2 text-[9px] font-bold text-emerald-500 uppercase tracking-tighter">Valores Líquidos</div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 border-l-4 border-l-pink-500 hover:shadow-xl hover:shadow-pink-500/5 transition-all group">
                        <div className="flex justify-between items-start mb-3">
                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nº de Estagiários</div>
                            <FaUserGraduate className="text-pink-100 group-hover:text-pink-500 transition-colors" size={20} />
                        </div>
                        <div className="text-xl font-black text-pink-600">{loading ? "..." : filtrados.length}</div>
                        <div className="mt-2 text-[9px] font-bold text-pink-500 uppercase tracking-tighter">Contratos Ativos</div>
                    </div>
                </div>

                {/* Tabela de Resultados */}
                <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                    <div className="p-5 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                       <h3 className="text-[10px] font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
                           <span className="w-1.5 h-4 bg-pink-500 rounded-full"></span> Relação de Estagiários
                       </h3>
                       <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                           {mesesLabels[Number(mes)-1]} de {ano}
                       </div>
                    </div>
                    
                    <div className="overflow-x-auto min-h-[300px] relative">
                        {loading && (
                            <div className="absolute inset-0 bg-white/70 flex flex-col items-center justify-center z-10 backdrop-blur-sm">
                                <FaSpinner className="animate-spin text-pink-500 text-3xl mb-3" />
                                <div className="text-[9px] font-black text-pink-600 uppercase tracking-[0.2em]">Consultando Dados...</div>
                            </div>
                        )}
                        <table className="w-full text-left" aria-label="Tabela de estagiários">
                            <thead>
                                <tr className="bg-gray-50/50 text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                                    <th className="px-6 py-4">Nome</th>
                                    <th className="px-6 py-4">Secretaria/Setor</th>
                                    <th className="px-6 py-4 text-right">Bolsa Bruta</th>
                                    <th className="px-6 py-4 text-right">Bolsa Líquida</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filtrados.length === 0 && !loading ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-20 text-center text-gray-400 font-bold uppercase text-[10px] tracking-widest italic">
                                            Nenhum estagiário localizado para o período.
                                        </td>
                                    </tr>
                                ) : (
                                    filtrados.map((s: Servidor) => (
                                        <tr key={s.id} className="hover:bg-pink-50/30 transition-all group">
                                            <td className="px-6 py-4">
                                                <div className="font-black text-gray-800 text-[11px] group-hover:text-pink-700 transition-colors uppercase tracking-tight">{s.nome}</div>
                                                <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider opacity-80">{s.cargo}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5 text-[9px] font-black text-gray-500 bg-gray-100/80 px-2 py-0.5 rounded-lg w-fit">
                                                    <FaBuilding size={9} className="text-gray-400" /> {s.secretaria}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right font-black text-gray-800 text-[11px]">
                                                {fmt(s.totalBruto)}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className="font-black text-emerald-600 text-[11px] bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100 shadow-sm">
                                                    {fmt(s.totalLiquido)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                            {!loading && servidores.length > 0 && (
                                <tfoot>
                                    <tr className="bg-gray-900 border-t-2 border-gray-800 text-white">
                                        <td colSpan={2} className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Total Consolidados (Filtro)</td>
                                        <td className="px-6 py-4 text-right font-black text-base text-pink-400">{fmt(totalBruto)}</td>
                                        <td className="px-6 py-4 text-right font-black text-base text-emerald-400">
                                            {fmt(totalLiquido)}
                                        </td>
                                    </tr>
                                </tfoot>
                            )}
                        </table>
                    </div>
                </div>

                <div className="mt-20">
                    <BannerPNTP />
                </div>
            </div>
        </div>
    );
}
