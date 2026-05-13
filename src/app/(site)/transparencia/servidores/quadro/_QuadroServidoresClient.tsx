"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/components/PageHeader";
import { FaTable, FaInfoCircle, FaCheckCircle, FaUserFriends, FaUserPlus, FaUserMinus } from "react-icons/fa";
import { Info, Briefcase, Download, Trash2, Search, Loader2 } from "lucide-react";
import TransparencyFilters from "@/components/transparencia/TransparencyFilters";
import { exportToCSV, exportToJSON, exportToPDF, exportToXLSX } from "@/lib/exportUtils";
import BannerPNTP from "@/components/transparencia/BannerPNTP";

type QuadroServidor = {
    id: string;
    cargo: string;
    vinculo: string;
    leiCriacao: string | null;
    vagasLei: number;
    vagasOcupadas: number;
    vagasLivres: number;
    ativo: boolean;
};

export default function QuadroServidoresClient({ 
    initialData 
}: { 
    initialData: QuadroServidor[] 
}) {
    const [items, setItems] = useState<QuadroServidor[]>(initialData);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");

    const fetchData = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                q: search,
                ativo: "true"
            });
            const res = await fetch(`/api/quadro-servidores?${params.toString()}`);
            const data = await res.json();
            setItems(data.items || []);
        } catch (error) {
            console.error("Erro ao buscar dados:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (search !== "") {
            fetchData();
        } else {
            setItems(initialData);
        }
    }, [search]);

    const handleClear = () => {
        setSearch("");
    };

    const handleExport = (format: "pdf" | "csv" | "json" | "xlsx") => {
        const dataToExport = items.map(i => ({
            "Cargo": i.cargo,
            "Vínculo": i.vinculo.toUpperCase(),
            "Lei de Criação": i.leiCriacao || 'N/A',
            "Vagas Lei": i.vagasLei,
            "Vagas Ocupadas": i.vagasOcupadas,
            "Vagas Livres": i.vagasLivres,
        }));

        const filename = `quadro_pessoal_lajes_pintadas`;
        const title = `Portal da Transparência - Quadro Geral de Pessoal`;

        if (format === "pdf") exportToPDF(dataToExport, filename, title);
        else if (format === "csv") exportToCSV(dataToExport, filename);
        else if (format === "json") exportToJSON(dataToExport, filename);
        else if (format === "xlsx") exportToXLSX(dataToExport, filename);
    };

    // Estatísticas para Bento Cards
    const stats = {
        totalVagas: items.reduce((acc, curr) => acc + curr.vagasLei, 0),
        ocupadas: items.reduce((acc, curr) => acc + curr.vagasOcupadas, 0),
        livres: items.reduce((acc, curr) => acc + curr.vagasLivres, 0),
    };

    return (
        <div className="min-h-screen bg-gray-50 font-['Montserrat',sans-serif]">
            <PageHeader
                title="Quadro Geral de Pessoal"
                subtitle="Consulte a relação completa de cargos, vagas ocupadas e disponíveis."
                variant="premium"
                icon={<FaTable />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Quadro de Pessoal" }
                ]}
            />

            <BannerPNTP />

            <div className="max-w-[1240px] mx-auto px-6 py-12">
                {/* Bento Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-blue-500/5 border border-slate-100 flex items-center gap-6 transition-all hover:scale-[1.02]">
                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center shadow-inner">
                            <FaUserFriends size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Total de Vagas (Lei)</p>
                            <p className="text-3xl font-black text-slate-900 tracking-tighter">{stats.totalVagas}</p>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-blue-500/5 border border-slate-100 flex items-center gap-6 transition-all hover:scale-[1.02]">
                        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center shadow-inner">
                            <FaUserPlus size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Vagas Ocupadas</p>
                            <p className="text-3xl font-black text-emerald-600 tracking-tighter">{stats.ocupadas}</p>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-blue-500/5 border border-slate-100 flex items-center gap-6 transition-all hover:scale-[1.02]">
                        <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-3xl flex items-center justify-center shadow-inner">
                            <FaUserMinus size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Vagas Livres</p>
                            <p className="text-3xl font-black text-amber-600 tracking-tighter">{stats.livres}</p>
                        </div>
                    </div>
                </div>

                <TransparencyFilters
                    searchValue={search}
                    onSearch={setSearch}
                    onClear={handleClear}
                    onExport={handleExport}
                    placeholder="Buscar por cargo, vínculo ou lei..."
                    hideYear
                    hideMonth
                />

                <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-blue-500/5 border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                                    <th className="px-8 py-6 border-b border-slate-100">Cargo</th>
                                    <th className="px-8 py-6 border-b border-slate-100 text-center">Vínculo</th>
                                    <th className="px-8 py-6 border-b border-slate-100">Lei de Criação</th>
                                    <th className="px-8 py-6 border-b border-slate-100 text-center bg-blue-50/30">Vagas Lei</th>
                                    <th className="px-8 py-6 border-b border-slate-100 text-center bg-emerald-50/30">Ocupadas</th>
                                    <th className="px-8 py-6 border-b border-slate-100 text-center bg-amber-50/30">Livres</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-20 text-center">
                                            <Loader2 className="animate-spin text-blue-600 mx-auto mb-4" size={32} />
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Atualizando quadro...</p>
                                        </td>
                                    </tr>
                                ) : items.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-20 text-center">
                                            <Trash2 className="text-slate-200 mx-auto mb-4" size={48} />
                                            <p className="text-slate-400 font-bold uppercase tracking-tighter text-lg">Nenhum registro encontrado</p>
                                        </td>
                                    </tr>
                                ) : (
                                    items.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tighter italic">
                                                    {item.cargo}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <span className="px-4 py-1.5 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                    {item.vinculo}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 font-medium text-slate-500 text-sm">
                                                {item.leiCriacao || "Não informada"}
                                            </td>
                                            <td className="px-8 py-6 text-center font-black text-slate-900 bg-blue-50/10">
                                                {item.vagasLei}
                                            </td>
                                            <td className="px-8 py-6 text-center font-black text-emerald-600 bg-emerald-50/10 text-lg">
                                                {item.vagasOcupadas}
                                            </td>
                                            <td className="px-8 py-6 text-center font-black text-amber-600 bg-amber-50/10 text-lg">
                                                {item.vagasLivres}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Info Card */}
                <div className="mt-12 bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-blue-500/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                        <FaInfoCircle size={120} />
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic flex items-center gap-3 mb-6">
                            <Info className="text-blue-600" /> Sobre o Quadro de Pessoal
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <p className="text-slate-500 font-medium leading-relaxed">
                                O Quadro Geral de Pessoal apresenta o demonstrativo de cargos criados por lei, 
                                as vagas legalmente instituídas e o status de ocupação. Esta divulgação cumpre os requisitos 
                                de transparência ativa previstos na matriz de avaliação do <strong>PNTP 2026</strong>.
                            </p>
                            <p className="text-slate-500 font-medium leading-relaxed">
                                Os dados são extraídos do sistema de gestão de recursos humanos da Prefeitura de Lajes Pintadas, 
                                refletindo a situação atualizada dos vínculos estatutários, comissionados e contratados.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
