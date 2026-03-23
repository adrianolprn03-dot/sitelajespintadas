import PageHeader from "@/components/PageHeader";
import { FaMoneyCheckAlt, FaFilePdf, FaArrowRight } from "react-icons/fa";

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
        <div className="min-h-screen bg-gray-50">
            <PageHeader
                title="Padrão Remuneratório"
                subtitle="Consulte a estrutura remuneratória e a tabela de vencimentos dos servidores municipais."
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Servidores", href: "/transparencia/servidores" },
                    { label: "Padrão Remuneratório" }
                ]}
            />

            <div className="max-w-[1240px] mx-auto px-6 py-16">
                <div className="grid grid-cols-1 gap-12">
                    {tabelas.map((tab, idx) => (
                        <div key={idx} className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                            <div className="bg-primary-600 px-8 py-6 text-white flex items-center justify-between">
                                <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                                    <FaMoneyCheckAlt /> {tab.categoria}
                                </h2>
                                <button className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                                    <FaFilePdf /> Lei Completa
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                                            <th className="px-8 py-4">Cargo / Função</th>
                                            <th className="px-8 py-4">Nível / Classe</th>
                                            <th className="px-8 py-4 text-right">Vencimento Base</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {tab.itens.map((item, iIdx) => (
                                            <tr key={iIdx} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-8 py-4 font-bold text-gray-700">{item.cargo}</td>
                                                <td className="px-8 py-4 text-xs font-bold text-primary-600">{item.nivel}</td>
                                                <td className="px-8 py-4 text-right font-mono font-black text-gray-800">
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

                <div className="mt-16 p-8 bg-blue-50 rounded-[2.5rem] border border-blue-100 flex items-center gap-6">
                    <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center shrink-0">
                        <FaFilePdf size={32} />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-blue-900 uppercase tracking-tight mb-2">Plano de Cargos e Carreiras</h3>
                        <p className="text-blue-700 text-sm font-medium mb-4">Acesse a legislação completa que regulamenta a carreira dos servidores municipais de Lajes Pintadas.</p>
                        <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
                            Baixar Legislação <FaArrowRight />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
