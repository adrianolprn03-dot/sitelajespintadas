import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { CalendarClock, Clock, AlertCircle, CheckCircle2, ArrowRightCircle, Info, Landmark } from "lucide-react";

export const metadata: Metadata = {
    title: "Prazos de Resposta | Portal da Transparência",
    description: "Conheça os prazos legais para atendimento às solicitações de informação no município.",
};

const prazos = [
    {
        titulo: "Atendimento Imediato",
        desc: "Sempre que a informação solicitada estiver disponível e for de fácil acesso, o órgão deverá fornecê-la imediatamente ao cidadão.",
        prazo: "Imediato",
        icon: CheckCircle2,
        color: "bg-emerald-500",
        bg: "bg-emerald-50 text-emerald-700"
    },
    {
        titulo: "Prazo Padrão (Regra)",
        desc: "Não sendo possível o acesso imediato, o órgão tem até 20 dias para responder, comunicando a data, local e modo para realizar a consulta ou as razões da negativa.",
        prazo: "20 Dias",
        icon: Clock,
        color: "bg-blue-500",
        bg: "bg-blue-50 text-blue-700"
    },
    {
        titulo: "Prorrogação",
        desc: "O prazo de 20 dias poderá ser prorrogado por mais 10 dias, mediante justificativa expressa enviada ao requerente antes do vencimento do prazo inicial.",
        prazo: "+ 10 Dias",
        icon: CalendarClock,
        color: "bg-amber-500",
        bg: "bg-amber-50 text-amber-700"
    },
    {
        titulo: "Recursos em 1ª Instância",
        desc: "Em caso de negativa ou não atendimento, o cidadão tem 10 dias para interpor recurso, que deve ser respondido pela autoridade superior em até 5 dias.",
        prazo: "10 Dias (Pedido) / 5 Dias (Resposta)",
        icon: AlertCircle,
        color: "bg-rose-500",
        bg: "bg-rose-50 text-rose-700"
    }
];

export default function SICPrazosPage() {
    return (
        <div className="min-h-screen bg-[#f8fafc] font-['Montserrat',sans-serif]">
            <PageHeader
                title="Prazos de Atendimento"
                subtitle="Transparência com agilidade: saiba quanto tempo o município tem para responder seu pedido."
                variant="premium"
                icon={<CalendarClock />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Transparência Passiva", href: "/transparencia/passiva" },
                    { label: "Prazos de Atendimento" }
                ]}
            />

            <div className="max-w-[1240px] mx-auto px-6 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
                    <div className="space-y-8">
                        <h2 className="text-3xl font-black text-gray-800 uppercase tracking-tighter leading-tight">
                            Controle de Prazos <br /> <span className="text-blue-600">Lei nº 12.527 / 2011</span>
                        </h2>
                        <p className="text-gray-500 font-medium leading-relaxed">
                            A Lei de Acesso à Informação estabelece ritos e prazos rigorosos para garantir que o cidadão receba sua resposta em tempo hábil. O não cumprimento destes prazos sem justificativa legal pode acarretar em responsabilidade administrativa.
                        </p>
                        
                        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/40">
                             <div className="flex items-center gap-4 mb-6">
                                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                                    <Info size={20} />
                                </div>
                                <h3 className="font-black text-gray-800 uppercase text-xs tracking-widest">Informações Importantes</h3>
                             </div>
                             <ul className="space-y-4">
                                {[
                                    "A contagem dos dias é feita em dias corridos.",
                                    "O prazo começa a contar a partir da data de protocolo.",
                                    "Pedidos genéricos ou desproporcionais podem ser indeferidos.",
                                    "A negativa deve ser sempre fundamentada legalmente."
                                ].map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-sm text-gray-500 font-medium">
                                        <ArrowRightCircle className="text-blue-500 shrink-0 mt-0.5" size={16} />
                                        {item}
                                    </li>
                                ))}
                             </ul>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute left-10 top-0 bottom-0 w-px bg-gray-100 hidden sm:block" />
                        <div className="space-y-8">
                            {prazos.map((p, idx) => (
                                <div key={idx} className="relative pl-0 sm:pl-24 group">
                                    {/* Icone Flutuante na Timeline */}
                                    <div className={`hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl ${p.color} text-white items-center justify-center shadow-xl ring-8 ring-[#f8fafc] z-10 transition-transform group-hover:scale-110`}>
                                        <p.icon size={24} />
                                    </div>
                                    
                                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-50 shadow-lg shadow-gray-200/40 transition-all hover:shadow-2xl">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="font-black text-gray-800 uppercase tracking-tighter text-lg">{p.titulo}</h3>
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${p.bg}`}>
                                                {p.prazo}
                                            </span>
                                        </div>
                                        <p className="text-gray-500 text-sm leading-relaxed font-medium">
                                            {p.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Seção Fluxograma Simplificado */}
                <div className="bg-gray-900 rounded-[3rem] p-12 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-blue-600/5 opacity-10" />
                    <div className="relative text-center mb-12">
                        <h3 className="text-2xl font-black uppercase tracking-tighter mb-4">Fluxo do Pedido</h3>
                        <p className="text-gray-400 text-sm max-w-xl mx-auto">Entenda o caminho da sua solicitação desde o envio até a resposta final.</p>
                    </div>
                    
                    <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8">
                        {[
                            { step: "01", label: "Protocolo", desc: "Envio do pedido via e-SIC ou Presencial." },
                            { step: "02", label: "Análise", desc: "Encaminhamento ao setor responsável." },
                            { step: "03", label: "Resposta", desc: "Elaboração e revisão da informação." },
                            { step: "04", label: "Conclusão", desc: "Disponibilização ao Cidadão." }
                        ].map((item, idx) => (
                            <div key={idx} className="text-center group">
                                <div className="w-16 h-16 bg-white/10 rounded-3xl mx-auto mb-6 flex items-center justify-center font-black text-xl group-hover:bg-blue-600 transition-all">
                                    {item.step}
                                </div>
                                <h4 className="font-black uppercase text-xs tracking-widest mb-2">{item.label}</h4>
                                <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
