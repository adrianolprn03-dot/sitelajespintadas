"use client";
import PageHeader from "@/components/PageHeader";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
    FaChartBar, FaUserCheck, FaClock, FaClipboardList 
} from "react-icons/fa";
import { 
    Building2, HelpCircle, CalendarClock, ScrollText, 
    FileStack, ShieldCheck, Eye, BarChart3, 
    Search, ArrowRight, Check, ExternalLink,
    Landmark, Info, Lock
} from "lucide-react";

const estatisticas = [
    { label: "Pedidos Recebidos", valor: "42", icone: FaClipboardList, cor: "text-blue-600 bg-blue-100" },
    { label: "Pedidos Atendidos", valor: "38", icone: FaUserCheck, cor: "text-green-600 bg-green-100" },
    { label: "Em Tramitação", valor: "04", icone: FaClock, cor: "text-orange-600 bg-orange-100" },
    { label: "Tempo Médio (Dias)", valor: "6.5", icone: FaChartBar, cor: "text-purple-600 bg-purple-100" },
];

const categoriasSIC = [
    {
        titulo: "Informações do SIC",
        modulos: [
            { icon: Building2, titulo: "Institucional do SIC", desc: "Autoridade de monitoramento, contatos e horários.", href: "/transparencia/passiva/institucional", cor: "from-blue-600 to-indigo-700", badge: "Institucional" },
            { icon: HelpCircle, titulo: "Perguntas Frequentes", desc: "Respostas para as dúvidas mais comuns sobre a LAI.", href: "/transparencia/passiva/perguntas", cor: "from-amber-500 to-orange-600", badge: "FAQ" },
            { icon: CalendarClock, titulo: "Prazos de Resposta", desc: "Prazos legais e procedimentos de atendimento.", href: "/transparencia/passiva/prazos", cor: "from-emerald-500 to-teal-700", badge: "Prazos" },
            { icon: ScrollText, titulo: "Regulamentação", desc: "Leis e decretos que regulamentam o SIC no município.", href: "/transparencia/passiva/regulamentacao", cor: "from-slate-600 to-slate-800", badge: "Leis" },
        ]
    },
    {
        titulo: "Relatórios e Estatísticas",
        modulos: [
            { icon: FileStack, titulo: "Relatório de Solicitações", desc: "Listagem detalhada de todos os pedidos protocolados.", href: "/transparencia/passiva/relatorios", cor: "from-rose-500 to-red-700", badge: "Geral" },
            { icon: ShieldCheck, titulo: "Com Grau de Sigilo", desc: "Relatórios de informações classificadas com sigilo.", href: "/transparencia/passiva/relatorios/com-sigilo", cor: "from-purple-600 to-indigo-800", badge: "Sigilo" },
            { icon: Eye, titulo: "Sem Grau de Sigilo", desc: "Relatórios de informações de acesso público.", href: "/transparencia/passiva/relatorios/sem-sigilo", cor: "from-cyan-500 to-blue-600", badge: "Público" },
            { icon: BarChart3, titulo: "Gráficos e Estatísticas", desc: "Indicadores de desempenho e estatísticas do SIC.", href: "/transparencia/passiva/graficos", cor: "from-teal-400 to-emerald-500", badge: "Dados" },
        ]
    }
];

