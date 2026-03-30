import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { BarChart3, Info, TrendingUp, Download, PieChart } from "lucide-react";
import StatisticsDashboard from "@/components/transparencia/StatisticsDashboard";

export const metadata: Metadata = {
    title: "Gráficos e Estatísticas | Portal da Transparência",
    description: "Visualização gráfica dos indicadores de atendimento do Serviço de Informação ao Cidadão (e-SIC).",
};

export default function SICGraficosPage() {
    return (
        <div className="min-h-screen bg-[#f8fafc] font-['Montserrat',sans-serif]">
            <PageHeader
                title="Estatísticas do e-SIC"
                subtitle="Indicadores de desempenho e transparência passiva em formato visual e intuitivo."
                variant="premium"
                icon={<BarChart3 />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Transparência Passiva", href: "/transparencia/passiva" },
                    { label: "Gráficos e Estatísticas" }
                ]}
            />

            <div className="max-w-[1240px] mx-auto px-6 py-16">
                
                {/* Intro Section */}
                <div className="bg-white p-10 md:p-16 rounded-[3.5rem] border border-gray-100 shadow-xl shadow-gray-200/40 mb-16 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full -mr-32 -mt-32" />
                    
                    <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
                                <TrendingUp size={14} /> Monitoramento em Tempo Real
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black text-gray-800 uppercase tracking-tighter mb-6 leading-tight">
                                Transparência através de <span className="text-blue-600">Dados Abertos</span>
                            </h2>
                            <p className="text-gray-500 font-medium leading-relaxed mb-8">
                                A Prefeitura Municipal de Lajes Pintadas disponibiliza estes gráficos para facilitar o controle social. Aqui você pode acompanhar o volume de pedidos por secretaria, a eficiência nas respostas e a natureza das informações solicitadas.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center gap-2 text-xs font-bold text-gray-700 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                                   <div className="w-2 h-2 bg-emerald-500 rounded-full" /> 
                                   Dados Filtrados por LGPD
                                </div>
                                <div className="flex items-center gap-2 text-xs font-bold text-gray-700 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                                   <div className="w-2 h-2 bg-blue-500 rounded-full" /> 
                                   Atualização Automática
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 rounded-[2.5rem] p-8 border border-gray-100 flex items-center justify-center">
                            <div className="text-center">
                                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-gray-200">
                                    <PieChart size={40} className="text-blue-600" />
                                </div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Total de Solicitações Históricas</p>
                                <p className="text-5xl font-black text-gray-800 tracking-tighter">100%</p>
                                <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest mt-2">Dados Processados</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dashboard de Gráficos */}
                <div className="mb-20">
                    <StatisticsDashboard type="esic" />
                </div>

                {/* Seção Informativa de Metodologia */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                                <Info size={20} />
                            </div>
                            <h3 className="font-black text-gray-800 uppercase text-xs tracking-widest">Sobre os Gráficos</h3>
                        </div>
                        <p className="text-sm text-gray-500 leading-relaxed font-medium">
                            Os dados apresentados são extraídos diretamente da base de dados do sistema e-SIC Municipal. Os gráficos são atualizados no momento em que um pedido é protocolado, respondido ou classificado.
                        </p>
                    </div>

                    <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                                <Download size={20} />
                            </div>
                            <h3 className="font-black text-gray-800 uppercase text-xs tracking-widest">Dados para Download</h3>
                        </div>
                        <p className="text-sm text-gray-500 leading-relaxed font-medium">
                            Você pode baixar a base de dados bruta destas estatísticas em formatos abertos na página de Dados Abertos de Lajes Pintadas.
                        </p>
                        <a href="/transparencia/dados-abertos" className="mt-6 inline-flex items-center gap-2 text-blue-600 font-black uppercase text-[10px] tracking-widest hover:underline">
                            Ir para Dados Abertos →
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
