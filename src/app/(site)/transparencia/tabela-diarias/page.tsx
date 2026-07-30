import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { FaInfoCircle } from "react-icons/fa";

export const metadata: Metadata = {
    title: "Tabela de Valores de Diárias | Prefeitura de Lajes Pintadas",
    description: "Tabela de valores vigentes para pagamento de diárias de viagens no Município.",
};

export default function TabelaDiariasPage() {
    return (
        <div className="min-h-screen bg-gray-50 font-['Montserrat',sans-serif]">
            <PageHeader
                title="Tabela de Valores de Diárias"
                subtitle="Referência legal de valores para indenização de alimentação e pernoite"
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Tabela de Diárias" }
                ]}
            />
            
            <div className="bg-[#01b0ef]/10 py-5 px-6 border-b border-blue-100 mb-16">
                <div className="max-w-[1200px] mx-auto flex flex-wrap items-center justify-center gap-6 text-[#0088b9] text-[10px] font-black uppercase tracking-widest">
                    {["Referência Vigente", "Valores Fixados", "Transparência Pública"].map((item) => (
                        <span key={item} className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-blue-100">
                            <span className="text-[#50B749]">✓</span> {item}
                        </span>
                    ))}
                </div>
            </div>

            <div className="max-w-[1000px] mx-auto px-6 pb-24">
                <div className="bg-white rounded-[3rem] p-12 md:p-20 shadow-xl shadow-gray-200/50 border border-white">
                     {/* Declaração Oficial */}
                     <div className="bg-red-50 border-l-8 border-red-500 rounded-r-3xl p-8 flex flex-col md:flex-row items-center justify-center md:justify-start gap-6 shadow-xl shadow-red-500/10 mb-12 transition-all hover:bg-red-100">
                         <FaInfoCircle className="text-red-500 text-5xl shrink-0 drop-shadow-md" />
                         <div className="text-center md:text-left">
                             <h3 className="text-red-900 font-black text-xl uppercase tracking-tight mb-2">Declaração Oficial</h3>
                             <p className="text-red-700 font-bold text-lg md:text-xl">
                                 Declaração que não existe regulamentação para Diárias Internacionais até o período de 01/06/2026.
                             </p>
                         </div>
                     </div>

                     <p className="text-xl text-gray-500 font-medium mb-12 text-center">
                         Confira a seguir a estrutura base de valores aplicada para ressarcimento de servidores no exercício de suas funções, fora da comarca do município. <br/>*(Valores referenciais podem variar mediante decreto superveniente)*.
                     </p>

                     <div className="overflow-x-auto rounded-3xl border border-gray-100 shadow-sm mb-12">
                         <table className="w-full text-left border-collapse">
                             <thead>
                                 <tr className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-[11px] font-black uppercase tracking-wider">
                                     <th className="p-4 md:p-5">Cargo ou Função</th>
                                     <th className="p-4 md:p-5 text-center">Natal, Mossoró ou Caicó</th>
                                     <th className="p-4 md:p-5 text-center">Demais Cidades</th>
                                     <th className="p-4 md:p-5 text-center">Outros Estados</th>
                                     <th className="p-4 md:p-5 text-center">Brasília/DF</th>
                                 </tr>
                             </thead>
                             <tbody className="text-xs md:text-sm font-medium text-gray-700 divide-y divide-gray-100">
                                 <tr className="hover:bg-blue-50/40 transition-colors">
                                     <td className="p-4 md:p-5 font-bold text-gray-900">Prefeito Municipal</td>
                                     <td className="p-4 md:p-5 text-center font-semibold text-blue-700">R$ 400,00</td>
                                     <td className="p-4 md:p-5 text-center">R$ 350,00</td>
                                     <td className="p-4 md:p-5 text-center">R$ 500,00</td>
                                     <td className="p-4 md:p-5 text-center font-bold text-emerald-600">R$ 1.000,00</td>
                                 </tr>
                                 <tr className="hover:bg-blue-50/40 transition-colors">
                                     <td className="p-4 md:p-5 font-bold text-gray-900">Vice Prefeito Municipal</td>
                                     <td className="p-4 md:p-5 text-center font-semibold text-blue-700">R$ 350,00</td>
                                     <td className="p-4 md:p-5 text-center">R$ 300,00</td>
                                     <td className="p-4 md:p-5 text-center">R$ 450,00</td>
                                     <td className="p-4 md:p-5 text-center font-bold text-emerald-600">R$ 800,00</td>
                                 </tr>
                                 <tr className="hover:bg-blue-50/40 transition-colors">
                                     <td className="p-4 md:p-5 font-bold text-gray-900">Procurador</td>
                                     <td className="p-4 md:p-5 text-center font-semibold text-blue-700">R$ 350,00</td>
                                     <td className="p-4 md:p-5 text-center">R$ 250,00</td>
                                     <td className="p-4 md:p-5 text-center">R$ 450,00</td>
                                     <td className="p-4 md:p-5 text-center font-bold text-emerald-600">R$ 800,00</td>
                                 </tr>
                                 <tr className="hover:bg-blue-50/40 transition-colors">
                                     <td className="p-4 md:p-5 font-bold text-gray-900">Controlador</td>
                                     <td className="p-4 md:p-5 text-center font-semibold text-blue-700">R$ 350,00</td>
                                     <td className="p-4 md:p-5 text-center">R$ 250,00</td>
                                     <td className="p-4 md:p-5 text-center">R$ 450,00</td>
                                     <td className="p-4 md:p-5 text-center font-bold text-emerald-600">R$ 800,00</td>
                                 </tr>
                                 <tr className="hover:bg-blue-50/40 transition-colors">
                                     <td className="p-4 md:p-5 font-bold text-gray-900">Secretários Municipais</td>
                                     <td className="p-4 md:p-5 text-center font-semibold text-blue-700">R$ 350,00</td>
                                     <td className="p-4 md:p-5 text-center">R$ 250,00</td>
                                     <td className="p-4 md:p-5 text-center">R$ 450,00</td>
                                     <td className="p-4 md:p-5 text-center font-bold text-emerald-600">R$ 800,00</td>
                                 </tr>
                                 <tr className="hover:bg-blue-50/40 transition-colors">
                                     <td className="p-4 md:p-5 font-bold text-gray-900">Conselheiros Tutelares</td>
                                     <td className="p-4 md:p-5 text-center font-semibold text-blue-700">R$ 150,00</td>
                                     <td className="p-4 md:p-5 text-center">R$ 100,00</td>
                                     <td className="p-4 md:p-5 text-center">R$ 150,00</td>
                                     <td className="p-4 md:p-5 text-center font-bold text-emerald-600">R$ 550,00</td>
                                 </tr>
                                 <tr className="hover:bg-blue-50/40 transition-colors">
                                     <td className="p-4 md:p-5 font-bold text-gray-900">Demais Agentes Públicos</td>
                                     <td className="p-4 md:p-5 text-center font-semibold text-blue-700">R$ 200,00</td>
                                     <td className="p-4 md:p-5 text-center">R$ 200,00</td>
                                     <td className="p-4 md:p-5 text-center">R$ 300,00</td>
                                     <td className="p-4 md:p-5 text-center font-bold text-emerald-600">R$ 550,00</td>
                                 </tr>
                             </tbody>
                         </table>
                     </div>

                     <div className="bg-amber-50 border border-amber-100 p-8 rounded-[2rem] flex items-start gap-4 text-sm text-amber-800 font-medium">
                         <span className="text-2xl mt-1">⚠️</span>
                         <p>
                             Para viagens cujo destino exige deslocamentos de risco (como áreas metropolitanas extensas) ou deslocamento aéreo (Brasília), o regramento municipal dispõe de complementação tarifada ou passagens emitidas via pregão próprio, cabendo o pagamento específico nos termos do controle interno.
                         </p>
                     </div>
                </div>
            </div>
        </div>
    );
}
