import PageHeader from "@/components/PageHeader";
import { Handshake, Info, FileText, ExternalLink } from "lucide-react";
import Link from "next/link";

export const metadata = {
    title: "Acordos Firmados | Portal da Transparência",
    description: "Informações sobre acordos firmados sem transferência de recursos financeiros.",
};

export default function AcordosFirmadosPage() {
    return (
        <div className="bg-[#f8fafc] min-h-screen font-['Montserrat',sans-serif]">
            <PageHeader
                title="Acordos Firmados"
                subtitle="Consulte os termos de cooperação e acordos técnicos firmados sem repasse de recursos."
                variant="premium"
                icon={<Handshake className="text-white" size={32} />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Acordos Firmados" }
                ]}
            />

            <div className="max-w-5xl mx-auto px-6 py-16">
                <div className="bg-white rounded-[2rem] p-12 shadow-xl border border-slate-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                        <Handshake size={200} />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                                <Info size={24} />
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">O que são estes Acordos?</h2>
                        </div>

                        <div className="space-y-6 text-slate-600 font-medium leading-relaxed mb-12">
                            <p>
                                Refere-se a parcerias, termos de cooperação mútua, acordos de cooperação técnica e outros ajustes firmados pelo Município com entidades públicas ou privadas, nos quais <strong>não há previsão de transferência voluntária de recursos financeiros</strong> entre os partícipes.
                            </p>
                            <p>
                                O objetivo principal destes acordos costuma ser o intercâmbio de conhecimentos, cessão de uso de espaços, apoio institucional ou execução conjunta de atividades de interesse público sem envolver movimentação de caixa.
                            </p>
                        </div>

                        <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 mb-12">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md">
                                    <FileText size={20} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter mb-2 italic">Acesso aos Documentos</h3>
                                    <p className="text-sm text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                                        A listagem completa e a íntegra dos termos podem ser consultadas através do sistema de gestão de parcerias ou solicitadas formalmente via E-SIC.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-6">
                            <Link 
                                href="/contato" 
                                className="flex-1 bg-slate-900 text-white text-center py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 active:scale-95"
                            >
                                Solicitar via E-SIC
                            </Link>
                            <a 
                                href="#" 
                                className="flex-1 bg-indigo-600 text-white text-center py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 active:scale-95 flex items-center justify-center gap-3"
                            >
                                <ExternalLink size={16} /> Acessar Sistema de Parcerias
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
