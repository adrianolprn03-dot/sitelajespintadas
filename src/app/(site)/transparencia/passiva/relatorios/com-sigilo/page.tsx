"use client";
import { useState, useEffect } from "react";
import PageHeader from "@/components/PageHeader";
import { FaShield, FaLock, FaExclamationTriangle, FaInfoCircle, FaFile, FaCalendar, FaCheckCircle, FaUserShield, FaChevronRight, FaBalanceScale, FaSpinner, FaArrowCircleRight } from "react-icons/fa";
import Link from "next/link";
import TransparencyFilters from "@/components/transparencia/TransparencyFilters";
import { exportToCSV, exportToJSON, exportToPDF, exportToXLSX } from "@/lib/exportUtils";
import BannerPNTP from "@/components/transparencia/BannerPNTP";

type Pedido = {
    id: string; protocolo: string; pedido: string; status: string; 
    orgao: string; criadoEm: string; grauSigilo: string;
};

export default function SICRelatoriosComSigiloPage() {
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [loading, setLoading] = useState(true);
    const [busca, setBusca] = useState("");
    const [ano, setAno] = useState(new Date().getFullYear().toString());
    const [mes, setMes] = useState("");
    const [sigilo, setSigilo] = useState("");

    useEffect(() => {
        const fetchPedidos = async () => {
            setLoading(true);
            try {
                // Filtra apenas os que NÃO são "Sem Sigilo"
                const query = new URLSearchParams();
                if (ano) query.append("ano", ano);
                if (mes) query.append("mes", mes);
                
                const res = await fetch(`/api/transparencia/pedidos?${query.toString()}`);
                const data = await res.json();
                
                // Filtra no cliente para garantir que pegamos apenas os sigilosos (ou usa o parâmetro se a API suportar)
                const sigilosos = (data.items || []).filter((p: any) => p.grauSigilo !== "Sem Sigilo");
                setPedidos(sigilosos);
            } catch (error) {
                console.error("Erro ao buscar pedidos sigilosos:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPedidos();
    }, [ano, mes]);

    const handleClearFilters = () => {
        setBusca("");
        setAno(new Date().getFullYear().toString());
        setMes("");
        setSigilo("");
    };

    const filtrados = pedidos.filter(p => {
        const b = busca.toLowerCase();
        const s = sigilo.toLowerCase();
        return (!busca || p.protocolo.toLowerCase().includes(b) || p.orgao.toLowerCase().includes(b)) &&
               (!sigilo || p.grauSigilo.toLowerCase() === s);
    });

    const handleExport = (format: "pdf" | "csv" | "json" | "xlsx") => {
        const payload = filtrados.map(p => ({
            "Protocolo": p.protocolo,
            "Data": new Date(p.criadoEm).toLocaleDateString('pt-BR'),
            "Órgão": p.orgao,
            "Grau de Sigilo": p.grauSigilo,
            "Status": p.status === 'concluido' ? 'Concluído' : 'Em Tramitação'
        }));

        const filename = `pedidos_esic_classificados_${ano}`;
        const title = `Relatório e-SIC: Informações Classificadas (Sigilo) – Lajes Pintadas/RN (${ano})`;

        if (format === "csv") exportToCSV(payload, filename);
        else if (format === "json") exportToJSON(payload, filename);
        else if (format === "xlsx") exportToXLSX(payload, filename);
        else exportToPDF(payload, filename, title);
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] font-['Montserrat',sans-serif]">
            <PageHeader
                title="Informações Classificadas (Sigilo)"
                subtitle="Relação de solicitações que possuem restrição de acesso temporária por força de lei."
                variant="premium"
                icon={<FaShield />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Transparência Passiva", href: "/transparencia/passiva" },
                    { label: "Relatórios", href: "/transparencia/passiva/relatorios" },
                    { label: "Com Sigilo" }
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
                    placeholder="Buscar por protocolo ou órgão..."
                >
                    <div className="flex items-center gap-3">
                        <select 
                            value={sigilo} 
                            onChange={(e) => setSigilo(e.target.value)}
                            className="bg-white border border-gray-200 px-4 py-2 rounded-xl text-[11px] font-bold text-gray-700 focus:outline-none hover:bg-white transition-all shadow-sm"
                        >
                            <option value="">Todos os Graus</option>
                            <option value="Reservado">Reservado</option>
                            <option value="Secreto">Secreto</option>
                            <option value="Ultrassecreto">Ultrassecreto</option>
                        </select>
                    </div>
                </TransparencyFilters>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-4">
                   {/* Coluna de Explicação sobre Sigilo */}
                   <div className="lg:col-span-1 space-y-8">
                      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/40 relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full -mr-12 -mt-12" />
                          <div className="w-12 h-12 bg-purple-600 text-white rounded-xl flex items-center justify-center mb-6 shadow-xl shadow-purple-200">
                              <FaLock size={20} />
                          </div>
                          <h2 className="text-xl font-black text-gray-800 uppercase tracking-tighter mb-4 leading-tight">Classificação de Sigilo</h2>
                          <p className="text-gray-500 text-[11px] font-bold leading-relaxed mb-6 italic opacity-80">
                             A LAI define graus de classificação para a informação pública:
                          </p>
                          <div className="space-y-3">
                             {[
                                 { g: "Reservado", p: "5 anos", c: "bg-amber-100 text-amber-700 font-black" },
                                 { g: "Secreto", p: "15 anos", c: "bg-orange-100 text-orange-700 font-black" },
                                 { g: "Ultrassecreto", p: "25 anos", c: "bg-rose-100 text-rose-700 font-black" }
                             ].map((item, idx) => (
                                 <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="flex items-center gap-2">
                                       <div className={`w-1.5 h-1.5 rounded-full ${item.c.split(' ')[0]}`} />
                                       <span className="text-[9px] font-black uppercase tracking-widest text-gray-700">{item.g}</span>
                                    </div>
                                    <span className="text-[8px] font-black text-gray-400 uppercase">Prazo: {item.p}</span>
                                 </div>
                             ))}
                          </div>
                       </div>

                       <div className="bg-amber-50 rounded-2xl p-8 border border-amber-100">
                          <h3 className="text-sm font-black text-amber-900 uppercase tracking-tighter mb-3 flex items-center gap-2">
                             <FaExclamationTriangle size={14} className="text-amber-600" /> Fundamentação
                          </h3>
                          <p className="text-[10px] text-amber-800/70 font-bold leading-relaxed opacity-80 italic">
                             Listagem de pedidos restritos com base na Lei 12.527/2011. Toda classificação requer um TCI.
                          </p>
                       </div>
                   </div>

                   {/* Listagem de Pedidos Sigilosos */}
                   <div className="lg:col-span-2 space-y-6">
                      <div className="flex items-center gap-4 mb-4">
                         <div className="w-10 h-1 bg-purple-600 rounded-full"></div>
                         <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter">Listagem de Solicitações</h2>
                      </div>
                      
                      {loading ? (
                        <div className="bg-white rounded-[3rem] p-20 text-center border border-gray-100 shadow-sm">
                           <FaSpinner className="animate-spin inline-block text-purple-600 text-3xl mb-4" />
                           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Carregando informações restritas...</p>
                        </div>
                      ) : filtrados.length > 0 ? (
                         filtrados.map((p) => (
                            <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden group hover:shadow-2xl transition-all duration-500">
                               <div className="p-8">
                                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                     <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center shrink-0 border border-purple-50 shadow-sm">
                                           <FaShield size={20} />
                                        </div>
                                        <div>
                                           <h3 className="text-base font-black text-gray-800 uppercase tracking-tighter mb-0.5">PROTOCOLO #{p.protocolo}</h3>
                                           <div className="flex items-center gap-3">
                                              <span className="flex items-center gap-1.5 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                                 <FaCalendar size={10} /> {new Date(p.criadoEm).toLocaleDateString('pt-BR')}
                                              </span>
                                              <span className="w-1 h-1 bg-gray-200 rounded-full" />
                                              <span className="text-[9px] font-black text-purple-500 uppercase tracking-widest">{p.orgao}</span>
                                           </div>
                                        </div>
                                     </div>
                                     <div className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest ring-1 ring-purple-100 ${p.grauSigilo === 'Reservado' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'}`}>
                                        Sigilo: {p.grauSigilo}
                                     </div>
                                  </div>

                                  <div className="bg-gray-900 rounded-xl p-6 text-white relative overflow-hidden">
                                     <div className="absolute right-0 top-0 p-6 opacity-10">
                                        <FaLock size={40} />
                                     </div>
                                     <p className="text-[8px] font-black text-blue-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                        <FaBalanceScale size={10} /> Fundamentação Legal
                                     </p>
                                     <p className="text-[10px] text-gray-400 font-bold leading-relaxed italic mb-0 opacity-80">
                                        "Informação classificada por comprometer a segurança pública ou atividades de inteligência."
                                     </p>
                                  </div>

                                  <div className="mt-6 pt-6 border-t border-gray-50 flex items-center justify-between">
                                     <div className="flex items-center gap-1.5 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                        <FaInfoCircle size={10} /> Desclassificação: +{p.grauSigilo === 'Reservado' ? '5' : '15'} Anos
                                     </div>
                                     <Link href={`/servicos/consulta-protocolo?id=${p.protocolo}`} className="text-purple-600 font-black uppercase text-[9px] tracking-widest hover:text-purple-800 transition-colors flex items-center gap-1.5">
                                        Detalhes <FaChevronRight size={10} />
                                     </Link>
                                  </div>
                               </div>
                            </div>
                         ))
                      ) : (
                        <div className="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-gray-100">
                           <div className="w-20 h-20 bg-gray-50 text-gray-200 rounded-full flex items-center justify-center mx-auto mb-8">
                              <FaLock size={40} />
                           </div>
                           <h4 className="text-xl font-black text-gray-800 uppercase tracking-tighter mb-4">Sem registros restritos</h4>
                           <p className="text-gray-400 font-medium text-sm max-w-sm mx-auto">
                               Não foram localizados pedidos de informação com grau de sigilo para os filtros selecionados.
                           </p>
                        </div>
                      )}
                      
                      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-center">
                         <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-4">Deseja solicitar a desclassificação?</p>
                         <Link href="/servicos/esic" className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-full font-black uppercase text-[9px] tracking-widest hover:bg-purple-700 transition-all shadow-lg shadow-purple-900/10">
                            Abrir Pedido <FaArrowCircleRight size={12} />
                         </Link>
                      </div>
                   </div>
                </div>
                
                <div className="mt-20">
                     <BannerPNTP />
                </div>
            </div>
        </div>
    );
}
