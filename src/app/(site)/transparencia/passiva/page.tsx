"use client";
import { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaChartBar, FaUserCheck, FaClock, FaClipboardList } from "react-icons/fa";
import {
    Building2,
    HelpCircle,
    CalendarClock,
    ScrollText,
    FileStack,
    ShieldCheck,
    Eye,
    BarChart3,
    Search,
    ArrowRight,
    Landmark,
} from "lucide-react";

const categoriasSIC = [
    {
        titulo: "Informações do SIC",
        modulos: [
            {
                icon: Building2,
                titulo: "Institucional do SIC",
                desc: "Autoridade de monitoramento, contatos, endereço e horários de atendimento presencial e eletrônico.",
                href: "/transparencia/passiva/institucional",
                cor: "from-blue-600 to-indigo-700",
                badge: "Institucional",
            },
            {
                icon: HelpCircle,
                titulo: "Perguntas Frequentes",
                desc: "Respostas para as dúvidas mais comuns sobre a Lei de Acesso à Informação (LAI).",
                href: "/transparencia/passiva/perguntas",
                cor: "from-amber-500 to-orange-600",
                badge: "FAQ",
            },
            {
                icon: CalendarClock,
                titulo: "Prazos e Recursos",
                desc: "Prazos legais de resposta (20 + 10 dias), instâncias recursais e procedimentos.",
                href: "/transparencia/passiva/prazos",
                cor: "from-emerald-500 to-teal-700",
                badge: "Prazos",
            },
            {
                icon: ScrollText,
                titulo: "Regulamentação da LAI",
                desc: "Leis e decretos que regulamentam o SIC e a proteção de dados no município.",
                href: "/transparencia/passiva/regulamentacao",
                cor: "from-slate-600 to-slate-800",
                badge: "Normas",
            },
        ],
    },
    {
        titulo: "Relatórios Estatísticos e Classificação de Sigilo",
        modulos: [
            {
                icon: BarChart3,
                titulo: "Relatório Anual Estatístico",
                desc: "Pedidos recebidos, atendidos, indeferidos e informações genéricas sobre os solicitantes.",
                href: "/transparencia/passiva/relatorios/estatisticas",
                cor: "from-blue-600 to-indigo-700",
                badge: "Anual",
            },
            {
                icon: ShieldCheck,
                titulo: "Documentos Classificados (Sigilo)",
                desc: "Lista por grau de sigilo com assunto, categoria, dispositivo legal e respectivo prazo.",
                href: "/transparencia/passiva/relatorios/com-sigilo",
                cor: "from-purple-600 to-indigo-800",
                badge: "Sigilo",
            },
            {
                icon: Eye,
                titulo: "Desclassificadas (Últimos 12 Meses)",
                desc: "Relação das informações desclassificadas nos últimos 12 meses ou declaração formal.",
                href: "/transparencia/passiva/relatorios/sem-sigilo",
                cor: "from-cyan-500 to-blue-600",
                badge: "12 Meses",
            },
            {
                icon: FileStack,
                titulo: "Central de Relatórios e Gráficos",
                desc: "Painel consolidado de relatórios do e-SIC, séries históricas e indicadores.",
                href: "/transparencia/passiva/relatorios",
                cor: "from-teal-400 to-emerald-500",
                badge: "Painel",
            },
        ],
    },
];

