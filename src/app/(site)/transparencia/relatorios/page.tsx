import PageHeader from "@/components/PageHeader";
import { FaFilePdf, FaChartLine, FaDownload, FaInbox, FaCheckCircle, FaLink, FaGlobe, FaExternalLinkAlt, FaSync } from "react-icons/fa";
import { prisma } from "@/lib/prisma";
import SiconfiDashboard from "@/components/transparencia/integracao/SiconfiDashboard";
import BannerPNTP from "@/components/transparencia/BannerPNTP";

export default async function RelatoriosPage() {
    // Busca estatísticas reais para PNTP
    const [esicStats, ouvidoriaStats, linksExternos] = await Promise.all([
        prisma.esic.findMany({ select: { criadoEm: true, respondidoEm: true, status: true, prazo: true } }),
        prisma.ouvidoria.findMany({ select: { criadoEm: true, respondidoEm: true, status: true, prazo: true } }),
        (prisma as any).linkExterno.findMany({ 
            where: { 
                ativo: true, 
                categoria: { in: ["relatorios", "geral"] } 
            }, 
            orderBy: [{ ordem: "asc" }, { criadoEm: "desc" }] 
        })
    ]);

    const calculateStats = (data: any[]) => {
        const total = data.length;
        const respondidos = data.filter(d => d.status === "concluido" || d.status === "encerrado").length;
        
        const noPrazo = data.filter(d => {
            if (!d.respondidoEm || !d.prazo) return false;
            return new Date(d.respondidoEm) <= new Date(d.prazo);
        }).length;

        const percentualNoPrazo = total > 0 ? Math.round((noPrazo / total) * 100) : 100;

        const tempos = data.filter(d => d.respondidoEm).map(d => {
            return (new Date(d.respondidoEm).getTime() - new Date(d.criadoEm).getTime()) / (1000 * 60 * 60 * 24);
        });
        const tempoMedio = tempos.length > 0 ? (tempos.reduce((a, b) => a + b, 0) / tempos.length).toFixed(1) : "0";

        return { total, respondidos, percentualNoPrazo, tempoMedio };
    };

    const s = calculateStats(esicStats);
    const o = calculateStats(ouvidoriaStats);

    const relatorios = [
        {
            titulo: "RREO - Relatório Resumido da Execução Orçamentária",
            descricao: "Demonstra o cumprimento das metas fiscais e a execução do orçamento municipal.",
            arquivos: [
                { label: "1º Bimestre 2024", data: "01/03/2024" },
                { label: "2º Bimestre 2024", data: "01/05/2024" },
                { label: "6º Bimestre 2023 (Anual)", data: "30/01/2024" },
            ]
        },
        {
            titulo: "RGF - Relatório de Gestão Fiscal",
            descricao: "Apresenta o equilíbrio entre as receitas e as despesas da administração pública.",
            arquivos: [
                { label: "1º Quadrimestre 2024", data: "15/05/2024" },
                { label: "3º Quadrimestre 2023", data: "15/01/2024" },
            ]
        },
        {
            titulo: "Relatório Anual de Gestão de Saúde (SARGSUS)",
            descricao: "Prestação de contas anual das ações e serviços de saúde no município.",
            arquivos: [
                { label: "Relatório Anual 2023", data: "30/03/2024" },
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <PageHeader
                title="Relatórios Fiscais e de Gestão"
                subtitle="Instrumentos de transparência da gestão fiscal e estatísticas de acesso à informação."
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Relatórios" }
                ]}
            />

            <div className="max-w-[1240px] mx-auto px-6 py-16">
                
                {/* Dashboard de Transparência Passiva (PNTP Requirement) */}
                <div className="mb-20">
                    <h2 className="text-sm font-black text-primary-600 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                        <span className="w-12 h-px bg-primary-600" /> Estatísticas de Acesso à Informação (LAI)
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* e-SIC Stats */}
                        <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-gray-200/50 border border-white">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl">
                                    <FaInbox />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-gray-800 uppercase tracking-tighter leading-none">e-SIC</h3>
                                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">Serviço de Informação ao Cidadão</p>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-4">
                                <div className="text-center">
                                    <p className="text-3xl font-black text-gray-800">{s.total}</p>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Pedidos</p>
                                </div>
                                <div className="text-center border-x border-gray-100">
                                    <p className="text-3xl font-black text-emerald-500">{s.percentualNoPrazo}%</p>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">No Prazo</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-3xl font-black text-primary-500">{s.tempoMedio}</p>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Dias p/ resp.</p>
                                </div>
                            </div>
                        </div>

                        {/* Ouvidoria Stats */}
                        <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-gray-200/50 border border-white">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center text-2xl">
                                    <FaCheckCircle />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-gray-800 uppercase tracking-tighter leading-none">Ouvidoria</h3>
                                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">Manifestações e Ouvidoria Geral</p>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-4">
                                <div className="text-center">
                                    <p className="text-3xl font-black text-gray-800">{o.total}</p>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Mensagens</p>
                                </div>
                                <div className="text-center border-x border-gray-100">
                                    <p className="text-3xl font-black text-emerald-500">{o.percentualNoPrazo}%</p>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Resolvidos</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-3xl font-black text-amber-500">{o.tempoMedio}</p>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Tempo médio</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-20">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                        <h2 className="text-sm font-black text-primary-600 uppercase tracking-[0.3em] flex items-center gap-3">
                            <span className="w-12 h-px bg-primary-600" /> Execução Orçamentária em Tempo Real (SICONFI)
                        </h2>
                        <div className="flex items-center gap-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-primary-100">
                            <FaSync className="animate-spin-slow" /> Dados Sincronizados com o Tesouro Nacional
                        </div>
                    </div>
                    
                    <SiconfiDashboard />
                </div>

                <div className="space-y-12">
                    <h2 className="text-sm font-black text-gray-400 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                        <span className="w-12 h-px bg-gray-200" /> Demonstrativos Contábeis e Fiscais (PDF)
                    </h2>
                    {relatorios.map((r, idx) => (
                        <div key={idx} className="bg-white rounded-[2.5rem] p-8 lg:p-12 shadow-sm border border-gray-100">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                                <div className="max-w-2xl">
                                    <h2 className="text-2xl font-black text-gray-800 mb-4 flex items-center gap-3">
                                        <FaChartLine className="text-primary-500" /> {r.titulo}
                                    </h2>
                                    <p className="text-gray-500 font-medium leading-relaxed">
                                        {r.descricao}
                                    </p>
                                </div>
                                <div className="bg-primary-50 px-6 py-3 rounded-2xl flex items-center gap-2 text-primary-700 font-black text-xs uppercase tracking-widest">
                                    {r.arquivos.length} arquivos disponíveis
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {r.arquivos.map((file, fIdx) => (
                                    <div key={fIdx} className="group bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-primary-300 hover:bg-white transition-all cursor-pointer">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="w-10 h-10 bg-red-100 text-red-600 rounded-xl flex items-center justify-center">
                                                <FaFilePdf size={20} />
                                            </div>
                                            <FaDownload className="text-gray-300 group-hover:text-primary-500 transition-colors" />
                                        </div>
                                        <h3 className="font-bold text-gray-700 mb-1 group-hover:text-primary-600 transition-colors">{file.label}</h3>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Publicado em {file.data}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 bg-gradient-to-r from-emerald-600 to-teal-700 rounded-[3rem] p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8">
                    <div>
                        <h3 className="text-2xl font-black mb-2 uppercase tracking-tighter">Portal Siconfi</h3>
                        <p className="text-emerald-100 font-medium opacity-80">
                            Acesse os dados diretos no Sistema de Informações Contábeis e Fiscais do Setor Público Brasileiro.
                        </p>
                    </div>
                    <a href="https://siconfi.tesouro.gov.br/" target="_blank" rel="noopener noreferrer" className="bg-white text-emerald-700 px-8 py-4 rounded-full font-black uppercase text-xs tracking-widest hover:scale-105 transition-transform shadow-lg shrink-0">
                        Ir para o Siconfi
                    </a>
                </div>

                {linksExternos.length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-sm font-black text-primary-600 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                            <span className="w-12 h-px bg-primary-600" /> Links e Documentos Externos
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {linksExternos.map((link: any) => (
                                <a
                                    key={link.id}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-start gap-4 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:border-primary-200 hover:shadow-md hover:-translate-y-1 transition-all"
                                >
                                    <div className="w-10 h-10 bg-primary-50 text-primary-500 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary-500 group-hover:text-white transition-all">
                                        <FaExternalLinkAlt size={14} />
                                    </div>
                                    <div className="min-w-0">
                                        <span className="font-bold text-gray-800 text-sm block group-hover:text-primary-600 transition-colors">{link.titulo}</span>
                                        {link.descricao && <span className="text-xs text-gray-400 block mt-0.5 truncate">{link.descricao}</span>}
                                        <span className="text-[10px] text-primary-400 font-bold uppercase tracking-widest flex items-center gap-1 mt-1">
                                            <FaGlobe size={8} /> Link externo
                                        </span>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mt-24 pb-12">
                    <BannerPNTP />
                </div>
            </div>
        </div>
    );
}
