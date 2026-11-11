import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
    FaNewspaper, FaGavel, FaUsers, FaMoneyBillWave,
    FaBullhorn, FaFileContract, FaChartBar, FaEnvelope, FaHandshake, FaPlane,
    FaHammer, FaQuestionCircle, FaBook, FaBalanceScale, FaBuilding,
    FaPlus, FaArrowRight, FaHeartbeat, FaCalendarAlt, FaCheckCircle,
    FaExclamationCircle, FaShieldAlt, FaExternalLinkAlt, FaClock
} from "react-icons/fa";

export default async function AdminDashboard() {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role || "admin";
    const userName = session?.user?.name?.split(' ')[0] || "Gestor";

    // Saudação por horário
    const hour = new Date().getHours();
    let saudacao = "Bem-vindo(a)";
    if (hour >= 5 && hour < 12) saudacao = "Bom dia";
    else if (hour >= 12 && hour < 18) saudacao = "Boa tarde";
    else saudacao = "Boa noite";

    // Data formatada em português
    const dataFormatada = new Intl.DateTimeFormat("pt-BR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    }).format(new Date());

    // Contadores do banco
    let counts = { 
        noticia: 0, licitacao: 0, contrato: 0, convenio: 0, diaria: 0, 
        servidor: 0, ouvidoria: 0, contato: 0, obra: 0, faq: 0, 
        glossario: 0, legislacao: 0, unidades: 0, regulacao: 0 
    };

    try {
        const [noticia, licitacao, contrato, convenio, diaria, servidor, ouvidoria, contato, obra, faq, glossario, legislacao, unidades, regulacao] = await Promise.all([
            prisma.noticia.count(),
            prisma.licitacao.count(),
            prisma.contrato.count(),
            prisma.convenio.count(),
            prisma.diaria.count(),
            prisma.servidor.count(),
            prisma.ouvidoria.count({ where: { status: "aberto" } }),
            prisma.contato.count({ where: { respondido: false } }),
            prisma.obra.count(),
            prisma.fAQ.count(),
            prisma.glossario.count(),
            prisma.legislacao.count(),
            prisma.unidadeAtendimento.count(),
            prisma.centralRegulacaoItem.count(),
        ]);
        counts = { noticia, licitacao, contrato, convenio, diaria, servidor, ouvidoria, contato, obra, faq, glossario, legislacao, unidades, regulacao };
    } catch { }

    const metrics = [
        { icon: FaNewspaper, cor: "from-blue-500 to-indigo-600", bgLight: "bg-blue-50/80", text: "text-blue-600", border: "border-blue-100", href: "/admin/noticias", label: "Notícias", value: counts.noticia, subtext: "Cadastradas", roles: ["admin", "editor", "comunicacao"] },
        { icon: FaHammer, cor: "from-amber-500 to-orange-600", bgLight: "bg-orange-50/80", text: "text-orange-600", border: "border-orange-100", href: "/admin/obras", label: "Obras", value: counts.obra, subtext: "Acompanhamento", roles: ["admin", "editor"] },
        { icon: FaBuilding, cor: "from-teal-500 to-emerald-600", bgLight: "bg-teal-50/80", text: "text-teal-600", border: "border-teal-100", href: "/admin/unidades", label: "Unidades", value: counts.unidades, subtext: "Atendimento", roles: ["admin", "editor"] },
        { icon: FaHeartbeat, cor: "from-rose-500 to-red-600", bgLight: "bg-rose-50/80", text: "text-rose-600", border: "border-rose-100", href: "/admin/central-regulacao", label: "Regulação", value: counts.regulacao, subtext: "Filas de Saúde", roles: ["admin", "editor"] },
        { icon: FaGavel, cor: "from-yellow-500 to-amber-600", bgLight: "bg-amber-50/80", text: "text-amber-600", border: "border-amber-100", href: "/admin/licitacoes", label: "Licitações", value: counts.licitacao, subtext: "Processos", roles: ["admin", "editor"] },
        { icon: FaFileContract, cor: "from-indigo-500 to-purple-600", bgLight: "bg-indigo-50/80", text: "text-indigo-600", border: "border-indigo-100", href: "/admin/contratos", label: "Contratos", value: counts.contrato, subtext: "Vigentes/Registrados", roles: ["admin", "editor"] },
        { icon: FaUsers, cor: "from-cyan-500 to-blue-600", bgLight: "bg-cyan-50/80", text: "text-cyan-600", border: "border-cyan-100", href: "/admin/servidores", label: "Servidores", value: counts.servidor, subtext: "Quadro de Pessoal", roles: ["admin", "editor"] },
        { icon: FaBullhorn, cor: "from-purple-500 to-pink-600", bgLight: "bg-purple-50/80", text: "text-purple-600", border: "border-purple-100", href: "/admin/ouvidoria", label: "Ouvidoria", value: counts.ouvidoria, subtext: "Manifestações Abertas", roles: ["admin", "editor"] },
    ].filter(c => c.roles.includes(role));

    const quickActions = [
        { label: "Nova Notícia", href: "/admin/noticias/nova", icon: FaPlus, bg: "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20" },
        { label: "Nova Obra", href: "/admin/obras/nova", icon: FaHammer, bg: "bg-orange-600 hover:bg-orange-700 text-white shadow-orange-600/20" },
        { label: "Nova Licitação", href: "/admin/licitacoes/nova", icon: FaGavel, bg: "bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20" },
        { label: "Novo Contrato", href: "/admin/contratos/novo", icon: FaFileContract, bg: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20" },
        { label: "Regulação em Saúde", href: "/admin/central-regulacao", icon: FaHeartbeat, bg: "bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20" },
    ];

    const [ultimasNoticias, ultimasObras, ultimasOuvidorias] = await Promise.all([
        prisma.noticia.findMany({
            take: 4,
            orderBy: { criadoEm: "desc" },
            select: { id: true, titulo: true, criadoEm: true, publicada: true }
        }),
        prisma.obra.findMany({
            take: 4,
            orderBy: { criadoEm: "desc" },
            select: { id: true, titulo: true, criadoEm: true, status: true }
        }),
        prisma.ouvidoria.findMany({
            take: 4,
            orderBy: { criadoEm: "desc" },
            select: { id: true, protocolo: true, assunto: true, status: true, criadoEm: true }
        })
    ]);

    return (
        <div className="max-w-[1440px] mx-auto space-y-8 pb-12">
            
            {/* HERO WELCOME BANNER */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 p-8 sm:p-10 text-white shadow-2xl shadow-slate-950/20 border border-slate-700/50">
                <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-gradient-to-br from-primary-500/20 to-blue-600/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                <div className="absolute bottom-0 left-1/3 w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-blue-200 text-xs font-bold mb-4 border border-white/10 uppercase tracking-widest">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            {dataFormatada}
                        </div>
                        
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-3">
                            {saudacao}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-primary-300 to-teal-200">{userName}!</span>
                        </h1>
                        
                        <p className="text-slate-300 text-sm sm:text-base max-w-2xl font-medium leading-relaxed">
                            Gerencie as informações institucionais, transparência pública e serviços de Lajes Pintadas em um só lugar.
                            Você possui <strong className="text-white">{counts.contato} contatos não lidos</strong> e <strong className="text-white">{counts.ouvidoria} manifestações abertas</strong> na ouvidoria.
                        </p>
                    </div>

                    <div className="shrink-0 flex flex-wrap items-center gap-3">
                        {quickActions.slice(0, 3).map((act, idx) => (
                            <Link
                                key={idx}
                                href={act.href}
                                className={`px-5 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-all flex items-center gap-2 ${act.bg}`}
                            >
                                <act.icon size={13} /> {act.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* METRICS & KPIS GRID */}
            <div>
                <div className="flex items-center justify-between mb-4 px-1">
                    <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
                        <FaChartBar className="text-primary-600" /> Visão Geral por Módulo
                    </h2>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total de Registros</span>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {metrics.map((m) => (
                        <Link 
                            key={m.href} 
                            href={m.href} 
                            className={`group relative bg-white p-6 rounded-[2rem] shadow-sm border ${m.border} hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300 hover:-translate-y-1.5 overflow-hidden isolate flex flex-col justify-between`}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-12 h-12 rounded-2xl ${m.bgLight} ${m.text} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-xs`}>
                                    <m.icon size={20} />
                                </div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-primary-600 transition-colors flex items-center gap-1">
                                    Acessar <FaArrowRight size={8} />
                                </span>
                            </div>

                            <div>
                                <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-none mb-1.5 group-hover:text-primary-600 transition-colors">
                                    {m.value.toLocaleString()}
                                </div>
                                <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">{m.label}</div>
                                <div className="text-[11px] font-medium text-slate-400 mt-0.5">{m.subtext}</div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* ATALHOS RÁPIDOS */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Atalhos de Criação Rápida</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    {quickActions.map((act, idx) => (
                        <Link
                            key={idx}
                            href={act.href}
                            className="group p-5 rounded-2xl bg-slate-50 hover:bg-primary-50 border border-slate-100 hover:border-primary-200 transition-all flex flex-col items-center text-center gap-3"
                        >
                            <div className="w-10 h-10 rounded-xl bg-white text-primary-600 flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                                <act.icon size={16} />
                            </div>
                            <span className="text-xs font-bold text-slate-700 group-hover:text-primary-800">{act.label}</span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* FEED DE ATIVIDADES E REGISTROS RECENTES */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Notícias Recentes */}
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                        <h3 className="text-base font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
                            <FaNewspaper className="text-blue-600" /> Notícias Recentes
                        </h3>
                        <Link href="/admin/noticias" className="text-xs font-bold text-primary-600 hover:underline">Ver todas</Link>
                    </div>

                    <div className="space-y-3">
                        {ultimasNoticias.length === 0 ? (
                            <p className="text-xs text-slate-400 italic">Nenhuma notícia cadastrada.</p>
                        ) : (
                            ultimasNoticias.map((n) => (
                                <Link 
                                    key={n.id} 
                                    href={`/admin/noticias/editar/${n.id}`}
                                    className="group flex items-start justify-between p-3.5 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all gap-3"
                                >
                                    <div className="space-y-1 min-w-0">
                                        <p className="text-xs font-bold text-slate-700 line-clamp-1 group-hover:text-primary-700">{n.titulo}</p>
                                        <span className="text-[10px] font-medium text-slate-400 block">
                                            {new Date(n.criadoEm).toLocaleDateString('pt-BR')}
                                        </span>
                                    </div>
                                    <span className={`px-2 py-0.5 text-[9px] font-black uppercase rounded-md shrink-0 ${
                                        n.publicada ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                                    }`}>
                                        {n.publicada ? "Publicada" : "Rascunho"}
                                    </span>
                                </Link>
                            ))
                        )}
                    </div>
                </div>

                {/* Obras Recentes */}
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                        <h3 className="text-base font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
                            <FaHammer className="text-orange-600" /> Obras Públicas
                        </h3>
                        <Link href="/admin/obras" className="text-xs font-bold text-primary-600 hover:underline">Ver todas</Link>
                    </div>

                    <div className="space-y-3">
                        {ultimasObras.length === 0 ? (
                            <p className="text-xs text-slate-400 italic">Nenhuma obra cadastrada.</p>
                        ) : (
                            ultimasObras.map((o) => (
                                <Link 
                                    key={o.id} 
                                    href={`/admin/obras/editar/${o.id}`}
                                    className="group flex items-start justify-between p-3.5 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all gap-3"
                                >
                                    <div className="space-y-1 min-w-0">
                                        <p className="text-xs font-bold text-slate-700 line-clamp-1 group-hover:text-primary-700">{o.titulo}</p>
                                        <span className="text-[10px] font-medium text-slate-400 block">
                                            {new Date(o.criadoEm).toLocaleDateString('pt-BR')}
                                        </span>
                                    </div>
                                    <span className="px-2 py-0.5 text-[9px] font-black uppercase rounded-md bg-blue-100 text-blue-800 shrink-0">
                                        {o.status || "Em Andamento"}
                                    </span>
                                </Link>
                            ))
                        )}
                    </div>
                </div>

                {/* Ouvidoria Recente */}
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                        <h3 className="text-base font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
                            <FaBullhorn className="text-purple-600" /> Ouvidoria (Manifestações)
                        </h3>
                        <Link href="/admin/ouvidoria" className="text-xs font-bold text-primary-600 hover:underline">Ver todas</Link>
                    </div>

                    <div className="space-y-3">
                        {ultimasOuvidorias.length === 0 ? (
                            <p className="text-xs text-slate-400 italic">Nenhuma manifestação pendente.</p>
                        ) : (
                            ultimasOuvidorias.map((ouv) => (
                                <Link 
                                    key={ouv.id} 
                                    href="/admin/ouvidoria"
                                    className="group flex items-start justify-between p-3.5 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all gap-3"
                                >
                                    <div className="space-y-1 min-w-0">
                                        <p className="text-xs font-bold text-slate-700 line-clamp-1 group-hover:text-primary-700">Prot. {ouv.protocolo}</p>
                                        <span className="text-[10px] font-medium text-slate-400 block truncate">{ouv.assunto}</span>
                                    </div>
                                    <span className="px-2 py-0.5 text-[9px] font-black uppercase rounded-md bg-purple-100 text-purple-800 shrink-0">
                                        {ouv.status}
                                    </span>
                                </Link>
                            ))
                        )}
                    </div>
                </div>

            </div>

        </div>
    );
}
