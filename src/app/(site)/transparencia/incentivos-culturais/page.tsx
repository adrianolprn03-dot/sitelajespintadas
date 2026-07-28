import type { Metadata } from "next";
import { FaMusic, FaRunning, FaTheaterMasks, FaBook, FaTrophy, FaStar, FaExternalLinkAlt, FaFile, FaCalendar } from "react-icons/fa";
import { Star } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import BannerPNTP from "@/components/transparencia/BannerPNTP";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Incentivos Culturais e Esportivos | Portal da Transparência – Prefeitura de Lajes Pintadas",
    description: "Editais, recursos e resultados dos programas de fomento à cultura, esporte e lazer do município.",
};

export const revalidate = 0; // Garantir dados sempre atualizados em tempo real

const ICON_MAP: Record<string, any> = {
    musica: FaMusic,
    esporte: FaRunning,
    teatro: FaTheaterMasks,
    livro: FaBook,
    trofeu: FaTrophy,
    estrela: FaStar,
};

const PROGRAMAS_DEFAULT = [
    {
        id: "prog-1",
        icone: "musica",
        titulo: "Fomento à Cultura",
        descricao: "Apoio financeiro e logístico a projetos culturais, festivais, grupos folclóricos e manifestações artísticas locais.",
        cor: "from-purple-500 to-violet-600",
        recursos: 42000,
        projetos: 8,
        status: "Vigente",
    },
    {
        id: "prog-2",
        icone: "esporte",
        titulo: "Fomento ao Esporte",
        descricao: "Apoio a competições esportivas, escolinhas de esporte, atletas e times representativos do município.",
        cor: "from-blue-500 to-cyan-600",
        recursos: 28500,
        projetos: 12,
        status: "Vigente",
    },
    {
        id: "prog-3",
        icone: "teatro",
        titulo: "Festividades Municipais",
        descricao: "Organização e apoio de eventos festivos, datas comemorativas e festivais anuais do calendário oficial.",
        cor: "from-amber-500 to-orange-600",
        recursos: 55000,
        projetos: 5,
        status: "Vigente",
    },
    {
        id: "prog-4",
        icone: "livro",
        titulo: "Incentivo à Leitura",
        descricao: "Projeto de fomento à leitura, doação de livros e apoio à biblioteca pública municipal.",
        cor: "from-emerald-500 to-teal-600",
        recursos: 12000,
        projetos: 3,
        status: "Vigente",
    },
];

const EDITAIS_DEFAULT = [
    {
        id: "default-1",
        titulo: "Edital de Fomento Cultural nº 001/2026",
        tipo: "Cultura",
        publicacao: "2026-02-01",
        status: "Encerrado",
        linkEdital: null,
    },
    {
        id: "default-2",
        titulo: "Edital de Apoio Esportivo nº 002/2026",
        tipo: "Esporte",
        publicacao: "2026-02-15",
        status: "Aberto",
        linkEdital: null,
    },
];

