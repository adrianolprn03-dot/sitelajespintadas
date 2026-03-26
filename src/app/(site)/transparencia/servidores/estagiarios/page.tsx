import PageHeader from "@/components/PageHeader";
import { FaUserGraduate, FaInfoCircle } from "react-icons/fa";
import BannerPNTP from "@/components/transparencia/BannerPNTP";

export default function EstagiariosPage() {
    return (
        <div className="min-h-screen bg-[#f8fafc] font-['Montserrat',sans-serif]">
            <PageHeader
                title="Estagiários"
                subtitle="Relação de estudantes em regime de estágio na administração pública municipal."
                variant="premium"
                icon={<FaUserGraduate />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Quadro de Pessoal", href: "/transparencia/servidores" },
                    { label: "Estagiários" }
                ]}
            />

            <div className="max-w-[1240px] mx-auto px-6 py-16 -mt-24 relative z-30 text-center">
                <div className="bg-white rounded-[3rem] p-20 shadow-xl shadow-gray-200/40 border border-white">
                    <div className="w-24 h-24 bg-pink-50 text-pink-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                        <FaUserGraduate size={40} />
                    </div>
                    <h2 className="text-3xl font-black text-gray-800 uppercase tracking-tighter mb-4">
                        Consolidação de Dados
                    </h2>
                    <p className="text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed italic mb-10">
                        Os termos de compromisso e a relação nominal de estagiários estão sendo digitalizados para publicação integral neste módulo, conforme as exigências da cartilha de transparência e boas práticas de gestão.
                    </p>
                    
                    <div className="flex items-center justify-center gap-3 text-[10px] font-black text-pink-600 uppercase tracking-widest bg-pink-50 px-6 py-4 rounded-2xl border border-pink-100 w-fit mx-auto">
                        <FaInfoCircle />
                        Modulo sob revisão administrativa
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