export default function TransparenciaPassivaPage() {
    return (
        <div className="min-h-screen bg-[#f8fafc] font-['Montserrat',sans-serif]">
            <PageHeader
                title="Transparência Passiva (e-SIC)"
                subtitle="Serviço de Informação ao Cidadão – Acesse dados públicos e acompanhe suas solicitações."
                variant="premium"
                icon={<Landmark />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Transparência Passiva" }
                ]}
            />

            <div className="max-w-[1240px] mx-auto px-6 py-12">
                {/* Cards de Métricas Rápidas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {estatisticas.map((item, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white rounded-2xl p-6 shadow-xl shadow-gray-200/40 border border-gray-100 flex flex-col items-center text-center group hover:shadow-2xl transition-all duration-500"
                        >
                            <div className={`w-12 h-12 ${item.cor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                <item.icone size={22} />
                            </div>
                            <span className="text-2xl font-black text-gray-800 mb-0.5">{item.valor}</span>
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{item.label}</span>
                        </motion.div>
                    ))}
                </div>

                {/* Seções de Módulos */}
                <div className="space-y-16">
                    {categoriasSIC.map((categoria, catIdx) => (
                        <div key={categoria.titulo} className="relative">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-8 h-1 bg-blue-600 rounded-full"></div>
                                <h2 className="text-xl font-black text-gray-800 uppercase tracking-tighter">
                                    {categoria.titulo}
                                </h2>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {categoria.modulos.map((m, idx) => (
                                    <motion.div
                                        key={m.href}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: (catIdx * 0.2) + (idx * 0.05) }}
                                    >
                                        <Link href={m.href} className="group block h-full">
                                            <div className="relative h-full bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/40 hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-500 group-hover:-translate-y-1.5 overflow-hidden">
                                                <div className={`h-20 bg-gradient-to-br ${m.cor} relative overflow-hidden`}>
                                                    <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]" />
                                                    <div className="absolute -right-3 -top-3 w-16 h-16 bg-white/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700" />
                                                </div>

                                                <div className="absolute top-10 left-6">
                                                    <div className="w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 border border-gray-50">
                                                        <m.icon className="text-gray-800 lg:group-hover:text-blue-600 transition-colors" size={24} strokeWidth={1.5} />
                                                    </div>
                                                </div>

                                                <div className="pt-10 p-6 h-full flex flex-col">
                                                    <div className="flex justify-between items-start mb-3">
                                                        <h2 className="font-black text-gray-800 text-[11px] uppercase tracking-tight group-hover:text-blue-600 transition-colors">
                                                            {m.titulo}
                                                        </h2>
                                                        <span className="text-[7.5px] font-black uppercase tracking-widest text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">
                                                            {m.badge}
                                                        </span>
                                                    </div>
                                                    
                                                    <p className="text-gray-500 text-[10px] font-bold leading-relaxed mb-6 grow italic opacity-80">
                                                        "{m.desc}"
                                                    </p>

                                                    <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
                                                        <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-blue-500 group-hover:text-blue-700 transition-colors">
                                                            Acessar
                                                            <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Call to Action - Abrir Solicitação */}
                <div className="mt-32">
                    <div className="relative rounded-[4rem] bg-gradient-to-br from-blue-600 to-indigo-800 p-1 md:p-1.5 shadow-2xl shadow-blue-900/20 overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                        
                        <div className="relative bg-white/5 backdrop-blur-3xl rounded-[3.8rem] p-12 md:p-20 text-center text-white overflow-hidden">
                             <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
                             <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl -ml-32 -mb-32" />

                             <motion.div 
                                initial={{ scale: 0.9, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-[2rem] shadow-xl mb-10"
                             >
                                <FaClipboardList size={40} className="text-blue-600" />
                             </motion.div>

                             <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tighter uppercase">Quer solicitar uma informação?</h2>
                             <p className="max-w-2xl mx-auto text-blue-100/80 text-lg font-medium leading-relaxed mb-12">
                                Caso não tenha encontrado o que procura, você pode abrir um pedido de informação através do nosso sistema eletrônico (e-SIC).
                             </p>

                             <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                                <Link href="/servicos/esic" className="w-full sm:w-auto bg-white text-blue-700 px-10 py-5 rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-xl hover:bg-blue-50 transition-all hover:scale-105 active:scale-95 duration-300">
                                    Abrir Nova Solicitação
                                </Link>
                                <Link href="/servicos/consulta-protocolo" className="w-full sm:w-auto bg-transparent border-2 border-white/30 text-white px-10 py-5 rounded-[2rem] font-black uppercase text-xs tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-3 group">
                                    <Search size={16} />
                                    Consultar Protocolo
                                </Link>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