function fmt(v: number) {
    return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default async function IncentivosCulturaisPage() {
    // 1. Carregar configurações salvas no Admin
    let customData: any = {};
    try {
        const configRecord = await prisma.configuracao.findUnique({
            where: { chave: "incentivos_culturais_data" }
        });
        if (configRecord?.valor) {
            customData = JSON.parse(configRecord.valor);
        }
    } catch (e) {
        console.error("Erro ao carregar configurações de incentivos culturais:", e);
    }

    const title = customData.title || "Incentivos Culturais e Esportivos";
    const subtitle = customData.subtitle || "Editais, programas de fomento e recursos destinados à cultura, esporte e lazer da comunidade.";
    const exercicioAno = customData.exercicioAno || new Date().getFullYear().toString();

    const programasList = Array.isArray(customData.programas)
        ? customData.programas
        : PROGRAMAS_DEFAULT;

    const calcTotalRecursos = programasList.reduce((s: number, p: any) => s + (Number(p.recursos) || 0), 0);
    const calcTotalProjetos = programasList.reduce((s: number, p: any) => s + (Number(p.projetos) || 0), 0);

    const totalRecursos = (customData.recursosInvestidos !== undefined && customData.recursosInvestidos !== "" && customData.recursosInvestidos !== null && !isNaN(Number(customData.recursosInvestidos)))
        ? Number(customData.recursosInvestidos)
        : calcTotalRecursos;

    const totalProjetos = (customData.projetosApoiados !== undefined && customData.projetosApoiados !== "" && customData.projetosApoiados !== null && !isNaN(Number(customData.projetosApoiados)))
        ? Number(customData.projetosApoiados)
        : calcTotalProjetos;

    // 2. Buscar editais do banco de dados (concursos/editais cadastrados no admin)
    let editaisDb: any[] = [];
    try {
        editaisDb = await prisma.concurso.findMany({
            where: { ativo: true },
            orderBy: { dataPublicacao: "desc" },
        });
    } catch (e) {
        console.error("Erro ao buscar editais do banco:", e);
    }

    const editaisExibicao = editaisDb.length > 0
        ? editaisDb.map(e => ({
            id: e.id,
            titulo: e.titulo,
            tipo: e.tipo || "Cultura/Esporte",
            publicacao: e.dataPublicacao ? new Date(e.dataPublicacao).toISOString().split('T')[0] : "",
            status: e.status === "aberto" || e.status === "Aberto" ? "Aberto" : "Encerrado",
            linkEdital: e.linkEdital || null,
        }))
        : EDITAIS_DEFAULT;

    return (
        <div className="min-h-screen bg-[#f8fafc] font-['Montserrat',sans-serif]">
            <PageHeader
                title={title}
                subtitle={subtitle}
                variant="premium"
                icon={<Star />}
                breadcrumbs={[
                    { label: "Início", href: "/" },
                    { label: "Transparência", href: "/transparencia" },
                    { label: "Incentivos Culturais e Esportivos" }
                ]}
            />

            <div className="max-w-[1240px] mx-auto px-6 py-12">
                {/* Resumo Financeiro */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-14">
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-purple-100/50 border-l-4 border-l-purple-500">
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Recursos Investidos</div>
                        <div className="text-2xl font-black text-purple-600">{fmt(totalRecursos)}</div>
                        <div className="text-[10px] font-bold text-gray-400 mt-1">Exercício {exercicioAno}</div>
                    </div>
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-blue-100/50 border-l-4 border-l-blue-500">
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Projetos Apoiados</div>
                        <div className="text-2xl font-black text-blue-600">{totalProjetos}</div>
                        <div className="text-[10px] font-bold text-gray-400 mt-1">Iniciativas ativas</div>
                    </div>
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-amber-100/50 border-l-4 border-l-amber-500">
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Editais Publicados</div>
                        <div className="text-2xl font-black text-amber-600">{editaisExibicao.length}</div>
                        <div className="text-[10px] font-bold text-gray-400 mt-1">Em {exercicioAno}</div>
                    </div>
                </div>

                {/* Programas em Execução */}
                <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter mb-8 flex items-center gap-3">
                    <div className="w-8 h-1 bg-purple-600 rounded-full" /> Programas em Execução
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    {programasList.map((p: any, i: number) => {
                        const IconComponent = ICON_MAP[p.icone] || FaMusic;
                        return (
                            <div key={p.id || i} className="group bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/30 overflow-hidden hover:shadow-2xl transition-all duration-500">
                                <div className={`h-2 bg-gradient-to-r ${p.cor || "from-purple-500 to-violet-600"}`} />
                                <div className="p-10">
                                    <div className="flex items-start gap-5 mb-6">
                                        <div className={`w-14 h-14 bg-gradient-to-br ${p.cor || "from-purple-500 to-violet-600"} text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform`}>
                                            <IconComponent size={24} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <h3 className="font-black text-gray-800 text-lg uppercase tracking-tighter group-hover:text-purple-600 transition-colors">{p.titulo}</h3>
                                                <span className="text-[9px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full uppercase">{p.status || "Vigente"}</span>
                                            </div>
                                            <p className="text-gray-500 text-sm font-medium leading-relaxed">{p.descricao}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 bg-gray-50/50 rounded-2xl p-6 border border-gray-50">
                                        <div className="text-center">
                                            <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Projetos</div>
                                            <div className="text-2xl font-black text-gray-800">{p.projetos || 0}</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Recursos</div>
                                            <div className="text-xl font-black text-purple-600">{fmt(Number(p.recursos) || 0)}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Editais Publicados */}
                <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter mb-8 flex items-center gap-3">
                    <div className="w-8 h-1 bg-amber-500 rounded-full" /> Editais Publicados
                </h2>

                <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden mb-16">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    <th className="px-8 py-5">Edital</th>
                                    <th className="px-8 py-5">Área / Categoria</th>
                                    <th className="px-8 py-5">Publicação</th>
                                    <th className="px-8 py-5 text-center">Status</th>
                                    <th className="px-8 py-5 text-center">Acesso</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {editaisExibicao.map((e: any, i: number) => (
                                    <tr key={e.id || i} className="hover:bg-amber-50/20 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <FaFile className="text-amber-400 shrink-0" size={14} />
                                                <span className="font-black text-gray-800 text-sm group-hover:text-amber-700 transition-colors">{e.titulo}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-700 border border-purple-100 rounded-full text-[9px] font-black uppercase tracking-widest">
                                                {String(e.tipo).toLowerCase().includes("esporte") ? <FaRunning size={9} /> : <FaTheaterMasks size={9} />} {e.tipo}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500">
                                                <FaCalendar size={10} className="text-gray-300" />
                                                {e.publicacao ? new Date(e.publicacao).toLocaleDateString("pt-BR") : "-"}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <span className={`inline-flex px-3 py-1.5 rounded-full text-[9px] font-black uppercase border ${
                                                e.status === "Aberto" 
                                                    ? "bg-emerald-100 text-emerald-700 border-emerald-200" 
                                                    : "bg-gray-100 text-gray-600 border-gray-200"
                                            }`}>
                                                {e.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            {e.linkEdital ? (
                                                <a 
                                                    href={e.linkEdital} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer" 
                                                    className="inline-flex items-center gap-1.5 text-amber-600 hover:text-amber-800 font-black text-[10px] uppercase tracking-widest transition-colors bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg border border-amber-200"
                                                >
                                                    <FaExternalLinkAlt size={9} /> Acessar Edital
                                                </a>
                                            ) : (
                                                <span className="text-[10px] font-bold text-gray-400">Sem documento</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <BannerPNTP />
            </div>
        </div>
    );
}


