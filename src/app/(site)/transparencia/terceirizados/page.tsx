"use client";
import { useState, useEffect } from "react";
import PageHeader from "@/components/PageHeader";
import { Info, FileText, GraduationCap, Briefcase, UserCheck, UserPlus, Building } from "lucide-react";
import { FaInfoCircle, FaSpinner } from "react-icons/fa";
import Link from "next/link";
import TransparencyFilters from "@/components/transparencia/TransparencyFilters";
import { exportToCSV, exportToJSON, exportToPDF, exportToXLSX } from "@/lib/exportUtils";

type Terceirizado = {
    id: string;
    nome: string;
    empresa: string;
    funcao: string;
    unidadeLotacao: string;
    dataInicio: string;
    dataFim: string | null;
    status: string;
};

export default function TerceirizadosPage() {
    const [terceirizados, setTerceirizados] = useState<Terceirizado[]>([]);
    const [loading, setLoading] = useState(true);
    const [busca, setBusca] = useState("");
    const [ano, setAno] = useState("2026");
    const [mes, setMes] = useState("");
    const [status, setStatus] = useState("");

    const fetchTerceirizados = async () => {
        setLoading(true);
        try {
            const query = new URLSearchParams({ 
                query: busca,
                ano,
                mes,
                status
            });
            const res = await fetch(`/api/terceirizados?${query.toString()}`);
            const data = await res.json();
            setTerceirizados(data.items || []);
        } catch (error) {
            console.error("Erro ao buscar terceirizados:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTerceirizados();
    }, [busca, ano, mes, status]);

    const handleClearFilters = () => {
        setBusca("");
        setAno("2026");
        setMes("");
        setStatus("");
    };

    const handleExport = (format: "pdf" | "csv" | "json" | "xlsx") => {
        const payload = terceirizados.map(t => ({
            "Nome": t.nome,
            "Empresa": t.empresa,
            "Função": t.funcao,
            "Lotação": t.unidadeLotacao,
            "Início": new Date(t.dataInicio).toLocaleDateString('pt-BR'),
            "Término": t.dataFim ? new Date(t.dataFim).toLocaleDateString('pt-BR') : "Vigente",
            "Status": t.status
        }));

        const filename = `terceirizados_lajes_pintadas`;
        const title = `Relatório de Terceirizados – Município de Lajes Pintadas/RN`;

        if (format === "csv") exportToCSV(payload, filename);
        else if (format === "json") exportToJSON(payload, filename);
        else if (format === "xlsx") exportToXLSX(payload, filename);
        else exportToPDF(payload, filename, title);
    };

    return (
        <div className="bg-[#f8fafc] min-h-screen font-['Montserrat',sans-serif]">
            <PageHeader
                title="Terceirizados"
                subtitle="Consulte a relação de pessoal terceirizado e as empresas prestadoras de serviço."
                variant="premium"
                icon={<UserPlus className="text-white" size={32} />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Terceirizados" }
                ]}
            />

            {/* Banner PNTP */}
            <div className="bg-[#01b0ef]/10 py-5 px-6 border-b border-blue-100">
                <div className="max-w-[1200px] mx-auto flex flex-wrap items-center justify-center gap-6 text-[#0088b9] text-[10px] font-black uppercase tracking-widest">
                    {["Lei de Licitações", "Transparência Pública", "PNTP 2026"].map((item) => (
                        <span key={item} className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-blue-100">
                            <span className="text-[#50B749]">✓</span> {item}
                        </span>
                    ))}
                </div>
            </div>

            <div className="max-w-[1240px] mx-auto px-6 pt-12">
                <TransparencyFilters
                    searchValue={busca}
                    onSearch={setBusca}
                    currentYear={ano}
                    onYearChange={setAno}
                    currentMonth={mes}
                    onMonthChange={setMes}
                    onClear={handleClearFilters}
                    onExport={handleExport}
                    placeholder="Buscar por nome, empresa ou função..."
                >
                    <div className="w-full sm:w-48">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Situação (Tipo)</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 text-xs focus:ring-2 focus:ring-blue-500/10 focus:bg-white focus:border-blue-300 transition-all font-black text-slate-700 outline-none cursor-pointer"
                        >
                            <option value="">Todas as Situações</option>
                            <option value="ativo">Ativos</option>
                            <option value="encerrado">Encerrados</option>
                        </select>
                    </div>
                </TransparencyFilters>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <FaSpinner className="text-4xl text-blue-600 animate-spin" />
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Carregando dados...</p>
                    </div>
                ) : terceirizados.length === 0 ? (
                    <div className="bg-red-50 border-l-8 border-red-500 rounded-r-3xl p-8 flex flex-col md:flex-row items-center justify-center md:justify-start gap-6 shadow-xl shadow-red-500/10 transition-all hover:bg-red-100">
                        <FaInfoCircle className="text-red-500 text-5xl shrink-0 drop-shadow-md" />
                        <div className="text-center md:text-left">
                            <h3 className="text-red-900 font-black text-xl uppercase tracking-tight mb-2">Comunicação Oficial</h3>
                            <p className="text-red-700 font-bold text-lg md:text-xl">
                                {busca || mes !== "" 
                                    ? "Nenhum terceirizado encontrado para os filtros aplicados."
                                    : `A Prefeitura Municipal de Lajes Pintadas informa que NÃO POSSUÍMOS PESSOAL TERCEIRIZADO em nosso quadro de colaboradores para o período selecionado (${mes ? mes + '/' : ''}${ano}).`
                                }
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-[2rem] shadow-2xl shadow-blue-500/5 border border-slate-100 overflow-hidden">
                        <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                                    <UserCheck className="text-blue-600" /> Relação de Terceirizados
                                </h2>
                                <p className="text-slate-500 font-medium">Dados conforme contratos de prestação de serviços vigentes.</p>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                                        <th className="px-8 py-5">Profissional / Função</th>
                                        <th className="px-8 py-5">Empresa Contratada</th>
                                        <th className="px-8 py-5">Unidade de Lotação</th>
                                        <th className="px-8 py-5">Início</th>
                                        <th className="px-8 py-5 text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {terceirizados.map((t) => (
                                        <tr key={t.id} className="hover:bg-blue-50/30 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{t.nome}</div>
                                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{t.funcao}</div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2">
                                                    <Building size={14} className="text-blue-500" />
                                                    <div className="text-sm font-semibold text-slate-600">{t.empresa}</div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="text-[10px] font-black text-blue-500 uppercase tracking-wider">{t.unidadeLotacao}</div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="text-sm font-medium text-slate-500">
                                                    {new Date(t.dataInicio).toLocaleDateString('pt-BR')}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${
                                                    t.status === 'ativo' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                                                }`}>
                                                    {t.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            <div className="max-w-5xl mx-auto px-6 py-16">
                <div className="bg-white rounded-[2rem] p-12 shadow-xl border border-slate-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                        <UserPlus size={200} />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                                <Info size={24} />
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Controle de Terceirização</h2>
                        </div>

                        <div className="space-y-6 text-slate-600 font-medium leading-relaxed mb-12">
                            <p>
                                Em conformidade com as diretrizes de transparência pública, esta seção apresenta a relação de profissionais vinculados a empresas prestadoras de serviço que atuam na administração municipal.
                            </p>
                            <p>
                                A gestão municipal assegura que todos os processos de terceirização ocorram mediante licitação pública e fiscalização rigorosa do cumprimento dos deveres trabalhistas e previdenciários pelas empresas contratadas.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-6">
                            <Link 
                                href="/transparencia/contratos" 
                                className="flex-1 bg-slate-900 text-white text-center py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 active:scale-95 flex items-center justify-center gap-3"
                            >
                                <FileText size={16} /> Consultar Contratos
                            </Link>
                            <a 
                                href="/transparencia" 
                                className="flex-1 bg-blue-600 text-white text-center py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-95 flex items-center justify-center gap-3"
                            >
                                Voltar ao Portal
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
