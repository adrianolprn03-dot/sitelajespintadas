import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
    title: "Regulamentação das Diárias | Prefeitura de Lajes Pintadas",
    description: "Legislação e normas relativas à concessão de diárias no Município.",
};

export default function RegulamentacaoDiariasPage() {
    return (
        <div className="min-h-screen bg-gray-50 font-['Montserrat',sans-serif]">
            <PageHeader
                title="Regulamentação de Diárias"
                subtitle="Normas para indenização de viagens a serviço da Administração Pública"
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Regulamentação de Diárias" }
                ]}
            />
            
            <div className="bg-[#01b0ef]/10 py-5 px-6 border-b border-blue-100 mb-16">
                <div className="max-w-[1200px] mx-auto flex flex-wrap items-center justify-center gap-6 text-[#0088b9] text-[10px] font-black uppercase tracking-widest">
                    {["Controle Interno", "Ressarcimento", "Lei Municipal"].map((item) => (
                        <span key={item} className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-blue-100">
                            <span className="text-[#50B749]">✓</span> {item}
                        </span>
                    ))}
                </div>
            </div>

            <div className="max-w-[1000px] mx-auto px-6 pb-24">
                <div className="bg-white rounded-[3rem] p-12 md:p-20 shadow-xl shadow-gray-200/50 border border-white">
                     <h2 className="text-3xl font-black text-gray-800 mb-6 uppercase tracking-tighter">Regras de Concessão</h2>
                     <p className="text-xl text-gray-500 font-medium mb-10">
                         A concessão de diárias na prefeitura municipal destina-se a indenizar o servidor pelas despesas extraordinárias com pousada, alimentação e locomoção urbana.
                     </p>

                     <h3 className="text-2xl font-black text-gray-800 mb-4 uppercase">Critérios Essenciais</h3>
                     <ul className="list-disc pl-6 space-y-4 font-medium text-gray-600 mb-12">
                         <li>O pagamento restringe-se ao afastamento da sede do município a serviço, preexistindo interesse público.</li>
                         <li>A diária é concedida por dia de afastamento, sendo paga pela metade quando o pernoite não for exigido.</li>
                         <li>É obrigatória a apresentação do formulário de relatório de viagem junto à nota fiscal das despesas.</li>
                         <li>Servidores sob regimes de contratação que já prevejam viagens na carga horária (como alguns motoristas específicos em rota contínua) obedecem a regramentos próprios em leis complementares.</li>
                     </ul>

                     <div className="p-8 bg-gray-50 border border-gray-100 rounded-[2rem] text-sm text-gray-500 leading-relaxed font-medium">
                         <strong>Atenção:</strong> A base legal para os pagamentos vigentes pode ser consultada inteiramente em nossa página de Legislação Municipal (seção Leis Ordinárias e Decretos Regulamentadores).
                     </div>
                </div>
            </div>
        </div>
    );
}
