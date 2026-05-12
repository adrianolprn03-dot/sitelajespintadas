import PageHeader from "@/components/PageHeader";
import { Scale, Info, AlertCircle, ExternalLink } from "lucide-react";
import Link from "next/link";

export const metadata = {
    title: "Dívida Ativa | Portal da Transparência",
    description: "Informações sobre a Dívida Ativa do Município, em conformidade com o PNTP 2026.",
};

export default function DividaAtivaPage() {
    return (
        <div className="bg-[#f8fafc] min-h-screen font-['Montserrat',sans-serif]">
            <PageHeader
                title="Dívida Ativa"
                subtitle="Consulte as informações sobre créditos tributários e não tributários inscritos em dívida ativa."
                variant="premium"
                icon={<Scale className="text-white" size={32} />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Dívida Ativa" }
                ]}
            />

            <div className="max-w-5xl mx-auto px-6 py-16">
                <div className="bg-white rounded-[2rem] p-12 shadow-xl border border-slate-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                        <Scale size={200} />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                                <Info size={24} />
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">O que é a Dívida Ativa?</h2>
                        </div>

                        <div className="space-y-6 text-slate-600 font-medium leading-relaxed mb-12">
                            <p>
                                A Dívida Ativa é o conjunto de créditos do Município (tributários ou não), que não foram pagos pelos contribuintes dentro do prazo de vencimento e que, após esgotadas as instâncias administrativas, são inscritos em um cadastro específico.
                            </p>
                            <p>
                                Esses valores podem ser referentes a IPTU, ISS, Taxas de Licenciamento, multas de trânsito, entre outros. A transparência desses dados é fundamental para o controle social e fiscal do município.
                            </p>
                        </div>

                        <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 mb-12">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md">
                                    <AlertCircle size={20} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter mb-2 italic">Aviso de Redirecionamento</h3>
                                    <p className="text-sm text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                                        As consultas detalhadas e emissão de guias para pagamento da dívida ativa geralmente são realizadas através do Portal do Contribuinte ou sistema fazendário específico.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-6">
                            <Link 
                                href="/contato" 
                                className="flex-1 bg-slate-900 text-white text-center py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 active:scale-95"
                            >
                                Solicitar Informações via E-SIC
                            </Link>
                            <a 
                                href="#" 
                                className="flex-1 bg-orange-600 text-white text-center py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] hover:bg-orange-700 transition-all shadow-xl shadow-orange-600/20 active:scale-95 flex items-center justify-center gap-3"
                            >
                                <ExternalLink size={16} /> Acessar Portal do Contribuinte
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-6">
                        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                            <Scale size={28} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Base Legal</p>
                            <p className="text-sm font-bold text-slate-700 uppercase tracking-tight">Lei de Responsabilidade Fiscal</p>
                        </div>
                    </div>
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-6">
                        <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                            <AlertCircle size={28} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">PNTP 2026</p>
                            <p className="text-sm font-bold text-slate-700 uppercase tracking-tight">Conformidade com Item de Transparência</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
