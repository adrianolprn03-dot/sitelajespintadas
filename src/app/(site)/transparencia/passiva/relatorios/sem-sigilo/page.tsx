"use client";
import { useState, useEffect } from "react";
import PageHeader from "@/components/PageHeader";
import { FaEye, FaFileAlt, FaCheckCircle, FaClock, FaArrowRight, FaSpinner } from "react-icons/fa";
import Link from "next/link";
import TransparencyFilters from "@/components/transparencia/TransparencyFilters";
import { exportToCSV, exportToJSON, exportToPDF } from "@/lib/exportUtils";
import BannerPNTP from "@/components/transparencia/BannerPNTP";

type Pedido = {
    id: string; protocolo: string; pedido: string; status: string; 
    orgao: string; criadoEm: string; nome: string | null;
};

export default function SICRelatoriosSemSigiloPage() {
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [loading, setLoading] = useState(true);
    const [busca, setBusca] = useState("");
    const [ano, setAno] = useState(new Date().getFullYear().toString());
    const [mes, setMes] = useState("");
    const [status, setStatus] = useState("");

    useEffect(() => {
        const fetchPedidos = async () => {
            setLoading(true);
            try {
                const query = new URLSearchParams({ sigilo: "Sem Sigilo" });
                if (ano) query.append("ano", ano);
                if (mes) query.append("mes", mes);
                if (status) query.append("status", status);

                const res = await fetch(`/api/transparencia/pedidos?${query.toString()}`);
                const data = await res.json();
                setPedidos(data.items || []);
            } catch (error) {
                console.error("Erro ao buscar pedidos:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPedidos();
    }, [ano, mes, status]);

    const handleClearFilters = () => {
        setBusca("");
        setAno(new Date().getFullYear().toString());
        setMes("");
        setStatus("");
    };

    const filtrados = pedidos.filter(p => {
        const b = busca.toLowerCase();
        return !busca || 
            p.protocolo.toLowerCase().includes(b) || 
            p.pedido.toLowerCase().includes(b) ||
            p.orgao.toLowerCase().includes(b);
    });

    const handleExport = (format: "pdf" | "csv" | "json") => {
        const payload = filtrados.map(p => ({
            "Protocolo": p.protocolo,
            "Data": new Date(p.criadoEm).toLocaleDateString('pt-BR'),
            "Órgão": p.orgao,
            "Solicitação": p.pedido,
            "Status": p.status === 'concluido' ? 'Concluído' : 'Em Tramitação'
        }));

        const filename = `pedidos_esic_sem_sigilo_${ano}`;
        const title = `Relatório e-SIC: Pedidos sem Sigilo – Lajes Pintadas/RN (${ano})`;

        if (format === "csv") exportToCSV(payload, filename);
        else if (format === "json") exportToJSON(payload, filename);
        else exportToPDF(payload, filename, title);
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] font-['Montserrat',sans-serif]">
            <PageHeader
                title="Pedidos de Acesso Público"
                subtitle="Consulta integral às solicitações realizadas via e-SIC que não possuem restrição de sigilo."
                variant="premium"
                icon={<FaEye />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Transparência Passiva", href: "/transparencia/passiva" },
                    { label: "Relatórios", href: "/transparencia/passiva/relatorios" },
                    { label: "Sem Sigilo" }
                ]}
            />

            <div className="max-w-[1240px] mx-auto px-6 py-16 -mt-10">
                <TransparencyFilters
                    searchValue={busca}
                    onSearch={setBusca}
                    currentYear={ano}
                    onYearChange={setAno}
                    currentMonth={mes}
                    onMonthChange={setMes}
                    onClear={handleClearFilters}
                    onExport={handleExport}
                    placeholder="Buscar por protocolo, órgão ou palavra-chave..."
                >
                    <div className="flex items-center gap-3">
                        <select 
                            value={status} 
                            onChange={(e) => setStatus(e.target.value)}
                            className="bg-white border border-gray-200 px-4 py-2 rounded-xl text-[11px] font-bold text-gray-700 focus:outline-none hover:bg-white transition-all shadow-sm"
                        >
                            <option value="">Todos os Status</option>
                            <option value="concluido">Concluído</option>
                            <option value="aberto">Em Aberto</option>
                        </select>
                    </div>
                </TransparencyFilters>

                {/* Listagem de Pedidos */}
                <div className="space-y-6">
                    {loading ? (
                        <div className="p-20 text-center text-blue-600 bg-white rounded-[3rem] border border-gray-100 shadow-sm">
                            <FaSpinner className="animate-spin inline-block text-3xl mb-4" />
                            <p className="font-black text-xs uppercase tracking-[0.2em]">Buscando dados no portal...</p>
                        </div>
                    ) : filtrados.length > 0 ? (
                        filtrados.map((p) => (
                            <div key={p.id} className="bg-white rounded-[2.5rem] border border-gray-50 shadow-lg shadow-gray-200/40 overflow-hidden group hover:shadow-2xl transition-all duration-500">
                                <div className="p-8 md:p-10">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                                       <div className="flex items-center gap-6">
                                          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500 shadow-sm border border-blue-50">
                                             <FaFileAlt size={24} />
                                          </div>
                                          <div>
                                             <h3 className="text-xl font-black text-gray-800 uppercase tracking-tighter mb-1">PROTOCOLO #{p.protocolo}</h3>
                                             <div className="flex items-center gap-4">
                                                <span className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                   {new Date(p.criadoEm).toLocaleDateString('pt-BR')}
                                                </span>
                                                <span className="w-1 h-1 bg-gray-200 rounded-full" />
                                                <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest leading-none">Órgão: {p.orgao}</span>
                                             </div>
                                          </div>
                                       </div>
                                       <div className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${p.status === 'concluido' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                          {p.status === 'concluido' ? <FaCheckCircle size={14} /> : <FaClock size={14} />}
                                          {p.status === 'concluido' ? 'Informação Disponibilizada' : 'Pedido em Tramitação'}
                                       </div>
                                    </div>

                                    <div className="bg-gray-50/50 rounded-[2rem] p-8 border border-gray-50">
                                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Teor da Solicitação</p>
                                       <p className="text-sm text-gray-600 font-medium leading-relaxed italic line-clamp-3">
                                          "{p.pedido}"
                                       </p>
                                    </div>

                                    <div className="mt-8 pt-8 border-t border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                       <div className="flex items-center gap-3 text-xs font-bold text-gray-500">
                                          <span className="text-gray-400">Solicitante:</span> {p.nome ? 'Cidadão Identificado' : 'Anônimo'}
                                       </div>
                                       <Link href={`/servicos/consulta-protocolo?id=${p.protocolo}`} className="bg-white text-blue-600 px-8 py-4 rounded-full font-black uppercase text-[10px] tracking-widest border border-blue-100 hover:bg-blue-600 hover:text-white transition-all shadow-sm flex items-center gap-3 self-end">
                                          Ver Detalhes do Pedido <FaArrowRight size={14} />
                                       </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-gray-100">
                            <div className="w-20 h-20 bg-gray-50 text-gray-200 rounded-full flex items-center justify-center mx-auto mb-8">
                               <FaFileAlt size={40} />
                            </div>
                            <h3 className="text-xl font-black text-gray-800 uppercase tracking-tighter mb-4">Nenhum registro encontrado</h3>
                            <p className="text-gray-400 font-medium text-sm max-w-sm mx-auto">
                                No momento, não há pedidos registrados para os filtros selecionados.
                            </p>
                        </div>
                    )}
                </div>

                <div className="mt-20">
                     <BannerPNTP />
                </div>
            </div>
        </div>
    );
}
