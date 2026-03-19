import PageHeader from "@/components/PageHeader";
import { FaChartBar, FaUserCheck, FaClock, FaClipboardList } from "react-icons/fa";

const estatisticas = [
    { label: "Pedidos Recebidos", valor: "42", icone: FaClipboardList, cor: "text-blue-600 bg-blue-100" },
    { label: "Pedidos Atendidos", valor: "38", icone: FaUserCheck, cor: "text-green-600 bg-green-100" },
    { label: "Em Tramitação", valor: "04", icone: FaClock, cor: "text-orange-600 bg-orange-100" },
    { label: "Tempo Médio (Dias)", valor: "6.5", icone: FaChartBar, cor: "text-purple-600 bg-purple-100" },
];

export default function TransparenciaPassivaPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <PageHeader
                title="Transparência Passiva"
                subtitle="Relatórios estatísticos de acesso à informação (e-SIC) – Lei 12.527/2011."
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Transparência Passiva" }
                ]}
            />

            <div className="max-w-[1240px] mx-auto px-6 py-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {estatisticas.map((item, idx) => (
                        <div key={idx} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center">
                            <div className={`w-14 h-14 ${item.cor} rounded-2xl flex items-center justify-center mb-6`}>
                                <item.icone size={28} />
                            </div>
                            <span className="text-3xl font-black text-gray-800 mb-1">{item.valor}</span>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.label}</span>
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-[3rem] p-12 shadow-sm border border-gray-100 mb-12">
                    <h2 className="text-2xl font-black text-gray-800 mb-8 uppercase tracking-tighter">Relatórios Anuais de Gestão (LAI)</h2>
                    <div className="space-y-4">
                        {[2023, 2022, 2021].map((ano) => (
                            <div key={ano} className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl group hover:bg-primary-50 transition-all cursor-pointer">
                                <span className="font-bold text-gray-700 group-hover:text-primary-600 transition-colors">Relatório Estatístico Consolidado - {ano}</span>
                                <div className="flex items-center gap-4">
                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest hidden sm:block">PDF - 1.2 MB</span>
                                    <button className="bg-white p-3 rounded-xl shadow-sm text-primary-500 group-hover:bg-primary-500 group-hover:text-white transition-all">
                                        Baixar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="text-center p-12 bg-gray-900 rounded-[3rem] text-white">
                    <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter">Pedido de Informação Online</h3>
                    <p className="text-gray-400 max-w-xl mx-auto mb-8 font-medium">
                        Qualquer cidadão pode solicitar informações que não estejam disponíveis de forma ativa no portal.
                    </p>
                    <a href="/servicos/esic" className="inline-block bg-[#01b0ef] text-white px-10 py-4 rounded-full font-black uppercase text-xs tracking-widest shadow-lg hover:bg-blue-600 transition-all">
                        Ir para o e-SIC
                    </a>
                </div>
            </div>
        </div>
    );
}
