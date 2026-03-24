import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";

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
                     <p className="text-xl text-gray-500 font-medium mb-12 text-center">
                         Confira a seguir a estrutura base de valores aplicada para ressarcimento de servidores no exercício de suas funções, fora da comarca do município. <br/>*(Valores referenciais podem variar mediante decreto superveniente)*.
                     </p>

                     <div className="overflow-x-auto rounded-3xl border border-gray-100 shadow-sm mb-12">
                         <table className="w-full text-left border-collapse">
                             <thead>
                                 <tr className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-[10px] uppercase tracking-widest">
                                     <th className="p-5">Beneficiário / Cargo</th>
                                     <th className="p-5">Hospedagem + Alimentação (Integral)</th>
                                     <th className="p-5">Somente Alimentação (Meia Diária)</th>
                                 </tr>
                             </thead>
                             <tbody className="text-sm font-medium text-gray-600 divide-y divide-gray-100">
                                 <tr className="hover:bg-gray-50 transition-colors">
                                     <td className="p-5 font-bold text-gray-800">Chefe do Executivo (Prefeito e Vice)</td>
                                     <td className="p-5 text-blue-600 font-black">R$ 500,00</td>
                                     <td className="p-5">R$ 250,00</td>
                                 </tr>
                                 <tr className="hover:bg-gray-50 transition-colors">
                                     <td className="p-5 font-bold text-gray-800">Secretários do Primeiro Escalão</td>
                                     <td className="p-5 text-blue-600 font-black">R$ 300,00</td>
                                     <td className="p-5">R$ 150,00</td>
                                 </tr>
                                 <tr className="hover:bg-gray-50 transition-colors">
                                     <td className="p-5 font-bold text-gray-800">Analistas, Assessores e Coordenações</td>
                                     <td className="p-5 text-blue-600 font-black">R$ 220,00</td>
                                     <td className="p-5">R$ 110,00</td>
                                 </tr>
                                 <tr className="hover:bg-gray-50 transition-colors">
                                     <td className="p-5 font-bold text-gray-800">Motoristas e Demais Servidores</td>
                                     <td className="p-5 text-blue-600 font-black">R$ 150,00</td>
                                     <td className="p-5">R$ 75,00</td>
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