export default function TransparenciaPassivaPage() {
    const [stats, setStats] = useState({
        recebidos: 0,
        atendidos: 0,
        tramitacao: 0,
        tempoMedioDias: "0",
        carregado: false,
    });

    useEffect(() => {
        fetch("/api/transparencia/esic-relatorios?tipo=estatisticas")
            .then((r) => r.json())
            .then((data) => {
                const c = data?.consolidadoHistorico;
                if (!c) {
                    setStats((prev) => ({ ...prev, carregado: true }));
                    return;
                }
                setStats({
                    recebidos: c.totalRecebidos ?? 0,
                    atendidos: c.atendidos ?? 0,
                    tramitacao: c.emTramitacao ?? 0,
                    tempoMedioDias: c.tempoMedioDias > 0 ? String(c.tempoMedioDias) : "—",
                    carregado: true,
                });
            })
            .catch(() => {
                setStats((prev) => ({ ...prev, carregado: true }));
            });
    }, []);

    const estatisticas = [
        {
            label: "Pedidos Registrados na Base",
            valor: stats.carregado ? String(stats.recebidos) : "...",
            icone: FaClipboardList,
            cor: "text-blue-600 bg-blue-100",
        },
        {
            label: "Pedidos Respondidos",
            valor: stats.carregado ? String(stats.atendidos) : "...",
            icone: FaUserCheck,
            cor: "text-green-600 bg-green-100",
        },
        {
            label: "Em Tramitação / Recurso",
            valor: stats.carregado ? String(stats.tramitacao) : "...",
            icone: FaClock,
            cor: "text-orange-600 bg-orange-100",
        },
        {
            label: "Tempo Médio Real (Dias)",
            valor: stats.carregado ? stats.tempoMedioDias : "...",
            icone: FaChartBar,
            cor: "text-purple-600 bg-purple-100",
        },
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] font-['Montserrat',sans-serif]">
            <PageHeader
                title="Transparência Passiva (e-SIC)"
                subtitle="Serviço de Informação ao Cidadão – Solicite informações públicas sem necessidade de justificativa e acompanhe estatísticas reais."
                variant="premium"
                icon={<Landmark />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Transparência Passiva" },
                ]}
            />

            <div className="max-w-[1240px] mx-auto px-6 py-12">
                {/* Cards de Métricas Reais */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {estatisticas.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white rounded-2xl p-6 shadow-xl shadow-gray-200/40 border border-gray-100 flex flex-col items-center text-center group hover:shadow-2xl transition-all duration-500"
                        >
                            <div
                                className={`w-12 h-12 ${item.cor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                            >
                                <item.icone size={22} />
                            </div>
                            <span className="text-2xl font-black text-gray-800 mb-0.5">{item.valor}</span>
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                {item.label}
                            </span>
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
                                        transition={{ delay: catIdx * 0.2 + idx * 0.05 }}
                                    >
                                        <Link href={m.href} className="group block h-full">
                                            <div className="relative h-full bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/40 hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-500 group-hover:-translate-y-1.5 overflow-hidden">
                                                <div className={`h-20 bg-gradient-to-br ${m.cor} relative overflow-hidden`}>
                                                    <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]" />
                                                    <div className="absolute -right-3 -top-3 w-16 h-16 bg-white/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700" />
                                                </div>

                                                <div className="absolute top-10 left-6">
                                                    <div className="w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 border border-gray-50">
                                                        <m.icon
                                                            className="text-gray-800 lg:group-hover:text-blue-600 transition-colors"
                                                            size={24}
                                                            strokeWidth={1.5}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="pt-10 p-6 h-full flex flex-col">
                                                    <div className="flex justify-between items-start mb-3">
                                                        <h3 className="font-black text-gray-800 text-[11px] uppercase tracking-tight group-hover:text-blue-600 transition-colors">
                                                            {m.titulo}
                                                        </h3>
                                                        <span className="text-[7.5px] font-black uppercase tracking-widest text-gray-500 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">
                                                            {m.badge}
                                                        </span>
                                                    </div>

                                                    <p className="text-gray-500 text-[10px] font-bold leading-relaxed mb-6 grow italic opacity-80">
                                                        &ldquo;{m.desc}&rdquo;
                                                    </p>

                                                    <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
                                                        <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-blue-600 group-hover:text-blue-800 transition-colors">
                                                            Acessar
                                                            <ArrowRight
                                                                size={12}
                                                                className="group-hover:translate-x-1 transition-transform"
                                                            />
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
                <div className="mt-24">
                    <div className="relative rounded-[3rem] bg-gradient-to-br from-blue-600 to-indigo-800 p-1 md:p-1.5 shadow-2xl shadow-blue-900/20 overflow-hidden">
                        <div className="relative bg-white/5 backdrop-blur-3xl rounded-[2.8rem] p-10 md:p-16 text-center text-white overflow-hidden">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-3xl shadow-xl mb-8">
                                <FaClipboardList size={36} className="text-blue-600" />
                            </div>

                            <h2 className="text-2xl md:text-4xl font-black mb-4 tracking-tighter uppercase">
                                Quer solicitar uma informação pública?
                            </h2>
                            <p className="max-w-2xl mx-auto text-blue-100 text-base font-medium leading-relaxed mb-10">
                                Você pode registrar seu pedido eletronicamente pelo e-SIC sem necessidade de apresentar justificativa (Art. 10, § 3º da Lei Federal nº 12.527/2011).
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                <Link
                                    href="/servicos/esic"
                                    className="w-full sm:w-auto bg-white text-blue-700 px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-blue-50 transition-all"
                                >
                                    Abrir Nova Solicitação (e-SIC)
                                </Link>
                                <Link
                                    href="/servicos/consulta-protocolo"
                                    className="w-full sm:w-auto bg-transparent border-2 border-white/40 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                                >
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
