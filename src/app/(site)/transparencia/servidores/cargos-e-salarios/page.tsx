import PageHeader from "@/components/PageHeader";
import { FaMoneyCheckAlt, FaFilePdf, FaArrowRight } from "react-icons/fa";
import BannerPNTP from "@/components/transparencia/BannerPNTP";

const tabelas = [
    {
        categoria: "Quadro Geral",
        itens: [
            { cargo: "Auxiliar Administrativo", nivel: "A-1", valor: 1412.00 },
            { cargo: "Assistente Administrativo", nivel: "B-1", valor: 1850.00 },
            { cargo: "Técnico de Nível Médio", nivel: "C-1", valor: 2100.00 },
        ]
    },
    {
        categoria: "Educação - Magistério",
        itens: [
            { cargo: "Professor (20h)", nivel: "P-1", valor: 2290.28 },
            { cargo: "Professor (40h)", nivel: "P-1", valor: 4580.57 },
        ]
    }
];

export default function CargosSalariosPage() {
    return (
        <div className="min-h-screen bg-[#f8fafc] font-['Montserrat',sans-serif]">
            <PageHeader
                title="Padrão Remuneratório"
                subtitle="Consulte a estrutura remuneratória e a tabela de vencimentos dos servidores municipais."
                variant="premium"
                icon={<FaMoneyCheckAlt />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Servidores", href: "/transparencia/servidores" },
                    { label: "Padrão Remuneratório" }
                ]}
            />

            <div className="max-w-[1240px] mx-auto px-6 py-12 -mt-16 relative z-30">
                <div className="grid grid-cols-1 gap-8">
                    {tabelas.map((tab, idx) => (
                        <div key={idx} className="bg-white rounded-2xl shadow-xl shadow-blue-900/5 border border-white overflow-hidden">
                            <div className="bg-[#1E293B] px-6 py-4 text-white flex items-center justify-between">
                                <h2 className="text-base font-black uppercase tracking-tight flex items-center gap-2">
                                    <FaMoneyCheckAlt className="text-blue-400" size={18} /> {tab.categoria}
                                </h2>
                                <button className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all border border-white/10">
                                    <FaFilePdf size={12} /> Lei Completa
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-gray-50 text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                                            <th className="px-6 py-3">Cargo / Função</th>
                                            <th className="px-6 py-3">Nível</th>
                                            <th className="px-6 py-3 text-right">Vencimento Base</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {tab.itens.map((item, iIdx) => (
                                            <tr key={iIdx} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-3.5 font-bold text-gray-700 text-xs uppercase tracking-tight">{item.cargo}</td>
                                                <td className="px-6 py-3.5 text-[10px] font-black text-blue-600">{item.nivel}</td>
                                                <td className="px-6 py-3.5 text-right font-black text-gray-800 text-xs">
                                                    {item.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 p-6 bg-blue-50 rounded-2xl border border-blue-100 flex items-center gap-6">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
                        <FaFilePdf size={24} />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-blue-900 uppercase tracking-tight mb-1">Plano de Cargos e Carreiras</h3>
                        <p className="text-blue-700 text-[11px] font-bold mb-3 italic opacity-80">Legislação completa que regulamenta a carreira dos servidores municipais.</p>
                        <button className="text-[9px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1.5 hover:gap-3 transition-all">
                            Baixar Legislação <FaArrowRight size={10} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Rodapé Informativo */}
            <div className="mt-20 pb-24 border-t border-slate-100 pt-16">
                <BannerPNTP />
                
                <div className="max-w-7xl mx-auto px-6 mt-16 text-center">
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em]">Lei de Responsabilidade Fiscal • Município de Lajes Pintadas</p>
                    <div className="w-12 h-1 bg-indigo-500/20 mx-auto rounded-full mt-4" />
                </div>
            </div>
        </div>
    );
}
