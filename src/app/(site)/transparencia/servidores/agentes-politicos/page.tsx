import PageHeader from "@/components/PageHeader";
import { FaIdCardAlt, FaInfoCircle } from "react-icons/fa";

export default function AgentesPoliticosPage() {
    return (
        <div className="min-h-screen bg-gray-50 font-['Montserrat',sans-serif]">
            <PageHeader
                title="Agentes Políticos"
                subtitle="Remuneração e subsídios do Prefeito, Vice-Prefeito e Secretários Municipais."
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Quadro de Pessoal", href: "/transparencia/servidores" },
                    { label: "Agentes Políticos" }
                ]}
            />

            <div className="max-w-[1240px] mx-auto px-6 py-16 text-center">
                <div className="bg-white rounded-[3rem] p-20 shadow-xl shadow-gray-200/40 border border-white">
                    <div className="w-24 h-24 bg-sky-50 text-sky-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                        <FaIdCardAlt size={40} />
                    </div>
                    <h2 className="text-3xl font-black text-gray-800 uppercase tracking-tighter mb-4">
                        Subsídios de Gestores
                    </h2>
                    <p className="text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed italic mb-10">
                        Publicação detalhada dos subsídios mensais fixados por lei para os agentes políticos do município. Módulo em conformidade com a transparência pública ativa.
                    </p>
                    
                    <div className="flex items-center justify-center gap-3 text-[10px] font-black text-sky-600 uppercase tracking-widest bg-sky-50 px-6 py-4 rounded-2xl border border-sky-100 w-fit mx-auto">
                        <FaInfoCircle />
                        Aguardando publicação oficial
                    </div>
                </div>
            </div>
        </div>
    );
}
