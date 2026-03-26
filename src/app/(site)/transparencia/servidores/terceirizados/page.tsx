import PageHeader from "@/components/PageHeader";
import { FaUserTie, FaInfoCircle } from "react-icons/fa";
import BannerPNTP from "@/components/transparencia/BannerPNTP";

export default function TerceirizadosPage() {
    return (
        <div className="min-h-screen bg-[#f8fafc] font-['Montserrat',sans-serif]">
            <PageHeader
                title="Terceirizados"
                subtitle="Relação de postos de trabalho e prestadores de serviço terceirizados."
                variant="premium"
                icon={<FaUserTie />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Quadro de Pessoal", href: "/transparencia/servidores" },
                    { label: "Terceirizados" }
                ]}
            />

            <div className="max-w-[1240px] mx-auto px-6 py-16 -mt-24 relative z-30 text-center">
                <div className="bg-white rounded-[3rem] p-20 shadow-xl shadow-gray-200/40 border border-white">
                    <div className="w-24 h-24 bg-orange-50 text-orange-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                        <FaUserTie size={40} />
                    </div>
                    <h2 className="text-3xl font-black text-gray-800 uppercase tracking-tighter mb-4">
                        Módulo em Atualização
                    </h2>
                    <p className="text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed italic mb-10">
                        Estamos consolidando a relação de prestadores de serviço terceirizados para garantir a total conformidade com a cartilha de transparência 2025. Os dados serão publicados em breve.
                    </p>
                    
                    <div className="flex items-center justify-center gap-3 text-[10px] font-black text-orange-600 uppercase tracking-widest bg-orange-50 px-6 py-4 rounded-2xl border border-orange-100 w-fit mx-auto">
                        <FaInfoCircle />
                        Previsão de publicação: Próxima quinzena
                    </div>
                </div>
            </div>

            {/* Rodapé Informativo */}
            <div className="pb-24 border-t border-slate-100 pt-16">
                <BannerPNTP />
            </div>
        </div>
    );
}
