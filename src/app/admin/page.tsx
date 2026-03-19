import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
    FaNewspaper, FaGavel, FaUsers, FaMoneyBillWave,
    FaBullhorn, FaFileContract, FaChartBar, FaEnvelope, FaHandshake, FaPlane,
    FaHammer, FaQuestionCircle, FaBook, FaBalanceScale, FaBuilding,
    FaPlus, FaArrowRight
} from "react-icons/fa";

export default async function AdminDashboard() {
    const session = await getServerSession(authOptions);

    // Contadores do banco
    let counts = { noticia: 0, licitacao: 0, contrato: 0, convenio: 0, diaria: 0, servidor: 0, ouvidoria: 0, contato: 0, obra: 0, faq: 0, glossario: 0, legislacao: 0, unidades: 0 };
    try {
        const [noticia, licitacao, contrato, convenio, diaria, servidor, ouvidoria, contato, obra, faq, glossario, legislacao, unidades] = await Promise.all([
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
        ]);
        counts = { noticia, licitacao, contrato, convenio, diaria, servidor, ouvidoria, contato, obra, faq, glossario, legislacao, unidades };
    } catch { }

    const cards = [
        { icon: FaNewspaper, cor: "from-blue-500 to-indigo-600", bgLight: "bg-blue-50", text: "text-blue-600", href: "/admin/noticias", label: "Notícias", value: counts.noticia },
        { icon: FaHammer, cor: "from-orange-500 to-red-600", bgLight: "bg-orange-50", text: "text-orange-600", href: "/admin/obras", label: "Obras", value: counts.obra },
        { icon: FaBuilding, cor: "from-emerald-400 to-teal-600", bgLight: "bg-teal-50", text: "text-teal-600", href: "/admin/unidades", label: "Unidades", value: counts.unidades },
        { icon: FaGavel, cor: "from-amber-400 to-amber-600", bgLight: "bg-amber-50", text: "text-amber-600", href: "/admin/licitacoes", label: "Licitações", value: counts.licitacao },
        { icon: FaFileContract, cor: "from-rose-400 to-pink-600", bgLight: "bg-pink-50", text: "text-pink-600", href: "/admin/contratos", label: "Contratos", value: counts.contrato },
        { icon: FaUsers, cor: "from-cyan-400 to-blue-500", bgLight: "bg-cyan-50", text: "text-cyan-600", href: "/admin/servidores", label: "Servidores", value: counts.servidor },
    ];

    const [ultimasNoticias, ultimasObras, ultimasFAQs] = await Promise.all([
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
        prisma.fAQ.findMany({
            take: 4,
            orderBy: { criadoEm: "desc" },
            select: { id: true, pergunta: true, criadoEm: true }
        })
    ]);

    return (
        <div className="max-w-[1400px] mx-auto pb-12">
            
            {/* HERO WELCOME AREA */}
            <div className="mb-8 relative overflow-hidden rounded-[2.5rem] bg-white p-8 sm:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] ring-1 ring-gray-100">
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary-400/20 to-blue-600/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-600 text-xs font-bold mb-4 uppercase tracking-wider">
                            <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span>
                            Sistema Operacional
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-gray-800 tracking-tight mb-2">
                            Bem-vindo(a), <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-500">{session?.user?.name?.split(' ')[0] || 'Gestor'}</span>
                        </h1>
                        <p className="text-gray-500 text-lg max-w-2xl leading-relaxed">
                            Aqui está o resumo das atividades gerais do portal hoje. Você tem <strong className="text-gray-800">{counts.contato} contatos não lidos</strong> e <strong className="text-gray-800">{counts.ouvidoria} manif. ativas</strong>.
                        </p>
                    </div>

                    <div className="shrink-0 flex items-center gap-4">
                        <Link href="/admin/noticias/nova" className="group relative px-6 py-3 bg-gradient-to-r from-primary-600 to-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 hover:-translate-y-1 transition-all overflow-hidden isolate flex items-center gap-2">
                            <FaPlus size={14} /> Nova Notícia
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform -z-10" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* METRICS GRID */}
            <h2 className="text-xl font-bold text-gray-800 mb-6 px-2 flex items-center gap-2">
                Visão Geral <span className="text-gray-400 font-normal text-sm ml-2">Módulos Principais</span>
            </h2>
            
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6 mb-10">
                {cards.map((c) => (
                    <Link key={c.href} href={c.href} className="group relative bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-gray-200/50 transition-all hover:-translate-y-1 overflow-hidden isolate">
                        {/* Blob de fundo decorativo no card */}
                        <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full mix-blend-multiply filter blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 bg-gradient-to-br ${c.cor}`} />
                        
                        <div className="flex flex-col text-left gap-4 h-full relative z-10">
                            <div className={`w-12 h-12 rounded-2xl ${c.bgLight} ${c.text} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500`}>
                                <c.icon size={20} />
                            </div>
                            
                            <div className="mt-auto">
                                <div className="text-3xl font-black text-gray-800 tracking-tight leading-none mb-1 group-hover:text-primary-600 transition-colors">
                                    {c.value.toLocaleString()}
                                </div>
                                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">{c.label}</div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* CONTENT SPLIT (ATIVIDADES RECENTS E ACTIONS) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Atividade Recente */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden relative">
                        {/* Faixa decorativa no topo */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-indigo-500" />
                        
                        <div className="p-6 sm:p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-black text-gray-800 tracking-tight">Publicações Recentes (Notícias)</h3>
                                <Link href="/admin/noticias" className="text-sm font-bold text-primary-600 hover:text-primary-700 hover:underline flex items-center gap-1">
                                    Ver tudo <FaArrowRight size={10} />
                                </Link>
                            </div>
                            
                            <div className="space-y-3">
                                {ultimasNoticias.map((n) => (
                                    <Link key={n.id} href={`/admin/noticias/editar/${n.id}`} className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-gray-50 hover:border-blue-100 hover:bg-blue-50/30 transition-all gap-3">
                                        <div className="flex items-center gap-4">
                                            <div className="relative shrink-0">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${n.publicada ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                                                    <FaNewspaper size={16} />
                                                </div>
                                                {n.publicada && <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-800 line-clamp-1 group-hover:text-primary-700 transition-colors">{n.titulo}</p>
                                                <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                                                    <span className={n.publicada ? "text-green-600 font-semibold" : "text-gray-500 font-semibold"}>
                                                        {n.publicada ? "Público" : "Rascunho"}
                                                    </span>
                                                    <span>•</span>
                                                    <span>{new Date(n.criadoEm).toLocaleDateString("pt-BR")}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6 sm:p-8">
                         <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-black text-gray-800 tracking-tight">Últimas Obras Registradas</h3>
                             <Link href="/admin/obras" className="text-sm font-bold text-primary-600 hover:hover:underline">Gerenciar Trabalhos</Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             {ultimasObras.map((o) => (
                                <Link key={o.id} href={`/admin/obras/editar/${o.id}`} className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 hover:-translate-y-0.5 transition-all">
                                     <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                                        o.status === "concluida" ? "bg-green-500 text-white" : 
                                        o.status === "paralisada" ? "bg-red-500 text-white" : 
                                        "bg-orange-500 text-white"
                                     }`}>
                                        <FaHammer size={18} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-gray-800 text-sm line-clamp-2">{o.titulo}</p>
                                        <p className="text-xs text-gray-500 mt-1 uppercase font-semibold tracking-wider">{o.status}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Painel Direito (Ações & Suporte) */}
                <div className="space-y-6">
                    {/* Atalhos Rápidos no estilo Apple Cards */}
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden isolate">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/20 blur-3xl opacity-50 rounded-full" />
                        
                        <h3 className="text-xl font-bold mb-6 text-white tracking-tight">Acesso Rápido</h3>
                        
                        <div className="grid grid-cols-2 gap-3 relative z-10">
                             {[
                                { label: "Nova Obra", href: "/admin/obras/nova", icon: "🏗️" },
                                { label: "FAQ / Ajuda", href: "/admin/faq/novo", icon: "💡" },
                                { label: "Glossário", href: "/admin/glossario/novo", icon: "📖" },
                                { label: "Mensagens", href: "/admin/contatos", icon: "📨" },
                            ].map((a) => (
                                <Link key={a.href} href={a.href} className="bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2 border border-white/5 transition-all hover:scale-105">
                                    <span className="text-2xl">{a.icon}</span>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-300">{a.label}</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* FAQ Mini */}
                    <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-black text-gray-800 tracking-tight mb-4">Perguntas (FAQ)</h3>
                        <div className="space-y-3">
                            {ultimasFAQs.map(f => (
                                <Link key={f.id} href={`/admin/faq/editar/${f.id}`} className="block p-4 rounded-2xl bg-gray-50 hover:bg-blue-50 hover:text-blue-700 transition-colors">
                                    <p className="text-sm font-semibold line-clamp-2">{f.pergunta}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
